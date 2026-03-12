"use client";

import NewsCard from "./NewsCard";
import Skeleton from "@/components/ui/Skeleton";
import { Inbox } from "lucide-react";
import type { NewsItem } from "@/types";

interface NewsListProps {
  news: NewsItem[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
}

export default function NewsList({ news, isLoading, onDelete }: NewsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Inbox className="h-12 w-12 mb-3" />
        <p className="text-sm">뉴스가 없습니다</p>
        <p className="text-xs mt-1">텔레그램 채널에서 뉴스가 수신되면 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
