import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseChannelPost, verifyTelegramSecret } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret && !verifyTelegramSecret(request, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update = await request.json();
    const parsed = parseChannelPost(update);

    if (!parsed) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Check for duplicate
    const existing = await prisma.newsItem.findFirst({
      where: {
        telegramMsgId: parsed.messageId,
        channelId: parsed.channelId,
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Create news item
    const newsItem = await prisma.newsItem.create({
      data: {
        telegramMsgId: parsed.messageId,
        channelId: parsed.channelId,
        channelTitle: parsed.channelTitle,
        originalContent: parsed.content,
        mediaUrls: JSON.stringify(parsed.mediaUrls),
        status: "new",
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        type: "news_received",
        message: `텔레그램에서 새 뉴스 수신: ${parsed.channelTitle}`,
        newsId: newsItem.id,
      },
    });

    // Check if automation is enabled
    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });

    if (settings?.automationEnabled) {
      // Trigger auto-analysis via internal API call
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsId: newsItem.id }),
      }).catch(console.error);
    }

    return NextResponse.json({ ok: true, newsId: newsItem.id });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
