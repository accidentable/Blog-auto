"use client";

import { useState } from "react";
import MobileContainer from "@/components/layout/MobileContainer";
import PageHeader from "@/components/layout/PageHeader";
import NewsList from "@/components/feed/NewsList";
import { useNewsList } from "@/hooks/useNews";
import { cn } from "@/lib/utils";

const filters = [
  { label: "전체", value: "" },
  { label: "새 뉴스", value: "new" },
  { label: "분석됨", value: "analyzed" },
  { label: "게시됨", value: "posted" },
  { label: "실패", value: "failed" },
];

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("");
  const { news, isLoading, mutate } = useNewsList(activeFilter || undefined);

  const handleDelete = (id: string) => {
    mutate(news.filter((n) => n.id !== id), false);
  };

  return (
    <MobileContainer>
      <PageHeader
        title="뉴스 피드"
        description="텔레그램에서 수신된 뉴스 목록"
      />

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <NewsList news={news} isLoading={isLoading} onDelete={handleDelete} />
    </MobileContainer>
  );
}
