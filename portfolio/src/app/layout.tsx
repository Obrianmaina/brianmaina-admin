import CookieBanner from '@/components/CookieBanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update your global metadata here
export const metadata: Metadata = {
  metadataBase: new URL('https://brianmaina.de/'), // Replace with your actual live domain
  title: 'Brian Maina Nyawira | Visual Designer & IT Professional',
  description: 'The professional portfolio of Brian Maina Nyawira, showcasing work in UI/UX, presentation design, branding, and graphics.',
  openGraph: {
    title: 'Brian Maina Nyawira | Visual Designer',
    description: 'The professional portfolio of Brian Maina Nyawira, showcasing work in UI/UX, presentation design, branding, and graphics.',
    url: '/',
    siteName: 'Brian Maina Portfolio',
    images: [
      {
        url: '/og-image.png', // Add a default 1200x630 preview image in your public folder
        width: 1200,
        height: 630,
        alt: 'Brian Maina Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brian Maina Nyawira | Visual Designer',
    description: 'The professional portfolio of Brian Maina Nyawira.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-300 flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          
          <div className="pt-16 flex-grow">
            {children}
          </div>

          <Footer />
          
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}