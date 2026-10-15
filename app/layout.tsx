import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EVS | Exotic Vehicle Systems",
  description: "Engineering workspace for the Exotic Racing Team IAET. Vehicle readings remain unavailable until a verified hardware source is connected.",
  applicationName: "Exotic Vehicle Systems",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}<Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="afterInteractive" /></body>
    </html>
  );
}
