import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNO by Next.js",
  description: "ローカル対戦とオンライン対戦に対応したUNOアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
