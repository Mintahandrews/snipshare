import type { Metadata } from "next";
import {
  Fira_Code,
  IBM_Plex_Mono,
  Inconsolata,
  Inter,
  JetBrains_Mono,
  Source_Code_Pro,
} from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SUPPORTED_FONT_STYLES as fonts } from "@/lib/fonts";
import Providers from "@/contexts/Providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Configure fonts with fallback options and reduced timeout
const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
  fallback: ["monospace"],
  preload: false
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  fallback: ["monospace"],
  preload: false
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inconsolata",
  fallback: ["monospace"],
  preload: false
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-code-pro",
  fallback: ["monospace"],
  preload: false
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  fallback: ["monospace"],
  preload: false
});

export const metadata: Metadata = {
  title: "SnipShare",
  description: "A beautiful code snippet editor and sharing tool",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
    ],
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
  userScalable: true
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(fonts[0].variable, fonts[1].variable, fonts[2].variable)}
    >
      <head>
        <meta name="theme-color" content="#161616" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script src="/extension-handler.js" async></script>
      </head>
      <body
        className={cn(
          "grid min-h-screen grid-rows-[auto,1fr] text-xs xs:text-sm",
          "bg-almost-black text-greyish caret-fuchsia-500 selection:bg-fuchsia-500 selection:text-amlost-white",
          "overflow-x-hidden"
        )}
      >
        <Providers>
          <Header />
          <main className={cn("grid place-items-center")}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
