"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AtSign, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ThreadsConnectionProps {
  isConnected: boolean;
  userId: string | null;
}

export default function ThreadsConnection({
  isConnected,
  userId,
}: ThreadsConnectionProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/threads/auth-url");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "URL 생성 실패");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "연동 실패",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AtSign className="h-4 w-4 text-purple-500" />
          <h3 className="font-semibold text-sm">Threads 연동</h3>
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm text-green-700">연동 완료</p>
              {userId && (
                <p className="text-xs text-gray-500">User ID: {userId}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Threads 계정을 연결하여 콘텐츠를 게시하세요.
            </p>
            <Button onClick={handleConnect} loading={loading} size="sm">
              <ExternalLink className="mr-1 h-3 w-3" />
              Threads 연동하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
