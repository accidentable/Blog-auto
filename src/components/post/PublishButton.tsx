"use client";

import Button from "@/components/ui/Button";
import { Send } from "lucide-react";

interface PublishButtonProps {
  onPublish: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function PublishButton({
  onPublish,
  loading,
  disabled,
}: PublishButtonProps) {
  return (
    <Button
      onClick={onPublish}
      loading={loading}
      disabled={disabled}
      size="lg"
      className="w-full"
    >
      <Send className="mr-2 h-4 w-4" />
      Threads에 게시하기
    </Button>
  );
}
