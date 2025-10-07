
import { notFound } from 'next/navigation';
import { articles, type HandbookArticle } from '@/lib/handbook-data';
import type { Metadata, ResolvingMetadata } from 'next';
import { JsonLdScript } from '@/components/json-ld-script';
import ArticleClient from './client';

type Props = {
  params: { slug: string };
};

// Generate metadata for each article page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: 'Không tìm thấy bài viết',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại.',
    };
  }

  // Optionally access and extend parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image, ...previousImages],
      type: 'article',
      publishedTime: new Date().toISOString(), // Placeholder, replace with actual publish date if available
      authors: [article.author],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLdScript article={article} />
      <ArticleClient article={article} />
    </>
  );
}
