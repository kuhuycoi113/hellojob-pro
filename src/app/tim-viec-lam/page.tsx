
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobSearchPageContent from './client';
import { type Metadata } from 'next';
import { allSpecialConditions, visaDetailsByVisaType, workShifts } from '@/lib/visa-data';
import { allJapanLocations, japanRegions } from '@/lib/location-data';
import { industriesByJobType } from '@/lib/industry-data';

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

const allIndustries = Object.values(industriesByJobType).flat();

const getNameFromSlug = (slug: string, data: { name: string; slug: string }[]): string | undefined => {
  return data.find(item => item.slug === slug)?.name;
};

const sortSlugToNameMap: { [key: string]: string } = {
    'moi-nhat': 'Mới nhất',
    'luong-co-ban-cao-den-thap': 'Lương cao nhất',
    'luong-co-ban-thap-den-cao': 'Lương thấp nhất',
    'thuc-linh-cao-den-thap': 'Thực lĩnh cao nhất',
    'thuc-linh-thap-den-cao': 'Thực lĩnh thấp nhất',
    'phi-thap-den-cao': 'Phí thấp nhất',
    'phi-cao-den-thap': 'Phí cao nhất',
    'phong-van-gan-nhat': 'Phỏng vấn gần nhất',
    'phong-van-xa-nhat': 'Phỏng vấn xa nhất',
    'uu-tien-co-anh': 'Ưu tiên có ảnh',
    'uu-tien-co-video': 'Ưu tiên có video',
    'hot-nhat': 'Hot nhất',
    'nhieu-nguoi-ung-tuyen': 'Nhiều người ứng tuyển',
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const siteName = 'HelloJob';
  const baseUrl = 'https://vi.hellojob.jp';

  const q = searchParams.q as string || '';
  const visaDetailSlug = searchParams['chi-tiet-loai-hinh-visa'] as string;
  const industrySlug = searchParams['nganh-nghe'] as string;
  const locationParam = searchParams['dia-diem'];
  const specialConditionsParam = searchParams['dieu-kien-dac-biet'];
  const sortBySlug = searchParams['sap-xep'] as string;
  const quantity = searchParams['so-luong'] as string;
  const workShiftSlug = searchParams['ca-lam-viec'] as string;

  const locations = Array.isArray(locationParam) ? locationParam : (locationParam ? [locationParam] : []);
  const specialConditionSlugs = Array.isArray(specialConditionsParam) ? specialConditionsParam : (specialConditionsParam ? [specialConditionsParam] : []);


  let titleParts: string[] = [];
  
  const sortName = sortBySlug ? sortSlugToNameMap[sortBySlug] : undefined;
  if (sortName) titleParts.push(sortName);
  
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
  
  const specialConditionNames = specialConditionSlugs.map(slug => getNameFromSlug(slug, allSpecialConditions)).filter(Boolean).join(', ');
  if (specialConditionNames) titleParts.push(specialConditionNames);
  
  const workShiftName = workShiftSlug ? getNameFromSlug(workShiftSlug, workShifts) : undefined;
  if (workShiftName) titleParts.push(workShiftName);

  if (quantity) titleParts.push(`tuyển từ ${quantity} người`);

  if (locations.length > 0) {
      const locationNames = locations.map(slug => {
          const region = japanRegions.find(r => r.slug === slug);
          if (region) return `vùng ${region.name}`;
          return getNameFromSlug(slug, allJapanLocations) || slug;
      }).join(', ');
      if (locationNames) titleParts.push(`tại ${locationNames}`);
  }

  const baseTitle = "Việc làm";
  const title = titleParts.length > 0
    ? `${baseTitle} ${titleParts.join(' ')} | ${siteName}`
    : `Tìm kiếm việc làm tại Nhật Bản | ${siteName}`;

  const description = titleParts.length > 0
    ? `Danh sách việc làm ${titleParts.join(' ')} tại Nhật Bản. Hàng ngàn đơn hàng Kỹ năng đặc định, Thực tập sinh, Kỹ sư đang chờ bạn ứng tuyển trên HelloJob.`
    : 'Tìm kiếm hàng ngàn cơ hội việc làm tại Nhật Bản. HelloJob là nền tảng giúp bạn tìm kiếm việc làm theo ngành nghề, địa điểm và loại visa phù hợp nhất.';
  
  // Safely construct URLSearchParams
  const cleanSearchParams: { [key: string]: string | string[] } = {};
  if (q) cleanSearchParams.q = q;
  if (visaDetailSlug) cleanSearchParams['chi-tiet-loai-hinh-visa'] = visaDetailSlug;
  if (industrySlug) cleanSearchParams['nganh-nghe'] = industrySlug;
  if (locations.length > 0) cleanSearchParams['dia-diem'] = locations;
  if (specialConditionSlugs.length > 0) cleanSearchParams['dieu-kien-dac-biet'] = specialConditionSlugs;
  if (sortBySlug) cleanSearchParams['sap-xep'] = sortBySlug;
  if (quantity) cleanSearchParams['so-luong'] = quantity;
  if (workShiftSlug) cleanSearchParams['ca-lam-viec'] = workShiftSlug;
  
  const url = `${baseUrl}/tim-viec-lam?${new URLSearchParams(cleanSearchParams as any).toString()}`;


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
