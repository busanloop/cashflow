import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CashFlow - 나의 가계부",
  description: "수입과 지출을 기록하고 현금흐름을 관리하세요",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}
