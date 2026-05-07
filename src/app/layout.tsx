import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/Layout/AppLayout";

export const metadata: Metadata = {
  title: "MusicApp - Nghe nhạc trực tuyến",
  description: "Ứng dụng nghe nhạc trực tuyến với hàng ngàn bài hát hot nhất",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
