import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

interface AISummaryProps {
  summary: string | null;
  isAnalyzing: boolean;
}

export default function AISummary({ summary, isAnalyzing }: AISummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <h3 className="font-semibold text-sm">AI 요약</h3>
        </div>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : summary ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{summary}</p>
        ) : (
          <p className="text-sm text-gray-400">
            AI 분석을 실행하면 여기에 요약이 표시됩니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
