import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Eye } from "lucide-react";

export default function ThreadsPreview({ content }: { content: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-sm">미리보기</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <div>
              <p className="text-sm font-semibold">Aptos News</p>
              <p className="text-xs text-gray-400">방금 전</p>
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap">{content || "콘텐츠가 없습니다"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
