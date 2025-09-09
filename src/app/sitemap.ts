
import { MetadataRoute } from 'next';
import { articles } from '@/lib/handbook-data';
import { jobData } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://hellojob.vn'; // Replace with your actual domain

  // Static pages
  const staticRoutes = [
    '',
    '/roadmap',
    '/career-orientation',
    '/career-orientation/holland',
    '/career-orientation/disc',
    '/career-orientation/mbti',
    '/ai-profile',
    '/learn',
    '/handbook',
    '/about',
    '/candidate-profile',
    '/employers',
    '/franchise',
    '/post-job',
    '/dashboard',
    '/feedback',
    '/premium',
    '/referral',
    '/jobs',
    '/chat',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic handbook articles
  const handbookRoutes = articles.map((article) => ({
    url: `${siteUrl}/handbook/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic job pages
  const jobRoutes = jobData.map((job) => ({
      url: `${siteUrl}/jobs/${job.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
  }));
  
  // You can add more dynamic routes here, e.g., for employers, etc.

  return [...staticRoutes, ...handbookRoutes, ...jobRoutes];
}
