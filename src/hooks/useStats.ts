import useSWR from "swr";
import type { DashboardStats, ActivityLog } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStats() {
  const { data, error, isLoading } = useSWR<{
    stats: DashboardStats;
    recentActivity: ActivityLog[];
  }>("/api/stats", fetcher, { refreshInterval: 30000 });

  return {
    stats: data?.stats,
    recentActivity: data?.recentActivity ?? [],
    error,
    isLoading,
  };
}
