import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuyOut Command Center — Boulder Construction",
  description: "Construction buyout management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
