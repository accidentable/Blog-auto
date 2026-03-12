"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import PageHeader from "@/components/layout/PageHeader";
import ApiKeyForm from "@/components/settings/ApiKeyForm";
import TelegramConfig from "@/components/settings/TelegramConfig";
import ThreadsConnection from "@/components/settings/ThreadsConnection";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/components/ui/Toast";
import Skeleton from "@/components/ui/Skeleton";

function SettingsContent() {
  const { settings, isLoading, mutate } = useSettings();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    if (searchParams.get("threads_connected") === "true") {
      showToast("Threads 계정이 연결되었습니다!", "success");
      mutate();
    }
    const threadsError = searchParams.get("threads_error");
    if (threadsError) {
      showToast(`Threads 연동 실패: ${threadsError}`, "error");
    }
  }, [searchParams, showToast, mutate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ApiKeyForm
        provider={settings?.aiProvider ?? "openai"}
        claudeKey={settings?.claudeApiKey ?? null}
        openaiKey={settings?.openaiApiKey ?? null}
        onSave={() => mutate()}
      />
      <TelegramConfig
        botToken={settings?.telegramBotToken ?? null}
        onSave={() => mutate()}
      />
      <ThreadsConnection
        isConnected={!!settings?.threadsAccessToken}
        userId={settings?.threadsUserId ?? null}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <MobileContainer>
      <PageHeader title="설정" description="API 연동 및 시스템 설정" />
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </MobileContainer>
  );
}
