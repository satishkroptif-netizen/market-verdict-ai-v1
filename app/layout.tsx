import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Verdict AI",
  description: "Explainable multi-factor market intelligence terminal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
