import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechNest.app | Tech Events in São Paulo",
  description:
    "Discover all tech events happening in São Paulo. Find meetups, conferences, workshops, and more in the tech community.",
  keywords: [
    "tech events",
    "São Paulo",
    "technology",
    "meetups",
    "conferences",
    "workshops",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "TechNest.app | Tech Events in São Paulo",
    description:
      "Discover all tech events happening in São Paulo. Find meetups, conferences, workshops, and more in the tech community.",
    url: "https://technest.app",
    siteName: "TechNest.app",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNest.app | Tech Events in São Paulo",
    description:
      "Discover all tech events happening in São Paulo. Find meetups, conferences, workshops, and more in the tech community.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}