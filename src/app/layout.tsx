import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "SHONGJOG (সংযোগ) — Inclusive Emergency Access Network",
  description:
    "AI-powered accessibility and emergency-response coordination platform connecting people with disabilities and older adults to verified step-free transport and accessible shelters. CTRL-V 2026 Hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('shongjog_lang');if(l==='bn'){document.documentElement.lang='bn';document.documentElement.classList.add('lang-bn');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F4F7F6] text-[#142D36] overflow-x-hidden">
        <Navbar />
        <main className="flex-1 max-w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
