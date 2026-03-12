import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeNews } from "@/lib/claude";
import type { AIProvider } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { newsId } = await request.json();

    if (!newsId) {
      return NextResponse.json(
        { error: "newsId is required" },
        { status: 400 }
      );
    }

    const newsItem = await prisma.newsItem.findUnique({
      where: { id: newsId },
    });

    if (!newsItem) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    await prisma.newsItem.update({
      where: { id: newsId },
      data: { status: "analyzing" },
    });

    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });

    const provider = (settings?.aiProvider || "openai") as AIProvider;
    const apiKey =
      provider === "openai"
        ? settings?.openaiApiKey || process.env.OPENAI_API_KEY
        : settings?.claudeApiKey || process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      await prisma.newsItem.update({
        where: { id: newsId },
        data: {
          status: "failed",
          errorMessage: `${provider === "openai" ? "OpenAI" : "Claude"} API 키가 설정되지 않았습니다.`,
        },
      });
      return NextResponse.json(
        { error: `${provider} API key not configured` },
        { status: 400 }
      );
    }

    const result = await analyzeNews(newsItem.originalContent, apiKey, provider);

    const updated = await prisma.newsItem.update({
      where: { id: newsId },
      data: {
        status: "analyzed",
        aiSummary: result.summary,
        threadsContent: result.threadsContent,
      },
    });

    await prisma.activityLog.create({
      data: {
        type: "analysis_complete",
        message: `AI 분석 완료 (${provider === "openai" ? "OpenAI" : "Claude"})`,
        newsId,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Analysis error:", error);

    try {
      const { newsId } = await request.clone().json();
      if (newsId) {
        await prisma.newsItem.update({
          where: { id: newsId },
          data: {
            status: "failed",
            errorMessage:
              error instanceof Error ? error.message : "분석 중 오류가 발생했습니다.",
          },
        });
      }
    } catch {}

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
