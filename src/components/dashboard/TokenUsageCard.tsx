"use client";

import useSWR from "swr";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Coins, TrendingUp } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import type { TokenStats } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TokenUsageCard() {
  const { data, isLoading } = useSWR<TokenStats>("/api/token-usage", fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading) {
    return <Skeleton className="h-48" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-sm">토큰 사용량</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">오늘 사용</p>
            <p className="text-lg font-bold">
              {(data?.todayTokens || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              ${data?.todayCost?.toFixed(4) || "0.0000"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">전체 누적</p>
            <p className="text-lg font-bold">
              {(data?.totalTokens || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              ${data?.totalCost?.toFixed(4) || "0.0000"}
            </p>
          </div>
        </div>

        {data?.recentUsage && data.recentUsage.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-500">최근 분석</p>
            </div>
            <div className="space-y-1.5">
              {data.recentUsage.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {u.model} · {u.totalTokens.toLocaleString()} 토큰
                  </span>
                  <span className="text-gray-400">
                    ${u.estimatedCost.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
