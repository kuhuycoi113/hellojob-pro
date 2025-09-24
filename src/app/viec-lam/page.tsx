
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { SearchModule } from '@/components/job-search/search-module';
import { searchDocuments } from '@/lib/elasticsearch';
import type { Job } from '@/lib/mock-data';

// Define the structure of the job object coming from Elasticsearch
interface ElasticsearchJob {
  id: string;
  code: string;
  visa: string; // This is the new visaDetail
  job: string; // Part of the title
  workLocation: string;
  gender: string;
  numberRecruits: string;
  age: string;
  language: string;
  languageLevel: string;
  basicSalary: number;
  realSalary: number;
  back: number;
  interviewDay: string;
  specialConditions: string;
  career: string;
  avatar: string; // This can be used as the main image
  postedDate: number;
  dataAnalyst: string; // Recruiter name
}

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

const getJobsForGroup = async (group: string): Promise<ElasticsearchJob[]> => {
  let queryBody: any = {
    size: 8,
    query: {
      match_all: {},
    },
  };

  if (jobGroupTitles[group]) {
    if (group === 'luong-cao') {
      queryBody.sort = [{ basicSalary: { order: 'desc' } }];
    } else if (group === 'phi-thap') {
      queryBody.query = {
        range: {
          postedDate: { // Assuming postedDate is a timestamp or date
            gte: 'now-7d/d',
            lte: 'now/d',
          },
        },
      };
      queryBody.sort = [{ netFee: { order: 'asc', missing: '_last' } }]; // Assuming a 'netFee' field
    } else if (group !== 'co-the-ban-quan-tam' && group !== 'goi-y') {
       queryBody.query = {
        match: {
          'visa.keyword': jobGroupTitles[group], // Use the 'visa' field from the new structure
        },
      };
    }
  }

  try {
    const response = await searchDocuments('hellojobv5-job-crawled', queryBody);
    return response.body.hits.hits.map((hit: any) => hit._source as ElasticsearchJob);
  } catch (error) {
    console.error(`Error fetching jobs for group "${group}":`, error);
    return [];
  }
};

const JobGroupSection = async ({ group, title }: { group: string; title: string }) => {
  const esJobs = await getJobsForGroup(group);

  if (esJobs.length === 0) return null;

  // Function to transform Elasticsearch job data to the format JobCard expects
  const transformEsJobToJobCardProps = (esJob: ElasticsearchJob): Job => {
    // Construct a title from available fields
    const constructedTitle = `${esJob.job}, ${esJob.workLocation}, tuyển ${esJob.numberRecruits} ${esJob.gender === 'Cả nam và nữ' ? 'Nam/Nữ' : esJob.gender}`;

    return {
      id: esJob.id,
      isRecording: false,
      image: {
        src: esJob.avatar || '/img/vieclam001.webp', // Use avatar as the main image, with a fallback
        type: 'thucte',
      },
      likes: '0', // Placeholder
      salary: {
        basic: String(esJob.basicSalary || 0),
        actual: String(esJob.realSalary || 0),
      },
      title: constructedTitle,
      recruiter: {
        id: esJob.dataAnalyst.toLowerCase().replace(/\s/g, '-'), // Create an ID from the name
        name: esJob.dataAnalyst,
        avatarUrl: '/img/favi2.png', // Placeholder avatar
        company: 'HelloJob', // Placeholder company
      },
      status: 'Đang tuyển', // Assuming default status
      postedTimeOffset: 0, // Cannot be calculated from timestamp without client-side logic
      interviewDateOffset: esJob.interviewDay === "Đủ người thì phỏng vấn" ? 999 : 10, // Placeholder
      interviewRounds: 1, // Placeholder
      tags: [esJob.career, esJob.visa],
      visaDetail: esJob.visa,
      industry: esJob.career,
      workLocation: esJob.workLocation,
      quantity: parseInt(esJob.numberRecruits, 10) || 1,
      details: { // Add placeholder details
          description: esJob.aiContent || 'Mô tả công việc chi tiết.',
          requirements: 'Yêu cầu chi tiết sẽ được trao đổi khi phỏng vấn.',
          benefits: 'Quyền lợi và chế độ đãi ngộ hấp dẫn.'
      }
    };
  };

  const jobs: Job[] = esJobs.map(transformEsJobToJobCardProps);

  let link = `/tim-viec-lam?chi-tiet-loai-hinh-visa=${encodeURIComponent(group)}`;
  if (title === 'Việc làm lương cao') {
      link = '/tim-viec-lam?sap-xep=luong-co-ban-cao-den-thap';
  } else if (title === 'Việc làm phí thấp') {
      link = '/tim-viec-lam?sap-xep=phi-thap-den-cao';
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
