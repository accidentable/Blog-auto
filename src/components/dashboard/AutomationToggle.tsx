"use client";

import { Card, CardContent } from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface AutomationToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function AutomationToggle({
  enabled,
  onToggle,
}: AutomationToggleProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (!res.ok) throw new Error();

      onToggle();
      showToast(
        !enabled ? "자동 분석이 활성화되었습니다." : "자동 분석이 비활성화되었습니다.",
        "success"
      );
    } catch {
      showToast("설정 변경에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">자동 AI 분석</p>
              <p className="text-xs text-gray-500">
                새 뉴스 수신 시 자동으로 분석
              </p>
            </div>
          </div>
          <Toggle
            enabled={enabled}
            onChange={handleToggle}
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
