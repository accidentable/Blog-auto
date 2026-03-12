import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Aptos News Bot",
  description: "Telegram → AI 분석 → Threads 자동 게시 시스템",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 antialiased">
        <ToastProvider>
          <main>{children}</main>
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
