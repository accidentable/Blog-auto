import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status");

    const where = status ? { status } : {};

    const news = await prisma.newsItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newsItem = await prisma.newsItem.create({
      data: {
        originalContent: body.content,
        channelTitle: body.channelTitle || "수동 입력",
        status: "new",
      },
    });
    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("News create error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
