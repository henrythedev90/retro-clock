import "@/app/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Footer from "./components/Footer";
import styles from "./page.module.css";

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
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={geistSans.className}>
        <div className={styles.page}>
          <div className={styles.content_container}>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
