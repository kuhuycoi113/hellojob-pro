
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { type Metadata } from 'next';
import JobSearchPageContent from '@/app/tim-viec-lam/client';
import { searchDocuments } from '@/lib/elasticsearch';


type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// This metadata function can remain on the server
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  // ... metadata generation logic will be added back if needed ...
  return {
    title: "Tìm kiếm việc làm tại Nhật Bản",
    description: "Tìm kiếm hàng ngàn cơ hội việc làm tại Nhật Bản. HelloJob là nền tảng giúp bạn tìm kiếm việc làm theo ngành nghề, địa điểm và loại visa phù hợp nhất."
  }
}

// The main page is now a Server Component
export default async function JobSearchPage({ searchParams }: { searchParams: SearchParams }) {
  // Data fetching logic can now safely happen here on the server
  // For now, we will pass searchParams and let the client component handle it with mock data
  // to restore the previous UI and functionality.
  // In a real server-side implementation, we would fetch from Elasticsearch here.

  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary"/>
        </div>
    }>
        {/* Pass searchParams to the client component */}
        <JobSearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}
