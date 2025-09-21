

'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters, experienceYears } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { allJapanLocations, japanRegions, interviewLocations } from '@/lib/location-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';
import { industriesByJobType, type Industry } from '@/lib/industry-data';
import { visaDetailsByVisaType, japanJobTypes, allSpecialConditions, workShifts } from '@/lib/visa-data';
import { recommendJobs } from '@/ai/flows/recommend-jobs-flow';


const initialSearchFilters: SearchFilters = {
    q: '',
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: [], 
    interviewLocation: '', 
    jobDetail: '',
    experienceRequirement: '',
    gender: '',
    height: [135, 210],
    weight: [35, 120],
    age: [18, 70],
    basicSalary: '',
    netSalary: '',
    hourlySalary: '',
    annualIncome: '',
    annualBonus: '',
    specialConditions: [],
    languageRequirement: '',
    englishRequirement: '',
    educationRequirement: '',
    yearsOfExperience: '',
    tattooRequirement: '',
    netFee: '',
    netFeeNoTicket: '',
    quantity: '',
    interviewRounds: '',
    interviewDate: '',
    visionRequirement: 'all',
    dominantHand: '',
    otherSkillRequirement: [],
    companyArrivalTime: '',
    workShift: '',
};

const keyMap: { [key: string]: string } = {
  q: 'q',
  visa: 'loai-visa',
  visaDetail: 'chi-tiet-loai-hinh-visa',
  industry: 'nganh-nghe',
  location: 'dia-diem',
  interviewLocation: 'dia-diem-phong-van',
  jobDetail: 'chi-tiet-cong-viec',
  gender: 'gioi-tinh',
  age: 'do-tuoi',
  height: 'chieu-cao',
  weight: 'can-nang',
  basicSalary: 'luong-co-ban',
  netSalary: 'luong-thuc-linh',
  hourlySalary: 'luong-gio',
  annualIncome: 'thu-nhap-nam',
  annualBonus: 'thuong-nam',
  specialConditions: 'dieu-kien-dac-biet',
  languageRequirement: 'yeu-cau-tieng-nhat',
  englishRequirement: 'yeu-cau-tieng-anh',
  educationRequirement: 'hoc-van',
  experienceRequirement: 'yeu-cau-kinh-nghiem',
  yearsOfExperience: 'so-nam-kinh-nghiem',
  tattooRequirement: 'hinh-xam',
  netFee: 'muc-phi',
  netFeeNoTicket: 'muc-phi-khong-ve',
  quantity: 'so-luong',
  interviewRounds: 'so-vong-phong-van',
  interviewDate: 'ngay-phong-van',
  visionRequirement: 'yeu-cau-thi-luc',
  dominantHand: 'tay-thuan',
  otherSkillRequirement: 'yeu-cau-ky-nang-khac',
  companyArrivalTime: 'thoi-diem-ve-cong-ty',
  workShift: 'ca-lam-viec',
  sortBy: 'sap-xep',
};

const reverseKeyMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(keyMap).map(([key, value]) => [value, key])
);


// Helper function to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const createSlug = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
};


const parseSalary = (salaryStr?: string): number | null => {
    if (!salaryStr) return null;
    const numericStr = String(salaryStr).replace(/[^0-9]/g, '');
    const value = parseInt(numericStr, 10);
    return isNaN(value) ? null : value;
};

const parseExperienceToRange = (expStr?: string): [number, number] => {
    if (!expStr || expStr === 'Không yêu cầu') return [0, Infinity];
    
    const cleanedStr = expStr.toLowerCase().replace(',', '.');
    
    if (cleanedStr.startsWith('dưới')) {
        const val = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
        return [0, val];
    }
    if (cleanedStr.startsWith('trên')) {
        const val = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
        return [val, Infinity];
    }
    const parts = cleanedStr.split('-').map(p => parseFloat(p.trim().replace(/[^0-9.]/g, '')));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
    }
    return [0, Infinity]; // Default fallback
};

const parseAgeRequirement = (ageStr?: string): [number, number] | null => {
    if (!ageStr) return null;
    const parts = ageStr.split('-').map(p => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
    }
    return null;
};

const parsePhysicalRequirement = (reqStr?: string): [number, number] => {
    if (!reqStr) return [0, Infinity];
    const cleanedStr = reqStr.toLowerCase();
    const numbers = cleanedStr.match(/\d+/g)?.map(Number) || [];

    if (cleanedStr.includes('trên')) {
        return [numbers[0] || 0, Infinity];
    }
    if (cleanedStr.includes('dưới')) {
        return [0, numbers[0] || Infinity];
    }
    if (numbers.length === 2) {
        return [numbers[0], numbers[1]];
    }
    if (numbers.length === 1) {
        return [numbers[0], numbers[0]]; // Exact match
    }

    return [0, Infinity];
};


const allIndustries: Industry[] = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

const tattooRequirements = [
    { name: "Không yêu cầu", slug: "all" },
    { name: "Không nhận hình xăm", slug: "khong-nhan-hinh-xam" },
    { name: "Nhận xăm nhỏ (kín)", slug: "nhan-xam-nho-kin" },
    { name: "Nhận cả xăm to (lộ)", slug: "nhan-ca-xam-to-lo" },
];

const languageLevels = [
    { name: 'N1', slug: 'n1' },
    { name: 'N2', slug: 'n2' },
    { name: 'N3', slug: 'n3' },
    { name: 'N4', slug: 'n4' },
    { name: 'N5', slug: 'n5' },
    { name: 'Không yêu cầu', slug: 'khong-yeu-cau' }
];

const englishLevels = [
    { name: 'TOEIC 900+', slug: 'toeic-900' },
    { name: 'TOEIC 800+', slug: 'toeic-800' },
    { name: 'TOEIC 700+', slug: 'toeic-700' },
    { name: 'TOEIC 600+', slug: 'toeic-600' },
    { name: 'TOEIC 500+', slug: 'toeic-500' },
    { name: 'IELTS 7.0+', slug: 'ielts-7.0' },
    { name: 'IELTS 6.0+', slug: 'ielts-6.0' },
    { name: 'IELTS 5.0+', slug: 'ielts-5.0' },
    { name: 'Giao tiếp tốt', slug: 'giao-tiep-tot' },
    { name: 'Giao tiếp cơ bản', slug: 'giao-tiep-co-ban' },
    { name: 'Không yêu cầu', slug: 'khong-yeu-cau' }
];


const educationLevels = [
    { name: "Tất cả", slug: "all" },
    { name: "Không yêu cầu", slug: "khong-yeu-cau" },
    { name: "Tốt nghiệp THPT", slug: "tot-nghiep-thpt" },
    { name: "Tốt nghiệp Trung cấp", slug: "tot-nghiep-trung-cap" },
    { name: "Tốt nghiệp Cao đẳng", slug: "tot-nghiep-cao-dang" },
    { name: "Tốt nghiệp Đại học", slug: "tot-nghiep-dai-hoc" },
    { name: "Tốt nghiệp Senmon", slug: "tot-nghiep-senmon" },
];

const dominantHands = [
    { name: "Tất cả", slug: "all" },
    { name: "Tay phải", slug: "tay-phai" },
    { name: "Tay trái", slug: "tay-trai" },
    { name: "Cả hai tay", slug: "ca-hai-tay" },
];

const otherSkills = [
    { name: "Có bằng lái xe AT", slug: "co-bang-lai-xe-at" },
    { name: "Có bằng lái xe MT", slug: "co-bang-lai-xe-mt" },
    { name: "Có bằng lái xe tải cỡ nhỏ", slug: "co-bang-lai-xe-tai-co-nho" },
    { name: "Có bằng lái xe tải cỡ trung", slug: "co-bang-lai-xe-tai-co-trung" },
    { name: "Có bằng lái xe tải cỡ lớn", slug: "co-bang-lai-xe-tai-co-lon" },
    { name: "Có bằng lái xe buýt cỡ trung", slug: "co-bang-lai-xe-buyt-co-trung" },
    { name: "Có bằng lái xe buýt cỡ lớn", slug: "co-bang-lai-xe-buyt-co-lon" },
    { name: "Lái được máy xúc, máy đào", slug: "lai-duoc-may-xuc-may-dao" },
    { name: "Lái được xe nâng", slug: "lai-duoc-xe-nang" },
    { name: "Có bằng cầu", slug: "co-bang-cau" },
    { name: "Vận hành máy CNC", slug: "van-hanh-may-cnc" },
    { name: "Có bằng tiện, mài", slug: "co-bang-tien-mai" },
    { name: "Có bằng hàn", slug: "co-bang-han" },
    { name: "Có bằng cắt", slug: "co-bang-cat" },
    { name: "Có bằng gia công kim loại", slug: "co-bang-gia-cong-kim-loai" },
    { name: "Làm được giàn giáo", slug: "lam-duoc-gian-giao" },
    { name: "Thi công nội thất", slug: "thi-cong-noi-that" },
    { name: "Quản lý thi công xây dựng", slug: "quan-ly-thi-cong-xay-dung" },
    { name: "Quản lý khối lượng xây dựng", slug: "quan-ly-khoi-luong-xay-dung" },
    { name: "Thiết kế BIM xây dựng", slug: "thiet-ke-bim-xay-dung" },
    { name: "Đọc được bản vẽ kỹ thuật", slug: "doc-duoc-ban-ve-ky-thuat" },
    { name: "Có bằng thi công nội thất", slug: "co-bang-thi-cong-noi-that" }
];



export default function JobSearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [sortBy, setSortBy] = useState('newest');
    
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [stagedResultCount, setStagedResultCount] = useState<number>(jobData.length);

    
    const runFilter = useCallback((filtersToApply: SearchFilters, sortOption: string) => {
        const { 
            q, visa, visaDetail, industry, location, jobDetail, interviewLocation, quantity, netFee, netFeeNoTicket, interviewRounds, interviewDate,
            basicSalary, netSalary, hourlySalary, annualIncome, annualBonus, gender, experienceRequirement, yearsOfExperience,
            age, height, weight, visionRequirement, tattooRequirement, languageRequirement, educationRequirement, dominantHand,
            otherSkillRequirement, specialConditions, companyArrivalTime, workShift, englishRequirement
        } = filtersToApply;
        
        const visaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name || visaDetail;
        const industryObject = allIndustries.find(i => i.slug === industry);
        const industryName = industryObject?.name || industry;
        
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === interviewLocation)?.name;

        const feeLimit = parseSalary(netFee);
        const feeNoTicketLimit = parseSalary(netFeeNoTicket);
        const roundsSlug = interviewRounds;
        const roundsToMatch = roundsSlug ? parseInt(roundsSlug.split('-')[0], 10) : null;
        
        const basicSalaryMin = parseSalary(basicSalary);
        const netSalaryMin = parseSalary(netSalary);
        const hourlySalaryMin = parseSalary(hourlySalary);
        const annualIncomeMin = parseSalary(annualIncome);
        const annualBonusMin = parseSalary(annualBonus);
        
        const yoeSlug = yearsOfExperience || '';
        const yoeName = experienceYears.find(y => y.slug === yoeSlug)?.name || '';
        const [minExp, maxExp] = parseExperienceToRange(yoeName);
        
        const expReqSlug = experienceRequirement || '';
        const eduReqName = educationLevels.find(e => e.slug === educationRequirement)?.name;
        const dominantHandName = dominantHands.find(d => d.slug === dominantHand)?.name;


        let results = jobData.filter(job => {
            let queryMatch = true;
            if (q) {
                const lowerQ = q.toLowerCase();
                queryMatch = job.id.toLowerCase().includes(lowerQ) ||
                             job.title.toLowerCase().includes(lowerQ) ||
                             job.industry.toLowerCase().includes(lowerQ) ||
                             job.recruiter.company.toLowerCase().includes(lowerQ) ||
                             job.details.description.toLowerCase().includes(lowerQ);
            }

            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (visa && visa !== 'all') {
                const targetVisaTypeObject = japanJobTypes.find(v => v.slug === visa);
                visaMatch = job.visaType === targetVisaTypeObject?.name;
            }

            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry === industryName);

            const jobDetailMatch = !jobDetail || jobDetail === 'all-details' || (job.title && createSlug(job.title).includes(jobDetail)) || (job.details.description && createSlug(job.details.description).includes(jobDetail));
            
            const expReqMatch = !expReqSlug || !job.experienceRequirement || createSlug(job.experienceRequirement).includes(expReqSlug);
            
            const [jobMinExp] = parseExperienceToRange(job.yearsOfExperience);
            const yearsOfExperienceMatch = !yoeSlug || (jobMinExp <= maxExp);

            let locationMatch = true;
            if (Array.isArray(location) && location.length > 0 && !location.includes('all')) {
                locationMatch = location.some(locSlug => {
                    const region = japanRegions.find(r => r.slug === locSlug);
                    if (region) {
                        return region.prefectures.some(p => job.workLocation.toLowerCase().includes(p.name.toLowerCase()));
                    }
                    const locationName = allJapanLocations.find(l => l.slug === locSlug)?.name;
                    return locationName ? job.workLocation && job.workLocation.toLowerCase().includes(locationName.toLowerCase()) : false;
                });
            }
            
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));

            const quantityMatch = !quantity || job.quantity >= parseInt(quantity, 10);
            
            const feeWithTicketMatch = feeLimit === null || (job.netFee && (parseSalary(job.netFee) ?? Infinity) <= feeLimit);
            const feeNoTicketMatch = feeNoTicketLimit === null || (job.netFeeNoTicket && (parseSalary(job.netFeeNoTicket) ?? Infinity) <= feeNoTicketLimit);
            const feeMatch = feeWithTicketMatch && feeNoTicketMatch;

            const roundsMatch = !roundsToMatch || job.interviewRounds === roundsToMatch;

            const interviewDateMatch = !interviewDate || interviewDate === 'flexible' || (job.interviewDate && job.interviewDate <= interviewDate);
            
            const jobBasicSalary = parseSalary(job.salary.basic);
            const basicSalaryMatch = basicSalaryMin === null || (jobBasicSalary !== null && jobBasicSalary >= basicSalaryMin);

            const jobNetSalary = parseSalary(job.salary.actual);
            const netSalaryMatch = netSalaryMin === null || (jobNetSalary !== null && jobNetSalary >= netSalaryMin);

            const hourlySalaryMatch = hourlySalaryMin === null;

            const jobAnnualIncome = parseSalary(job.salary.annualIncome);
            const annualIncomeMatch = annualIncomeMin === null || (jobAnnualIncome !== null && jobAnnualIncome >= annualIncomeMin);

            const jobAnnualBonus = parseSalary(job.salary.annualBonus);
            const annualBonusMatch = annualBonusMin === null || (jobAnnualBonus !== null && jobAnnualBonus >= annualBonusMin);
            
            let genderMatch = true;
            if (gender) {
                const targetGender = gender === 'nam' ? 'Nam' : 'Nữ';
                genderMatch = job.gender === targetGender || job.gender === 'Cả nam và nữ';
            }

            let ageMatch = true;
            if (age && job.ageRequirement) {
                const jobAgeRange = parseAgeRequirement(job.ageRequirement);
                if (jobAgeRange) {
                    const [filterMinAge, filterMaxAge] = age;
                    const [jobMinAge, jobMaxAge] = jobAgeRange;
                    ageMatch = Math.max(filterMinAge, jobMinAge) <= Math.min(filterMaxAge, jobMaxAge);
                }
            }
            
            let heightMatch = true;
            if (height) {
                const [jobMinHeight, jobMaxHeight] = parsePhysicalRequirement(job.heightRequirement);
                const [filterMinHeight, filterMaxHeight] = height;
                heightMatch = filterMinHeight <= jobMaxHeight && filterMaxHeight >= jobMinHeight;
            }

            let weightMatch = true;
            if (weight) {
                const [jobMinWeight, jobMaxWeight] = parsePhysicalRequirement(job.weightRequirement);
                const [filterMinWeight, filterMaxHeight] = weight;
                weightMatch = filterMinWeight <= jobMaxWeight && filterMaxHeight >= jobMinWeight;
            }

            const visionMatch = !visionRequirement || visionRequirement === 'all' || !job.visionRequirement || createSlug(job.visionRequirement).includes(visionRequirement);
            
            const tattooReqName = tattooRequirements.find(t => t.slug === tattooRequirement)?.name;
            const tattooMatch = !tattooRequirement || tattooRequirement === 'all' || !job.tattooRequirement || job.tattooRequirement === tattooReqName;

            const langReqName = languageLevels.find(l => l.slug === languageRequirement)?.name;
            const languageReqMatch = !languageRequirement || languageRequirement === 'all' || !job.languageRequirement || job.languageRequirement === langReqName;
            
            const englishReqMatch = !englishRequirement || englishRequirement === 'all' || !job.languageRequirement || createSlug(job.languageRequirement).includes(englishRequirement);

            const educationReqMatch = !eduReqName || eduReqName === 'Tất cả' || !job.educationRequirement || job.educationRequirement === eduReqName;

            const dominantHandMatch = !dominantHandName || dominantHandName === 'Tất cả' || !job.details.description || job.details.description.includes(dominantHandName);

            const otherSkillMatch = !otherSkillRequirement || otherSkillRequirement.length === 0 || otherSkillRequirement.every(skillSlug => {
                const skillName = otherSkills.find(s => s.slug === skillSlug)?.name;
                return skillName ? (job.details.description.includes(skillName) || job.details.requirements.includes(skillName)) : true;
            });
            
            const specialConditionsMatch = !specialConditions || specialConditions.length === 0 || specialConditions.every(cond => {
                 return job.specialConditions && job.specialConditions.toLowerCase().includes(cond.toLowerCase());
            });

            const arrivalTimeMatch = !companyArrivalTime || (job.companyArrivalTime && job.companyArrivalTime === companyArrivalTime);
            
            const workShiftMatch = !workShift || !job.details.description || createSlug(job.details.description).includes(createSlug(workShift));


            return queryMatch && visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && quantityMatch && feeMatch && roundsMatch && interviewDateMatch && basicSalaryMatch && netSalaryMatch && hourlySalaryMatch && annualIncomeMatch && annualBonusMatch && genderMatch && expReqMatch && yearsOfExperienceMatch && ageMatch && heightMatch && weightMatch && visionMatch && tattooMatch && languageReqMatch && educationReqMatch && dominantHandMatch && otherSkillMatch && specialConditionsMatch && arrivalTimeMatch && workShiftMatch && englishReqMatch;
        });

        // Sorting logic
        results.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.postedTime.split(' ')[1].split('/').reverse().join('-')).getTime() - new Date(a.postedTime.split(' ')[1].split('/').reverse().join('-')).getTime();
                case 'salary_desc':
                    return (parseSalary(b.salary.basic) ?? 0) - (parseSalary(a.salary.basic) ?? 0);
                case 'salary_asc':
                    return (parseSalary(a.salary.basic) ?? 0) - (parseSalary(b.salary.basic) ?? 0);
                case 'net_salary_desc':
                    return (parseSalary(b.salary.actual) ?? 0) - (parseSalary(a.salary.actual) ?? 0);
                case 'net_salary_asc':
                    return (parseSalary(a.salary.actual) ?? 0) - (parseSalary(b.salary.actual) ?? 0);
                case 'fee_asc':
                    return (parseSalary(a.netFee) ?? Infinity) - (parseSalary(b.netFee) ?? Infinity);
                case 'fee_desc':
                    return (parseSalary(b.netFee) ?? -1) - (parseSalary(a.netFee) ?? -1);
                case 'interview_date_asc':
                    return new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime();
                case 'interview_date_desc':
                    return new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime();
                case 'has_image':
                    return (b.details.images && b.details.images.length > 0 ? 1 : 0) - (a.details.images && a.details.images.length > 0 ? 1 : 0);
                case 'has_video':
                    return (b.details.videoUrl ? 1 : 0) - (a.details.videoUrl ? 1 : 0);
                case 'hot': // Example logic for 'hot'
                case 'most_applicants':
                    return (b.applicants?.count ?? 0) - (a.applicants?.count ?? 0);
                default:
                    return 0;
            }
        });

        setFilteredJobs(results);
    }, []);

    const countStagedResults = useCallback((filtersToCount: SearchFilters) => {
        const { 
            q, visa, visaDetail, industry, location, jobDetail, interviewLocation, quantity, netFee, netFeeNoTicket, interviewRounds, interviewDate,
            basicSalary, netSalary, hourlySalary, annualIncome, annualBonus, gender, experienceRequirement, yearsOfExperience,
            age, height, weight, visionRequirement, tattooRequirement, languageRequirement, educationRequirement, dominantHand,
            otherSkillRequirement, specialConditions, companyArrivalTime, workShift, englishRequirement
        } = filtersToCount;
        
        const industryObject = allIndustries.find(i => i.slug === industry);
        const industryName = industryObject?.name || industry;
        
        const feeLimit = parseSalary(netFee);
        const feeNoTicketLimit = parseSalary(netFeeNoTicket);
        
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === interviewLocation)?.name;
        
        const roundsSlug = interviewRounds;
        const roundsToMatch = roundsSlug ? parseInt(roundsSlug.split('-')[0], 10) : null;
        
        const basicSalaryMin = parseSalary(basicSalary);
        const netSalaryMin = parseSalary(netSalary);
        const hourlySalaryMin = parseSalary(hourlySalary);
        const annualIncomeMin = parseSalary(annualIncome);
        const annualBonusMin = parseSalary(annualBonus);
        
        const yoeSlug = yearsOfExperience || '';
        const yoeName = experienceYears.find(y => y.slug === yoeSlug)?.name || '';
        const [minExp, maxExp] = parseExperienceToRange(yoeName);
        
        const expReqSlug = experienceRequirement || '';
        const eduReqName = educationLevels.find(e => e.slug === educationRequirement)?.name;
        const dominantHandName = dominantHands.find(d => d.slug === dominantHand)?.name;


        const count = jobData.filter(job => {
            let queryMatch = true;
            if (q) {
                const lowerQ = q.toLowerCase();
                queryMatch = job.id.toLowerCase().includes(lowerQ) ||
                             job.title.toLowerCase().includes(lowerQ) ||
                             job.industry.toLowerCase().includes(lowerQ) ||
                             job.recruiter.company.toLowerCase().includes(lowerQ) ||
                             job.details.description.toLowerCase().includes(lowerQ);
            }

            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (visa && visa !== 'all') {
                 const targetVisaTypeObject = japanJobTypes.find(v => v.slug === visa);
                 visaMatch = job.visaType === targetVisaTypeObject?.name;
            }
            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry === industryName);

            const jobDetailMatch = !jobDetail || jobDetail === 'all-details' || (job.title && createSlug(job.title).includes(jobDetail)) || (job.details.description && createSlug(job.details.description).includes(jobDetail));

            const expReqMatch = !expReqSlug || !job.experienceRequirement || createSlug(job.experienceRequirement).includes(expReqSlug);
            
            const [jobMinExp] = parseExperienceToRange(job.yearsOfExperience);
            const yearsOfExperienceMatch = !yoeSlug || (jobMinExp <= maxExp);

             let locationMatch = true;
            if (Array.isArray(location) && location.length > 0 && !location.includes('all')) {
                 locationMatch = location.some(locSlug => {
                    const region = japanRegions.find(r => r.slug === locSlug);
                    if (region) {
                        return region.prefectures.some(p => job.workLocation.toLowerCase().includes(p.name.toLowerCase()));
                    }
                    const locationName = allJapanLocations.find(l => l.slug === locSlug)?.name;
                    return locationName ? job.workLocation && job.workLocation.toLowerCase().includes(locationName.toLowerCase()) : false;
                });
            }
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));
            const quantityMatch = !quantity || job.quantity >= parseInt(quantity, 10);
            
            const feeWithTicketMatch = feeLimit === null || (job.netFee && (parseSalary(job.netFee) ?? Infinity) <= feeLimit);
            const feeNoTicketMatch = feeNoTicketLimit === null || (job.netFeeNoTicket && (parseSalary(job.netFeeNoTicket) ?? Infinity) <= feeNoTicketLimit);
            const feeMatch = feeWithTicketMatch && feeNoTicketMatch;

            const roundsMatch = !roundsToMatch || job.interviewRounds === roundsToMatch;
            const interviewDateMatch = !interviewDate || interviewDate === 'flexible' || (job.interviewDate && job.interviewDate <= interviewDate);

            const jobBasicSalary = parseSalary(job.salary.basic);
            const basicSalaryMatch = basicSalaryMin === null || (jobBasicSalary !== null && jobBasicSalary >= basicSalaryMin);

            const jobNetSalary = parseSalary(job.salary.actual);
            const netSalaryMatch = netSalaryMin === null || (jobNetSalary !== null && jobNetSalary >= netSalaryMin);

            const hourlySalaryMatch = hourlySalaryMin === null;

            const jobAnnualIncome = parseSalary(job.salary.annualIncome);
            const annualIncomeMatch = annualIncomeMin === null || (jobAnnualIncome !== null && jobAnnualIncome >= annualIncomeMin);

            const jobAnnualBonus = parseSalary(job.salary.annualBonus);
            const annualBonusMatch = annualBonusMin === null || (jobAnnualBonus !== null && jobAnnualBonus >= annualBonusMin);
            
            let genderMatch = true;
            if (gender) {
                const targetGender = gender === 'nam' ? 'Nam' : 'Nữ';
                genderMatch = job.gender === targetGender || job.gender === 'Cả nam và nữ';
            }

            let ageMatch = true;
            if (age && job.ageRequirement) {
                const jobAgeRange = parseAgeRequirement(job.ageRequirement);
                if (jobAgeRange) {
                    const [filterMinAge, filterMaxAge] = age;
                    const [jobMinAge, jobMaxAge] = jobAgeRange;
                    ageMatch = Math.max(filterMinAge, jobMinAge) <= Math.min(filterMaxAge, jobMaxAge);
                }
            }
            
            let heightMatch = true;
            if (height) {
                const [jobMinHeight, jobMaxHeight] = parsePhysicalRequirement(job.heightRequirement);
                const [filterMinHeight, filterMaxHeight] = height;
                heightMatch = filterMinHeight <= jobMaxHeight && filterMaxHeight >= jobMinHeight;
            }

            let weightMatch = true;
            if (weight) {
                const [jobMinWeight, jobMaxWeight] = parsePhysicalRequirement(job.weightRequirement);
                const [filterMinWeight, filterMaxHeight] = weight;
                weightMatch = filterMinWeight <= jobMaxWeight && filterMaxHeight >= jobMinWeight;
            }

            const visionMatch = !visionRequirement || visionRequirement === 'all' || !job.visionRequirement || createSlug(job.visionRequirement).includes(visionRequirement);
            
            const tattooReqName = tattooRequirements.find(t => t.slug === tattooRequirement)?.name;
            const tattooMatch = !tattooRequirement || tattooRequirement === 'all' || !job.tattooRequirement || job.tattooRequirement === tattooReqName;
            
            const langReqName = languageLevels.find(l => l.slug === languageRequirement)?.name;
            const languageReqMatch = !languageRequirement || languageRequirement === 'all' || !job.languageRequirement || job.languageRequirement === langReqName;
            
            const englishReqMatch = !englishRequirement || englishRequirement === 'all' || !job.languageRequirement || createSlug(job.languageRequirement).includes(englishRequirement);

            const educationReqMatch = !eduReqName || eduReqName === 'Tất cả' || !job.educationRequirement || job.educationRequirement === eduReqName;

            const dominantHandMatch = !dominantHandName || dominantHandName === 'Tất cả' || !job.details.description || job.details.description.includes(dominantHandName);

            const otherSkillMatch = !otherSkillRequirement || otherSkillRequirement.length === 0 || otherSkillRequirement.every(skillSlug => {
                const skillName = otherSkills.find(s => s.slug === skillSlug)?.name;
                return skillName ? (job.details.description.includes(skillName) || job.details.requirements.includes(skillName)) : true;
            });
            
            const specialConditionsMatch = !specialConditions || specialConditions.length === 0 || specialConditions.every(cond => {
                 return job.specialConditions && job.specialConditions.toLowerCase().includes(cond.toLowerCase());
            });

             const arrivalTimeMatch = !companyArrivalTime || (job.companyArrivalTime && job.companyArrivalTime === companyArrivalTime);
             
             const workShiftMatch = !workShift || !job.details.description || createSlug(job.details.description).includes(createSlug(workShift));

            return queryMatch && visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && quantityMatch && feeMatch && roundsMatch && interviewDateMatch && basicSalaryMatch && netSalaryMatch && hourlySalaryMatch && annualIncomeMatch && annualBonusMatch && genderMatch && expReqMatch && yearsOfExperienceMatch && ageMatch && heightMatch && weightMatch && visionMatch && tattooMatch && languageReqMatch && educationReqMatch && dominantHandMatch && otherSkillMatch && specialConditionsMatch && arrivalTimeMatch && workShiftMatch && englishReqMatch;
        }).length;
        setStagedResultCount(count);
    }, []);

    useEffect(() => {
        const newFilters: SearchFilters = { ...initialSearchFilters, location: [], specialConditions: [] };
        let hasSortBy = false;

        for (const [key, value] of searchParams.entries()) {
            const internalKey = reverseKeyMap[key] || key;
            if (internalKey === 'sortBy') {
                setSortBy(value);
                hasSortBy = true;
            } else if (internalKey === 'location' || internalKey === 'otherSkillRequirement') {
                const currentValues = newFilters[internalKey as 'location' | 'otherSkillRequirement'] || [];
                // @ts-ignore
                newFilters[internalKey as 'location' | 'otherSkillRequirement'] = [...currentValues, value];
            } else if (internalKey === 'age' || internalKey === 'height' || internalKey === 'weight') {
                const values = searchParams.getAll(key);
                if (values.length === 2) {
                     // @ts-ignore
                    newFilters[internalKey] = [parseInt(values[0], 10), parseInt(values[1], 10)];
                }
            } else if (internalKey === 'specialConditions') {
                const currentConditions = newFilters.specialConditions || [];
                const conditionName = allSpecialConditions.find(c => c.slug === value)?.name;
                if (conditionName) {
                    newFilters.specialConditions = [...currentConditions, conditionName];
                }
            } else if (key === 'yoe') { // Legacy key support
                newFilters['yearsOfExperience'] = value;
            } else {
                 if (internalKey in newFilters) {
                    // @ts-ignore
                    newFilters[internalKey] = value;
                 }
            }
        }
        if (!hasSortBy) {
            setSortBy('newest'); // default sort
        }
        setAppliedFilters(newFilters);
        setStagedFilters(newFilters);
        runFilter(newFilters, hasSortBy ? searchParams.get('sap-xep')! : 'newest');
        countStagedResults(newFilters);
        
    }, [searchParams, runFilter, countStagedResults]);
    
    const handleStagedFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      setStagedFilters(prev => {
          const updated = {...prev, ...newFilters};
          countStagedResults(updated);
          return updated;
      });
    }, [countStagedResults]);

    const handleApplyFilters = useCallback(() => {
        const query = new URLSearchParams();
        Object.entries(stagedFilters).forEach(([key, value]) => {
             const urlKey = keyMap[key] || key;
            if (value && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
                if (key !== 'visa' && !(Array.isArray(value) && value.includes('all'))) {
                    if (Array.isArray(value)) {
                        if (key === 'specialConditions') {
                            value.forEach(item => {
                                const conditionSlug = allSpecialConditions.find(c => c.name === item)?.slug;
                                if (conditionSlug) {
                                    query.append(urlKey, conditionSlug);
                                }
                            });
                        } else {
                            value.forEach(item => query.append(urlKey, String(item)));
                        }
                    } else {
                        query.set(urlKey, String(value));
                    }
                }
            }
        });

        if (sortBy !== 'newest') {
            query.set(keyMap['sortBy'], sortBy);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
    }, [stagedFilters, sortBy, router]);

    const handleSortChange = (value: string) => {
        setSortBy(value);
        const query = new URLSearchParams(searchParams.toString());
        if (value === 'newest') {
            query.delete(keyMap['sortBy']);
        } else {
            query.set(keyMap['sortBy'], value);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
    };
  
    const handleResetFilters = useCallback(() => {
        setStagedFilters(initialSearchFilters);
        setSortBy('newest');
        countStagedResults(initialSearchFilters);
        if (searchParams.toString() !== '') {
            router.push('/tim-viec-lam');
        } else {
             runFilter(initialSearchFilters, 'newest');
        }
    }, [router, runFilter, countStagedResults, searchParams]);
    
    const handleNewSearch = async (filters: SearchFilters) => {
        const query = new URLSearchParams();
        
        if (filters.q) {
            const criteria = await recommendJobs(filters.q);
            if (criteria?.industry) query.set(keyMap['industry'], allIndustries.find(i => i.name === criteria.industry)?.slug || '');
            if (criteria?.workLocation) query.set(keyMap['location'], allJapanLocations.find(l => l.name === criteria.workLocation)?.slug || '');
            if (criteria?.visaType) {
                 const visaSlug = japanJobTypes.find(v => v.name === criteria.visaType)?.slug;
                 if(visaSlug) query.set(keyMap['visa'], visaSlug);
            }
             if (!criteria?.industry && !criteria?.workLocation && !criteria?.visaType) {
                query.set('q', filters.q);
            }
        } else {
            if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set(keyMap['visaDetail'], filters.visaDetail);
            if (filters.industry && filters.industry !== 'all') query.set(keyMap['industry'], filters.industry);
            if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
                filters.location.forEach(loc => query.append(keyMap['location'], loc));
            } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
                query.append(keyMap['location'], filters.location);
            }
        }
        
        router.push(`/tim-viec-lam?${query.toString()}`);
    }

    return (
        <div className="flex flex-col">
            <SearchModule 
                onSearch={handleNewSearch} 
                filters={stagedFilters}
                onFilterChange={handleStagedFilterChange} 
            />
            <SearchResults 
                jobs={filteredJobs} 
                filters={stagedFilters}
                appliedFilters={appliedFilters}
                onFilterChange={handleStagedFilterChange} 
                applyFilters={handleApplyFilters} 
                resetFilters={handleResetFilters}
                resultCount={stagedResultCount}
                sortBy={sortBy}
                onSortChange={handleSortChange}
            />
        </div>
    );
}

    