import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Activity } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ActivityLog } from "@/types";

const typeIcons: Record<string, string> = {
  news_received: "📨",
  analysis_complete: "🤖",
  threads_posted: "📤",
  threads_connected: "🔗",
};

export default function ActivityTimeline({
  activities,
}: {
  activities: ActivityLog[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-sm">최근 활동</h3>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            아직 활동이 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <span className="text-base mt-0.5">
                  {typeIcons[log.type] || "📋"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{log.message}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
