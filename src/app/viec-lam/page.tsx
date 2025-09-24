
'use client';

import { Suspense, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { JobCard } from '@/components/job-card';
import { SearchModule } from '@/components/job-search/search-module';
import type { Job } from '@/lib/mock-data';
import { jobData } from '@/lib/mock-data'; // Keep for fallback/type reference
import { useRouter } from 'next/navigation';
import client from '@/lib/elasticsearch'; // Import the default client

// Define the structure of the job object coming from Elasticsearch
interface ElasticsearchJob {
  id: string;
  code: string;
  visa: string; // This is the visaDetail
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
  aiContent: string;
  i18n: {
      aiContent: {
          vn: string;
      }
  };
  career: string;
  image: any[]; // Can be array or other types
  video: any[];
  salaryImages: any[];
  filter: {
      job: {
          label: string;
          value: string;
          valueArr: number[];
          parent: string;
      }
  };
  avatar: string; // This can be used as the main image
  status: string;
  postedDate: number; // Unix timestamp
  source: string;
  createdDate: number;
  basicSalaryCode: string;
  realSalaryCode: string;
  basicSalaryHourCode: string;
  country: string;
  createdID: string;
  dataAnalyst: string; // Recruiter name
  netFee?: string;
  netFeeNoTicket?: string;
  netFeeWithTuition?: string;
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


const LoadingJobGroup = () => (
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

const transformEsJobToJobCardProps = (esJob: ElasticsearchJob): Job => {
    const constructedTitle = `${esJob.job}, ${esJob.workLocation}, tuyển ${esJob.numberRecruits} ${esJob.gender === 'Cả nam và nữ' ? 'Nam/Nữ' : esJob.gender}`;

    // Calculate offset based on postedDate (assuming postedDate is a unix timestamp in seconds)
    const postedDate = new Date(esJob.postedDate * 1000);
    const today = new Date();
    const timeDiff = today.getTime() - postedDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    return {
      id: esJob.id,
      isRecording: false,
      image: {
        src: esJob.avatar || '/img/vieclam001.webp',
        type: 'thucte',
      },
      likes: '0', 
      salary: {
        basic: String(esJob.basicSalary || 0),
        actual: String(esJob.realSalary || 0),
      },
      title: constructedTitle,
      recruiter: {
        id: esJob.dataAnalyst.toLowerCase().replace(/\s/g, '-'),
        name: esJob.dataAnalyst,
        avatarUrl: '/img/favi2.png',
        company: 'HelloJob',
      },
      status: esJob.status === 'CONFIRMED' ? 'Đang tuyển' : 'Tạm dừng',
      postedTimeOffset: -daysDiff,
      interviewDateOffset: esJob.interviewDay === "Đủ người thì phỏng vấn" ? 999 : 10,
      interviewRounds: 1, 
      tags: [esJob.career, esJob.visa],
      visaDetail: esJob.visa,
      industry: esJob.career,
      workLocation: esJob.workLocation,
      quantity: parseInt(esJob.numberRecruits, 10) || 1,
      netFee: esJob.netFee,
      netFeeNoTicket: esJob.netFeeNoTicket,
      netFeeWithTuition: esJob.netFeeWithTuition,
      details: {
        description: esJob.aiContent || 'Mô tả công việc đang được cập nhật.',
        requirements: 'Yêu cầu cụ thể đang được cập nhật.',
        benefits: 'Quyền lợi đang được cập nhật.',
      }
    };
};

const JobGroupSection = ({ groupKey, title }: { groupKey: string; title: string }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                let queryBody: any = {
                    size: 8,
                    query: {
                        bool: {
                            must: [
                                { term: { status: "CONFIRMED" } }
                            ]
                        }
                    },
                    sort: [
                        { postedDate: "desc" }
                    ]
                };

                if (groupKey === 'luong-cao') {
                    queryBody.sort = [{ basicSalary: "desc" }];
                } else if (groupKey === 'phi-thap') {
                     const oneWeekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
                     queryBody.query.bool.must.push({
                         range: {
                             postedDate: {
                                 gte: oneWeekAgo
                             }
                         }
                     });
                     queryBody.sort = [
                        { netFeeWithTuition: { order: 'asc', missing: '_last' } },
                        { netFee: { order: 'asc', missing: '_last' } },
                        { netFeeNoTicket: { order: 'asc', missing: '_last' } },
                        { postedDate: "desc" }
                     ];
                } else if (jobGroupTitles[groupKey]) {
                    queryBody.query.bool.must.push({
                        term: {
                            "visa.keyword": jobGroupTitles[groupKey]
                        }
                    });
                }
                
                const response = await client.search({
                    index: 'hellojobv5-job-crawled',
                    body: queryBody,
                });

                const fetchedJobs = response.body.hits.hits.map((hit: any) => transformEsJobToJobCardProps(hit._source as ElasticsearchJob));
                setJobs(fetchedJobs);

            } catch (error) {
                console.error(`Failed to fetch jobs for group ${groupKey}:`, error);
                setJobs([]); // Set to empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [groupKey]);

    if (isLoading) return <LoadingJobGroup />;
    if (jobs.length === 0) return null;

    let link = `/tim-viec-lam?chi-tiet-loai-hinh-visa=${encodeURIComponent(groupKey)}`;
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
                {jobs.slice(0, 8).map(job => (
                   <JobCard key={job.id} job={job} variant="grid-item" showApplyButtons={true} />
                ))}
            </div>
            </CardContent>
        </Card>
        </section>
    );
};


export default function JobsPage() {
    const router = useRouter();

    const handleSearch = (filters: any) => {
        const query = new URLSearchParams(filters).toString();
        router.push(`/tim-viec-lam?${query}`);
    };
    
    return (
      <div className="flex flex-col">
          <Suspense fallback={<div className="h-[400px] bg-gray-200 animate-pulse" />}>
            <SearchModule onSearch={handleSearch} filters={{}} onFilterChange={() => {}} />
          </Suspense>
        <div className="w-full bg-secondary">
          <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection groupKey="luong-cao" title="Việc làm lương cao" />
            </Suspense>
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection groupKey="phi-thap" title="Việc làm phí thấp" />
            </Suspense>
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection groupKey="dac-dinh-dau-nhat" title="Đặc định đầu Nhật" />
            </Suspense>
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection groupKey="thuc-tap-sinh-3-nam" title="Thực tập sinh 3 năm" />
            </Suspense>
            <Suspense fallback={<LoadingJobGroup />}>
                {/* @ts-expect-error Server Component */}
                <JobGroupSection groupKey="ky-su-tri-thuc-dau-nhat" title="Kỹ sư, tri thức đầu Nhật" />
            </Suspense>
          </div>
        </div>
      </div>
    );
}

