
import { MetadataRoute } from 'next';
import { articles } from '@/lib/handbook-data';
import { jobData } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://hellojob.vn'; // Replace with your actual domain

  // Static pages
  const staticRoutes = [
    '',
    '/lo-trinh',
    '/career-orientation', // This route seems not to be translated, keeping it as is.
    '/career-orientation/holland',
    '/career-orientation/disc',
    '/career-orientation/mbti',
    '/tao-ho-so-ai',
    '/hoc-tap',
    '/cam-nang',
    '/gioi-thieu',
    '/ho-so-cua-toi',
    '/nha-tuyen-dung',
    '/nhuong-quyen',
    '/dang-tin-tuyen-dung',
    '/bang-dieu-khien',
    '/gop-y',
    '/nang-cap-premium',
    '/gioi-thieu-ban-be',
    '/viec-lam',
    '/tim-viec-lam',
    '/chat', // Assuming /chat is a valid route not needing translation
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic handbook articles
  const handbookRoutes = articles.map((article) => ({
    url: `${siteUrl}/cam-nang/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic job pages
  const jobRoutes = jobData.map((job) => ({
      url: `${siteUrl}/viec-lam/${job.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
  }));
  
  // You can add more dynamic routes here, e.g., for employers, etc.

  return [...staticRoutes, ...handbookRoutes, ...jobRoutes];
}
