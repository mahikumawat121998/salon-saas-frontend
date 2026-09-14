import AppProviders from "@/providers/AppProviders";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SalonOS - Management Suite",
  description: "All-in-one luxury salon management & appointment booking software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let mode = 'light';
                const stored = localStorage.getItem('salonos_theme_store');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (parsed?.state?.mode) {
                    mode = parsed.state.mode;
                  }
                }
                
                if (mode === 'dark') {
                  document.documentElement.style.setProperty('--initial-bg', '#0F172A');
                  document.documentElement.style.setProperty('--initial-text', '#F8FAFC');
                  document.documentElement.style.setProperty('--initial-text-secondary', '#94A3B8');
                  document.documentElement.style.setProperty('--initial-loader-bg', 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.18) 0%, transparent 70%)');
                } else {
                  document.documentElement.style.setProperty('--initial-bg', '#FFFFFF');
                  document.documentElement.style.setProperty('--initial-text', '#0F172A');
                  document.documentElement.style.setProperty('--initial-text-secondary', '#475569');
                  document.documentElement.style.setProperty('--initial-loader-bg', 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
