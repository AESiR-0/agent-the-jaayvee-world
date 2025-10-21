import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jaayvee Agents - Onboard & Manage Merchants",
    template: "%s | Jaayvee Agents"
  },
  description: "Join Jaayvee Agents program and earn commission by onboarding and managing merchants. Help businesses grow while earning from their activity.",
  keywords: [
    "agent program", "merchant onboarding", "commission", "business development", "Jaayvee agents",
    "merchant management", "agent commission", "business growth", "merchant support", "agent dashboard",
    "business development", "merchant training", "agent earnings", "business partnership", "agent network"
  ],
  authors: [{ name: "Jaayvee Team", url: "https://thejaayveeworld.com" }],
  creator: "Jaayvee",
  publisher: "Jaayvee",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://agents.jaayvee.com',
    siteName: 'Jaayvee Agents',
    title: 'Jaayvee Agents - Onboard & Manage Merchants',
    description: 'Join Jaayvee Agents program and earn commission by onboarding and managing merchants. Help businesses grow while earning from their activity.',
    images: [
      {
        url: '/static/logos/agents/agents_og.png',
        width: 1200,
        height: 630,
        alt: 'Jaayvee Agents - Onboard & Manage Merchants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaayvee Agents - Onboard & Manage Merchants',
    description: 'Join Jaayvee Agents program and earn commission by onboarding and managing merchants. Help businesses grow while earning from their activity.',
    images: ['/static/logos/agents/agents_twitter.png'],
    creator: '@jaayvee',
  },
  icons: {
    icon: "/static/logos/agents/agents_fav.png",
    shortcut: "/static/logos/agents/agents_fav.png",
    apple: "/static/logos/agents/agents_fav.png",
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://agents.jaayvee.com',
  },
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Jaayvee Agents",
              "url": "https://agents.jaayvee.com",
              "logo": "https://agents.jaayvee.com/static/logos/agents/agents_logo.png",
              "description": "Join Jaayvee Agents program and earn commission by onboarding and managing merchants. Help businesses grow while earning from their activity.",
              "foundingDate": "2024",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Jaayvee Team"
                }
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-XXXXXXXXXX",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://twitter.com/jaayvee",
                "https://linkedin.com/company/jaayvee",
                "https://instagram.com/jaayvee"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "Maharashtra",
                "addressLocality": "Mumbai"
              },
              "serviceType": "Agent Management Platform",
              "areaServed": {
                "@type": "Country",
                "name": "India"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
