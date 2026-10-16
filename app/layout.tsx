import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EVS | Exotic Vehicle Systems",
  description: "Engineering workspace for the Exotic Racing Team IAET. Vehicle readings remain unavailable until a verified hardware source is connected.",
  applicationName: "Exotic Vehicle Systems",
  icons: { icon: "/exotic-racing-logo.jpg", apple: "/exotic-racing-logo.jpg" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`h-full antialiased ${manrope.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-full"><LocaleProvider><Script id="theme-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("evs-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}}catch(e){}` }} />{children}<Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="afterInteractive" /></LocaleProvider></body>
    </html>
  );
}
