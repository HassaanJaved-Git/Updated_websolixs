import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import CustomCursor from "@/components/layout/CustomCursor";
import JsonLd from "@/components/ui/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const content = getContent();
const { seo } = content;

export const metadata: Metadata = {
  metadataBase: new URL(seo.canonical ?? "https://websolixs.com"),
  title: {
    default: seo.title,
    template: `%s | Websolixs`,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: "Websolixs", url: seo.canonical }],
  creator: "Websolixs",
  publisher: "Websolixs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seo.canonical,
    siteName: "Websolixs",
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.ogImage ?? "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Websolixs — Next-Gen Software House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage ?? "/og-image.jpg"],
    creator: "@websolixs",
    site: "@websolixs",
  },
  alternates: {
    canonical: seo.canonical,
    languages: {
      "en-US": `${seo.canonical}/en`,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <JsonLd content={content} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" hrefLang="en" href="https://websolixs.com" />
        <link rel="alternate" hrefLang="x-default" href="https://websolixs.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
