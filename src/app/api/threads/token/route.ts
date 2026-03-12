import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { exchangeCodeForToken, getLongLivedToken } from "@/lib/threads-auth";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Exchange for short-lived token
    const shortLived = await exchangeCodeForToken(code);

    // Exchange for long-lived token
    const longLived = await getLongLivedToken(shortLived.access_token);

    // Save to settings
    await prisma.settings.upsert({
      where: { id: "singleton" },
      update: {
        threadsAccessToken: longLived.access_token,
        threadsUserId: shortLived.user_id,
      },
      create: {
        id: "singleton",
        threadsAccessToken: longLived.access_token,
        threadsUserId: shortLived.user_id,
      },
    });

    await prisma.activityLog.create({
      data: {
        type: "threads_connected",
        message: "Threads 계정이 연결되었습니다.",
      },
    });

    return NextResponse.json({ success: true, userId: shortLived.user_id });
  } catch (error) {
    console.error("Threads token error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Token exchange failed" },
      { status: 500 }
    );
  }
}
