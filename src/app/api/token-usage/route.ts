import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [allUsage, todayUsage, recentUsage] = await Promise.all([
      prisma.tokenUsage.aggregate({
        _sum: { totalTokens: true, estimatedCost: true },
      }),
      prisma.tokenUsage.aggregate({
        where: { createdAt: { gte: today } },
        _sum: { totalTokens: true, estimatedCost: true },
      }),
      prisma.tokenUsage.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      totalTokens: allUsage._sum.totalTokens || 0,
      totalCost: Math.round((allUsage._sum.estimatedCost || 0) * 10000) / 10000,
      todayTokens: todayUsage._sum.totalTokens || 0,
      todayCost: Math.round((todayUsage._sum.estimatedCost || 0) * 10000) / 10000,
      recentUsage,
    });
  } catch (error) {
    console.error("Token usage error:", error);
    return NextResponse.json({ error: "Failed to fetch token usage" }, { status: 500 });
  }
}
