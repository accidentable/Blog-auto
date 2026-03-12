import { Card } from "@/components/ui/Card";
import { Newspaper, Sparkles, Send, Clock } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import type { DashboardStats } from "@/types";

const statItems = [
  { key: "totalNews" as const, label: "전체 뉴스", icon: Newspaper, color: "text-blue-600 bg-blue-100" },
  { key: "analyzedToday" as const, label: "오늘 분석", icon: Sparkles, color: "text-green-600 bg-green-100" },
  { key: "postedToday" as const, label: "오늘 게시", icon: Send, color: "text-purple-600 bg-purple-100" },
  { key: "pendingReview" as const, label: "검토 대기", icon: Clock, color: "text-orange-600 bg-orange-100" },
];

export default function StatsCards({
  stats,
  isLoading,
}: {
  stats?: DashboardStats;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {statItems.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.[key] ?? 0}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
