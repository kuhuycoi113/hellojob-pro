
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobSearchPageContent from './client';
import { type Metadata } from 'next';
import { allSpecialConditions, visaDetailsByVisaType, workShifts, otherSkills, dominantHands, educationLevels, englishLevels, tattooRequirements, visionRequirements, experienceYears } from '@/lib/visa-data';
import { allJapanLocations, japanRegions, interviewLocations } from '@/lib/location-data';
import { industriesByJobType } from '@/lib/industry-data';
import { format, isValid, parse } from 'date-fns';
import LANGUAGE_LEVEL from '@/lib/language_level.json';
import { generateJobFilter } from '@/lib/job-filter-util';
import { getJobs } from '@/actions/jobs-action';
const languageLevels = LANGUAGE_LEVEL.filter(level => level.groupCode.includes('TN'));

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

const allIndustries = Object.values(industriesByJobType).flat();
const allJobDetailsForExperience = [...new Set(Object.values(industriesByJobType).flat().flatMap(ind => ind.keywords).filter(Boolean))];


const createSlug = (str: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0000-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-.]+/g, '');
};

const getNameFromSlug = (slug: string, data: { name: string; slug: string }[] | string[]): string | undefined => {
  if (typeof data[0] === 'string') {
    const allKeywords = Object.values(industriesByJobType).flat().flatMap(ind => ind.keywords);
    return allKeywords.find(item => createSlug(item) === slug);
  }
  return (data as { name: string; slug: string }[]).find(item => item.slug === slug)?.name;
};

const formatCmToMeter = (cm: string): string => {
  const num = parseInt(cm.replace('cm', '').trim(), 10);
  if (isNaN(num)) return cm;
  const meters = Math.floor(num / 100);
  const centimeters = num % 100;
  return `${meters}m${centimeters < 10 ? '0' : ''}${centimeters}`;
}

const interviewRoundsOptions = [
  { name: "1 vòng", slug: "1-vong" },
  { name: "2 vòng", slug: "2-vong" },
  { name: "3 vòng", slug: "3-vong" },
  { name: "4 vòng", slug: "4-vong" },
  { name: "5 vòng", slug: "5-vong" }
];

const ginouExpiryOptions = [
  { name: "Trên 4,5 năm", slug: "tren-4-5-nam" },
  { name: "Trên 4 năm", slug: "tren-4-nam" },
  { name: "Trên 3,5 năm", slug: "tren-3-5-nam" },
  { name: "Trên 3 năm", slug: "tren-3-nam" },
  { name: "Trên 2,5 năm", slug: "tren-2-5-nam" },
  { name: "Trên 2 năm", slug: "tren-2-nam" },
  { name: "Trên 1,5 năm", slug: "tren-1-5-nam" },
  { name: "Trên 1 năm", slug: "tren-1-nam" },
  { name: "Trên 0,5 năm", slug: "tren-0-5-nam" }
];


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

export async function generateMetadata({ searchParams }: { searchParams: any }): Promise<Metadata> {
  const siteName = 'HelloJob';
  const params = await searchParams;

  const q = params.q as string || '';
  const visaDetailSlug = params['chi-tiet-loai-hinh-visa'] as string;
  const industrySlug = params['nganh-nghe'] as string;
  const locationParam = params['dia-diem'];
  const interviewLocationSlug = params['dia-diem-phong-van'] as string;
  const specialConditionsParam = params['dieu-kien-dac-biet'];
  const sortBySlug = params['sap-xep'] as string;
  const quantity = params['so-luong'] as string;
  const workShiftSlug = params['ca-lam-viec'] as string;
  const otherSkillParam = params['yeu-cau-ky-nang-khac'];
  const dominantHandSlug = params['tay-thuan'] as string;
  const educationSlug = params['hoc-van'] as string;
  const languageSlug = params['yeu-cau-tieng-nhat'] as string;
  const englishSlug = params['yeu-cau-tieng-anh'] as string;
  const tattooSlug = params['hinh-xam'] as string;
  const visionSlug = params['yeu-cau-thi-luc'] as string;
  const genderSlug = params['gioi-tinh'] as string;
  const ageParam = params['do-tuoi'];
  const heightParam = params['chieu-cao'];
  const weightParam = params['can-nang'];
  const experienceRequirementSlug = params['yeu-cau-kinh-nghiem'] as string;
  const experienceSlug = params['so-nam-kinh-nghiem'] as string;
  const netSalary = params['luong-thuc-linh'] as string;
  const basicSalary = params['luong-co-ban'] as string;
  const hourlySalary = params['luong-gio'] as string;
  const annualIncome = params['thu-nhap-nam'] as string;
  const annualBonus = params['thuong-nam'] as string;
  const interviewDate = params['ngay-phong-van'] as string;
  const interviewDateType = params['loai-ngay-phong-van'] as string; // Read the date type
  const interviewRoundsSlug = params['so-vong-phong-van'] as string;
  const jobDetailSlug = params['chi-tiet-cong-viec'] as string;
  const netFee = params['muc-phi'] as string;
  const netFeeNoTicket = params['muc-phi-khong-ve'] as string;
  const ginouExpirySlug = params['han-ginou'] as string;
  const companyArrivalTime = params['thoi-diem-ve-cong-ty'] as string;


  const locations = Array.isArray(locationParam) ? locationParam : (locationParam ? [locationParam] : []);
  const specialConditionSlugs = Array.isArray(specialConditionsParam) ? specialConditionsParam : (specialConditionsParam ? [specialConditionsParam] : []);
  const otherSkillSlugs = Array.isArray(otherSkillParam) ? otherSkillParam : (otherSkillParam ? [otherSkillParam] : []);
  const ages = Array.isArray(ageParam) ? ageParam : (ageParam ? [ageParam] : []);
  const heights = Array.isArray(heightParam) ? heightParam : (heightParam ? [heightParam] : []);
  const weights = Array.isArray(weightParam) ? weightParam : (weightParam ? [weightParam] : []);


  let titleParts: string[] = [];

  const sortName = sortBySlug ? sortSlugToNameMap[sortBySlug] : undefined;
  if (sortName) titleParts.push(sortName);

  if (q) titleParts.push(`"${q}"`);

  let visaDetailName: string | undefined;
  if (visaDetailSlug) {
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

  const allKeywords = Object.values(industriesByJobType).flat().flatMap(ind => ind.keywords);
  const jobDetailName = jobDetailSlug ? allKeywords.find(keyword => createSlug(keyword) === jobDetailSlug) : undefined;
  if (jobDetailName) titleParts.push(jobDetailName);

  const specialConditionNames = specialConditionSlugs.map(slug => getNameFromSlug(slug, allSpecialConditions)).filter(Boolean).join(', ');
  if (specialConditionNames) titleParts.push(specialConditionNames);

  const workShiftName = workShiftSlug ? getNameFromSlug(workShiftSlug, workShifts) : undefined;
  if (workShiftName) titleParts.push(workShiftName);

  if (quantity) titleParts.push(`tuyển từ ${quantity} người`);

  const otherSkillNames = otherSkillSlugs.map(slug => getNameFromSlug(slug, otherSkills)).filter(Boolean).join(', ');
  if (otherSkillNames) titleParts.push(`yêu cầu ${otherSkillNames}`);

  const dominantHandName = dominantHandSlug ? getNameFromSlug(dominantHandSlug, dominantHands) : undefined;
  if (dominantHandName && dominantHandName !== "Tất cả") titleParts.push(`yêu cầu ${dominantHandName}`);

  const educationName = educationSlug ? getNameFromSlug(educationSlug, educationLevels) : undefined;
  if (educationName && educationName !== "Tất cả" && educationName !== "Không yêu cầu") titleParts.push(`yêu cầu ${educationName}`);

  const languageName = languageSlug ? getNameFromSlug(languageSlug, languageLevels) : undefined;
  if (languageName && languageName !== "Không yêu cầu") titleParts.push(`yêu cầu Tiếng Nhật ${languageName}`);

  const englishName = englishSlug ? getNameFromSlug(englishSlug, englishLevels) : undefined;
  if (englishName && englishName !== "Không yêu cầu") titleParts.push(`yêu cầu Tiếng Anh ${englishName}`);

  const tattooName = tattooSlug ? getNameFromSlug(tattooSlug, tattooRequirements) : undefined;
  if (tattooName && tattooName !== "Không yêu cầu" && tattooName !== "Tất cả") titleParts.push(tattooName);

  const visionName = visionSlug ? getNameFromSlug(visionSlug, visionRequirements) : undefined;
  if (visionName && visionName !== "Không yêu cầu" && visionName !== "Tất cả") titleParts.push(`yêu cầu ${visionName}`);

  if (genderSlug) {
    if (genderSlug === 'nam') titleParts.push('cho Nam');
    if (genderSlug === 'nu') titleParts.push('cho Nữ');
  }

  if (ages.length === 2 && ages[0] && ages[1]) {
    titleParts.push(`tuổi từ ${ages[0]} đến ${ages[1]}`);
  }

  if (heights.length === 2 && heights[0] && heights[1]) {
    const heightFrom = heights[0].replace('cm', '');
    const heightTo = heights[1].replace('cm', '');
    titleParts.push(`chiều cao từ ${formatCmToMeter(heightFrom)} đến ${formatCmToMeter(heightTo)}`);
  }

  if (weights.length === 2 && weights[0] && weights[1]) {
    const weightFrom = weights[0].replace('kg', '');
    const weightTo = weights[1].replace('kg', '');
    titleParts.push(`cân nặng từ ${weightFrom}kg đến ${weightTo}kg`);
  }

  const experienceRequirementName = experienceRequirementSlug ? getNameFromSlug(experienceRequirementSlug, allJobDetailsForExperience) : undefined;
  if (experienceRequirementName) titleParts.push(`kinh nghiệm ${experienceRequirementName}`);

  const experienceName = experienceSlug ? getNameFromSlug(experienceSlug, experienceYears) : undefined;
  if (experienceName && experienceName !== "Không yêu cầu") titleParts.push(`kinh nghiệm ${experienceName.toLowerCase()}`);

  if (netSalary) {
    const formattedSalary = parseInt(netSalary, 10).toLocaleString('ja-JP');
    titleParts.push(`thực lĩnh từ ${formattedSalary} yên`);
  }

  if (basicSalary) {
    const formattedSalary = parseInt(basicSalary, 10).toLocaleString('ja-JP');
    titleParts.push(`lương cơ bản từ ${formattedSalary} yên`);
  }

  if (hourlySalary) {
    const formattedSalary = parseInt(hourlySalary, 10).toLocaleString('ja-JP');
    titleParts.push(`lương giờ từ ${formattedSalary} yên`);
  }

  if (annualIncome) {
    const formattedSalary = parseInt(annualIncome, 10).toLocaleString('ja-JP');
    titleParts.push(`thu nhập năm từ ${formattedSalary} yên`);
  }

  if (annualBonus) {
    const formattedBonus = parseInt(annualBonus, 10).toLocaleString('ja-JP');
    titleParts.push(`có thưởng năm từ ${formattedBonus} yên`);
  }

  if (netFee) {
    const formattedFee = parseInt(netFee, 10).toLocaleString('en-US');
    titleParts.push(`phí dưới ${formattedFee} USD`);
  }
  if (netFeeNoTicket) {
    const formattedFee = parseInt(netFeeNoTicket, 10).toLocaleString('en-US');
    titleParts.push(`phí không vé dưới ${formattedFee} USD`);
  }

  if (interviewDate) {
    if (interviewDate === 'flexible') {
      titleParts.push('ngày phỏng vấn linh hoạt');
    } else {
      const parsedDate = parse(interviewDate, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        const formattedDate = format(parsedDate, 'dd/MM/yyyy');
        if (interviewDateType === 'from') {
          titleParts.push(`phỏng vấn từ ngày ${formattedDate}`);
        } else if (interviewDateType === 'exact') {
          titleParts.push(`phỏng vấn đúng ngày ${formattedDate}`);
        } else { // 'until' is the default
          titleParts.push(`phỏng vấn đến ngày ${formattedDate}`);
        }
      }
    }
  }


  if (interviewRoundsSlug) {
    const roundsName = getNameFromSlug(interviewRoundsSlug, interviewRoundsOptions);
    if (roundsName) {
      titleParts.push(`phỏng vấn ${roundsName}`);
    }
  }

  const ginouExpiryName = ginouExpirySlug ? getNameFromSlug(ginouExpirySlug, ginouExpiryOptions) : undefined;
  if (ginouExpiryName) {
    titleParts.push(`yêu cầu hạn Ginou ${ginouExpiryName.toLowerCase()}`);
  }

  if (companyArrivalTime) {
    const formattedDate = companyArrivalTime.replace(/-/g, '/').replace('Thang ', 'Tháng ');
    titleParts.push(`yêu cầu thời điểm về công ty vào ${formattedDate}`);
  }


  const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
  const interviewLocationName = interviewLocationSlug ? getNameFromSlug(interviewLocationSlug, allInterviewLocations) : undefined;
  if (interviewLocationName) {
    titleParts.push(`phỏng vấn tại ${interviewLocationName}`);
  }


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



  const queryString = new URLSearchParams(params).toString();

  const url = `${process.env.DOMAIN}/tim-viec-lam?${queryString}`;
  const avatarUrl = `${process.env.DOMAIN}/api/public/getJobMetaImageForJobs?${queryString}`;


  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: avatarUrl,
          width: 1200,
          height: 630,
          alt: "HelloJob",
        }
      ]
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

const DISPLAYED_JOBS_PER_PAGE = 30;

export default async function JobSearchPage({ searchParams }: { searchParams: SearchParams }) {
  // Pass searchParams to client component to avoid re-reading them,
  // this is important for structured data generation on the client.
  const { newFilters, sortOption, page } = generateJobFilter(await searchParams);
  const { docs: jobs, total, totalPages } = await getJobs(newFilters, sortOption, page, DISPLAYED_JOBS_PER_PAGE);
  // const appliedFilters=
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <JobSearchPageContent filters={newFilters} jobs={jobs} total={total} totalPages={totalPages} page={page} sort={sortOption} />
    </Suspense>
  );
}