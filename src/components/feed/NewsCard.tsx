"use client";

import { Card } from "@/components/ui/Card";
import StatusBadge from "./StatusBadge";
import { formatDate, truncate } from "@/lib/utils";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NewsItem, NewsStatus } from "@/types";

export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/post/${news.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={news.status as NewsStatus} />
              {news.channelTitle && (
                <span className="text-xs text-gray-500 truncate">
                  {news.channelTitle}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-900 line-clamp-3">
              {truncate(news.originalContent, 200)}
            </p>
            {news.aiSummary && (
              <div className="mt-2 flex items-start gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-primary-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500 line-clamp-2">
                  {news.aiSummary}
                </p>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {formatDate(news.createdAt)}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
        </div>
      </Link>
    </Card>
  );
}
