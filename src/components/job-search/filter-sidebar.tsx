

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
import { Briefcase, Check, DollarSign, Dna, MapPin, SlidersHorizontal, Star, UserSearch, Weight, Building, FileText, Calendar, Camera, Ruler, Languages } from "lucide-react";
import { locations } from "@/lib/location-data";
import { type SearchFilters } from './search-results';
import { cn } from '@/lib/utils';

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

const specialConditions = [
    'Hỗ trợ Ginou 2', 'Hỗ trợ chỗ ở', 'Cặp đôi', 'Lương tốt', 'Tăng ca', 'Có thưởng', 'Nợ phí', 'Bay nhanh', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Không yêu cầu kinh nghiệm', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Nhận visa katsudo'
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
const visionRequirements = ["Không yêu cầu", "Yêu cầu thị lực tốt", "Không mù màu", "20/20", "10/10", "8/10"];

const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

interface FilterSidebarProps {
    filters: SearchFilters;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    onApply: () => void;
}

export const FilterSidebar = ({ filters, onFilterChange, onApply }: FilterSidebarProps) => {
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);

    useEffect(() => {
        if (filters.industry) {
            const selectedIndustryData = allIndustries.find(ind => ind.name === filters.industry);
            setAvailableJobDetails(selectedIndustryData?.keywords || []);
        } else {
            setAvailableJobDetails([]);
        }
        // Don't reset jobDetail here, let it be controlled by the parent state
    }, [filters.industry]);

    const handleJobTypeChange = (value: string) => {
        onFilterChange({ visa: value, visaDetail: '' });
    }
    
     const handleVisaDetailChange = (value: string) => {
        const newFilters: Partial<SearchFilters> = { visaDetail: value };
        const parentType = Object.keys(visaDetailsByVisaType).find(key => visaDetailsByVisaType[key].includes(value));
        if (parentType && filters.visa !== parentType) {
            newFilters.visa = parentType;
        }
        onFilterChange(newFilters);
    };

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
                                    <Label>Loại visa</Label>
                                    <Select value={filters.visa} onValueChange={handleJobTypeChange}>
                                        <SelectTrigger className={cn(filters.visa && filters.visa !== 'all' && 'text-primary')}>
                                            <SelectValue placeholder="Tất cả loại hình"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả loại hình</SelectItem>
                                            {japanJobTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                            {allIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chi tiết công việc</Label>
                                     <Select value={filters.jobDetail} onValueChange={(value) => onFilterChange({ jobDetail: value })} disabled={!filters.industry || availableJobDetails.length === 0}>
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
                                            <SelectGroup>
                                                 <SelectLabel>Việt Nam</SelectLabel>
                                                 {locations['Việt Nam'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}
                                            </SelectGroup>
                                             <SelectGroup>
                                                <SelectLabel>Nhật Bản</SelectLabel>
                                                 {locations['Phỏng vấn tại Nhật Bản'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                             </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="basic-salary">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5"/>Lương cơ bản (JPY/tháng)</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div>
                                    <Slider defaultValue={[160000, 300000]} max={500000} step={10000} />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>16万</span>
                                        <span>50万</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="net-salary">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5"/>Thực lĩnh (JPY/tháng)</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div>
                                    <Slider defaultValue={[140000, 250000]} max={450000} step={10000} />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>14万</span>
                                        <span>45万</span>
                                    </div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label htmlFor="age-from">Tuổi từ</Label><Input id="age-from" type="number" placeholder="18" /></div>
                                    <div><Label htmlFor="age-to">đến</Label><Input id="age-to" type="number" placeholder="40" /></div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height-from">Chiều cao từ (cm)</Label>
                                    <Input id="height-from" type="number" placeholder="150" min="135" max="210" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight-from">Cân nặng từ (kg)</Label>
                                    <Input id="weight-from" type="number" placeholder="45" />
                                </div>
                                
                                <div>
                                    <Label className="font-semibold">Trình độ tiếng Nhật</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                                        <SelectContent>
                                            {languageLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div>
                                    <Label className="font-semibold">Trình độ tiếng Anh</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                                        <SelectContent>
                                            {englishLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div>
                                    <Label className="font-semibold">Học vấn</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn học vấn" /></SelectTrigger>
                                        <SelectContent>
                                            {educationLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="font-semibold">Yêu cầu kinh nghiệm</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn ngành nghề"/></SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {allIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
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
                                    <Label className="font-semibold">Yêu cầu thị lực</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn yêu cầu thị lực" /></SelectTrigger>
                                        <SelectContent>
                                            {visionRequirements.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="font-semibold">Yêu cầu hình xăm</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn yêu cầu" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Không nhận hình xăm</SelectItem>
                                            <SelectItem value="small">Nhận xăm nhỏ (kín)</SelectItem>
                                            <SelectItem value="all">Nhận cả xăm to (lộ)</SelectItem>
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
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="specialConditions" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">
                               <span className="flex items-center gap-2"><Star className="h-5 w-5"/>Điều kiện đặc biệt</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-4">
                                {specialConditions.map(item => (
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
 
