

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { industriesByJobType, type Industry } from "@/lib/industry-data";
import { Briefcase, Check, DollarSign, Dna, MapPin, SlidersHorizontal, Star, UserSearch, Weight, Building, FileText, Calendar, Camera, Ruler, Languages, Clock, ListChecks, Trash2 } from "lucide-react";
import { japanRegions, allJapanLocations, interviewLocations } from '@/lib/location-data';
import { type SearchFilters, experienceYears } from './search-results';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, startOfTomorrow, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { jobData } from '@/lib/mock-data';
import { Badge } from '../ui/badge';
import { japanJobTypes, visaDetailsByVisaType, workShifts, allSpecialConditions, otherSkills, dominantHands, educationLevels, languageLevels, englishLevels, visionRequirements, tattooRequirements } from '@/lib/visa-data';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const createSlug = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-.]+/g, '');
};

const conditionsByVisaDetail: { [key: string]: string[] } = {
  'thuc-tap-sinh-3-nam': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'thuc-tap-sinh-1-nam': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'thuc-tap-sinh-3-go': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
  'dac-dinh-dau-nhat': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
  'dac-dinh-dau-viet': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'dac-dinh-di-moi': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'ky-su-tri-thuc-dau-nhat': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng', 'Nhận bằng Senmon', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
  'ky-su-tri-thuc-dau-viet': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng', 'Nhận bằng Senmon', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
};

const interviewRoundsOptions = [
    { name: "1 vòng", slug: "1-vong" },
    { name: "2 vòng", slug: "2-vong" },
    { name: "3 vòng", slug: "3-vong" },
    { name: "4 vòng", slug: "4-vong" },
    { name: "5 vòng", slug: "5-vong" }
];

const ginouExpiryOptions = [
    "Trên 4,5 năm", "Trên 4 năm", "Trên 3,5 năm", "Trên 3 năm", "Trên 2,5 năm", "Trên 2 năm", "Trên 1,5 năm", "Trên 1 năm", "Trên 0,5 năm"
];


const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

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


interface FilterSidebarProps {
    filters: SearchFilters;
    appliedFilters: SearchFilters;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    onApply: () => void;
    onReset: () => void;
    resultCount: number;
}

const JPY_VND_RATE = 180;
const USD_VND_RATE = 26300;

const getConvertedValue = (value: string | undefined, placeholder: string, rate: number, unit: string) => {
    const numericString = value || placeholder.replace(/[^0-9]/g, '');
    const num = Number(numericString.replace(/[^0-9]/g, ''));
    
    if (isNaN(num)) return `≈ 0 ${unit}`;

    const convertedValue = num * rate;
    
    if (num === 0) {
        return `≈ 0 ${unit}`;
    }

    if (unit === 'triệu VNĐ') {
        const valueInMillions = convertedValue / 1000000;
        const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `≈ ${formattedVnd.replace('.',',')} triệu VNĐ`;
    }
    
    return `≈ ${convertedValue.toLocaleString('vi-VN')} VNĐ`;
};

const handleSalaryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: keyof SearchFilters,
    limit: number | null,
    onFilterChange: FilterSidebarProps['onFilterChange']
) => {
    const rawValue = e.target.value;
    let num = Number(rawValue.replace(/[^0-9]/g, ''));

    if (isNaN(num)) {
        onFilterChange({ [field]: '' });
        return;
    }

    if (limit && num > limit) {
        num = limit;
    }

    onFilterChange({ [field]: String(num) });
};

const getDisplayValue = (value?: string) => {
    if (!value) return '';
    const num = Number(String(value).replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('ja-JP');
};


const MonthlySalaryContent = React.memo(({ filters, onFilterChange }: Pick<FilterSidebarProps, 'filters' | 'onFilterChange'>) => {
    
    const placeholderText = "VD: 200,000";

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="basic-salary-jpy">Lương cơ bản (JPY/tháng)</Label>
                <Input 
                    id="basic-salary-jpy" 
                    type="text" 
                    placeholder={placeholderText} 
                    onChange={(e) => handleSalaryInputChange(e, 'basicSalary', 10000000, onFilterChange)}
                    value={getDisplayValue(filters.basicSalary)} 
                />
                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.basicSalary, placeholderText, JPY_VND_RATE, 'triệu VNĐ')}</p>
            </div>
             <div className="space-y-2">
                <Label htmlFor="net-salary-jpy">Thực lĩnh tối thiểu (JPY/tháng)</Label>
                <Input 
                    id="net-salary-jpy" 
                    type="text" 
                    placeholder="VD: 160,000" 
                    onChange={(e) => handleSalaryInputChange(e, 'netSalary', 10000000, onFilterChange)}
                    value={getDisplayValue(filters.netSalary)} 
                />
                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netSalary, 'VD: 160,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
            </div>
        </div>
    );
});
MonthlySalaryContent.displayName = 'MonthlySalaryContent';


export const FilterSidebar = ({ filters, appliedFilters, onFilterChange, onApply, onReset, resultCount }: FilterSidebarProps) => {
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);
    const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
    const [isFlexibleDate, setIsFlexibleDate] = useState(false);
    const isMobile = useIsMobile();
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    
    const { jobCountsByRegion, jobCountsByPrefecture } = useMemo(() => {
        const countsByPrefecture: { [key: string]: number } = {};
        const countsByRegion: { [key: string]: number } = {};

        // Initialize all locations with 0
        allJapanLocations.forEach(p => {
            countsByPrefecture[p.name] = 0;
        });
        japanRegions.forEach(r => {
            countsByRegion[r.name] = 0;
        });
        
        const filtersToApply = { ...filters };
        const industryObject = allIndustries.find(i => i.slug === filtersToApply.industry);
        const industryName = industryObject?.name || filtersToApply.industry;
        const feeLimit = parseSalary(filtersToApply.netFee);
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === filtersToApply.interviewLocation)?.name;
        const roundsSlug = filtersToApply.interviewRounds;
        const roundsToMatch = roundsSlug ? parseInt(roundsSlug.split('-')[0], 10) : null;
        const basicSalaryMin = parseSalary(filtersToApply.basicSalary);
        const netSalaryMin = parseSalary(filtersToApply.netSalary);
        const hourlySalaryMin = parseSalary(filtersToApply.hourlySalary);
        const annualIncomeMin = parseSalary(filtersToApply.annualIncome);
        const annualBonusMin = parseSalary(filtersToApply.annualBonus);
        const yoeSlug = filtersToApply.yearsOfExperience || '';
        const yoeName = experienceYears.find(y => y.slug === yoeSlug)?.name || '';
        const [minExp, maxExp] = parseExperienceToRange(yoeName);
        const expReqSlug = filtersToApply.experienceRequirement || '';
        const eduReqName = educationLevels.find(e => e.slug === filtersToApply.educationRequirement)?.name;
        const dominantHandName = dominantHands.find(d => d.slug === filtersToApply.dominantHand)?.name;

        // Filter jobs based on all criteria EXCEPT location
        const preFilteredJobs = jobData.filter(job => {
             let visaMatch = true;
            if (filtersToApply.visaDetail && filtersToApply.visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === filtersToApply.visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (filtersToApply.visa && filtersToApply.visa !== 'all') {
                 const targetVisaTypeObject = japanJobTypes.find(v => v.slug === filtersToApply.visa);
                 visaMatch = job.visaType === targetVisaTypeObject?.name;
            }

            const industryMatch = !filtersToApply.industry || filtersToApply.industry === 'all' || (job.industry && job.industry === industryName);
            const jobDetailMatch = !filtersToApply.jobDetail || (job.title && createSlug(job.title).includes(filtersToApply.jobDetail)) || (job.details.description && createSlug(job.details.description).includes(filtersToApply.jobDetail));
            const expReqMatch = !expReqSlug || !job.experienceRequirement || createSlug(job.experienceRequirement).includes(expReqSlug);
            const [jobMinExp] = parseExperienceToRange(job.yearsOfExperience);
            const yearsOfExperienceMatch = !yoeSlug || (jobMinExp <= maxExp);
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));
            const quantityMatch = !filtersToApply.quantity || job.quantity >= parseInt(filtersToApply.quantity, 10);
            const feeMatch = feeLimit === null || !job.netFee || (parseSalary(job.netFee) || 0) <= feeLimit;
            const roundsMatch = !roundsToMatch || job.interviewRounds === roundsToMatch;
            const interviewDateMatch = !filtersToApply.interviewDate || filtersToApply.interviewDate === 'flexible' || (job.interviewDateOffset && (new Date().getTime() + job.interviewDateOffset * 24 * 3600 * 1000) <= new Date(filtersToApply.interviewDate).getTime());
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
            if (filtersToApply.gender) {
                const targetGender = filtersToApply.gender === 'nam' ? 'Nam' : 'Nữ';
                genderMatch = job.gender === targetGender || job.gender === 'Cả nam và nữ';
            }
            let ageMatch = true;
            if (filtersToApply.age && job.ageRequirement) {
                const jobAgeRange = parseAgeRequirement(job.ageRequirement);
                if (jobAgeRange) {
                    const [filterMinAge, filterMaxAge] = filtersToApply.age;
                    const [jobMinAge, jobMaxAge] = jobAgeRange;
                    ageMatch = Math.max(filterMinAge, jobMinAge) <= Math.min(filterMaxAge, jobMaxAge);
                }
            }
            let heightMatch = true;
            if (filtersToApply.height) {
                const [jobMinHeight, jobMaxHeight] = parsePhysicalRequirement(job.heightRequirement);
                const [filterMinHeight, filterMaxHeight] = filtersToApply.height;
                heightMatch = filterMinHeight <= jobMaxHeight && filterMaxHeight >= jobMinHeight;
            }
            let weightMatch = true;
            if (filtersToApply.weight) {
                const [jobMinWeight, jobMaxWeight] = parsePhysicalRequirement(job.weightRequirement);
                const [filterMinWeight, filterMaxHeight] = filtersToApply.weight;
                weightMatch = filterMinWeight <= jobMaxWeight && filterMaxHeight >= jobMinWeight;
            }
            const visionMatch = !filtersToApply.visionRequirement || filtersToApply.visionRequirement === 'all' || !job.visionRequirement || createSlug(job.visionRequirement).includes(filtersToApply.visionRequirement);
            const tattooReqName = tattooRequirements.find(t => t.slug === filtersToApply.tattooRequirement)?.name;
            const tattooMatch = !filtersToApply.tattooRequirement || filtersToApply.tattooRequirement === 'all' || !job.tattooRequirement || job.tattooRequirement === tattooReqName;
            const langReqName = languageLevels.find(l => l.slug === filtersToApply.languageRequirement)?.name;
            const languageReqMatch = !filtersToApply.languageRequirement || filtersToApply.languageRequirement === 'all' || !job.languageRequirement || job.languageRequirement === langReqName;
            const educationReqMatch = !eduReqName || eduReqName === 'Tất cả' || !job.educationRequirement || job.educationRequirement === eduReqName;
            const dominantHandMatch = !dominantHandName || dominantHandName === 'Tất cả' || !job.details.description || job.details.description.includes(dominantHandName);
            const otherSkillMatch = !filtersToApply.otherSkillRequirement || filtersToApply.otherSkillRequirement.length === 0 || filtersToApply.otherSkillRequirement.every(skillSlug => {
                const skillName = otherSkills.find(s => s.slug === skillSlug)?.name;
                return skillName ? (job.details.description.includes(skillName) || job.details.requirements.includes(skillName)) : true;
            });
            const specialConditionsMatch = !filtersToApply.specialConditions || filtersToApply.specialConditions.length === 0 || filtersToApply.specialConditions.every(cond => {
                 return job.specialConditions && job.specialConditions.toLowerCase().includes(cond.toLowerCase());
            });

            const arrivalTimeMatch = !filtersToApply.companyArrivalTime || (job.companyArrivalTime && job.companyArrivalTime === filtersToApply.companyArrivalTime);
            const workShiftMatch = !filters.workShift || !job.details.description || createSlug(job.details.description).includes(createSlug(filters.workShift));
            
            const englishRequirementMatch = !filters.englishRequirement || filters.englishRequirement === 'all' || !job.languageRequirement || createSlug(job.languageRequirement).includes(filters.englishRequirement);

            return visaMatch && industryMatch && jobDetailMatch && expReqMatch && yearsOfExperienceMatch && interviewLocationMatch && quantityMatch && feeMatch && roundsMatch && interviewDateMatch && basicSalaryMatch && netSalaryMatch && hourlySalaryMatch && annualIncomeMatch && annualBonusMatch && genderMatch && ageMatch && heightMatch && weightMatch && visionMatch && tattooMatch && languageReqMatch && educationReqMatch && dominantHandMatch && otherSkillMatch && specialConditionsMatch && arrivalTimeMatch && workShiftMatch && englishRequirementMatch;
        });

        // Count jobs in the pre-filtered list
        for (const job of preFilteredJobs) {
            const prefectureName = job.workLocation;
            if (countsByPrefecture.hasOwnProperty(prefectureName)) {
                countsByPrefecture[prefectureName]++;
            }
        }
        
        for (const region of japanRegions) {
            countsByRegion[region.name] = region.prefectures.reduce((sum, p) => sum + (countsByPrefecture[p.name] || 0), 0);
        }

        return { jobCountsByRegion: countsByRegion, jobCountsByPrefecture: countsByPrefecture };
    }, [filters]);


    const allJobDetailsForExperience = useMemo(() => {
        return [...new Set(Object.values(industriesByJobType).flat().flatMap(ind => ind.keywords).filter(Boolean))];
    }, []);

    const activeFilters = { ...appliedFilters, ...filters };

    const showGinouFilter = useMemo(() => 
        ['dac-dinh-dau-viet', 'dac-dinh-dau-nhat'].includes(activeFilters.visaDetail || ''),
    [activeFilters.visaDetail]);

    const showArrivalTimeFilter = useMemo(() => 
        ['thuc-tap-sinh-3-go', 'dac-dinh-dau-nhat', 'ky-su-tri-thuc-dau-nhat'].includes(activeFilters.visaDetail || ''),
    [activeFilters.visaDetail]);

    const availableConditions = useMemo(() => {
        if (!activeFilters.visaDetail) {
            return allSpecialConditions;
        }
        const conditions = conditionsByVisaDetail[activeFilters.visaDetail as keyof typeof conditionsByVisaDetail] || [];
        return conditions.map(name => ({name, slug: createSlug(name)}));

    }, [activeFilters.visaDetail]);

    const showTattooFilter = useMemo(() => {
        const visasToHideTattoo = ['ky-su-tri-thuc-dau-viet', 'ky-su-tri-thuc-dau-nhat'];
        const parentVisaSlug = activeFilters.visa || Object.keys(visaDetailsByVisaType).find(key => (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === activeFilters.visaDetail));
        if (parentVisaSlug === 'ky-su-tri-thuc') return false;
        return !visasToHideTattoo.includes(activeFilters.visaDetail || '');
    }, [activeFilters.visa, activeFilters.visaDetail]);

    const showEnglishLevelFilter = useMemo(() => {
        // Use a consistent source for logic: activeFilters which is the merged state.
        const parentVisaSlug = activeFilters.visa || Object.keys(visaDetailsByVisaType).find(key => 
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === activeFilters.visaDetail)
        );

        const isEngineerVisa = parentVisaSlug === 'ky-su-tri-thuc';
        const isTokuteiServiceIndustry = 
            parentVisaSlug === 'ky-nang-dac-dinh' && 
            ['nha-hang-tokutei', 'hang-khong-tokutei', 've-sinh-toa-nha-tokutei', 'luu-tru-khach-san-tokutei'].includes(activeFilters.industry || '');
        
        return isEngineerVisa || isTokuteiServiceIndustry;
    }, [activeFilters.visa, activeFilters.visaDetail, activeFilters.industry]);

    useEffect(() => {
        const parentVisaSlug = filters.visa || Object.keys(industriesByJobType).find(key => 
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === filters.visaDetail)
        );

        const industries = parentVisaSlug ? (industriesByJobType[parentVisaSlug as keyof typeof industriesByJobType] || allIndustries) : allIndustries;
        const uniqueIndustries = Array.from(new Map(industries.map(item => [item.name, item])).values());
        setAvailableIndustries(uniqueIndustries);

        if (filters.industry && filters.industry !== 'all') {
            const selectedIndustryData = allIndustries.find(ind => ind.slug === filters.industry);
            setAvailableJobDetails(selectedIndustryData?.keywords || []);
        } else {
             const allJobDetails = uniqueIndustries.flatMap(ind => ind.keywords);
             setAvailableJobDetails([...new Set(allJobDetails)]);
        }

    }, [filters.visa, filters.visaDetail, filters.industry]);

    useEffect(() => {
        if (filters.interviewDate === 'flexible') {
            setIsFlexibleDate(true);
        } else {
            setIsFlexibleDate(false);
        }
    }, [filters.interviewDate]);

    const handleDateSelect = (date: Date | undefined) => {
        onFilterChange({ interviewDate: date ? format(date, 'yyyy-MM-dd') : '' });
    };

    const handleFlexibleDateChange = (checked: boolean) => {
        if (checked) {
            onFilterChange({ interviewDate: 'flexible' });
        } else {
            onFilterChange({ interviewDate: '' });
        }
    };

    const handleVisaDetailChange = (value: string) => {
        const newFilters: Partial<SearchFilters> = { visaDetail: value };
        const parentTypeSlug = Object.keys(visaDetailsByVisaType).find(key => 
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === value)
        );
        
        if (parentTypeSlug && filters.visa !== parentTypeSlug) {
            newFilters.visa = parentTypeSlug;
            newFilters.industry = '';
            newFilters.jobDetail = '';
        }
        
        const vietnamVisas = ["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam", "dac-dinh-dau-viet", "dac-dinh-di-moi", "ky-su-tri-thuc-dau-viet"];
        const japanVisas = ["thuc-tap-sinh-3-go", "dac-dinh-dau-nhat", "ky-su-tri-thuc-dau-nhat"];

        if (filters.interviewLocation) {
             const interviewLoc = interviewLocations['Việt Nam'].find(l => l.slug === filters.interviewLocation) || interviewLocations['Nhật Bản'].find(l => l.slug === filters.interviewLocation);
            if (vietnamVisas.includes(value) && !interviewLocations['Việt Nam'].some(l => l.slug === filters.interviewLocation)) {
                newFilters.interviewLocation = ''; 
            } else if (japanVisas.includes(value) && !interviewLocations['Nhật Bản'].some(l => l.slug === filters.interviewLocation)) {
                 newFilters.interviewLocation = '';
            }
        }

        onFilterChange(newFilters);
    };

    const renderInterviewLocations = () => {
        const vietnamVisas = ["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam", "dac-dinh-dau-viet", "dac-dinh-di-moi", "ky-su-tri-thuc-dau-viet"];
        const japanVisas = ["thuc-tap-sinh-3-go", "dac-dinh-dau-nhat", "ky-su-tri-thuc-dau-nhat"];
        
        if (filters.visaDetail && vietnamVisas.includes(filters.visaDetail)) {
            return (
                <SelectGroup>
                    <SelectLabel>Việt Nam</SelectLabel>
                    {interviewLocations['Việt Nam'].map(l=><SelectItem key={l.slug} value={l.slug}>{l.name}</SelectItem>)}
                </SelectGroup>
            );
        }

        if (filters.visaDetail && japanVisas.includes(filters.visaDetail)) {
            return (
                 <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                    {interviewLocations['Nhật Bản'].map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                </SelectGroup>
            );
        }

        // Default case: show all
        return (
            <>
                <SelectGroup>
                        <SelectLabel>Việt Nam</SelectLabel>
                        {interviewLocations['Việt Nam'].map(l=><SelectItem key={l.slug} value={l.slug}>{l.name}</SelectItem>)}
                </SelectGroup>
                    <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                        {interviewLocations['Nhật Bản'].map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                    </SelectGroup>
            </>
        )
    }
    
    const showTtsFeeFilter = useMemo(() => {
        const visasToShowFee = ['thuc-tap-sinh-3-nam', 'thuc-tap-sinh-1-nam'];
        return !!activeFilters.visaDetail && visasToShowFee.includes(activeFilters.visaDetail);
    }, [activeFilters.visaDetail]);

    const showDdKsFeeFilter = useMemo(() => {
        const visasToShowFee = ['dac-dinh-dau-viet', 'dac-dinh-di-moi', 'ky-su-tri-thuc-dau-viet'];
        return !!activeFilters.visaDetail && visasToShowFee.includes(activeFilters.visaDetail);
    }, [activeFilters.visaDetail]);


    const showEducationFilter = useMemo(() => {
        const parentVisaSlug = activeFilters.visa || Object.keys(visaDetailsByVisaType).find(key => (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === activeFilters.visaDetail));
        
        return parentVisaSlug === 'ky-su-tri-thuc' || !activeFilters.visaDetail;
    }, [activeFilters.visa, activeFilters.visaDetail]);
    
    const shouldShowLươngGiờ = !["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam"].includes(activeFilters.visaDetail || "");
    const shouldShowLươngNăm = !["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam"].includes(activeFilters.visaDetail || "");
    const shouldShowTabs = shouldShowLươngGiờ || shouldShowLươngNăm;

    const getFeePlaceholder = () => {
        const visaDetail = filters.visaDetail;
        if (visaDetail === 'thuc-tap-sinh-1-nam') return "0 đến 1500$";
        if (visaDetail === 'dac-dinh-dau-viet') return "0 đến 2500$";
        return "0 đến 3800$";
    };
    
    return (
        <div className="md:col-span-1 lg:col-span-1 h-full flex flex-col">
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><SlidersHorizontal/> Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto pr-4">
                    <Accordion type="multiple" defaultValue={['jobType', 'location', 'industry', 'experience', 'requirements', 'interviewLocation', 'process', 'salary', 'netSalary', 'specialConditions', 'netFee']} className="w-full">
                         <AccordionItem value="jobType">
                            <AccordionTrigger className="text-base font-semibold">
                                 <span className="flex items-center gap-2"><Briefcase className="h-5 w-5"/>Loại hình công việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                 <div>
                                    <Label>Chi tiết loại hình visa</Label>
                                    <Select key={filters.visa || 'all'} value={filters.visaDetail} onValueChange={handleVisaDetailChange}>
                                        <SelectTrigger className={cn(filters.visaDetail && filters.visaDetail !== 'all-details' && 'text-primary')}>
                                            <SelectValue placeholder="Tất cả chi tiết"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-details">Tất cả chi tiết</SelectItem>
                                             {japanJobTypes.map(type => (
                                                <SelectGroup key={type.slug}>
                                                    <SelectLabel>{type.name}</SelectLabel>
                                                    {(visaDetailsByVisaType[type.slug] || []).map(detail => (
                                                        <SelectItem key={detail.slug} value={detail.slug}>{detail.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="industry">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><Building className="h-5 w-5"/>Ngành nghề &amp; Công việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Ngành nghề</Label>
                                    <Select value={filters.industry} onValueChange={(value) => onFilterChange({ industry: value, jobDetail: '' })}>
                                        <SelectTrigger className={cn(filters.industry && filters.industry !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn ngành nghề"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                                            {availableIndustries.map(ind => <SelectItem key={ind.slug} value={ind.slug}>{ind.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chi tiết công việc</Label>
                                    <Select value={filters.jobDetail} onValueChange={(value) => onFilterChange({ jobDetail: value })} disabled={!filters.industry || filters.industry === 'all'}>
                                        <SelectTrigger className={cn(filters.jobDetail && 'text-primary')}><SelectValue placeholder="Chọn công việc"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all-details">Tất cả công việc</SelectItem>
                                            {availableJobDetails.map(detail => <SelectItem key={detail} value={createSlug(detail)}>{detail}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                         <AccordionItem value="location">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><MapPin className="h-5 w-5"/>Địa điểm làm việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="space-y-3">
                                   <div className='p-3 bg-secondary rounded-md'>
                                      <p className='text-sm font-semibold'>Đã chọn ({Array.isArray(filters.location) ? filters.location.length : 0})</p>
                                      {Array.isArray(filters.location) && filters.location.length > 0 && (
                                         <div className='flex flex-wrap gap-1 mt-2 text-xs'>
                                            {filters.location.map(locSlug => (
                                                <Badge key={locSlug} variant="secondary" className='bg-primary/20 text-primary-dark font-medium px-2 py-0.5 rounded'>
                                                    {allJapanLocations.find(l => l.slug === locSlug)?.name || japanRegions.find(r => r.slug === locSlug)?.name || locSlug}
                                                </Badge>
                                            ))}
                                         </div>
                                      )}
                                   </div>
                                   <Accordion type="multiple" className="w-full">
                                    {japanRegions.map((region) => (
                                        <AccordionItem key={region.slug} value={region.slug}>
                                            <div className="flex items-center gap-2 py-2 text-sm hover:no-underline" >
                                                <Checkbox
                                                    id={`region-${region.slug}`}
                                                    checked={Array.isArray(filters.location) && region.prefectures.every(p => filters.location.includes(p.slug))}
                                                    onCheckedChange={(checked) => {
                                                        const currentSelection = new Set(Array.isArray(filters.location) ? filters.location : []);
                                                        if (checked) {
                                                            region.prefectures.forEach(p => currentSelection.add(p.slug));
                                                        } else {
                                                            region.prefectures.forEach(p => currentSelection.delete(p.slug));
                                                        }
                                                        onFilterChange({ location: Array.from(currentSelection) });
                                                    }}
                                                />
                                                <AccordionTrigger className="flex-1 p-0 hover:no-underline">
                                                    <Label htmlFor={`region-${region.slug}`} className="flex-grow text-left font-semibold cursor-pointer flex justify-between w-full">
                                                        <span>Vùng {region.name}</span>
                                                        <span className="text-muted-foreground text-xs ml-1">{jobCountsByRegion[region.name] || 0} việc</span>
                                                    </Label>
                                                </AccordionTrigger>
                                            </div>
                                            <AccordionContent className="pl-6 space-y-2">
                                                {region.prefectures.map((prefecture) => (
                                                    <div key={prefecture.slug} className="flex items-center gap-2">
                                                         <Checkbox
                                                            id={`pref-${prefecture.slug}`}
                                                            checked={Array.isArray(filters.location) && filters.location.includes(prefecture.slug)}
                                                            onCheckedChange={(checked) => {
                                                                const currentSelection = new Set(Array.isArray(filters.location) ? filters.location : []);
                                                                if (checked) {
                                                                    currentSelection.add(prefecture.slug);
                                                                } else {
                                                                    currentSelection.delete(prefecture.slug);
                                                                }
                                                                onFilterChange({ location: Array.from(currentSelection) });
                                                            }}
                                                        />
                                                        <Label htmlFor={`pref-${prefecture.slug}`} className="flex w-full items-center justify-between font-normal cursor-pointer">
                                                            <span>{prefecture.name}</span>
                                                            <span className="text-muted-foreground text-xs ml-1">{jobCountsByPrefecture[prefecture.name] || 0}</span>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                   </Accordion>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                         <AccordionItem value="interviewLocation">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><FileText className="h-5 w-5"/>Phỏng vấn, tuyển tại</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Địa điểm phỏng vấn</Label>
                                    <Select value={filters.interviewLocation} onValueChange={(value) => onFilterChange({ interviewLocation: value })}>
                                        <SelectTrigger className={cn(filters.interviewLocation && filters.interviewLocation !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all">Tất cả địa điểm</SelectItem>
                                            {renderInterviewLocations()}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Số vòng phỏng vấn</Label>
                                    <Select value={filters.interviewRounds} onValueChange={(value) => onFilterChange({ interviewRounds: value })}>
                                        <SelectTrigger className={cn(filters.interviewRounds && filters.interviewRounds !== 'all' && 'text-primary')}>
                                            <SelectValue placeholder="Chọn số vòng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            {interviewRoundsOptions.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Phỏng vấn từ giờ đến</Label>
                                    {isMobile ? (
                                        <Sheet open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                            <SheetTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full justify-start text-left font-normal", !filters.interviewDate && "text-muted-foreground", filters.interviewDate && filters.interviewDate !== 'flexible' && "text-primary")}
                                                    disabled={isFlexibleDate}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filters.interviewDate && filters.interviewDate !== 'flexible' ? format(new Date(filters.interviewDate), "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="bottom" className="h-auto">
                                                <SheetHeader>
                                                    <SheetTitle>Chọn ngày phỏng vấn</SheetTitle>
                                                </SheetHeader>
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={filters.interviewDate && filters.interviewDate !== 'flexible' ? new Date(filters.interviewDate) : undefined}
                                                    onSelect={(date) => {
                                                        handleDateSelect(date);
                                                        setIsDatePickerOpen(false);
                                                    }}
                                                    fromDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                                    toDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
                                                    locale={vi}
                                                    initialFocus
                                                />
                                            </SheetContent>
                                        </Sheet>
                                    ) : (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full justify-start text-left font-normal", !filters.interviewDate && "text-muted-foreground", filters.interviewDate && filters.interviewDate !== 'flexible' && "text-primary")}
                                                    disabled={isFlexibleDate}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filters.interviewDate && filters.interviewDate !== 'flexible' ? format(new Date(filters.interviewDate), "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={filters.interviewDate && filters.interviewDate !== 'flexible' ? new Date(filters.interviewDate) : undefined}
                                                    onSelect={handleDateSelect}
                                                    fromDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                                    toDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
                                                    locale={vi}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="flexible-date" checked={isFlexibleDate} onCheckedChange={handleFlexibleDateChange} />
                                    <label
                                        htmlFor="flexible-date"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Đủ người thì phỏng vấn
                                    </label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="salary">
                             <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5"/>Lương &amp; Đãi ngộ</span>
                            </AccordionTrigger>
                             <AccordionContent className="pt-4">
                                {shouldShowTabs ? (
                                    <Tabs defaultValue="basic">
                                        <TabsList className={cn("grid w-full h-auto", (shouldShowLươngGiờ && shouldShowLươngNăm) ? "grid-cols-3" : "grid-cols-2")}>
                                            <TabsTrigger value="basic" className="text-xs">Lương tháng</TabsTrigger>
                                            {shouldShowLươngGiờ && <TabsTrigger value="hourly" className="text-xs">Lương giờ</TabsTrigger>}
                                            {shouldShowLươngNăm && <TabsTrigger value="yearly" className="text-xs">Lương năm</TabsTrigger>}
                                        </TabsList>
                                        <TabsContent value="basic" className="pt-4">
                                            <MonthlySalaryContent filters={filters} onFilterChange={onFilterChange} />
                                        </TabsContent>
                                        <TabsContent value="hourly" className="pt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="hourly-salary-jpy">Lương giờ (JPY)</Label>
                                                <Input 
                                                    id="hourly-salary-jpy" 
                                                    type="text" 
                                                    placeholder="VD: 1,000" 
                                                    onChange={(e) => handleSalaryInputChange(e, 'hourlySalary', 15000, onFilterChange)}
                                                    value={getDisplayValue(filters.hourlySalary || '')} 
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.hourlySalary, 'VD: 1,000', JPY_VND_RATE, 'trăm nghìn VNĐ')}</p>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="yearly" className="pt-4">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="annual-income-jpy">Thu nhập năm (JPY)</Label>
                                                    <Input 
                                                        id="annual-income-jpy" 
                                                        type="text" 
                                                        placeholder="VD: 3,000,000" 
                                                        onChange={(e) => handleSalaryInputChange(e, 'annualIncome', 30000000, onFilterChange)}
                                                        value={getDisplayValue(filters.annualIncome || '')} 
                                                    />
                                                        <p className="text-xs text-muted-foreground">{getConvertedValue(filters.annualIncome, 'VD: 3,000,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="annual-bonus-jpy">Thưởng năm (JPY)</Label>
                                                    <Input 
                                                        id="annual-bonus-jpy" 
                                                        type="text" 
                                                        placeholder="VD: 500,000" 
                                                        onChange={(e) => handleSalaryInputChange(e, 'annualBonus', 5000000, onFilterChange)}
                                                        value={getDisplayValue(filters.annualBonus || '')} 
                                                    />
                                                        <p className="text-xs text-muted-foreground">{getConvertedValue(filters.annualBonus, 'VD: 500,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                ) : (
                                    <MonthlySalaryContent filters={filters} onFilterChange={onFilterChange} />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        
                        {(showTtsFeeFilter || showDdKsFeeFilter) && (
                            <AccordionItem value="netFee">
                                <AccordionTrigger className="text-base font-semibold">
                                    <span className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-red-500"/>Mức phí</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {showTtsFeeFilter && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="net-fee-with-tuition-usd">Phí và vé và học phí (USD)</Label>
                                                <Input
                                                    id="net-fee-with-tuition-usd"
                                                    type="text"
                                                    placeholder={getFeePlaceholder()}
                                                    onChange={(e) => handleSalaryInputChange(e, 'netFee', 4200, onFilterChange)} // Assuming netFee maps to this for now
                                                    value={getDisplayValue(filters.netFee)}
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netFee, getFeePlaceholder(), USD_VND_RATE, 'triệu VNĐ')}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="net-fee-no-tuition-usd">Phí và vé không học phí (USD)</Label>
                                                <Input 
                                                    id="net-fee-no-tuition-usd" 
                                                    type="text" 
                                                    placeholder={getFeePlaceholder()}
                                                    onChange={(e) => handleSalaryInputChange(e, 'netFeeNoTicket', 4200, onFilterChange)} // Assuming netFeeNoTicket maps to this
                                                    value={getDisplayValue(filters.netFeeNoTicket)} 
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netFeeNoTicket, getFeePlaceholder(), USD_VND_RATE, 'triệu VNĐ')}</p>
                                            </div>
                                        </>
                                    )}
                                    {showDdKsFeeFilter && (
                                         <>
                                            <div className="space-y-2">
                                                <Label htmlFor="net-fee-with-ticket-usd">Phí có vé (USD)</Label>
                                                <Input
                                                    id="net-fee-with-ticket-usd"
                                                    type="text"
                                                    placeholder={getFeePlaceholder()}
                                                    onChange={(e) => handleSalaryInputChange(e, 'netFee', 4200, onFilterChange)}
                                                    value={getDisplayValue(filters.netFee)}
                                                />
                                                 <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netFee, getFeePlaceholder(), USD_VND_RATE, 'triệu VNĐ')}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="net-fee-no-ticket-usd">Phí không vé (USD)</Label>
                                                <Input 
                                                    id="net-fee-no-ticket-usd" 
                                                    type="text" 
                                                    placeholder={getFeePlaceholder()}
                                                    onChange={(e) => handleSalaryInputChange(e, 'netFeeNoTicket', 4200, onFilterChange)}
                                                    value={getDisplayValue(filters.netFeeNoTicket)}
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netFeeNoTicket, getFeePlaceholder(), USD_VND_RATE, 'triệu VNĐ')}</p>
                                            </div>
                                        </>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        
                        <AccordionItem value="experience">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><Briefcase className="h-5 w-5"/>Kinh nghiệm</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Yêu cầu kinh nghiệm</Label>
                                    <Select value={filters.experienceRequirement} onValueChange={(value) => onFilterChange({ experienceRequirement: value })}>
                                        <SelectTrigger className={cn(filters.experienceRequirement && filters.experienceRequirement !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn công việc"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all">Tất cả công việc</SelectItem>
                                            {allJobDetailsForExperience.map(jobDetail => <SelectItem key={jobDetail} value={createSlug(jobDetail)}>{jobDetail}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Số năm kinh nghiệm</Label>
                                     <Select value={filters.yearsOfExperience} onValueChange={(value) => onFilterChange({ yearsOfExperience: value })}>
                                        <SelectTrigger className={cn(filters.yearsOfExperience && 'text-primary')}><SelectValue placeholder="Chọn số năm" /></SelectTrigger>
                                        <SelectContent>
                                             {experienceYears.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                         <AccordionItem value="requirements">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><UserSearch className="h-5 w-5"/>Yêu cầu ứng viên</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div>
                                    <Label className="font-semibold">Giới tính</Label>
                                    <RadioGroup value={filters.gender} onValueChange={(value) => onFilterChange({ gender: value as any })} className="flex items-center space-x-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="" id="gender-all" />
                                            <Label htmlFor="gender-all" className='font-normal'>Tất cả</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="nam" id="gender-male" />
                                            <Label htmlFor="gender-male" className='font-normal'>Nam</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="nu" id="gender-female" />
                                            <Label htmlFor="gender-female" className='font-normal'>Nữ</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Tuổi</Label>
                                    <Slider
                                        defaultValue={[18, 36]}
                                        min={18}
                                        max={60}
                                        step={1}
                                        onValueChange={(value) => onFilterChange({ age: value as [number, number] })}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{filters.age?.[0] || 18} tuổi</span>
                                        <span>{filters.age?.[1] || 60} tuổi</span>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Chiều cao (cm)</Label>
                                    <Slider
                                        defaultValue={[145, 180]}
                                        min={135}
                                        max={210}
                                        step={1}
                                        onValueChange={(value) => onFilterChange({ height: value as [number, number] })}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{filters.height?.[0] || 135} cm</span>
                                        <span>{filters.height?.[1] || 210} cm</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cân nặng (kg)</Label>
                                     <Slider
                                        defaultValue={[40, 90]}
                                        min={35}
                                        max={120}
                                        step={1}
                                        onValueChange={(value) => onFilterChange({ weight: value as [number, number] })}
                                    />
                                     <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{filters.weight?.[0] || 35} kg</span>
                                        <span>{filters.weight?.[1] || 120} kg</span>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label className="font-semibold">Yêu cầu thị lực</Label>
                                    <Select value={filters.visionRequirement || 'all'} onValueChange={(value) => onFilterChange({ visionRequirement: value })}>
                                        <SelectTrigger className="mt-2" id="vision-requirement"><SelectValue placeholder="Chọn yêu cầu" /></SelectTrigger>
                                        <SelectContent>
                                            {visionRequirements.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {showTattooFilter && (
                                <div className="space-y-2">
                                    <Label className="font-semibold">Yêu cầu hình xăm</Label>
                                    <Select value={filters.tattooRequirement || 'all'} onValueChange={(value) => onFilterChange({ tattooRequirement: value })}>
                                        <SelectTrigger className={cn(filters.tattooRequirement && filters.tattooRequirement !== 'all' && "text-primary")}><SelectValue placeholder="Chọn yêu cầu" /></SelectTrigger>
                                        <SelectContent>
                                            {tattooRequirements.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="font-semibold">Trình độ tiếng Nhật</Label>
                                    <Select value={filters.languageRequirement} onValueChange={(value) => onFilterChange({ languageRequirement: value })}>
                                        <SelectTrigger className={cn(filters.languageRequirement && filters.languageRequirement !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn yêu cầu" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            {languageLevels.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {showEnglishLevelFilter && (
                                 <div className="space-y-2">
                                    <Label className="font-semibold">Trình độ tiếng Anh</Label>
                                    <Select value={filters.englishRequirement} onValueChange={(value) => onFilterChange({ englishRequirement: value })}>
                                        <SelectTrigger className={cn(filters.englishRequirement && filters.englishRequirement !== 'all' && "text-primary")}><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="all">Tất cả</SelectItem>
                                            {englishLevels.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                {showEducationFilter && (
                                 <div className="space-y-2">
                                    <Label className="font-semibold">Học vấn</Label>
                                    <Select value={filters.educationRequirement} onValueChange={(value) => onFilterChange({ educationRequirement: value })}>
                                        <SelectTrigger className={cn(filters.educationRequirement && filters.educationRequirement !== 'all' && "text-primary")}><SelectValue placeholder="Chọn học vấn" /></SelectTrigger>
                                        <SelectContent>
                                            {educationLevels.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="font-semibold">Tay thuận</Label>
                                    <Select value={filters.dominantHand} onValueChange={(value) => onFilterChange({ dominantHand: value })}>
                                        <SelectTrigger className={cn(filters.dominantHand && filters.dominantHand !== 'all' && "text-primary")}>
                                            <SelectValue placeholder="Chọn tay thuận" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dominantHands.map(item => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label className="font-semibold pt-2">Yêu cầu năng lực khác</Label>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-2">
                                      {otherSkills.map(skill => (
                                        <div key={skill.slug} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`skill-${skill.slug}`}
                                                checked={filters.otherSkillRequirement?.includes(skill.slug)}
                                                onCheckedChange={(checked) => {
                                                    const currentSkills = filters.otherSkillRequirement || [];
                                                    const newSkills = checked
                                                        ? [...currentSkills, skill.slug]
                                                        : currentSkills.filter((s) => s !== skill.slug);
                                                    onFilterChange({ otherSkillRequirement: newSkills });
                                                }}
                                            />
                                            <Label htmlFor={`skill-${skill.slug}`} className="font-normal text-sm cursor-pointer">{skill.name}</Label>
                                        </div>
                                      ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                         <AccordionItem value="process">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><ListChecks className="h-5 w-5"/>Quy trình tuyển dụng</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                {showGinouFilter && (
                                <div className="space-y-2">
                                    <Label>Yêu cầu hạn Ginou còn</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn thời gian" /></SelectTrigger>
                                        <SelectContent>
                                            {ginouExpiryOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                {showArrivalTimeFilter && (
                                <div className="space-y-2">
                                    <Label>Yêu cầu thời điểm về công ty</Label>
                                    <Select value={filters.companyArrivalTime} onValueChange={(value) => onFilterChange({ companyArrivalTime: value })}>
                                        <SelectTrigger id="company-arrival-time" className={cn(filters.companyArrivalTime && "text-primary")}><SelectValue placeholder="Chọn thời điểm" /></SelectTrigger>
                                        <SelectContent>
                                            {getFutureMonths().map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Ca làm việc</Label>
                                     <Select value={filters.workShift} onValueChange={(value) => onFilterChange({ workShift: value })}>
                                        <SelectTrigger className={cn(filters.workShift && 'text-primary')}>
                                            <SelectValue placeholder="Chọn ca làm việc" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workShifts.map(shift => <SelectItem key={shift.slug} value={shift.name}>{shift.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity-filter">Số lượng tuyển tối thiểu</Label>
                                    <Input 
                                        id="quantity-filter" 
                                        type="number" 
                                        min="1"
                                        placeholder="Nhập số người" 
                                        value={filters.quantity || ''}
                                        onChange={(e) => onFilterChange({ quantity: e.target.value })}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="specialConditions" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">
                               <span className="flex items-center gap-2"><Star className="h-5 w-5"/>Điều kiện đặc biệt</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-4">
                                {availableConditions.map(item => (
                                    <div key={item.slug} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`cond-${item.slug}`}
                                            checked={filters.specialConditions?.includes(item.name)}
                                            onCheckedChange={(checked) => {
                                                const currentConditions = filters.specialConditions || [];
                                                const newConditions = checked
                                                    ? [...currentConditions, item.name]
                                                    : currentConditions.filter(c => c !== item.name);
                                                onFilterChange({ specialConditions: newConditions });
                                            }}
                                        />
                                        <Label htmlFor={`cond-${item.slug}`} className="font-normal cursor-pointer">{item.name}</Label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            <div className="p-4 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t mt-auto">
                <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant="outline" onClick={onReset} className="col-span-1">Xóa</Button>
                    <Button className="w-full bg-primary text-white col-span-2" onClick={onApply}>
                        Áp dụng <Badge variant="secondary" className="ml-2">{resultCount}</Badge>
                    </Button>
                </div>
            </div>
        </div>
    );
}
