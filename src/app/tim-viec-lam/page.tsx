
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobSearchPageContent from './client';
import { type Metadata } from 'next';
import { allSpecialConditions, visaDetailsByVisaType, workShifts, otherSkills, dominantHands, educationLevels, languageLevels, englishLevels, tattooRequirements, visionRequirements, experienceYears } from '@/lib/visa-data';
import { allJapanLocations, japanRegions, interviewLocations } from '@/lib/location-data';
import { industriesByJobType } from '@/lib/industry-data';
import { format, isValid, parse } from 'date-fns';

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
  const interviewLocationSlug = searchParams['dia-diem-phong-van'] as string;
  const specialConditionsParam = searchParams['dieu-kien-dac-biet'];
  const sortBySlug = searchParams['sap-xep'] as string;
  const quantity = searchParams['so-luong'] as string;
  const workShiftSlug = searchParams['ca-lam-viec'] as string;
  const otherSkillParam = searchParams['yeu-cau-ky-nang-khac'];
  const dominantHandSlug = searchParams['tay-thuan'] as string;
  const educationSlug = searchParams['hoc-van'] as string;
  const languageSlug = searchParams['yeu-cau-tieng-nhat'] as string;
  const englishSlug = searchParams['yeu-cau-tieng-anh'] as string;
  const tattooSlug = searchParams['hinh-xam'] as string;
  const visionSlug = searchParams['yeu-cau-thi-luc'] as string;
  const genderSlug = searchParams['gioi-tinh'] as string;
  const ageParam = searchParams['do-tuoi'];
  const heightParam = searchParams['chieu-cao'];
  const weightParam = searchParams['can-nang'];
  const experienceRequirementSlug = searchParams['yeu-cau-kinh-nghiem'] as string;
  const experienceSlug = searchParams['so-nam-kinh-nghiem'] as string;
  const netSalary = searchParams['luong-thuc-linh'] as string;
  const basicSalary = searchParams['luong-co-ban'] as string;
  const hourlySalary = searchParams['luong-gio'] as string;
  const annualIncome = searchParams['thu-nhap-nam'] as string;
  const annualBonus = searchParams['thuong-nam'] as string;
  const interviewDate = searchParams['ngay-phong-van'] as string;
  const interviewRoundsSlug = searchParams['so-vong-phong-van'] as string;
  const jobDetailSlug = searchParams['chi-tiet-cong-viec'] as string;
  const netFee = searchParams['muc-phi'] as string;
  const netFeeNoTicket = searchParams['muc-phi-khong-ve'] as string;


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
    const heightFrom = heights[0].replace('cm','');
    const heightTo = heights[1].replace('cm','');
    titleParts.push(`chiều cao từ ${formatCmToMeter(heightFrom)} đến ${formatCmToMeter(heightTo)}`);
  }

  if (weights.length === 2 && weights[0] && weights[1]) {
    const weightFrom = weights[0].replace('kg','');
    const weightTo = weights[1].replace('kg','');
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
            titleParts.push(`phỏng vấn đến ngày ${format(parsedDate, 'dd/MM/yyyy')}`);
        }
    }
  }

  if (interviewRoundsSlug) {
    const roundsName = getNameFromSlug(interviewRoundsSlug, interviewRoundsOptions);
    if (roundsName) {
        titleParts.push(`phỏng vấn ${roundsName}`);
    }
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
  const cleanSearchParams: { [key: string]: string | string[] } = {};
  if (q) cleanSearchParams.q = q;
  if (visaDetailSlug) cleanSearchParams['chi-tiet-loai-hinh-visa'] = visaDetailSlug;
  if (industrySlug) cleanSearchParams['nganh-nghe'] = industrySlug;
  if (locations.length > 0) cleanSearchParams['dia-diem'] = locations;
  if (interviewLocationSlug) cleanSearchParams['dia-diem-phong-van'] = interviewLocationSlug;
  if (specialConditionSlugs.length > 0) cleanSearchParams['dieu-kien-dac-biet'] = specialConditionSlugs;
  if (sortBySlug) cleanSearchParams['sap-xep'] = sortBySlug;
  if (quantity) cleanSearchParams['so-luong'] = quantity;
  if (workShiftSlug) cleanSearchParams['ca-lam-viec'] = workShiftSlug;
  if (otherSkillSlugs.length > 0) cleanSearchParams['yeu-cau-ky-nang-khac'] = otherSkillSlugs;
  if (dominantHandSlug) cleanSearchParams['tay-thuan'] = dominantHandSlug;
  if (educationSlug) cleanSearchParams['hoc-van'] = educationSlug;
  if (languageSlug) cleanSearchParams['yeu-cau-tieng-nhat'] = languageSlug;
  if (englishSlug) cleanSearchParams['yeu-cau-tieng-anh'] = englishSlug;
  if (tattooSlug) cleanSearchParams['hinh-xam'] = tattooSlug;
  if (visionSlug) cleanSearchParams['yeu-cau-thi-luc'] = visionSlug;
  if (genderSlug) cleanSearchParams['gioi-tinh'] = genderSlug;
  if (ages.length > 0) cleanSearchParams['do-tuoi'] = ages;
  if (heights.length > 0) cleanSearchParams['chieu-cao'] = heights;
  if (weights.length > 0) cleanSearchParams['can-nang'] = weights;
  if (experienceSlug) cleanSearchParams['so-nam-kinh-nghiem'] = experienceSlug;
  if (experienceRequirementSlug) cleanSearchParams['yeu-cau-kinh-nghiem'] = experienceRequirementSlug;
  if (netSalary) cleanSearchParams['luong-thuc-linh'] = netSalary;
  if (basicSalary) cleanSearchParams['luong-co-ban'] = basicSalary;
  if (hourlySalary) cleanSearchParams['luong-gio'] = hourlySalary;
  if (annualIncome) cleanSearchParams['thu-nhap-nam'] = annualIncome;
  if (annualBonus) cleanSearchParams['thuong-nam'] = annualBonus;
  if (netFee) cleanSearchParams['muc-phi'] = netFee;
  if (netFeeNoTicket) cleanSearchParams['muc-phi-khong-ve'] = netFeeNoTicket;
  if (interviewDate) cleanSearchParams['ngay-phong-van'] = interviewDate;
  if (interviewRoundsSlug) cleanSearchParams['so-vong-phong-van'] = interviewRoundsSlug;
  if (jobDetailSlug) cleanSearchParams['chi-tiet-cong-viec'] = jobDetailSlug;



  
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


export default function JobSearchPage({ searchParams }: { searchParams: SearchParams }) {
  // Pass searchParams to client component to avoid re-reading them,
  // this is important for structured data generation on the client.
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary"/>
        </div>
    }>
        <JobSearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}

    