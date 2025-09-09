import type { Metadata } from 'next';
import './globals.css';
import { RootProvider } from '@/components/layout/root-provider';

const siteConfig = {
  name: "HelloJob",
  url: "https://hellojob.vn", // Replace with your actual domain
  description: "Nền tảng việc làm và phát triển sự nghiệp tại Nhật Bản. Tìm kiếm việc làm Kỹ năng đặc định (Tokutei Ginou), Thực tập sinh, Kỹ sư. Xây dựng lộ trình sự nghiệp (SWR) bền vững.",
  ogImage: "/metadata/opengraph-image.jpg",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "việc làm Nhật Bản",
    "Tokutei Ginou",
    "Kỹ năng đặc định",
    "Thực tập sinh Nhật Bản",
    "xuất khẩu lao động",
    "HelloJob",
    "SWR",
    "lộ trình sự nghiệp"
  ],
  authors: [{ name: "HelloJob Team", url: siteConfig.url }],
  creator: "HelloJob Team",
  manifest: "/metadata/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@hellojob", // Replace with your Twitter handle
  },
  icons: {
    icon: [
        { url: '/metadata/favicon-32x32.png' },
        { url: '/metadata/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/metadata/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
        { url: '/metadata/apple-touch-icon.png' },
    ],
    other: [
        {
            rel: 'android-chrome-192x192',
            url: '/metadata/android-chrome-192x192.png'
        },
        {
            rel: 'android-chrome-512x512',
            url: '/metadata/android-chrome-512x512.png'
        }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased pb-20 md:pb-0">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
