"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Edit3 } from "lucide-react";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  maxLength?: number;
}

export default function ContentEditor({
  content,
  onChange,
  maxLength = 500,
}: ContentEditorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm">Threads 콘텐츠 편집</h3>
          </div>
          <span
            className={`text-xs ${
              content.length > maxLength ? "text-red-500" : "text-gray-400"
            }`}
          >
            {content.length}/{maxLength}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          placeholder="Threads에 게시할 콘텐츠를 편집하세요..."
        />
      </CardContent>
    </Card>
  );
}
