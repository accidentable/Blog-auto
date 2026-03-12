"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import PageHeader from "@/components/layout/PageHeader";
import OriginalContent from "@/components/post/OriginalContent";
import AISummary from "@/components/post/AISummary";
import ContentEditor from "@/components/post/ContentEditor";
import ThreadsPreview from "@/components/post/ThreadsPreview";
import PublishButton from "@/components/post/PublishButton";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/feed/StatusBadge";
import { useNewsItem } from "@/hooks/useNews";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import type { NewsStatus } from "@/types";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;
  const { news, isLoading, mutate } = useNewsItem(id);

  const [threadsContent, setThreadsContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (news?.threadsContent) {
      setThreadsContent(news.threadsContent);
    }
  }, [news?.threadsContent]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "분석 실패");
      }

      const updated = await res.json();
      setThreadsContent(updated.threadsContent || "");
      mutate();
      showToast("AI 분석이 완료되었습니다.", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "분석 중 오류 발생",
        "error"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    if (!threadsContent.trim()) {
      showToast("게시할 콘텐츠를 입력하세요.", "error");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/threads/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsId: id, content: threadsContent }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "게시 실패");
      }

      mutate();
      showToast("Threads에 성공적으로 게시되었습니다!", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "게시 중 오류 발생",
        "error"
      );
    } finally {
      setPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </MobileContainer>
    );
  }

  if (!news) {
    return (
      <MobileContainer>
        <div className="text-center py-16">
          <p className="text-gray-500">뉴스를 찾을 수 없습니다.</p>
          <Button variant="ghost" onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </MobileContainer>
    );
  }

  const isPosted = news.status === "posted";

  return (
    <MobileContainer>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">뉴스 상세</h1>
            <StatusBadge status={news.status as NewsStatus} />
          </div>
          {news.channelTitle && (
            <p className="text-xs text-gray-500">{news.channelTitle}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <OriginalContent content={news.originalContent} />

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleAnalyze}
            loading={analyzing}
            disabled={analyzing || isPosted}
            className="flex-1"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {news.aiSummary ? "다시 분석" : "AI 분석"}
          </Button>
        </div>

        <AISummary summary={news.aiSummary} isAnalyzing={analyzing} />

        {isPosted ? (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">게시 완료</p>
              {news.threadsPostId && (
                <p className="text-xs text-green-600">
                  Post ID: {news.threadsPostId}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <ContentEditor
              content={threadsContent}
              onChange={setThreadsContent}
            />
            <ThreadsPreview content={threadsContent} />
            <PublishButton
              onPublish={handlePublish}
              loading={publishing}
              disabled={!threadsContent.trim() || publishing}
            />
          </>
        )}

        {news.errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{news.errorMessage}</p>
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
