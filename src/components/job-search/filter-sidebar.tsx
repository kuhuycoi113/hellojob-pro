

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { locations } from "@/lib/location-data";
import { type SearchFilters } from './search-results';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, startOfTomorrow, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { jobData } from '@/lib/mock-data';
import { Badge } from '../ui/badge';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';

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

const allSpecialConditions = [...new Set(Object.values(conditionsByVisaDetail).flat())];

const languageLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'Không yêu cầu'];
const englishLevels = [
    "TOEIC 900", "TOEIC 800", "TOEIC 700", "TOEIC 600", "TOEIC 500", "TOEIC 400",
    "IELTS 9.0", "IELTS 8.0", "IELTS 7.0", "IELTS 6.0", "IELTS 5.0", "IELTS 4.0",
    "Giao tiếp IELTS 9.0", "Giao tiếp IELTS 8.0", "Giao tiếp IELTS 7.0", "Giao tiếp IELTS 6.0", "Giao tiếp IELTS 5.0", "Giao tiếp IELTS 4.0",
    "Trình độ tương đương 9.0", "Trình độ tương đương 8.0", "Trình độ tương đương 7.0", "Trình độ tương đương 6.0", "Trình độ tương đương 5.0", "Trình độ tương đương 4.0"
];
const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon", "Không yêu cầu"];
const experienceYears = [
    'Không yêu cầu',
    'Dưới 0,5 năm',
    '0,5 - 1 năm',
    '1 - 1,5 năm',
    '1,5 - 2 năm',
    '2 - 2,5 năm',
    '2,5 - 3 năm',
    '3 - 3,5 năm',
    '3,5 - 4 năm',
    '4 - 4,5 năm',
    '4,5 - 5 năm',
    'Trên 5 năm'
];
const visionRequirements = ["Không yêu cầu", "Yêu cầu thị lực tốt", "Không mù màu"];
const tattooRequirements = ["Không yêu cầu", "Không nhận hình xăm", "Nhận xăm nhỏ (kín)", "Nhận cả xăm to (lộ)"];

const interviewRoundsOptions = ["1 vòng", "2 vòng", "3 vòng", "4 vòng", "5 vòng"];
const workShifts = [
    "Ca ngày (thường 08:00-17:00 hoặc 09:00-18:00)",
    "Ca chiều/tối (thường 16:00-24:00 hoặc 17:00-01:00)",
    "Ca đêm (thường 24:00-08:00)",
    "Ca luân phiên (chia ca sáng, chiều và đêm; luân phiên tuần tháng)",
    "Ca 2-2-3 (làm 2 ngày, nghỉ 2 ngày, làm 3 ngày và lặp lại)",
    "Ca 4-3-3 (làm 4 ngày, nghỉ 3 ngày và tiếp tục 3 ngày nghỉ)",
    "Nghỉ thứ 7, Chủ Nhật",
    "Nghỉ định kỳ trong tuần",
    "Khác"
];
const ginouExpiryOptions = [
    "Trên 4,5 năm", "Trên 4 năm", "Trên 3,5 năm", "Trên 3 năm", "Trên 2,5 năm", "Trên 2 năm", "Trên 1,5 năm", "Trên 1 năm", "Trên 0,5 năm"
];
const otherSkills = [
    "Có bằng lái xe AT", "Có bằng lái xe MT", "Có bằng lái xe tải cỡ nhỏ", "Có bằng lái xe tải cỡ trung", "Có bằng lái xe tải cỡ lớn", "Có bằng lái xe buýt cỡ trung", "Có bằng lái xe buýt cỡ lớn", "Lái được máy xúc, máy đào", "Lái được xe nâng", "Có bằng cầu", "Vận hành máy CNC", "Có bằng tiện, mài", "Có bằng hàn", "Có bằng cắt", "Có bằng gia công kim loại", "Làm được giàn giáo", "Thi công nội thất", "Quản lý thi công xây dựng", "Quản lý khối lượng xây dựng", "Thiết kế BIM xây dựng", "Đọc được bản vẽ kỹ thuật", "Có bằng thi công nội thất"
];
const getFutureMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 1; i <= 12; i++) { // next 12 months
        const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const month = futureDate.getMonth() + 1;
        const year = futureDate.getFullYear();
        months.push(`Tháng ${month}/${year}`);
    }
    return months;
};


const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
const allJobDetailsForExperience = [...new Set(Object.values(industriesByJobType).flat().flatMap(ind => ind.keywords))];


interface FilterSidebarProps {
    filters: SearchFilters;
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


const MonthlySalaryContent = React.memo(({ filters, onFilterChange }: Pick<FilterSidebarProps, 'filters' | 'onFilterChange'>) => {
    
    const placeholderText = "VD: 200,000";

    const handleSalaryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ basicSalary: e.target.value });
    };

    const getDisplayValue = (value: string | undefined) => {
        if (!value) return '';
        const num = Number(value.replace(/[^0-9]/g, ''));
        if (isNaN(num)) return '';
        return num.toLocaleString('ja-JP');
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="basic-salary-jpy">Lương cơ bản (JPY/tháng)</Label>
            <Input 
                id="basic-salary-jpy" 
                type="text" 
                placeholder={placeholderText} 
                onChange={handleSalaryInputChange}
                value={getDisplayValue(filters.basicSalary)} 
            />
            <p className="text-xs text-muted-foreground">{getConvertedValue(filters.basicSalary, placeholderText, JPY_VND_RATE, 'triệu VNĐ')}</p>
        </div>
    );
});
MonthlySalaryContent.displayName = 'MonthlySalaryContent';


export const FilterSidebar = ({ filters, onFilterChange, onApply, onReset, resultCount }: FilterSidebarProps) => {
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);
    const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
    const [isFlexibleDate, setIsFlexibleDate] = useState(false);
    
    const { jobCountsByRegion, jobCountsByPrefecture } = useMemo(() => {
        const countsByPrefecture: { [key: string]: number } = {};
        const countsByRegion: { [key: string]: number } = {};

        // Initialize all known prefectures and regions to 0
        Object.values(locations["Nhật Bản"]).flat().forEach(p => {
            if (typeof p === 'string' && !countsByPrefecture[p]) countsByPrefecture[p] = 0;
        });
         Object.keys(locations["Nhật Bản"]).forEach(r => {
            if (!countsByRegion[r]) countsByRegion[r] = 0;
        });

        for (const job of jobData) {
            const prefecture = job.workLocation;
            if (prefecture && countsByPrefecture.hasOwnProperty(prefecture)) {
                countsByPrefecture[prefecture]++;
            }
        }
        
        for (const region in locations["Nhật Bản"]) {
            const prefecturesInRegion = locations["Nhật Bản"][region as keyof typeof locations["Nhật Bản"]];
            countsByRegion[region] = prefecturesInRegion.reduce((sum, p) => sum + (countsByPrefecture[p] || 0), 0);
        }

        return { jobCountsByRegion: countsByRegion, jobCountsByPrefecture: countsByPrefecture };
    }, []);

    const showGinouFilter = useMemo(() => 
        ['dac-dinh-dau-viet', 'dac-dinh-dau-nhat'].includes(filters.visaDetail || ''),
    [filters.visaDetail]);

    const showArrivalTimeFilter = useMemo(() => 
        ['thuc-tap-sinh-3-go', 'dac-dinh-dau-nhat', 'ky-su-tri-thuc-dau-nhat'].includes(filters.visaDetail || ''),
    [filters.visaDetail]);

    const availableConditions = useMemo(() => {
        if (!filters.visaDetail) {
            return allSpecialConditions;
        }
        return conditionsByVisaDetail[filters.visaDetail] || [];
    }, [filters.visaDetail]);


    useEffect(() => {
        const parentVisaSlug = filters.visa || Object.keys(industriesByJobType).find(key => 
            visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType]?.some(detail => detail.slug === filters.visaDetail)
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


    const handleJobTypeChange = (value: string) => {
        onFilterChange({ visa: value, visaDetail: '', industry: '', jobDetail: '' });
    }
    
     const handleVisaDetailChange = (value: string) => {
        const newFilters: Partial<SearchFilters> = { visaDetail: value };
        const parentType = Object.keys(visaDetailsByVisaType).find(key => visaDetailsByVisaType[key].some(detail => detail.slug === value));
        if (parentType && filters.visa !== parentType) {
            newFilters.visa = parentType;
            newFilters.industry = '';
            newFilters.jobDetail = '';
        }
        
        const vietnamVisas = ["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam", "dac-dinh-dau-viet", "dac-dinh-di-moi", "ky-su-tri-thuc-dau-viet"];
        const japanVisas = ["thuc-tap-sinh-3-go", "dac-dinh-dau-nhat", "ky-su-tri-thuc-dau-nhat"];

        if (vietnamVisas.includes(value) && filters.interviewLocation && !locations['Việt Nam'].includes(filters.interviewLocation)) {
            newFilters.interviewLocation = ''; 
        } else if (japanVisas.includes(value) && filters.interviewLocation && !locations['Phỏng vấn tại Nhật Bản'].includes(filters.interviewLocation)) {
             newFilters.interviewLocation = '';
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
                    {locations['Việt Nam'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectGroup>
            );
        }

        if (filters.visaDetail && japanVisas.includes(filters.visaDetail)) {
            return (
                 <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                    {locations['Phỏng vấn tại Nhật Bản'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectGroup>
            );
        }

        // Default case: show all
        return (
            <>
                <SelectGroup>
                        <SelectLabel>Việt Nam</SelectLabel>
                        {locations['Việt Nam'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectGroup>
                    <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                        {locations['Phỏng vấn tại Nhật Bản'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectGroup>
            </>
        )
    }

    const salaryLimits: { [key: string]: number } = {
        'basicSalary': 10000000,
        'netSalary': 10000000,
        'hourlySalary': 15000,
        'annualIncome': 30000000,
        'annualBonus': 5000000,
    };
    
    const handleSalaryInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SearchFilters) => {
        const rawValue = e.target.value;
        let num = Number(rawValue.replace(/[^0-9]/g, ''));

        if (isNaN(num)) {
            onFilterChange({ [field]: '' });
            return;
        }

        let limit = salaryLimits[field as keyof typeof salaryLimits];
        if (field === 'netFee') {
            switch (filters.visaDetail) {
                case 'thuc-tap-sinh-1-nam':
                    limit = 1400;
                    break;
                case 'dac-dinh-dau-viet':
                    limit = 2500;
                    break;
                default:
                    limit = 3800;
                    break;
            }
        }
        
        if (limit && num > limit) {
            num = limit;
        }

        onFilterChange({ [field]: String(num) });
    };

    const getDisplayValue = (value: string | undefined) => {
        if (!value) return '';
        const num = Number(value.replace(/[^0-9]/g, ''));
        if (isNaN(num)) return '';
        return num.toLocaleString('ja-JP');
    };
    
    const getFeePlaceholder = () => {
        switch (filters.visaDetail) {
            case 'thuc-tap-sinh-1-nam':
                return "1000";
            case 'dac-dinh-dau-viet':
                return "1600";
            default:
                return "3000";
        }
    };
    
    const getFeeLabel = () => {
        switch (filters.visaDetail) {
            case 'thuc-tap-sinh-3-nam':
            case 'thuc-tap-sinh-1-nam':
                return 'Phí và học phí tối đa';
            case 'dac-dinh-dau-viet':
                return 'Phí và vé máy bay tối đa';
            case 'dac-dinh-di-moi':
            case 'ky-su-tri-thuc-dau-viet':
                return 'Phí, học phí và vé tối đa';
            default:
                return 'Phí tối đa (USD)';
        }
    };

    const visasToHideTattoo = ['ky-su-tri-thuc-dau-viet', 'ky-su-tri-thuc-dau-nhat'];
    const showTattooFilter = !visasToHideTattoo.includes(filters.visaDetail || '');
    
    const showEducationFilter = useMemo(() => {
        const visasToShow = ['ky-su-tri-thuc-dau-viet', 'ky-su-tri-thuc-dau-nhat'];
        // Show if no specific visa is selected OR if the selected visa is one of the engineer visas
        return !filters.visaDetail || visasToShow.includes(filters.visaDetail);
    }, [filters.visaDetail]);
    
    const showEnglishLevelFilter = useMemo(() => {
        const isEngineerVisa = ['ky-su-tri-thuc-dau-viet', 'ky-su-tri-thuc-dau-nhat'].includes(filters.visaDetail || '');
        const isTokuteiServiceIndustry = 
            filters.visa === 'ky-nang-dac-dinh' && 
            ['nha-hang-tokutei', 'hang-khong-tokutei', 've-sinh-toa-nha-tokutei', 'luu-tru-khach-san-tokutei'].includes(filters.industry || '');
        
        return isEngineerVisa || isTokuteiServiceIndustry;
    }, [filters.visaDetail, filters.visa, filters.industry]);
    
    const shouldShowLươngGiờ = !["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam"].includes(filters.visaDetail || "");
    const shouldShowLươngNăm = !["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam"].includes(filters.visaDetail || "");
    const shouldShowTabs = shouldShowLươngGiờ || shouldShowLươngNăm;
    
    const showFeeFilter = useMemo(() => {
        const visasToShowFee = ['thuc-tap-sinh-3-nam', 'thuc-tap-sinh-1-nam', 'dac-dinh-dau-viet', 'dac-dinh-di-moi', 'ky-su-tri-thuc-dau-viet'];
        return !!filters.visaDetail && visasToShowFee.includes(filters.visaDetail);
    }, [filters.visaDetail]);

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
                                    <Select value={filters.visaDetail} onValueChange={handleVisaDetailChange}>
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
                                    <Select value={filters.jobDetail} onValueChange={(value) => onFilterChange({ jobDetail: value })} disabled={!filters.industry}>
                                        <SelectTrigger className={cn(filters.jobDetail && 'text-primary')}><SelectValue placeholder="Chọn công việc"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all-details">Tất cả công việc</SelectItem>
                                            {availableJobDetails.map(detail => <SelectItem key={detail} value={detail}>{detail}</SelectItem>)}
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
                                            {filters.location.map(loc => (
                                               <span key={loc} className='bg-primary/20 text-primary-dark font-medium px-2 py-0.5 rounded'>{loc}</span>
                                            ))}
                                         </div>
                                      )}
                                   </div>
                                   <Accordion type="multiple" className="w-full">
                                    {Object.entries(locations['Nhật Bản']).map(([region, prefectures]) => (
                                        <AccordionItem key={region} value={region}>
                                            <div className="flex items-center gap-2 py-2 text-sm hover:no-underline" >
                                                <Checkbox
                                                    id={`region-${region}`}
                                                    checked={Array.isArray(filters.location) && (prefectures as string[]).every(p => filters.location.includes(p))}
                                                    onCheckedChange={(checked) => {
                                                        const currentSelection = new Set(Array.isArray(filters.location) ? filters.location : []);
                                                        if (checked) {
                                                            (prefectures as string[]).forEach(p => currentSelection.add(p));
                                                        } else {
                                                            (prefectures as string[]).forEach(p => currentSelection.delete(p));
                                                        }
                                                        onFilterChange({ location: Array.from(currentSelection) });
                                                    }}
                                                />
                                                <AccordionTrigger className="flex-1 p-0 hover:no-underline">
                                                    <Label htmlFor={`region-${region}`} className="flex-grow text-left font-semibold cursor-pointer flex justify-between w-full">
                                                        <span>Vùng {region}</span>
                                                        <span className="text-muted-foreground text-xs ml-1">{jobCountsByRegion[region] || 0} việc</span>
                                                    </Label>
                                                </AccordionTrigger>
                                            </div>
                                            <AccordionContent className="pl-6 space-y-2">
                                                {(prefectures as string[]).map((prefecture: string) => (
                                                    <div key={prefecture} className="flex items-center gap-2">
                                                         <Checkbox
                                                            id={`pref-${prefecture}`}
                                                            checked={Array.isArray(filters.location) && filters.location.includes(prefecture)}
                                                            onCheckedChange={(checked) => {
                                                                const currentSelection = new Set(Array.isArray(filters.location) ? filters.location : []);
                                                                if (checked) {
                                                                    currentSelection.add(prefecture);
                                                                } else {
                                                                    currentSelection.delete(prefecture);
                                                                }
                                                                onFilterChange({ location: Array.from(currentSelection) });
                                                            }}
                                                        />
                                                        <Label htmlFor={`pref-${prefecture}`} className="flex w-full items-center justify-between font-normal cursor-pointer">
                                                            <span>{prefecture}</span>
                                                            <span className="text-muted-foreground text-xs ml-1">{jobCountsByPrefecture[prefecture] || 0}</span>
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
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn số vòng" /></SelectTrigger>
                                        <SelectContent>
                                            {interviewRoundsOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Phỏng vấn từ giờ đến</Label>
                                     <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !filters.interviewDate && "text-muted-foreground",
                                                    filters.interviewDate && filters.interviewDate !== 'flexible' && "text-primary"
                                                )}
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
                                                    onChange={(e) => handleSalaryInputChange(e, 'hourlySalary')}
                                                    value={getDisplayValue(filters.hourlySalary)} 
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
                                                        onChange={(e) => handleSalaryInputChange(e, 'annualIncome')}
                                                        value={getDisplayValue(filters.annualIncome)} 
                                                    />
                                                        <p className="text-xs text-muted-foreground">{getConvertedValue(filters.annualIncome, 'VD: 3,000,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="annual-bonus-jpy">Thưởng năm (JPY)</Label>
                                                    <Input 
                                                        id="annual-bonus-jpy" 
                                                        type="text" 
                                                        placeholder="VD: 500,000" 
                                                        onChange={(e) => handleSalaryInputChange(e, 'annualBonus')}
                                                        value={getDisplayValue(filters.annualBonus)} 
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
                        
                         <AccordionItem value="netSalary">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-500"/>Thực lĩnh</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="net-salary-jpy">Thực lĩnh tối thiểu (JPY/tháng)</Label>
                                    <Input 
                                        id="net-salary-jpy" 
                                        type="text" 
                                        placeholder="VD: 160,000" 
                                        onChange={(e) => handleSalaryInputChange(e, 'netSalary')}
                                        value={getDisplayValue(filters.netSalary)} 
                                    />
                                    <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netSalary, 'VD: 160,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {showFeeFilter && (
                            <AccordionItem value="netFee">
                                <AccordionTrigger className="text-base font-semibold">
                                    <span className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-red-500"/>Mức phí</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="net-fee-usd">{getFeeLabel()}</Label>
                                        <Input 
                                            id="net-fee-usd" 
                                            type="text" 
                                            placeholder={getFeePlaceholder()}
                                            onChange={(e) => handleSalaryInputChange(e, 'netFee')}
                                            value={getDisplayValue(filters.netFee)} 
                                        />
                                        <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netFee, getFeePlaceholder(), USD_VND_RATE, 'triệu VNĐ')}</p>
                                    </div>
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
                                            {allJobDetailsForExperience.map(jobDetail => <SelectItem key={jobDetail} value={jobDetail}>{jobDetail}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Số năm kinh nghiệm</Label>
                                     <Select value={filters.yearsOfExperience} onValueChange={(value) => onFilterChange({ yearsOfExperience: value })}>
                                        <SelectTrigger><SelectValue placeholder="Chọn số năm" /></SelectTrigger>
                                        <SelectContent>
                                            {experienceYears.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
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
                                    <div className="flex items-center space-x-4 pt-2">
                                         {['Nam', 'Nữ', 'Cả hai'].map(item => (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox id={`gender-${item}`} />
                                                <Label htmlFor={`gender-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                            </div>
                                        ))}
                                    </div>
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
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn yêu cầu thị lực" /></SelectTrigger>
                                        <SelectContent>
                                            {visionRequirements.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {showTattooFilter && (
                                <div className="space-y-2">
                                    <Label className="font-semibold">Yêu cầu hình xăm</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn yêu cầu" /></SelectTrigger>
                                        <SelectContent>
                                            {tattooRequirements.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="font-semibold">Trình độ tiếng Nhật</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                                        <SelectContent>
                                            {languageLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {showEnglishLevelFilter && (
                                 <div className="space-y-2">
                                    <Label className="font-semibold">Trình độ tiếng Anh</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                                        <SelectContent>
                                            {englishLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                {showEducationFilter && (
                                 <div className="space-y-2">
                                    <Label className="font-semibold">Học vấn</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn học vấn" /></SelectTrigger>
                                        <SelectContent>
                                            {educationLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="font-semibold">Tay thuận</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn tay thuận" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="right">Tay phải</SelectItem>
                                            <SelectItem value="left">Tay trái</SelectItem>
                                            <SelectItem value="both">Cả hai tay</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label className="font-semibold pt-2">Yêu cầu năng lực khác</Label>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-2">
                                      {otherSkills.map(skill => (
                                        <div key={skill} className="flex items-center space-x-2">
                                            <Checkbox id={`skill-${skill}`} />
                                            <Label htmlFor={`skill-${skill}`} className="font-normal text-sm cursor-pointer">{skill}</Label>
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
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn thời điểm" /></SelectTrigger>
                                        <SelectContent>
                                            {getFutureMonths().map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Ca làm việc</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn ca làm việc" /></SelectTrigger>
                                        <SelectContent>
                                            {workShifts.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
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
                                    <div key={item} className="flex items-center space-x-2">
                                        <Checkbox id={`cond-${item}`} />
                                        <Label htmlFor={`cond-${item}`} className="font-normal cursor-pointer">{item}</Label>
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

    
