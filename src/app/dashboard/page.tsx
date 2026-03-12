"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import PageHeader from "@/components/layout/PageHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import AutomationToggle from "@/components/dashboard/AutomationToggle";
import { useStats } from "@/hooks/useStats";
import { useSettings } from "@/hooks/useSettings";

export default function DashboardPage() {
  const { stats, recentActivity, isLoading } = useStats();
  const { settings, mutate: mutateSettings } = useSettings();

  return (
    <MobileContainer>
      <PageHeader
        title="대시보드"
        description="뉴스 수집 및 게시 현황"
      />

      <div className="space-y-4">
        <StatsCards stats={stats} isLoading={isLoading} />

        <AutomationToggle
          enabled={settings?.automationEnabled ?? false}
          onToggle={() => mutateSettings()}
        />

        <ActivityTimeline activities={recentActivity} />
      </div>
    </MobileContainer>
  );
}
