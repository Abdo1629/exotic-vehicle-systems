import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Manrope, IBM_Plex_Mono, Cairo } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", weight: ["400", "500", "600", "700"], display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EVS | Exotic Vehicle Systems",
  description: "A bilingual vehicle operations workspace for teams. Live readings appear only from a verified data source.",
  applicationName: "Exotic Vehicle Systems",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-locale="en" data-theme="dark" className={`h-full antialiased ${manrope.variable} ${cairo.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-full">
        <Script id="theme-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("evs-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}}catch(e){}` }} />
        <LocaleProvider>{children}</LocaleProvider>
        <Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
