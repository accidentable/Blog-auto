"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Bot, Webhook } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface TelegramConfigProps {
  botToken: string | null;
  onSave: () => void;
}

export default function TelegramConfig({ botToken, onSave }: TelegramConfigProps) {
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [settingWebhook, setSettingWebhook] = useState(false);
  const { showToast } = useToast();

  const handleSaveToken = async () => {
    if (!token.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramBotToken: token }),
      });
      if (!res.ok) throw new Error();
      setToken("");
      onSave();
      showToast("봇 토큰이 저장되었습니다.", "success");
    } catch {
      showToast("저장에 실패했습니다.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleWebhook = async (action: "set" | "delete") => {
    setSettingWebhook(true);
    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast(
          action === "set" ? "웹훅이 등록되었습니다." : "웹훅이 해제되었습니다.",
          "success"
        );
      } else {
        throw new Error(data.description || "실패");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "웹훅 설정 실패",
        "error"
      );
    } finally {
      setSettingWebhook(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-500" />
          <h3 className="font-semibold text-sm">텔레그램 봇</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {botToken && (
            <p className="text-xs text-green-600">
              설정됨: {botToken.slice(0, 10)}...
            </p>
          )}
          <Input
            type="password"
            placeholder="123456:ABC-DEF..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveToken} loading={saving} size="sm">
              토큰 저장
            </Button>
            <Button
              variant="outline"
              onClick={() => handleWebhook("set")}
              loading={settingWebhook}
              size="sm"
              disabled={!botToken}
            >
              <Webhook className="mr-1 h-3 w-3" />
              웹훅 등록
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleWebhook("delete")}
              loading={settingWebhook}
              size="sm"
              disabled={!botToken}
            >
              해제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
