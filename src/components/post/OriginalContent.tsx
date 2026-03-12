import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { FileText } from "lucide-react";

export default function OriginalContent({ content }: { content: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-sm">원본 콘텐츠</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}
