import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publishToThreads } from "@/lib/threads";

export async function POST(request: NextRequest) {
  try {
    const { newsId, content } = await request.json();

    if (!newsId || !content) {
      return NextResponse.json(
        { error: "newsId and content are required" },
        { status: 400 }
      );
    }

    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings?.threadsAccessToken || !settings?.threadsUserId) {
      return NextResponse.json(
        { error: "Threads 계정이 연결되지 않았습니다." },
        { status: 400 }
      );
    }

    const result = await publishToThreads(
      settings.threadsUserId,
      settings.threadsAccessToken,
      content
    );

    // Update news item
    await prisma.newsItem.update({
      where: { id: newsId },
      data: {
        status: "posted",
        threadsPostId: result.id,
        threadsContent: content,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        type: "threads_posted",
        message: "Threads에 게시 완료",
        newsId,
      },
    });

    return NextResponse.json({ success: true, postId: result.id });
  } catch (error) {
    console.error("Threads publish error:", error);

    try {
      const body = await request.clone().json();
      if (body.newsId) {
        await prisma.newsItem.update({
          where: { id: body.newsId },
          data: {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "게시 실패",
          },
        });
      }
    } catch {}

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publish failed" },
      { status: 500 }
    );
  }
}
