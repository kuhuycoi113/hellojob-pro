
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, LogIn } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { SearchModule } from '@/components/job-search/search-module';
import { searchDocuments } from '@/lib/elasticsearch';
import type { Job } from '@/lib/mock-data';

const jobGroupTitles: { [key: string]: string } = {
  'dac-dinh-dau-nhat': 'Đặc định đầu Nhật',
  'dac-dinh-dau-viet': 'Đặc định đầu Việt',
  'thuc-tap-sinh-3-nam': 'Thực tập sinh 3 năm',
  'ky-su-tri-thuc-dau-nhat': 'Kỹ sư, tri thức đầu Nhật',
  'ky-su-tri-thuc-dau-viet': 'Kỹ sư, tri thức đầu Việt',
  'dac-dinh-di-moi': 'Đặc định đi mới',
  'thuc-tap-sinh-1-nam': 'Thực tập sinh 1 năm',
  'thuc-tap-sinh-3-go': 'Thực tập sinh 3 Go',
  'luong-cao': 'Việc làm lương cao',
  'phi-thap': 'Việc làm phí thấp',
  'co-the-ban-quan-tam': 'Có thể bạn quan tâm',
  'goi-y': 'Gợi ý cho bạn',
};

const getJobsForGroup = async (group: string): Promise<Job[]> => {
  let queryBody: any = {
    size: 8,
    query: {
      match_all: {},
    },
  };

  if (jobGroupTitles[group]) {
    if (group === 'luong-cao') {
      queryBody.sort = [{ 'salary.basic.keyword': { order: 'desc' } }];
    } else if (group === 'phi-thap') {
      queryBody.query = {
        range: {
          postedTime: {
            gte: 'now-7d/d',
            lte: 'now/d',
          },
        },
      };
      queryBody.sort = [{ netFee: { order: 'asc', missing: '_last' } }];
    } else if (group !== 'co-the-ban-quan-tam' && group !== 'goi-y') {
       queryBody.query = {
        match: {
          'visaDetail.keyword': jobGroupTitles[group],
        },
      };
    }
  }

  try {
    const response = await searchDocuments('hellojobv5-job-crawled', queryBody);
    return response.body.hits.hits.map((hit: any) => hit._source as Job);
  } catch (error) {
    console.error(`Error fetching jobs for group "${group}":`, error);
    return [];
  }
};

const JobGroupSection = async ({ group, title }: { group: string; title: string }) => {
  const jobs = await getJobsForGroup(group);

  if (jobs.length === 0) return null;

  let link = `/tim-viec-lam?chi-tiet-loai-hinh-visa=${encodeURIComponent(group)}`;
  if (title === 'Việc làm lương cao') {
      link = '/tim-viec-lam?sap-xep=salary_desc';
  } else if (title === 'Việc làm phí thấp') {
      link = '/tim-viec-lam?sap-xep=fee_asc';
  } else if (title === 'Gợi ý cho bạn' || title === 'Có thể bạn quan tâm') {
      link = '/viec-lam-cua-toi';
  }

  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
            <Button asChild variant="link">
              <Link href={link}>Xem tất cả</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} variant="grid-item" showApplyButtons={true} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default async function JobsPage() {
  // This page is now a server component.
  // The client-side logic for search is handled inside SearchModule and SearchResults page.

  return (
    <div className="flex flex-col">
      <Suspense fallback={<div className="h-[400px] bg-gray-200 animate-pulse" />}>
        {/* @ts-expect-error Server Component */}
        <SearchModuleWrapper />
      </Suspense>
      <div className="w-full bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection group="luong-cao" title="Việc làm lương cao" />
            </Suspense>
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection group="phi-thap" title="Việc làm phí thấp" />
            </Suspense>
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection group="dac-dinh-dau-nhat" title="Đặc định đầu Nhật" />
            </Suspense>
             <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection group="thuc-tap-sinh-3-nam" title="Thực tập sinh 3 năm" />
            </Suspense>
             <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection group="ky-su-tri-thuc-dau-nhat" title="Kỹ sư, tri thức đầu Nhật" />
            </Suspense>
        </div>
      </div>
    </div>
  );
}

// A wrapper to make SearchModule usable in a Server Component
async function SearchModuleWrapper() {
    // This wrapper can fetch initial data or props for SearchModule if needed in the future
    return <SearchModule onSearch={() => {}} filters={{}} onFilterChange={() => {}} />;
}

function LoadingJobGroup() {
    return (
         <Card className="shadow-lg">
            <CardHeader>
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
