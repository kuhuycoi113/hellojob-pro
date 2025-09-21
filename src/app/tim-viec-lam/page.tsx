
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobSearchPageContent from './client';
import { type Metadata } from 'next';
import { visaDetailsByVisaType } from '@/lib/visa-data';
import { allJapanLocations, japanRegions } from '@/lib/location-data';
import { industriesByJobType } from '@/lib/industry-data';

type SearchParams = {
  q?: string;
  'chi-tiet-loai-hinh-visa'?: string;
  'nganh-nghe'?: string;
  'dia-diem'?: string | string[];
};

const allIndustries = Object.values(industriesByJobType).flat();

const getNameFromSlug = (slug: string, data: { name: string; slug: string }[]): string | undefined => {
  return data.find(item => item.slug === slug)?.name;
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const siteName = 'HelloJob';
  const baseUrl = 'https://vi.hellojob.jp';

  const q = searchParams.q || '';
  const visaDetailSlug = searchParams['chi-tiet-loai-hinh-visa'];
  const industrySlug = searchParams['nganh-nghe'];
  const locationSlug = searchParams['dia-diem'];

  let titleParts: string[] = [];
  if (q) titleParts.push(`"${q}"`);

  let visaDetailName: string | undefined;
  if(visaDetailSlug) {
    for (const key in visaDetailsByVisaType) {
        const detail = (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).find(d => d.slug === visaDetailSlug);
        if (detail) {
            visaDetailName = detail.name;
            break;
        }
    }
  }
  if (visaDetailName) titleParts.push(visaDetailName);

  const industryName = industrySlug ? getNameFromSlug(industrySlug, allIndustries) : undefined;
  if (industryName) titleParts.push(industryName);

  const locations = Array.isArray(locationSlug) ? locationSlug : (locationSlug ? [locationSlug] : []);
  if (locations.length > 0) {
      const locationNames = locations.map(slug => {
          const region = japanRegions.find(r => r.slug === slug);
          if (region) return `vùng ${region.name}`;
          return getNameFromSlug(slug, allJapanLocations) || slug;
      }).join(', ');
      if (locationNames) titleParts.push(`tại ${locationNames}`);
  }

  const title = titleParts.length > 0
    ? `Việc làm ${titleParts.join(' ')} | ${siteName}`
    : `Tìm kiếm việc làm tại Nhật Bản | ${siteName}`;

  const description = titleParts.length > 0
    ? `Khám phá các cơ hội việc làm ${titleParts.join(' ')} tại Nhật Bản. Hàng ngàn đơn hàng Kỹ năng đặc định, Thực tập sinh, Kỹ sư đang chờ bạn ứng tuyển trên HelloJob.`
    : 'Tìm kiếm hàng ngàn cơ hội việc làm tại Nhật Bản. HelloJob là nền tảng giúp bạn tìm kiếm việc làm theo ngành nghề, địa điểm và loại visa phù hợp nhất.';
  
  // Safely construct URLSearchParams
  const cleanSearchParams: { [key: string]: string | string[] } = {};
  if (q) cleanSearchParams.q = q;
  if (visaDetailSlug) cleanSearchParams['chi-tiet-loai-hinh-visa'] = visaDetailSlug;
  if (industrySlug) cleanSearchParams['nganh-nghe'] = industrySlug;
  if (locations.length > 0) cleanSearchParams['dia-diem'] = locations;
  
  const url = `${baseUrl}/tim-viec-lam?${new URLSearchParams(cleanSearchParams).toString()}`;


  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
    },
    twitter: {
        title,
        description,
    },
    alternates: {
        canonical: url,
    }
  };
}


export default function JobSearchPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary"/>
        </div>
    }>
        <JobSearchPageContent />
    </Suspense>
  );
}
