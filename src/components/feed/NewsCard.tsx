"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import StatusBadge from "./StatusBadge";
import { formatDate, truncate } from "@/lib/utils";
import { MessageSquare, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import type { NewsItem, NewsStatus } from "@/types";

interface NewsCardProps {
  news: NewsItem;
  onDelete?: (id: string) => void;
}

export default function NewsCard({ news, onDelete }: NewsCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 뉴스를 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/news/${news.id}`, { method: "DELETE" });
      if (res.ok) onDelete?.(news.id);
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

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
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
