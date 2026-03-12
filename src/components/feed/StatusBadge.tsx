import { cn } from "@/lib/utils";
import type { NewsStatus } from "@/types";

const statusConfig: Record<NewsStatus, { label: string; color: string }> = {
  new: { label: "새 뉴스", color: "bg-blue-100 text-blue-700" },
  analyzing: { label: "분석 중", color: "bg-yellow-100 text-yellow-700" },
  analyzed: { label: "분석 완료", color: "bg-green-100 text-green-700" },
  posted: { label: "게시됨", color: "bg-purple-100 text-purple-700" },
  failed: { label: "실패", color: "bg-red-100 text-red-700" },
};

export default function StatusBadge({ status }: { status: NewsStatus }) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.color
      )}
    >
      {config.label}
    </span>
  );
}
