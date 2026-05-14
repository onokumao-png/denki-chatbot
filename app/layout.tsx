import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "電工AI技術相談 | 現場の受変電設備Q&A",
  description: "現場電気工事士向けAI技術相談アプリ。OCR・GR・VCB・保護協調・変圧器容量計算・主任技術者など受変電設備の疑問を即解決。無料・ログイン不要。",
  keywords: ["電気工事士", "OCR", "GR", "VCB", "保護協調", "受変電設備", "変圧器", "高圧受電", "継電器試験", "電工AI"],
  metadataBase: new URL("https://denki-chatbot.vercel.app"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "電工AI技術相談",
  },
  openGraph: {
    type: "website",
    url: "https://denki-chatbot.vercel.app",
    title: "電工AI技術相談 | 現場の受変電設備Q&A",
    description: "OCR・GR・変圧器・継電器試験など、現場の「あれなんだっけ？」をAIが即解決。無料・ログイン不要。",
    siteName: "電工AI技術相談",
    locale: "ja_JP",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "電工AI技術相談",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "電工AI技術相談 | 現場の受変電設備Q&A",
    description: "OCR・GR・変圧器・継電器試験など、現場の「あれなんだっけ？」をAIが即解決。無料・ログイン不要。",
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

// JSON-LDはハードコード定数のため dangerouslySetInnerHTML は安全
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "電工AI技術相談",
  url: "https://denki-chatbot.vercel.app",
  description: "現場電気工事士向けAI技術相談アプリ。OCR・GR・VCB・保護協調など受変電設備の疑問を即解決。",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  author: { "@type": "Organization", name: "株式会社LuminaTech" },
  inLanguage: "ja",
  keywords: "電気工事士,OCR,GR,VCB,保護協調,受変電設備,変圧器,高圧受電,継電器試験",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
