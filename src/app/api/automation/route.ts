import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: { automationEnabled: !!enabled },
      create: { id: "singleton", automationEnabled: !!enabled },
    });

    await prisma.activityLog.create({
      data: {
        type: "automation_toggle",
        message: enabled
          ? "자동 분석이 활성화되었습니다."
          : "자동 분석이 비활성화되었습니다.",
      },
    });

    return NextResponse.json({
      success: true,
      automationEnabled: settings.automationEnabled,
    });
  } catch (error) {
    console.error("Automation toggle error:", error);
    return NextResponse.json({ error: "Failed to toggle automation" }, { status: 500 });
  }
}
