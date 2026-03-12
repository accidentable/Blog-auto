import { NextRequest, NextResponse } from "next/server";
import { setWebhook, deleteWebhook, getWebhookInfo } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const { action, botToken } = await request.json();
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Bot token is required" },
        { status: 400 }
      );
    }

    if (action === "set") {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!baseUrl) {
        return NextResponse.json(
          { error: "APP_URL not configured" },
          { status: 400 }
        );
      }
      const webhookUrl = `${baseUrl}/api/telegram/webhook`;
      const secret = process.env.TELEGRAM_WEBHOOK_SECRET || "";
      const result = await setWebhook(token, webhookUrl, secret);
      return NextResponse.json(result);
    }

    if (action === "delete") {
      const result = await deleteWebhook(token);
      return NextResponse.json(result);
    }

    if (action === "info") {
      const result = await getWebhookInfo(token);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Telegram setup error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
