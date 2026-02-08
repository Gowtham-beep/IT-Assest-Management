import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Inventory Management",
  description: "IT asset lifecycle management for SMB teams"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
