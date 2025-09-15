

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
const visionRequirements = [
    "Không yêu cầu",
    "Yêu cầu thị lực tốt",
    "Không nhận cận thị",
    "Không nhận viễn thị",
    "Không nhận loạn thị",
    "Không nhận mù màu",
    "Yêu cầu thị lực rất tốt",
    "20/20", "10/10", "8/10"
];
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
    for (let i = 1; i <= 12; i++) {
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

    const showHourlyWage = ["Đặc định đầu Việt", "Đặc định đầu Nhật", "Đặc định đi mới"].includes(filters.visaDetail || '');
    const showYearlyWage = [
        "Đặc định đầu Việt", "Đặc định đầu Nhật", "Đặc định đi mới", 
        "Thực tập sinh 3 Go", 
        "Kỹ sư, tri thức đầu Việt", "Kỹ sư, tri thức đầu Nhật"
    ].includes(filters.visaDetail || '');
    
    const JPY_VND_RATE = 180;
    
    const showSalaryTabs = showHourlyWage || showYearlyWage;
    
    const isNewcomerVisa = ["Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Đặc định đi mới"].includes(filters.visaDetail || '');

    const handleSalaryInputChange = (value: string, currency: 'vnd' | 'jpy') => {
        let num = parseInt(value.replace(/[.,]/g, ''));
        if (isNaN(num)) num = 0;
        const baseValue = currency === 'vnd' ? String(Math.round(num / JPY_VND_RATE)) : String(num);
        // This assumes you have a way to update the filter state, e.g., onFilterChange({ basicSalary: baseValue });
    };

    const getDisplayValue = (value: string | undefined, currency: 'vnd' | 'jpy') => {
        if (!value) return '';
        const num = Number(value);
        if (isNaN(num) || num === 0) return '';
        const valueToFormat = currency === 'vnd' ? Math.round(num * JPY_VND_RATE) : num;
        return valueToFormat.toLocaleString(currency === 'vnd' ? 'vi-VN' : 'ja-JP');
    };
    
    const getConvertedValue = (value: string | undefined, currency: 'vnd' | 'jpy') => {
        if (!value) return '';
        const num = Number(value);
        if (isNaN(num) || num === 0) return '';
        if (currency === 'vnd') {
            return `≈ ${num.toLocaleString('ja-JP')} JPY`;
        }
        
        const vndValueInMillions = (num * JPY_VND_RATE) / 1000000;
        const formattedVnd = vndValueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `≈ ${formattedVnd} triệu đồng`;
    };

    const monthlySalaryContent = (
      <div className="space-y-2">
        <Label htmlFor="basic-salary-jpy">Lương cơ bản (JPY/tháng)</Label>
        <Input id="basic-salary-jpy" type="text" placeholder="VD: 200,000" onChange={(e) => onFilterChange({ basicSalary: e.target.value.replace(/,/g, '') })} value={filters.basicSalary?.toLocaleString('ja-JP') || ''} />
        {filters.basicSalary && <p className="text-xs text-muted-foreground">{getConvertedValue(filters.basicSalary, 'jpy')}</p>}
      </div>
    );
    
    const netSalaryContent = (
       <div className="space-y-2">
        <Label htmlFor="net-salary-jpy">Thực lĩnh (JPY/tháng)</Label>
        <Input id="net-salary-jpy" type="text" placeholder="VD: 160,000" onChange={(e) => onFilterChange({ netSalary: e.target.value.replace(/,/g, '') })} value={filters.netSalary?.toLocaleString('ja-JP') || ''} />
         {filters.netSalary && <p className="text-xs text-muted-foreground">{getConvertedValue(filters.netSalary, 'jpy')}</p>}
      </div>
    );
    
    const showTattooFilter = !['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật'].includes(filters.visaDetail || '');
    const showJapaneseLevelFilter = !['Thực tập sinh 1 năm', 'Thực tập sinh 3 năm'].includes(filters.visaDetail || '');
    const showEnglishLevelFilter = (() => {
        const engineerVisas = ["Kỹ sư, tri thức đầu Việt", "Kỹ sư, tri thức đầu Nhật"];
        const serviceIndustries = ["Nhà hàng", "Hàng không", "Vệ sinh toà nhà", "Lưu trú, khách sạn"];
        const tokuteiVisas = ["Đặc định đầu Việt", "Đặc định đầu Nhật", "Đặc định đi mới"];

        if (engineerVisas.includes(filters.visaDetail || '')) {
            return true;
        }

        if (tokuteiVisas.includes(filters.visaDetail || '') && serviceIndustries.includes(filters.industry || '')) {
            return true;
        }

        return false;
    })();
    const showEducationFilter = ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật'].includes(filters.visaDetail || '');


    return (
        <div className="md:col-span-1 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><SlidersHorizontal/> Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={['jobType', 'location', 'industry', 'requirements']} className="w-full">
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
                                <span className="flex items-center gap-2"><Building className="h-5 w-5"/>Ngành nghề & Công việc</span>
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
                                <span className="flex items-center gap-2"><MapPin className="h-5 w-5"/>Phỏng vấn, tuyển tại</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Select value={filters.interviewLocation} onValueChange={(value) => onFilterChange({ interviewLocation: value })}>
                                        <SelectTrigger className={cn(filters.interviewLocation && filters.interviewLocation !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all">Tất cả địa điểm</SelectItem>
                                            {renderInterviewLocations()}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="salary">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5"/>Lương & Phúc lợi</span>
                            </AccordionTrigger>
                             <AccordionContent className="pt-2">
                                <div className="pt-4 space-y-4">{monthlySalaryContent}</div>
                            </AccordionContent>
                        </AccordionItem>
                        
                         <AccordionItem value="netSalary">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-600"/>Thực lĩnh</span>
                            </AccordionTrigger>
                             <AccordionContent className="pt-2">
                                <div className="pt-4 space-y-4">{netSalaryContent}</div>
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
                                        defaultValue={filters.age || [18, 36]}
                                        min={18}
                                        max={60}
                                        step={1}
                                        onValueChange={(value) => onFilterChange({ age: value as [number, number] })}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{filters.age?.[0] || 18} tuổi</span>
                                        <span>{filters.age?.[1] || 36} tuổi</span>
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
                                {showJapaneseLevelFilter && (
                                <div>
                                    <Label className="font-semibold">Trình độ tiếng Nhật</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                                        <SelectContent>
                                            {languageLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                )}
                                {showEnglishLevelFilter && (
                                 <div>
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
                                 <div>
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
                                <div>
                                    <Label className="font-semibold">Kinh nghiệm</Label>
                                     <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn số năm kinh nghiệm" /></SelectTrigger>
                                        <SelectContent>
                                            {experienceYears.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
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
                                <div>
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
                                    <Label>Số vòng phỏng vấn</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn số vòng" /></SelectTrigger>
                                        <SelectContent>
                                            {interviewRoundsOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
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
