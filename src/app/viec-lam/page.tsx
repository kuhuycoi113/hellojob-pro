
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobSearchPageContent from './client';
import { type Metadata } from 'next';

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
export default function JobSearchPage({ searchParams }: { searchParams: SearchParams }) {
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
