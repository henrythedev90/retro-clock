import "@/app/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retro Digital Clock",
  description:
    "A customizable retro-style digital clock with 7-segment display",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistSans.className}>{children}</body>
    </html>
  );
}
