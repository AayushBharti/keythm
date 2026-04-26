import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome";
import { SettingsProvider } from "@/components/settings/settings-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { VisitTracker } from "@/components/visit-tracker";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Keythm — Free Typing Test",
    template: "%s | Keythm",
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Keythm — Free Typing Test",
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph.png",
        width: 1440,
        height: 1080,
        alt: "Keythm — typing test with mechanical keyboard sounds",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        spaceGrotesk.variable
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <SettingsProvider>
            <VisitTracker />
            <AppChrome>{children}</AppChrome>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
