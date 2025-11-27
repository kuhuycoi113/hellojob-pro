'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CAREERS, industriesByJobType, type Industry } from "@/lib/industry-data";
import { Briefcase, Check, DollarSign, Dna, MapPin, SlidersHorizontal, Star, UserSearch, Weight, Building, FileText, Calendar, Camera, Ruler, Languages, Clock, ListChecks, Trash2, Search, ListFilter, X } from "lucide-react";
import { interviewLocations } from '@/lib/location-data';
import { type SearchFilters, experienceYears } from './search-results';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '../ui/badge';
import { japanJobTypes, visaDetailsByVisaType, workShifts, allSpecialConditions, otherSkills, dominantHands, educationLevels, englishLevels, visionRequirements, tattooRequirements } from '@/lib/visa-data';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import JOBS from '@/lib/jobs.json';
import PROVINCES from "@/lib/provinces.json";
import LANGUAGE_LEVEL from '@/lib/language_level.json';
import { useDebounce } from '@/lib/useDebounce';
import { Switch } from '../ui/switch';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { initialSearchFilters, keyMap, sortOptionMap } from '@/lib/job-filter-util';
import { useRouter } from 'next/navigation';

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
const languageLevels = LANGUAGE_LEVEL.filter(level => level.groupCode.includes('TN'));

const conditionsByVisaDetail: { [key: string]: string[] } = {
    'thuc-tap-sinh-3-nam': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
    'thuc-tap-sinh-1-nam': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
    'thuc-tap-sinh-3-go': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
    'dac-dinh-dau-nhat': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
    'dac-dinh-dau-viet': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
    'dac-dinh-di-moi': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
    'ky-su-dau-nhat': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng', 'Nhận bằng Senmon', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
    'ky-su-dau-viet': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng', 'Nhận bằng Senmon', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
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


// const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
const allIndustries = Object.values(CAREERS).flat();

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
    if (num === 0) {
        return '≈ 0 VNĐ';
    }

    const convertedValue = num * rate;

    if (unit === 'triệu VNĐ') {
        const valueInMillions = convertedValue / 1000000;
        const formattingOptions: Intl.NumberFormatOptions = {
            maximumFractionDigits: 1,
        };
        if (valueInMillions % 1 === 0) {
            formattingOptions.minimumFractionDigits = 0;
        } else {
            formattingOptions.minimumFractionDigits = 1;
        }
        const formattedVnd = valueInMillions.toLocaleString('vi-VN', formattingOptions);
        return `≈ ${formattedVnd.replace('.', ',')} triệu VNĐ`;
    }

    return `≈ ${convertedValue.toLocaleString('vi-VN')} VNĐ`;
};

const getConvertedFeeValue = (value: string | undefined, placeholder: string) => {
    const numericString = value || placeholder.replace(/[^0-9]/g, '');
    const num = Number(numericString.replace(/[^0-9]/g, ''));

    if (isNaN(num)) return '≈ 0 triệu VNĐ';
    if (num === 0) {
        return '≈ 0 VNĐ';
    }

    const convertedValue = num * USD_VND_RATE;
    const valueInMillions = convertedValue / 1000000;

    const formattingOptions: Intl.NumberFormatOptions = {};
    if (valueInMillions % 1 === 0) {
        formattingOptions.maximumFractionDigits = 0;
    } else {
        formattingOptions.minimumFractionDigits = 1;
        formattingOptions.maximumFractionDigits = 1;
    }

    const formattedVnd = valueInMillions.toLocaleString('vi-VN', formattingOptions);
    return `≈ ${formattedVnd.replace('.', ',')} triệu VNĐ`;
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

// Định nghĩa lại type cho callback xử lý input lương/phí để dùng cho prop
type SalaryChangeCallback = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SearchFilters,
    limit: number | null
) => void;

// Cập nhật props của MonthlySalaryContent
const MonthlySalaryContent = React.memo(({ filters, onSalaryChange }: { filters: Pick<FilterSidebarProps, 'filters'>['filters'], onSalaryChange: SalaryChangeCallback }) => {

    const placeholderText = "VD: 200,000";

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="basic-salary-jpy">Lương cơ bản (JPY/tháng)</Label>
                <Input
                    id="basic-salary-jpy"
                    type="text"
                    placeholder={placeholderText}
                    // Sử dụng onSalaryChange đã được tối ưu
                    onChange={(e) => onSalaryChange(e, 'basicSalary', 10000000)}
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
                    // Sử dụng onSalaryChange đã được tối ưu
                    onChange={(e) => onSalaryChange(e, 'realSalary', 10000000)}
                    value={getDisplayValue(filters.realSalary)}
                />
                <p className="text-xs text-muted-foreground">{getConvertedValue(filters.realSalary, 'VD: 160,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
            </div>
        </div>
    );
});
const makeLabelFromFilters = (f: SearchFilters) => {
    const parts: string[] = [];
    if (f.q) parts.push(f.q);
    if (f.visaDetail && f.visaDetail !== 'all') parts.push(f.visaDetail);
    if ((f.career && f.career !== 'all') || (f.job && f.job !== 'all')) {
        parts.push(f.job ?? f.career ?? '')
    };
    if (Array.isArray(f.workLocation) && f.workLocation.length) parts.push(`${f.workLocation.length} địa điểm`);
    return parts.slice(0, 3).join(' • ') || 'Bộ lọc mới';
};

function loadRecentFilters(): RecentFilterItem[] {
    try {
        const raw = localStorage.getItem(RECENT_FILTERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveRecentFilters(items: RecentFilterItem[]) {
    try {
        localStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(items));
    } catch { }
}
export type RecentFilterItem = {
    id: string;
    label: string;
    filters: any;
    sortBy: any;
    createdAt: number;
};

export const RECENT_FILTERS_KEY = 'hj_recent_filters_v1';
export const RecentFiltersCard = ({
    onApply,
    autoHideDelay = 50000
}: {
    onApply: (filters: any) => void;
    autoHideDelay?: number;
}) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [recentList, setRecentList] = useState<RecentFilterItem[]>([]);

    useEffect(() => {
        setRecentList(loadRecentFilters());
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            handleClose();
        }, autoHideDelay);

        return () => clearTimeout(timer);
    }, [isVisible, autoHideDelay]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 300); // match animation duration
    };

    const handleOpen = () => {
        setIsVisible(true);
        setIsClosing(false);
    }

    const handleApply = (stagedFilters: any, sortBy: any) => {

        const query = new URLSearchParams();
        Object.entries(stagedFilters).forEach(([key, value]) => {
            const urlKey = keyMap[key] || key;
            if ((value || typeof value === 'boolean') && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
                if (key !== 'visa') {
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
            query.set(keyMap['sortBy'], sortOptionMap[sortBy]);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
        // onApply(filters);
        // handleClose();
    };

    const handleRemove = (id: string) => {
        const next = recentList.filter(i => i.id !== id);
        setRecentList(next);
        saveRecentFilters(next);
    };

    return (
        <div
            className={cn(
                'fixed bottom-24 right-4 z-40 transition-all duration-300',
                isClosing && 'translate-x-full right-0'
            )}
        >
            {!isVisible && <div onClick={handleOpen} className={
                cn('bg-white px-3 cursor-pointer transition-all z-39 duration-300 shadow w-[46px] h-[50px] opacity-[0.5] hover:w-[160px] hover:opacity-[1] absolute right-[100%] top-0 flex items-center justify-start text-primary')
            }>
                <div>
                    <Clock className='mr-3' />
                </div>
                <span className='whitespace-nowrap'>Bộ lọc đã lưu</span>
            </div>}
            <Card className="shadow-2xl w-full max-w-sm z-41">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center justify-between">
                        <span>Bộ lọc đã lưu</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {recentList.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Chưa có bộ lọc đã lưu</p>
                    ) : (
                        recentList.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 bg-muted p-2 rounded group"
                            >
                                <button
                                    className="text-sm text-left truncate flex-1"
                                    title={item.label}
                                    onClick={() => handleApply(item.filters, item.sortBy)}
                                >
                                    {item.label}
                                </button>
                                <button
                                    className="text-xs opacity-0 group-hover:opacity-100 px-1 transition-opacity"
                                    onClick={() => handleRemove(item.id)}
                                    aria-label="Xóa"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
MonthlySalaryContent.displayName = 'MonthlySalaryContent';
const japanProvinces = PROVINCES.filter((item) => item.groupCode === "JP");

export const FilterSidebar = memo(({ filters, appliedFilters, onFilterChange, onApply, onReset, resultCount }: FilterSidebarProps) => {
    const { role } = useAuth();
    const [availableJobDetails, setAvailableJobDetails] = useState<any[]>([]);
    const [availableIndustries, setAvailableIndustries] = useState<String[]>(allIndustries);
    const isMobile = useIsMobile();
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [japanRegions, setJapanRegions] = useState<{ [key: string]: { label: string, [key: string]: any } }[] | any>(() => {
        const regions: { [key: string]: any[] } = {};
        japanProvinces.filter(item => item.groupCode === 'JP').forEach((region: any) => {
            if (!region.parentCode) {
                regions[region.label] = [];
            } else {
                const parentRegion = japanProvinces.find(r => r.value === region.parentCode);
                if (!!parentRegion) {
                    regions[parentRegion.label].push(region);
                }
            }
        });
        return regions;
    });
    const [selectedParentRegion, _] = useState<string[]>(() => {
        if (!filters?.workLocation?.length) {
            return [];
        } else {
            let regions = [];
            regions = Object.keys(japanRegions).filter((region, index) => {
                const provinces = japanRegions[region];
                return provinces.find((province: { label: string, [key: string]: any }) => filters.workLocation?.includes(province.label))
            });
            return regions;
        }
    })

    // Tối ưu hóa: Bọc hàm xử lý input từ khóa bằng useCallback
    const handleKeywordDebounced = useCallback((q: string) => {
        if ((filters.q ?? '') === (q ?? '')) return; // avoid no-op updates
        onFilterChange({ q });
    }, [filters.q, onFilterChange]);


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
        if (!activeFilters.visaDetail || activeFilters.visaDetail === 'all') {
            return allSpecialConditions;
        }
        const conditions = conditionsByVisaDetail[activeFilters.visaDetail as keyof typeof conditionsByVisaDetail] || [];
        return conditions.map(name => ({ name, slug: createSlug(name) }));

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
            parentVisaSlug === 'dac-dinh' &&
            ['nha-hang-tokutei', 'hang-khong-tokutei', 've-sinh-toa-nha-tokutei', 'luu-tru-khach-san-tokutei'].includes(activeFilters.career || '');

        return isEngineerVisa || isTokuteiServiceIndustry;
    }, [activeFilters.visa, activeFilters.visaDetail, activeFilters.career]);

    // Tối ưu hóa: Tạo callback ổn định cho việc thay đổi input lương/phí
    const handleSalaryChangeCallback = useCallback((
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof SearchFilters,
        limit: number | null
    ) => {
        handleSalaryInputChange(e, field, limit, onFilterChange);
    }, [onFilterChange]);

    useEffect(() => {
        const parentVisaSlug = filters.visa || Object.keys(visaDetailsByVisaType).find(key =>
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === filters.visaDetail)
        );
        const industries = CAREERS[parentVisaSlug as keyof typeof CAREERS] || allIndustries;
        setAvailableIndustries(industries ?? []);
        setAvailableJobDetails([]);
    }, [filters.visa]);
    useEffect(() => {
        const parentVisaSlug = filters.visa || Object.keys(visaDetailsByVisaType).find(key =>
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === filters.visaDetail)
        );
        const visaCode = japanJobTypes.find(v => v.slug === parentVisaSlug)?.code;
        const parentIndustry = filters.career;
        const jobDetails = JOBS.filter(item => item.parent === parentIndustry && item.value.startsWith(visaCode || ''));
        setAvailableJobDetails(jobDetails);
    }, [filters.career]);

    // Tối ưu hóa: Bọc các hàm xử lý sự kiện bằng useCallback
    const handleDateSelect = useCallback((date: Date | undefined) => {
        onFilterChange({ interviewDate: date ? format(date, 'yyyy-MM-dd') : '' });
        setIsDatePickerOpen(false); // Thêm logic đóng popover/sheet vào đây
    }, [onFilterChange]);

    const handleFlexibleDateChange = useCallback((checked: boolean | string) => {
        if (checked) {
            onFilterChange({ interviewDate: 'flexible' });
        } else {
            onFilterChange({ interviewDate: '' });
        }
    }, [onFilterChange]);

    const handleRegionSelect = useCallback((checked: CheckedState, regionLabel: any) => {
        const currentSelection = new Set(Array.isArray(filters.workLocation) ? filters.workLocation : []);
        if (checked) {
            japanRegions[regionLabel].forEach((p: any) => currentSelection.add(p.label));
        } else {
            japanRegions[regionLabel].forEach((p: any) => currentSelection.delete(p.label));
        }
        onFilterChange({ workLocation: Array.from(currentSelection) });
    }, [filters.workLocation, japanRegions, onFilterChange]);

    const handleProvinceSelect = useCallback((checked: CheckedState, provinceLabel: any) => {
        const currentSelection = new Set(Array.isArray(filters.workLocation) ? filters.workLocation : []);
        if (checked) {
            currentSelection.add(provinceLabel);
        } else {
            currentSelection.delete(provinceLabel);
        }
        onFilterChange({ workLocation: Array.from(currentSelection) });
    }, [filters.workLocation, onFilterChange]);

    const handleVisaDetailChange = useCallback((value: string) => {
        const newFilters: Partial<SearchFilters> = { visaDetail: value };
        const parentTypeSlug = Object.keys(visaDetailsByVisaType).find(key =>
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === value)
        );

        if (parentTypeSlug && filters.visa !== parentTypeSlug) {
            newFilters.visa = parentTypeSlug;
            newFilters.career = '';
            newFilters.job = '';
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
    }, [filters.visa, filters.interviewLocation, onFilterChange]);

    const renderInterviewLocations = useCallback(() => {
        const vietnamVisas = ["thuc-tap-sinh-3-nam", "thuc-tap-sinh-1-nam", "dac-dinh-dau-viet", "dac-dinh-di-moi", "ky-su-tri-thuc-dau-viet"];
        const japanVisas = ["thuc-tap-sinh-3-go", "dac-dinh-dau-nhat", "ky-su-tri-thuc-dau-nhat"];

        if (filters.visaDetail && vietnamVisas.includes(filters.visaDetail)) {
            return (
                <SelectGroup>
                    <SelectLabel>Việt Nam</SelectLabel>
                    {interviewLocations['Việt Nam'].map(l => <SelectItem key={l.slug} value={l.slug}>{l.name}</SelectItem>)}
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
                    {interviewLocations['Việt Nam'].map(l => <SelectItem key={l.slug} value={l.slug}>{l.name}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                    {interviewLocations['Nhật Bản'].map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                </SelectGroup>
            </>
        )
    }, [filters.visaDetail]);

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

    const isFlexibleDateChecked = filters.interviewDate === 'flexible';

    const [showRecentCard, setShowRecentCard] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    return (
        <div className="md:col-span-1 lg:col-span-1 h-full flex flex-col">
            {isMounted && showRecentCard && role === 'admin' && (
                <RecentFiltersCard onApply={onApply} autoHideDelay={50000} />
            )}
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><SlidersHorizontal /> Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto pr-4">
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="filter-keyword" className="text-base font-semibold flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Tìm kiếm từ khóa
                        </Label>
                        <KeywordInput
                            initial={filters.q}
                            onDebouncedChange={handleKeywordDebounced}
                        />
                    </div>
                    <Accordion type="multiple" defaultValue={['jobType', 'location', 'industry', 'experience', 'requirements', 'interviewLocation', 'process', 'salary', 'netSalary', 'specialConditions', 'netFee', 'conditions']} className="w-full">
                        <AccordionItem value="jobType">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Loại hình công việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div>
                                    <Label>Chi tiết loại hình visa</Label>
                                    <Select key={filters.visa || 'all'} value={filters.visaDetail} onValueChange={handleVisaDetailChange}>
                                        <SelectTrigger className={cn(filters.visaDetail && filters.visaDetail !== 'all-details' && 'text-primary')}>
                                            <SelectValue placeholder="Tất cả loại hình" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả loại hình</SelectItem>
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
                                <span className="flex items-center gap-2"><Building className="h-5 w-5" />Ngành nghề &amp; Công việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Ngành nghề</Label>
                                    <Select value={filters.career} onValueChange={(value) => onFilterChange({ career: value, job: '' })}>
                                        <SelectTrigger className={cn(filters.career && filters.career !== 'all' && 'text-primary')}>
                                            <SelectValue placeholder="Chọn ngành nghề" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                                            {[...new Set(availableIndustries)].map((ind: any, index: number) => <SelectItem key={`${ind}-${index}`} value={ind}>{ind}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chi tiết công việc</Label>
                                    <Select value={filters.job} onValueChange={(value) => onFilterChange({ job: value })} disabled={!filters.career || filters.career === 'all'}>
                                        <SelectTrigger className={cn(filters.job && 'text-primary')}>
                                            <SelectValue placeholder="Chọn công việc" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            <SelectItem value="all-details">Tất cả công việc</SelectItem>
                                            {availableJobDetails.map(detail => <SelectItem key={detail.value} value={detail.value}>{detail.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="location">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />Địa điểm làm việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="space-y-3">
                                    <div className='p-3 bg-secondary rounded-md'>
                                        <p className='text-sm font-semibold'>Đã chọn ({Array.isArray(filters.workLocation) ? filters.workLocation.length : 0})</p>
                                        {Array.isArray(filters.workLocation) && filters.workLocation.length > 0 && (
                                            <div className='flex flex-wrap gap-1 mt-2 text-xs'>
                                                {filters.workLocation.map(loc => (
                                                    <Badge onClick={() => handleProvinceSelect(false, loc)} key={loc} variant="secondary" className='bg-primary/20 text-primary-dark font-medium px-2 py-0.5 rounded cursor-pointer'>
                                                        {loc}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Accordion type="multiple" className="w-full" defaultValue={selectedParentRegion}>
                                        {Object.keys(japanRegions).map((region) => (
                                            <AccordionItem key={region} value={region}>
                                                <div className="flex items-center gap-2 py-2 text-sm hover:no-underline" >
                                                    <Checkbox
                                                        id={`region-${region}`}
                                                        checked={Array.isArray(filters.workLocation) && japanRegions[region].every((p: any) => (filters.workLocation ?? []).includes(p.label))}
                                                        onCheckedChange={(checked) => handleRegionSelect(checked, region)}
                                                        value={region}
                                                    />
                                                    <AccordionTrigger className="flex-1 p-0 hover:no-underline">
                                                        <Label htmlFor={`region-${region}`} className="flex-grow text-left font-semibold cursor-pointer flex justify-between w-full">
                                                            <span>Vùng {region}</span>
                                                            {/* <span className="text-muted-foreground text-xs ml-1">{jobCountsByRegion[region.name] || 0} việc</span> */}
                                                        </Label>
                                                    </AccordionTrigger>
                                                </div>
                                                <AccordionContent className="pl-6 space-y-2">
                                                    {japanRegions[region].map((province: any) => (
                                                        <div key={province.label} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={`pref-${province.label}`}
                                                                checked={Array.isArray(filters.workLocation) && filters.workLocation.includes(province.label)}
                                                                onCheckedChange={(checked) => handleProvinceSelect(checked, province.label)}
                                                            />
                                                            <Label htmlFor={`pref-${province.label}`} className="flex w-full items-center justify-between font-normal cursor-pointer">
                                                                <span>{province.label}</span>
                                                                {/* <span className="text-muted-foreground text-xs ml-1">{jobCountsByPrefecture[prefecture.name] || 0}</span> */}
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
                                <span className="flex items-center gap-2"><FileText className="h-5 w-5" />Quy trình tuyển dụng</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Địa điểm phỏng vấn</Label>
                                    <Select value={filters.interviewLocation} onValueChange={(value) => onFilterChange({ interviewLocation: value })}>
                                        <SelectTrigger className={cn(filters.interviewLocation && filters.interviewLocation !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn tỉnh/thành phố" /></SelectTrigger>
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
                                    <Label>Ngày phỏng vấn</Label>
                                    <div className={cn("transition-opacity", isFlexibleDateChecked && "opacity-50")}>
                                        <Tabs value={filters.interviewDateType || 'until'} onValueChange={(value) => onFilterChange({ interviewDateType: value as any })} className="w-full">
                                            <TabsList className="grid w-full h-auto grid-cols-3">
                                                <TabsTrigger value="until" className="text-xs py-1 h-auto data-[state=active]:bg-accent-orange">Đến ngày</TabsTrigger>
                                                <TabsTrigger value="exact" className="text-xs py-1 h-auto data-[state=active]:bg-accent-green">Đúng ngày</TabsTrigger>
                                                <TabsTrigger value="from" className="text-xs py-1 h-auto data-[state=active]:bg-accent-blue">Từ ngày</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <div className={cn('flex gap-2 items-center pt-2', isFlexibleDateChecked && "opacity-50 pointer-events-none")}>
                                        {isMobile ? (
                                            <Sheet open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-full justify-start text-left font-normal", !filters.interviewDate && "text-muted-foreground", filters.interviewDate && filters.interviewDate !== 'flexible' && "text-primary")}
                                                        disabled={isFlexibleDateChecked}
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
                                                        selected={filters.interviewDate && filters.interviewDate !== 'flexible' ? parse(filters.interviewDate, 'yyyy-MM-dd', new Date()) : undefined}
                                                        onSelect={handleDateSelect} // Sử dụng hàm đã bọc useCallback
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
                                                        disabled={isFlexibleDateChecked}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {filters.interviewDate && filters.interviewDate !== 'flexible' ? format(new Date(filters.interviewDate), "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={filters.interviewDate && filters.interviewDate !== 'flexible' ? parse(filters.interviewDate, 'yyyy-MM-dd', new Date()) : undefined}
                                                        onSelect={handleDateSelect} // Sử dụng hàm đã bọc useCallback
                                                        fromDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                                        toDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
                                                        locale={vi}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="flexible-date" checked={isFlexibleDateChecked} onCheckedChange={handleFlexibleDateChange} />
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
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Lương &amp; Đãi ngộ</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                {shouldShowTabs ? (
                                    <Tabs defaultValue="basic">
                                        <TabsList className={cn("grid w-full h-auto data-[state=active]:bg-accent-yellow", (shouldShowLươngGiờ && shouldShowLươngNăm) ? "grid-cols-3" : "grid-cols-2")}>
                                            <TabsTrigger value="basic" className={cn("text-xs py-1 h-auto data-[state=active]:bg-accent-yellow")}>Lương tháng</TabsTrigger>
                                            {shouldShowLươngGiờ && <TabsTrigger value="hourly" className={cn("text-xs py-1 h-auto data-[state=active]:bg-accent-yellow")}>Lương giờ</TabsTrigger>}
                                            {shouldShowLươngNăm && <TabsTrigger value="yearly" className={cn("text-xs py-1 h-auto data-[state=active]:bg-accent-yellow")}>Lương năm</TabsTrigger>}
                                        </TabsList>
                                        <TabsContent value="basic" className="pt-4">
                                            {/* Truyền hàm callback đã tối ưu */}
                                            <MonthlySalaryContent filters={filters} onSalaryChange={handleSalaryChangeCallback} />
                                        </TabsContent>
                                        <TabsContent value="hourly" className="pt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="hourly-salary-jpy">Lương giờ (JPY)</Label>
                                                <Input
                                                    id="hourly-salary-jpy"
                                                    type="text"
                                                    placeholder="VD: 1,000"
                                                    // Sử dụng hàm callback đã tối ưu
                                                    onChange={(e) => handleSalaryChangeCallback(e, 'hourlySalary', 15000)}
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
                                                        // Sử dụng hàm callback đã tối ưu
                                                        onChange={(e) => handleSalaryChangeCallback(e, 'annualIncome', 30000000)}
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
                                                        // Sử dụng hàm callback đã tối ưu
                                                        onChange={(e) => handleSalaryChangeCallback(e, 'annualBonus', 5000000)}
                                                        value={getDisplayValue(filters.annualBonus || '')}
                                                    />
                                                    <p className="text-xs text-muted-foreground">{getConvertedValue(filters.annualBonus, 'VD: 500,000', JPY_VND_RATE, 'triệu VNĐ')}</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                ) : (
                                    <MonthlySalaryContent filters={filters} onSalaryChange={handleSalaryChangeCallback} />
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {(showTtsFeeFilter || showDdKsFeeFilter) && (
                            <AccordionItem value="netFee">
                                <AccordionTrigger className="text-base font-semibold">
                                    <span className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-red-500" />Mức phí</span>
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
                                                    onChange={(e) => handleSalaryChangeCallback(e, 'netFee', 10000)} // Sử dụng hàm callback đã tối ưu
                                                    value={getDisplayValue(filters.netFee)}
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedFeeValue(filters.netFee, getFeePlaceholder())}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="net-fee-no-tuition-usd">Phí và vé không học phí (USD)</Label>
                                                <Input
                                                    id="net-fee-no-tuition-usd"
                                                    type="text"
                                                    placeholder="0 đến 3600$"
                                                    onChange={(e) => handleSalaryChangeCallback(e, 'netFeeNoTicket', 10000)} // Sử dụng hàm callback đã tối ưu
                                                    value={getDisplayValue(filters.netFeeNoTicket)}
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedFeeValue(filters.netFeeNoTicket, '0 đến 3600$')}</p>
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
                                                    onChange={(e) => handleSalaryChangeCallback(e, 'netFee', 4200)} // Sử dụng hàm callback đã tối ưu
                                                    value={getDisplayValue(filters.netFee)}
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedFeeValue(filters.netFee, getFeePlaceholder())}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="net-fee-no-ticket-usd">Phí không vé (USD)</Label>
                                                <Input
                                                    id="net-fee-no-ticket-usd"
                                                    type="text"
                                                    placeholder={getFeePlaceholder()}
                                                    onChange={(e) => handleSalaryChangeCallback(e, 'netFeeNoTicket', 4200)} // Sử dụng hàm callback đã tối ưu
                                                    value={getDisplayValue(filters.netFeeNoTicket)}
                                                />
                                                <p className="text-xs text-muted-foreground">{getConvertedFeeValue(filters.netFeeNoTicket, getFeePlaceholder())}</p>
                                            </div>
                                        </>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        <AccordionItem value="experience">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Kinh nghiệm</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Yêu cầu kinh nghiệm</Label>
                                    <Select value={filters.experienceRequirement} onValueChange={(value) => onFilterChange({ experienceRequirement: value })}>
                                        <SelectTrigger className={cn(filters.experienceRequirement && filters.experienceRequirement !== 'all' && 'text-primary')}><SelectValue placeholder="Chọn công việc" /></SelectTrigger>
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
                                <span className="flex items-center gap-2"><UserSearch className="h-5 w-5" />Yêu cầu ứng viên</span>
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
                                <span className="flex items-center gap-2"><ListChecks className="h-5 w-5" />Quy trình tuyển dụng</span>
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
                                        value={filters.numberRecruits || ''}
                                        onChange={(e) => onFilterChange({ numberRecruits: e.target.value })}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="specialConditions" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><Star className="h-5 w-5" />Điều kiện đặc biệt</span>
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
                        <AccordionItem value="conditions" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><ListFilter className="h-5 w-5" />Điều kiện hiển thị</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="show-expired" className="cursor-pointer text-muted-foreground">Hiển thị đơn hết hạn</Label>
                                    <Switch
                                        id="show-expired"
                                        checked={filters.showExpired}
                                        onCheckedChange={(checked) => onFilterChange({ showExpired: checked })}
                                    />
                                </div>
                                {filters.showExpired && (
                                    <div className="pl-6 border-l-2 ml-2 space-y-4 pt-4">
                                        <div className="flex items-center justify-between space-x-2">
                                            <Label htmlFor="sort-expired" className="cursor-pointer text-muted-foreground">Hết hạn xuống dưới</Label>
                                            <Switch
                                                id="sort-expired"
                                                checked={filters.sortExpiredToEnd}
                                                onCheckedChange={(checked) => onFilterChange({ sortExpiredToEnd: checked })}
                                            />
                                        </div>
                                    </div>
                                )}
                                {role === 'admin' && <div className="space-y-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="has-form" className="font-normal cursor-pointer flex-grow text-muted-foreground">Có form đơn</Label>
                                        <Switch
                                            id="has-form"
                                            checked={filters.hasForm}
                                            onCheckedChange={(checked) => onFilterChange({ hasForm: !!checked, hasNiceForm: checked ? filters.hasNiceForm : false })}
                                        />
                                    </div>
                                    {/* <div className="pl-6 border-l-2 ml-2 space-y-4">
                                        <div className="flex items-center justify-between space-x-2">
                                            <Label htmlFor="has-nice-form" className={cn("font-normal cursor-pointer flex-grow text-muted-foreground", !filters.hasForm && "opacity-50")}>
                                                Form đơn đẹp
                                            </Label>
                                            <Switch
                                                id="has-nice-form"
                                                checked={filters.hasNiceForm}
                                                onCheckedChange={(checked) => onFilterChange({ hasNiceForm: !!checked })}
                                                disabled={!filters.hasForm}
                                            />
                                        </div>
                                    </div> */}
                                </div>}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            <div className="p-4 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t mt-auto">
                <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant="outline" onClick={onReset} className="col-span-1">Xóa</Button>
                    <Button className="w-full bg-primary text-white col-span-2" onClick={onApply}>
                        Áp dụng <Badge variant="secondary" className="ml-2" id='filter-staged-count-badge'>{resultCount}</Badge>
                    </Button>
                </div>
            </div>
        </div>
    );
})
function KeywordInput({ initial, onDebouncedChange }: { initial?: string; onDebouncedChange: (q: string) => void }) {
    const [local, setLocal] = React.useState(initial ?? '');
    const debounced = useDebounce(local, 300);
    const lastSentRef = useRef<string | null>(null);

    React.useEffect(() => {
        // only call when debounced actually changed from the last sent value
        if (lastSentRef.current === debounced) return;
        lastSentRef.current = debounced;
        onDebouncedChange(debounced);
    }, [debounced, onDebouncedChange]);

    React.useEffect(() => {
        // keep local in sync when parent filters.q changes externally
        if (initial !== undefined && initial !== local) {
            setLocal(initial);
        }
    }, [initial]);

    return (
        <Input
            id="filter-keyword"
            placeholder="Chức danh, kỹ năng, công ty..."
            value={local}
            onChange={(e) => setLocal(e.target.value)}
        />
    );
}