

'use client';

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { industriesByJobType, type Industry } from "@/lib/industry-data";
import { Briefcase, Check, DollarSign, Dna, MapPin, SlidersHorizontal, Star, UserSearch, Weight, Building, FileText, Calendar, Camera, Ruler, Languages, Clock, ListChecks } from "lucide-react";
import { locations } from "@/lib/location-data";
import { type SearchFilters } from './search-results';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const japanJobTypes = [
    'Thực tập sinh kỹ năng',
    'Kỹ năng đặc định',
    'Kỹ sư, tri thức'
];

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};

const allSpecialConditions = [
  'Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi',
  'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng',
  'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo', 'Không nhận visa katsudo',
  'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình',
  'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng',
  'Nhận bằng Senmon', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền',
  'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé',
  'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'
];

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
const visionRequirements = ["Yêu cầu thị lực rất tốt", "Yêu cầu thị lực tốt", "Không yêu cầu thị lực", "Không nhận cận thị", "Không nhận viễn thị", "Không nhận loạn thị", "Không nhận mù màu"];
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

interface FilterSidebarProps {
    filters: SearchFilters;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    onApply: () => void;
}

export const FilterSidebar = ({ filters, onFilterChange, onApply }: FilterSidebarProps) => {
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);
    const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
    const [isFlexibleDate, setIsFlexibleDate] = useState(false);


    useEffect(() => {
        const industries = filters.visa ? (industriesByJobType[filters.visa as keyof typeof industriesByJobType] || allIndustries) : allIndustries;
        const uniqueIndustries = Array.from(new Map(industries.map(item => [item.name, item])).values());
        setAvailableIndustries(uniqueIndustries);

        if (filters.industry && filters.industry !== 'all') {
            const selectedIndustryData = allIndustries.find(ind => ind.name === filters.industry);
            setAvailableJobDetails(selectedIndustryData?.keywords || []);
        } else {
             const allJobDetails = uniqueIndustries.flatMap(ind => ind.keywords);
             setAvailableJobDetails([...new Set(allJobDetails)]);
        }

    }, [filters.visa, filters.industry]);

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
            // If user unchecks it, revert to empty or previous date.
            // For simplicity, we'll clear it.
            onFilterChange({ interviewDate: '' });
        }
    };


    const handleJobTypeChange = (value: string) => {
        onFilterChange({ visa: value, visaDetail: '', industry: '', jobDetail: '' });
    }
    
     const handleVisaDetailChange = (value: string) => {
        const newFilters: Partial<SearchFilters> = { visaDetail: value };
        const parentType = Object.keys(visaDetailsByVisaType).find(key => visaDetailsByVisaType[key].includes(value));
        if (parentType && filters.visa !== parentType) {
            newFilters.visa = parentType;
            newFilters.industry = '';
            newFilters.jobDetail = '';
        }
        
        const vietnamVisas = ["Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Đặc định đầu Việt", "Đặc định đi mới", "Kỹ sư, tri thức đầu Việt"];
        const japanVisas = ["Thực tập sinh 3 Go", "Đặc định đầu Nhật", "Kỹ sư, tri thức đầu Nhật"];

        if (vietnamVisas.includes(value) && !locations['Việt Nam'].includes(filters.interviewLocation || '')) {
            newFilters.interviewLocation = ''; 
        } else if (japanVisas.includes(value) && !locations['Phỏng vấn tại Nhật Bản'].includes(filters.interviewLocation || '')) {
             newFilters.interviewLocation = '';
        }

        onFilterChange(newFilters);
    };

    const renderInterviewLocations = () => {
        const vietnamVisas = ["Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Đặc định đầu Việt", "Đặc định đi mới", "Kỹ sư, tri thức đầu Việt"];
        const japanVisas = ["Thực tập sinh 3 Go", "Đặc định đầu Nhật", "Kỹ sư, tri thức đầu Nhật"];
        
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
        'Thực tập sinh kỹ năng': 500000,
        'Kỹ năng đặc định': 1500000,
        'Kỹ sư, tri thức': 10000000,
    };
    
    const handleSalaryInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SearchFilters) => {
        const rawValue = e.target.value;
        const numericValue = parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
        
        if (isNaN(numericValue)) {
            onFilterChange({ [field]: '' });
            return;
        }

        const limit = salaryLimits[filters.visa as keyof typeof salaryLimits] || 10000000;
        const clampedValue = Math.min(numericValue, limit);
        
        onFilterChange({ [field]: String(clampedValue) });
    };

    const getDisplayValue = (value: string | undefined) => {
        if (!value) return '';
        const num = Number(value);
        if (isNaN(num)) return '';
        return num.toLocaleString('ja-JP');
    };
    
    const JPY_VND_RATE = 180;

    const getConvertedValue = (value: string | undefined) => {
        if (!value) return '';
        const num = Number(value);
        if (isNaN(num) || num === 0) return '';
        
        const vndValueInMillions = (num * JPY_VND_RATE) / 1000000;
        if (vndValueInMillions % 1 === 0) {
            return `≈ ${vndValueInMillions.toLocaleString('vi-VN')} triệu đồng`;
        }
        
        const formattedVnd = vndValueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `≈ ${formattedVnd} triệu đồng`;
    };
    
    const showTattooFilter = !['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật'].includes(filters.visaDetail || '');

    const getAvailableSpecialConditions = () => {
        const visaDetail = filters.visaDetail || '';
        
        let conditionsToHide: string[] = [];

        const nonApplicableForMost = ['Nhóm ngành 1', 'Nhóm ngành 2', 'Hỗ trợ Ginou 2'];
        const nonApplicableVisasForMost = [
            "Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Thực tập sinh 3 Go",
            "Kỹ sư, tri thức đầu Việt", "Kỹ sư, tri thức đầu Nhật"
        ];
        if (nonApplicableVisasForMost.includes(visaDetail)) {
            conditionsToHide.push(...nonApplicableForMost);
        }

        const nonApplicableForTrainee = [
            'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo',
            'Không nhận visa katsudo', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại',
            'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono',
            'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé'
        ];
        const traineeVisas = ["Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Thực tập sinh 3 Go"];
        if (traineeVisas.includes(visaDetail)) {
             conditionsToHide.push(...nonApplicableForTrainee);
        }

        if (traineeVisas.includes(visaDetail)) {
            conditionsToHide.push('Nhận nhiều loại bằng');
        }

        const tokuteiVisas = ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'];
        if (tokuteiVisas.includes(visaDetail)) {
            conditionsToHide.push('Nhận nhiều loại bằng', 'Nhận bằng Senmon');
        }
        
        const engineerVisas = ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật'];
        if (engineerVisas.includes(visaDetail)) {
            conditionsToHide.push('Yêu cầu mặc Kimono');
        }
        
        return allSpecialConditions.filter(cond => !conditionsToHide.includes(cond));
    };

    const showEnglishLevelFilter = ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật'].includes(filters.visaDetail || '');
    const showEducationFilter = !['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'].includes(filters.visaDetail || '');
    
    const shouldShowLươngGiờ = !["Thực tập sinh 3 năm", "Thực tập sinh 1 năm"].includes(filters.visaDetail || "");
    const shouldShowLươngNăm = !["Thực tập sinh 3 năm", "Thực tập sinh 1 năm"].includes(filters.visaDetail || "");

    return (
        <div className="md:col-span-1 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><SlidersHorizontal/> Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={['jobType', 'location', 'industry', 'requirements', 'interviewLocation', 'process', 'salary', 'netSalary']} className="w-full">
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
                                                <SelectGroup key={type}>
                                                    <SelectLabel>{type}</SelectLabel>
                                                    {(visaDetailsByVisaType[type] || []).map(detail => (
                                                        <SelectItem key={detail} value={detail}>{detail}</SelectItem>
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
                                            {availableIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chi tiết công việc</Label>
                                     <Select value={filters.jobDetail} onValueChange={(value) => onFilterChange({ jobDetail: value })}>
                                        <SelectTrigger className={cn(filters.jobDetail && 'text-primary')}><SelectValue placeholder="Chọn công việc chi tiết"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
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
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Select value={filters.location} onValueChange={(value) => onFilterChange({ location: value })}>
                                        <SelectTrigger className={cn(filters.location && filters.location !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all">Tất cả Nhật Bản</SelectItem>
                                            {Object.entries(locations['Nhật Bản']).map(([region, prefectures]) => (
                                                <SelectGroup key={region}>
                                                    <SelectLabel>{region}</SelectLabel>
                                                    {region !== 'Hokkaido' && region !== 'Okinawa' && (
                                                        <SelectItem value={region}>Toàn bộ vùng {region}</SelectItem>
                                                    )}
                                                    {(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <Label>Ngày phỏng vấn</Label>
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
                                <Tabs defaultValue="basic">
                                    <TabsList className={cn("grid w-full h-auto", (shouldShowLươngGiờ && shouldShowLươngNăm) ? "grid-cols-3" : "grid-cols-2")}>
                                        <TabsTrigger value="basic" className="text-xs">Lương tháng</TabsTrigger>
                                        {shouldShowLươngGiờ && <TabsTrigger value="hourly" className="text-xs">Lương giờ</TabsTrigger>}
                                        {shouldShowLươngNăm && <TabsTrigger value="yearly" className="text-xs">Lương năm</TabsTrigger>}
                                    </TabsList>
                                    <TabsContent value="basic" className="pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="basic-salary-jpy">Lương cơ bản (JPY/tháng)</Label>
                                            <Input 
                                                id="basic-salary-jpy" 
                                                type="text" 
                                                placeholder="VD: 200,000" 
                                                onChange={(e) => handleSalaryInputChange(e, 'basicSalary')}
                                                value={getDisplayValue(filters.basicSalary)} 
                                            />
                                            <p className="text-xs text-muted-foreground">{getConvertedValue(filters.basicSalary)}</p>
                                        </div>
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
                                            <p className="text-xs text-muted-foreground">{getConvertedValue(filters.hourlySalary)}</p>
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
                                                    <p className="text-xs text-muted-foreground">{getConvertedValue(filters.annualIncome)}</p>
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
                                                    <p className="text-xs text-muted-foreground">{getConvertedValue(filters.annualBonus)}</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
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
                                    <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netSalary)}</p>
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
                                    <Label>Yêu cầu kinh nghiệm</Label>
                                    <Select value={filters.jobDetail} onValueChange={(value) => onFilterChange({ jobDetail: value })}>
                                        <SelectTrigger className={cn(filters.jobDetail && 'text-primary')}><SelectValue placeholder="Chọn chi tiết công việc"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {availableJobDetails.map(detail => <SelectItem key={detail} value={detail}>{detail}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold">Kinh nghiệm</Label>
                                     <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn số năm kinh nghiệm" /></SelectTrigger>
                                        <SelectContent>
                                            {experienceYears.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                <div className="space-y-2">
                                    <Label>Yêu cầu hạn Ginou còn</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn thời gian" /></SelectTrigger>
                                        <SelectContent>
                                            {ginouExpiryOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Yêu cầu thời điểm về công ty</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn thời điểm" /></SelectTrigger>
                                        <SelectContent>
                                            {getFutureMonths().map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ca làm việc</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn ca làm việc" /></SelectTrigger>
                                        <SelectContent>
                                            {workShifts.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="specialConditions" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">
                               <span className="flex items-center gap-2"><Star className="h-5 w-5"/>Điều kiện đặc biệt</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-4">
                                {allSpecialConditions.map(item => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <Checkbox id={`cond-${item}`} />
                                        <Label htmlFor={`cond-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                     <Button className="w-full bg-primary text-white mt-6" onClick={onApply}>Áp dụng bộ lọc</Button>
                </CardContent>
            </Card>
        </div>
    );
}
