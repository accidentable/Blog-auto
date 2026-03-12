import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalNews, analyzedToday, postedToday, pendingReview, recentActivity] =
      await Promise.all([
        prisma.newsItem.count(),
        prisma.newsItem.count({
          where: {
            status: "analyzed",
            updatedAt: { gte: today },
          },
        }),
        prisma.newsItem.count({
          where: {
            status: "posted",
            updatedAt: { gte: today },
          },
        }),
        prisma.newsItem.count({
          where: {
            status: { in: ["new", "analyzed"] },
          },
        }),
        prisma.activityLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
      ]);

    return NextResponse.json({
      stats: { totalNews, analyzedToday, postedToday, pendingReview },
      recentActivity,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
