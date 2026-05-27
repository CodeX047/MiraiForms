import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GlobalProviders } from "~/providers/global";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Mirai Forms",
    template: "%s | Mirai Forms",
  },
  description: "Mirai Forms - Build Beautiful and Interactive Forms in seconds with zero code.",
  keywords: ["forms", "form builder", "surveys", "mirai forms", "no-code"],
  authors: [{ name: "Mirai Team" }],
  openGraph: {
    title: "Mirai Forms",
    description: "Build Beautiful and Interactive Forms in seconds with zero code.",
    url: "https://miraiforms.com",
    siteName: "Mirai Forms",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirai Forms",
    description: "Build Beautiful and Interactive Forms in seconds with zero code.",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} dark antialiased`}>
          <GlobalProviders>{children}</GlobalProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
