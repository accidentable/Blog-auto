"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Brain, Key } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types";

interface ApiKeyFormProps {
  provider: AIProvider;
  claudeKey: string | null;
  openaiKey: string | null;
  onSave: () => void;
}

const providers: { value: AIProvider; label: string; placeholder: string }[] = [
  { value: "openai", label: "OpenAI", placeholder: "sk-..." },
  { value: "claude", label: "Claude", placeholder: "sk-ant-..." },
];

export default function ApiKeyForm({
  provider: currentProvider,
  claudeKey,
  openaiKey,
  onSave,
}: ApiKeyFormProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(currentProvider);
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [switchingProvider, setSwitchingProvider] = useState(false);
  const { showToast } = useToast();

  const currentKey = selectedProvider === "openai" ? openaiKey : claudeKey;
  const config = providers.find((p) => p.value === selectedProvider)!;

  const handleSwitchProvider = async (provider: AIProvider) => {
    setSelectedProvider(provider);
    setSwitchingProvider(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiProvider: provider }),
      });
      if (!res.ok) throw new Error();
      onSave();
      showToast(`${provider === "openai" ? "OpenAI" : "Claude"}로 전환되었습니다.`, "success");
    } catch {
      showToast("전환에 실패했습니다.", "error");
      setSelectedProvider(currentProvider);
    } finally {
      setSwitchingProvider(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    try {
      const keyField = selectedProvider === "openai" ? "openaiApiKey" : "claudeApiKey";
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [keyField]: apiKey }),
      });
      if (!res.ok) throw new Error();
      setApiKey("");
      onSave();
      showToast("API 키가 저장되었습니다.", "success");
    } catch {
      showToast("저장에 실패했습니다.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-sm">AI 분석 엔진</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Provider selector */}
          <div className="flex gap-2">
            {providers.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleSwitchProvider(value)}
                disabled={switchingProvider}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all border",
                  selectedProvider === value
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Current key status */}
          {currentKey && (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <Key className="h-3 w-3" />
              <span>설정됨: {currentKey.slice(0, 12)}...</span>
            </div>
          )}

          {/* API key input */}
          <Input
            type="password"
            placeholder={config.placeholder}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSaveKey} loading={saving} size="sm" disabled={!apiKey.trim()}>
            {currentKey ? "키 변경" : "키 저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
