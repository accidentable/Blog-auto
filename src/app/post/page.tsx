"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import PageHeader from "@/components/layout/PageHeader";
import NewsList from "@/components/feed/NewsList";
import { useNewsList } from "@/hooks/useNews";

export default function PostHistoryPage() {
  const { news, isLoading } = useNewsList("posted");

  return (
    <MobileContainer>
      <PageHeader
        title="게시 히스토리"
        description="Threads에 게시된 콘텐츠"
      />
      <NewsList news={news} isLoading={isLoading} />
    </MobileContainer>
  );
}
