
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, CalendarIcon, SlidersHorizontal, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CandidateProfile } from '@/ai/schemas';
import { Industry, industriesByJobType, allIndustries } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType, allSpecialConditions, experienceYears, languageLevels, educationLevels, tattooRequirements } from '@/lib/visa-data';
import { locations, interviewLocations, japanRegions, allJapanLocations } from '@/lib/location-data';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/actions/user-action';

const JPY_VND_RATE = 180;
const USD_VND_RATE = 26300;

const getFeeDisplayValue = (value: number) => {
    if (!value) return '';
    const num = Number(String(value).replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
};

const getConvertedFeeValue = (value: number) => {
    if (!value || isNaN(value) || value === 0) return '(≈ 0 triệu VNĐ)';

    const vndValue = value * USD_VND_RATE;
    const valueInMillions = vndValue / 1000000;
    const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    return `(≈ ${formattedVnd.replace('.', ',')} triệu VNĐ)`;
};

const getSalaryDisplayValue = (value: number) => {
    if (!value) return '';
    const num = Number(String(value).replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('ja-JP');
};

const getConvertedSalaryValue = (value: number) => {
    if (!value || isNaN(value) || value === 0) return '(≈ 0 triệu VNĐ)';

    const vndValue = value * JPY_VND_RATE;
    const valueInMillions = vndValue / 1000000;
    const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    return `(≈ ${formattedVnd.replace('.', ',')} triệu VNĐ)`;
};
type AspirationsState = Partial<
    CandidateProfile['aspirations'] & {
        educationRequirement?: string;
        languageRequirement?: string;
        yearsOfExperience?: string;
        specialConditions?: string[];
    }
>;
interface EditAspirationsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}
//

export const EditAspirationsDialog: React.FC<EditAspirationsDialogProps> = ({
    isOpen,
    onOpenChange
}) => {
    const { user } = useAuth();
    const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);
    const isMobile = useIsMobile();
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [locationSearchTerm, setLocationSearchTerm] = useState('');
    const [tempAspirations, setTempAspirations] = useState<Partial<CandidateProfile['aspirations'] & { educationRequirement?: string, languageRequirement?: string, yearsOfExperience?: string, specialConditions?: string[] }>>(() => {
        if (!!user?.aspirations) {
            console.log(user.uid, user.aspirations);
            return { ...user.aspirations };
        }
        return {};
    });
    const [suggestionPrinciple, setSuggestionPrinciple] = useState<'basicSalary' | 'fee' | 'realSalary' | null>(null);
    const [tempFee, setTempFee] = useState<string | null>(null);
    const JPY_VND_RATE = 180;
    const USD_VND_RATE = 26300;

    useEffect(() => {
        const parentVisaSlug = tempAspirations.visa
            ? japanJobTypes.find(jt => jt.name === tempAspirations.visa)?.slug
            : Object.keys(visaDetailsByVisaType).find(key =>
                (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.name === tempAspirations.visaDetail)
            );

        const industries = parentVisaSlug ? (industriesByJobType[parentVisaSlug as keyof typeof industriesByJobType] || allIndustries) : allIndustries;
        const uniqueIndustries = Array.from(new Map(industries.map(item => [item.name, item])).values());
        setAvailableIndustries(uniqueIndustries);
    }, [tempAspirations.visa, tempAspirations.visaDetail]);

    useEffect(() => {
        // done
        if (tempAspirations.career) {
            const selectedIndustryData = allIndustries.find(ind => ind.name === tempAspirations.career);
            const jobs = selectedIndustryData?.keywords || [];
            setAvailableJobDetails(jobs);
            // Reset job detail if industry changes
            if (!jobs.includes(tempAspirations.job as string)) {
                setTempAspirations(prev => ({ ...prev, job: null }));
            }
        } else {
            setAvailableJobDetails([]);
        }
    }, [tempAspirations.career, setTempAspirations]);



    const handleSaveAspirations = async () => {
        try {
            console.log(tempAspirations);
            await updateProfile(user?.uid, { aspirations: { ...tempAspirations } });
            onOpenChange(false);
            toast({
                title: 'Cập nhật nguyện vọng thành công!',
                description: 'Thông tin nguyện vọng của bạn đã được lưu. Nội dung việc làm sẽ được hiển thị theo nguyện vọng của bạn.',
                className: 'bg-green-500 text-white'
            });
        } catch (error) {
            toast({
                title: 'Cập nhật nguyện vọng thất bại!',
                description: 'Đã xảy ra lỗi khi lưu thông tin nguyện vọng của bạn. Vui lòng thử lại.',
                className: 'bg-red-500 text-white'
            });
        }
        // const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
        // let profile = storedProfileRaw ? JSON.parse(storedProfileRaw) : {};
        // profile = {
        //     ...profile,
        //     aspirations: tempAspirations
        // };
        // localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
        // if (suggestionPrinciple) {
        //     localStorage.setItem('suggestionPrinciple', suggestionPrinciple);
        // } else {
        //     localStorage.removeItem('suggestionPrinciple');
        // }
        // localStorage.setItem('suggestionType', suggestionType);
        // console.log("Suggestion principle saved:", suggestionPrinciple);
        // console.log("Suggestion type saved:", suggestionType);
        // setIsAspirationsDialogOpen(false);
        // setForceUpdate(prev => prev + 1); // Trigger a re-fetch
    };
    const handleSaveFee = () => {
        let num = null;
        if (tempFee) {
            num = parseInt(tempFee.replace(/[,.]/g, ''), 10)
        }
        setTempAspirations(prev => ({ ...prev, [suggestionPrinciple || '']: num }));
        setTempFee('');
        setSuggestionPrinciple(null);
        toast({
            title: `Đã cập nhật ${suggestionPrinciple === 'fee' ? 'phí' : suggestionPrinciple === 'basicSalary' ? 'lương cơ bản' : suggestionPrinciple === 'realSalary' ? 'lương thực nhận' : ''} mong muốn`,
            description: `Mức ${suggestionPrinciple === 'fee' ? 'phí tối đa' : suggestionPrinciple === 'basicSalary' ? 'lương cơ bản tối thiểu' : suggestionPrinciple === 'realSalary' ? 'lương thực nhận tối thiểu' : ''} mới là ${parseInt(tempFee || '0').toLocaleString('en-US')} USD.`,
        });
    }


    const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let num = parseInt(rawValue.replace(/[,.]/g, ''), 10);

        if (isNaN(num)) {
            setTempFee('');
            return;
        }

        const visaDetail = tempAspirations.visaDetail;
        let limit = 3800; // Default limit
        switch (suggestionPrinciple) {
            case 'basicSalary':
            case 'realSalary': {
                limit = 1000000;
                break;
            }
            default: {
                if (visaDetail === 'Thực tập sinh 1 năm') limit = 1400;
                if (visaDetail === 'Đặc định đầu Việt') limit = 2500;
                break;
            }
        }
        if (num > limit) {
            num = limit;
        }

        setTempFee(String(num));
    };

    const getFeeDisplayValue = () => {
        if (tempFee?.length) {
            const num = Number(tempFee.replace(/[^0-9]/g, ''));
            if (isNaN(num)) return '';
            return num.toLocaleString('en-US');
        }
        let value = null;
        switch (suggestionPrinciple) {
            case 'basicSalary':
                value = tempAspirations.basicSalary || 0;
                break;
            case 'realSalary':
                value = tempAspirations.realSalary || 0;
                break;
            case 'fee':
                value = tempAspirations.fee || 0;
                break;
        }
        if (!value) return '';
        if (isNaN(value)) return '';
        return value.toLocaleString('en-US');
    };

    const getConvertedFeeValue = (value: number | string) => {
        let num = null;
        if (typeof value === 'string') {
            num = Number(value);
        } else {
            num = value;
        }
        if (isNaN(num) || num === 0) return '≈ 0 triệu VNĐ';
        const rate = suggestionPrinciple === 'fee' ? USD_VND_RATE : JPY_VND_RATE;
        const vndValue = num * rate;
        const valueInMillions = vndValue / 1000000;
        const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `≈ ${formattedVnd.replace('.', ',')} triệu VNĐ`;
    };
    const getFeePlaceholder = () => {
        switch (suggestionPrinciple) {
            case 'basicSalary':
                return '200,000'
            case 'realSalary':
                return '150,000'
            default: {
                const visaDetail = tempAspirations.visaDetail;
                if (visaDetail === 'Thực tập sinh 1 năm') return "1000";
                if (visaDetail === 'Đặc định đầu Việt') return "1600";
                return "3000";
            }

        }
    };

    const handleVisaDetailChange = (value: string) => {
        const newFilters: Partial<CandidateProfile['aspirations']> = { visaDetail: value };
        const parentType = Object.keys(visaDetailsByVisaType).find(key =>
            (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.name === value)
        );
        const parentTypeName = japanJobTypes.find(jt => jt.slug === parentType)?.name || '';

        // Logic to reset interview location
        const vietnamVisas = ["Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Đặc định đầu Việt", "Đặc định đi mới", "Kỹ sư, tri thức đầu Việt"];
        const japanVisas = ["Thực tập sinh 3 Go", "Đặc định đầu Nhật", "Kỹ sư, tri thức đầu Nhật"];
        const currentInterviewLocationIsVn = interviewLocations['Việt Nam'].some(l => l.slug === tempAspirations.interviewLocation);
        const currentInterviewLocationIsJp = interviewLocations['Nhật Bản'].some(l => l.slug === tempAspirations.interviewLocation);

        if (vietnamVisas.includes(value) && currentInterviewLocationIsJp) {
            newFilters.interviewLocation = '';
        } else if (japanVisas.includes(value) && currentInterviewLocationIsVn) {
            newFilters.interviewLocation = '';
        }

        setTempAspirations(prev => ({ ...prev, ...newFilters, visa: parentTypeName }));
        setTempAspirations(prev => ({ ...prev, career: null, job: null }));
    };

    const renderInterviewLocations = () => {
        const vietnamVisas = ["Thực tập sinh 3 năm", "Thực tập sinh 1 năm", "Đặc định đầu Việt", "Đặc định đi mới", "Kỹ sư, tri thức đầu Việt"];
        const japanVisas = ["Thực tập sinh 3 Go", "Đặc định đầu Nhật", "Kỹ sư, tri thức đầu Nhật"];
        const visaDetail = tempAspirations.visaDetail;

        if (visaDetail && vietnamVisas.includes(visaDetail)) {
            return (
                <SelectGroup>
                    <SelectLabel>Việt Nam</SelectLabel>
                    {interviewLocations['Việt Nam'].map(l => <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>)}
                </SelectGroup>
            );
        }

        if (visaDetail && japanVisas.includes(visaDetail)) {
            return (
                <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                    {interviewLocations['Nhật Bản'].map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                </SelectGroup>
            );
        }

        // Default case: show all
        return (
            <>
                <SelectGroup>
                    <SelectLabel>Việt Nam</SelectLabel>
                    {interviewLocations['Việt Nam'].map(l => <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Nhật Bản</SelectLabel>
                    {interviewLocations['Nhật Bản'].map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                </SelectGroup>
            </>
        );
    };

    const handleDateSelect = (date: Date | undefined) => {
        console.log(date)
        setTempAspirations(prev => ({ ...prev, interviewDate: date ? date.getTime() : null }));
    };

    const showTattooFilter = useMemo(() => {
        const parentVisaSlug = tempAspirations.visa
            ? japanJobTypes.find(jt => jt.name === tempAspirations.visa)?.slug
            : Object.keys(visaDetailsByVisaType).find(key => (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.name === tempAspirations.visaDetail));

        if (parentVisaSlug === 'ky-su-tri-thuc') return false;

        const visasToHideTattoo = ['ky-su-tri-thuc-dau-viet', 'ky-su-tri-thuc-dau-nhat'];
        return !visasToHideTattoo.includes(tempAspirations.visaDetail || '');
    }, [tempAspirations.visa, tempAspirations.visaDetail]);


    return (
        <>

            <Dialog open={isOpen} onOpenChange={onOpenChange} >
                <DialogContent className="sm:max-w-2xl" id="HSCN_SUAGOIY_DIALOG">
                    <DialogHeader>
                        <DialogTitle>Sửa điều kiện gợi ý/nguyện vọng</DialogTitle>
                        <DialogDescription>
                            Thay đổi các nguyện vọng để nhận được gợi ý việc làm phù hợp hơn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                            {/* Hàng 1, Cột 1 (Mobile: order 1) */}
                            <div className="space-y-2 order-1">
                                <Label htmlFor="visa-detail-modal">Chi tiết loại hình visa</Label>
                                <Select
                                    value={tempAspirations.visaDetail || ''}
                                    onValueChange={handleVisaDetailChange}
                                >
                                    <SelectTrigger id="visa-detail-modal"><SelectValue placeholder="Chọn chi tiết loại hình visa" /></SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {japanJobTypes.map(type => (
                                            <SelectGroup key={type.slug}>
                                                <SelectLabel>{type.name}</SelectLabel>
                                                {(visaDetailsByVisaType[type.slug] || []).map(detail => (
                                                    <SelectItem key={detail.slug} value={detail.name}>{detail.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Hàng 1, Cột 2 (Mobile: order 2) */}
                            <div className="space-y-2 order-2">
                                <Label htmlFor="industry-modal">Ngành nghề mong muốn</Label>
                                <Select
                                    value={tempAspirations.career || ''}
                                    onValueChange={(value) => {
                                        setTempAspirations(prev => ({ ...prev, career: value }));
                                    }}
                                    disabled={!tempAspirations.visa}
                                >
                                    <SelectTrigger id="industry-modal">
                                        <SelectValue placeholder="Chọn ngành nghề" >
                                            {tempAspirations.career || "Chọn ngành nghề"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Hàng 2, Cột 1 (Mobile: order 3) */}
                            <div className="space-y-2 order-3">
                                <Label htmlFor="job-detail-modal">Chi tiết công việc</Label>
                                <Select
                                    value={tempAspirations.job || undefined}
                                    onValueChange={value => setTempAspirations(prev => ({ ...prev, job: value }))}
                                    disabled={!tempAspirations.career || availableJobDetails.length === 0}
                                >
                                    <SelectTrigger
                                        id="job-detail-modal"
                                        className={cn(!tempAspirations.job && !tempAspirations.career && "text-xs italic text-muted-foreground")}
                                    >
                                        <SelectValue
                                            placeholder={tempAspirations.job ?? (!tempAspirations.career ? "Hãy chọn Ngành nghề mong muốn" : "Chọn công việc chi tiết")}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableJobDetails.map(job => (
                                            <SelectItem key={job} value={job}>{job}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Hàng 2, Cột 2 (Mobile: order 4) */}
                            <div className="space-y-2 order-4">
                                <Label htmlFor="location-modal">Địa điểm làm việc mong muốn</Label>
                                <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                            <div className="truncate">
                                                {Array.isArray(tempAspirations.workLocation) && tempAspirations.workLocation.length > 0 ? (
                                                    tempAspirations.workLocation.map(locSlug => (
                                                        <Badge key={locSlug} variant="secondary" className='mr-1'>
                                                            {allJapanLocations.find(l => l.slug === locSlug)?.name ||
                                                                japanRegions.find(r => r.slug === locSlug)?.name ||
                                                                locSlug}
                                                        </Badge>
                                                    ))
                                                ) : "Chọn địa điểm"}
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Chọn địa điểm làm việc</DialogTitle>
                                            <DialogDescription>Bạn có thể chọn nhiều tỉnh hoặc cả vùng.</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    placeholder="Tìm tỉnh/thành phố..."
                                                    className="pl-10"
                                                    value={locationSearchTerm}
                                                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4 max-h-[50vh] overflow-y-auto pr-2 space-y-4">
                                                {japanRegions
                                                    .filter(region => region.prefectures.some(p => p.name.toLowerCase().includes(locationSearchTerm.toLowerCase())))
                                                    .map((region) => (
                                                        <div key={region.slug}>
                                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                                                                <Checkbox
                                                                    id={`region-${region.slug}`}
                                                                    checked={region.prefectures.every(p => tempAspirations.workLocation?.includes(p.slug))}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentSelection = new Set(tempAspirations.workLocation || []);
                                                                        region.prefectures.forEach(p => {
                                                                            if (checked) {
                                                                                currentSelection.add(p.slug);
                                                                            } else {
                                                                                currentSelection.delete(p.slug);
                                                                            }
                                                                        });
                                                                        setTempAspirations(prev => ({ ...prev, workLocation: Array.from(currentSelection) }));
                                                                    }}
                                                                />
                                                                <Label htmlFor={`region-${region.slug}`} className="flex-grow text-left font-semibold cursor-pointer">
                                                                    Vùng {region.name}
                                                                </Label>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pl-6">
                                                                {region.prefectures
                                                                    .filter(p => p.name.toLowerCase().includes(locationSearchTerm.toLowerCase()))
                                                                    .map(p => (
                                                                        <div key={p.slug} className="flex items-center gap-2">
                                                                            <Checkbox
                                                                                id={`pref-${p.slug}`}
                                                                                checked={tempAspirations.workLocation?.includes(p.slug)}
                                                                                onCheckedChange={(checked) => {
                                                                                    const currentSelection = new Set(tempAspirations.workLocation || []);
                                                                                    if (checked) {
                                                                                        currentSelection.add(p.slug);
                                                                                    } else {
                                                                                        currentSelection.delete(p.slug);
                                                                                    }
                                                                                    setTempAspirations(prev => ({ ...prev, workLocation: Array.from(currentSelection) }));
                                                                                }}
                                                                            />
                                                                            <Label htmlFor={`pref-${p.slug}`} className="font-normal cursor-pointer">{p.name}</Label>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={() => setIsLocationDialogOpen(false)}>Xác nhận</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>


                        <div className="space-y-2 pt-2">
                            <Label className="font-semibold">Nguyên tắc gợi ý</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={tempAspirations.suggestionType !== 'related' ? 'default' : 'outline'}
                                    onClick={() => setTempAspirations(prev => ({ ...prev, suggestionType: 'accurate' }))}
                                    className="justify-center text-left h-auto py-2"
                                >
                                    Chính xác 100%
                                </Button>
                                <Button
                                    variant={tempAspirations.suggestionType === 'related' ? 'default' : 'outline'}
                                    onClick={() => setTempAspirations(prev => ({ ...prev, suggestionType: 'related' }))}
                                    className="justify-center text-left h-auto py-2"
                                >
                                    Thêm cả việc liên quan
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label className="font-semibold">Ưu tiên tìm việc</Label>
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSuggestionPrinciple('basicSalary');
                                            // Note: You might need a dialog for salary input similar to the fee dialog.
                                            // This part just updates the UI.
                                        }}
                                        className={cn(
                                            "justify-start text-left h-auto py-2 flex flex-col items-start",
                                            suggestionPrinciple === 'basicSalary' && "ring-2 ring-primary border-primary bg-primary/10"
                                        )}
                                    >
                                        <p className="font-semibold">Lương tối thiểu từ</p>
                                        {tempAspirations.basicSalary ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-bold text-accent-green">{getSalaryDisplayValue(tempAspirations.basicSalary)} JPY</span>
                                                <span className="text-xs text-muted-foreground">{getConvertedSalaryValue(tempAspirations.basicSalary)}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs opacity-80 font-normal">Bấm để nhập mức lương</p>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSuggestionPrinciple('realSalary');
                                        }}
                                        className={cn(
                                            "justify-start text-left h-auto py-2 flex flex-col items-start",
                                            suggestionPrinciple === 'realSalary' && "ring-2 ring-primary border-primary bg-primary/10"
                                        )}
                                    >
                                        <p className="font-semibold">Thực lĩnh tối thiểu từ</p>
                                        {tempAspirations.realSalary ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-bold text-accent-green">{getSalaryDisplayValue(tempAspirations.realSalary)} JPY</span>
                                                <span className="text-xs text-muted-foreground">{getConvertedSalaryValue(tempAspirations.realSalary)}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs opacity-80 font-normal">Bấm để nhập mức thực lĩnh</p>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSuggestionPrinciple('fee');
                                        }}
                                        className={cn(
                                            "justify-start text-left h-auto py-2 flex flex-col items-start",
                                            suggestionPrinciple === 'fee' && "ring-2 ring-primary border-primary bg-primary/10"
                                        )}
                                    >
                                        <p className="font-semibold">Phí tối đa đến</p>
                                        {tempAspirations.fee ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-bold text-accent-green">{getFeeDisplayValue()} USD</span>
                                                <span className="text-xs text-muted-foreground">{getConvertedFeeValue(tempAspirations.fee)}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs opacity-80 font-normal">Bấm để nhập mức phí</p>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5" />
                                Điều kiện mở rộng
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Địa điểm phỏng vấn</Label>
                                    <Select
                                        value={tempAspirations.interviewLocation || 'all'}
                                        onValueChange={value => setTempAspirations(prev => ({ ...prev, interviewLocation: value === 'all' ? null : value }))}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Chọn địa điểm" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả địa điểm</SelectItem>
                                            {renderInterviewLocations()}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ngày phỏng vấn</Label>
                                    <div className={cn("transition-opacity", tempAspirations.interviewDateType === 'flexible' && "opacity-50")}>
                                        <Tabs
                                            value={tempAspirations.interviewDateType || 'until'}
                                            onValueChange={(value) => setTempAspirations(prev => ({ ...prev, interviewDateType: value as any }))}
                                            className="w-full"
                                        >
                                            <TabsList className="grid w-full h-auto grid-cols-3">
                                                <TabsTrigger value="until" className="text-xs py-1 h-auto data-[state=active]:bg-accent-orange">Đến ngày</TabsTrigger>
                                                <TabsTrigger value="exact" className="text-xs py-1 h-auto data-[state=active]:bg-accent-green">Đúng ngày</TabsTrigger>
                                                <TabsTrigger value="from" className="text-xs py-1 h-auto data-[state=active]:bg-accent-blue">Từ ngày</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <div className={cn('flex gap-2 items-center pt-2', tempAspirations.interviewDateType === 'flexible' && "opacity-50 pointer-events-none")}>
                                        {isMobile ? (
                                            <Sheet open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-full justify-start text-left font-normal", !tempAspirations.interviewDate && "text-muted-foreground", tempAspirations.interviewDate && tempAspirations.interviewDateType !== 'flexible' && "text-primary")}
                                                        disabled={tempAspirations.interviewDateType === 'flexible'}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {tempAspirations.interviewDate && tempAspirations.interviewDateType !== 'flexible' ? format(new Date(tempAspirations.interviewDate), "dd/MM/yyyy") : "Chọn ngày"}
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent side="bottom" className="h-auto">
                                                    <SheetHeader><SheetTitle>Chọn ngày phỏng vấn</SheetTitle></SheetHeader>
                                                    <Calendar
                                                        mode="single"
                                                        selected={tempAspirations.interviewDate && tempAspirations.interviewDateType !== 'flexible' ? new Date(tempAspirations.interviewDate) : undefined}
                                                        onSelect={(date) => { handleDateSelect(date); setIsDatePickerOpen(false); }}
                                                        locale={vi}
                                                    />
                                                </SheetContent>
                                            </Sheet>
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-full justify-start text-left font-normal", !tempAspirations.interviewDate && "text-muted-foreground", tempAspirations.interviewDate && tempAspirations.interviewDateType !== 'flexible' && "text-primary")}
                                                        disabled={tempAspirations.interviewDateType === 'flexible'}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {tempAspirations.interviewDate && tempAspirations.interviewDateType !== 'flexible' ? format(new Date(tempAspirations.interviewDate), "dd/MM/yyyy") : "Chọn ngày"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={tempAspirations.interviewDate && tempAspirations.interviewDateType !== 'flexible' ? new Date(tempAspirations.interviewDate) : undefined}
                                                        onSelect={handleDateSelect}
                                                        locale={vi}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="flexible-date-modal"
                                            checked={tempAspirations.interviewDateType === 'flexible'}
                                            onCheckedChange={(checked) => setTempAspirations(prev => ({ ...prev, interviewDateType: checked ? 'flexible' : null }))}
                                        />
                                        <Label htmlFor="flexible-date-modal" className="text-sm font-normal cursor-pointer">
                                            Đủ người thì phỏng vấn
                                        </Label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender-modal">Giới tính</Label>
                                    <Select
                                        value={tempAspirations.gender || 'all'}
                                        onValueChange={value => setTempAspirations(prev => ({ ...prev, gender: value === 'all' ? null : value }))}
                                    >
                                        <SelectTrigger id="gender-modal"><SelectValue placeholder="Bất kỳ" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="Nam">Nam</SelectItem>
                                            <SelectItem value="Nữ">Nữ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {showTattooFilter && (
                                    <div className="space-y-2">
                                        <Label htmlFor="tattoo-modal">Hình xăm</Label>
                                        <Select
                                            value={tempAspirations.haveTattoo || 'all'}
                                            onValueChange={value => setTempAspirations(prev => ({ ...prev, tattooRequirement: value === 'all' ? null : value }))}
                                        >
                                            <SelectTrigger id="tattoo-modal"><SelectValue placeholder="Bất kỳ" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={'all'}>Tất cả</SelectItem>
                                                <SelectItem value="Không nhận hình xăm">Không nhận hình xăm</SelectItem>
                                                <SelectItem value="Nhận xăm nhỏ (kín)">Nhận xăm nhỏ (kín)</SelectItem>
                                                <SelectItem value="Nhận cả xăm to (lộ)">Nhận cả xăm to (lộ)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex-row justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline">Hủy</Button>
                        </DialogClose>
                        <Button onClick={handleSaveAspirations}>Lưu và tìm lại</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!suggestionPrinciple} onOpenChange={() => setSuggestionPrinciple(null)}>
                <DialogContent className="sm:max-w-md">
                    {/* MPMM01 */}
                    <DialogHeader>
                        <DialogTitle>Mức {suggestionPrinciple === 'fee' ? 'phí' : suggestionPrinciple === 'basicSalary' ? 'lương cơ bản' : 'lương thực lĩnh'} mong muốn</DialogTitle>
                        <DialogDescription>Nhập {suggestionPrinciple === 'fee' ? 'mức phí tối đa bạn sẵn sàng chi trả (USD).' : suggestionPrinciple === 'basicSalary' ? 'mức lương cơ bản tối thiểu mong muốn (JPY).' : 'mức lương thực lĩnh tối thiểu mong muốn (JPY).'}</DialogDescription>
                    </DialogHeader>
                    <div className="pt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fee-usd">{suggestionPrinciple === 'fee' ? 'Phí tối đa (USD)' : suggestionPrinciple === 'basicSalary' ? 'Lương cơ bản (JPY)' : 'Lương thực lĩnh (JPY)'}</Label>
                            <Input
                                id="fee-usd"
                                type="text"
                                placeholder={getFeePlaceholder()}
                                value={getFeeDisplayValue()}
                                onChange={handleFeeInputChange}
                            />
                            <p className="text-xs text-muted-foreground">{getConvertedFeeValue(tempFee || '')}</p>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button variant="outline" onClick={() => setSuggestionPrinciple(null)}>Hủy</Button>
                        <Button onClick={handleSaveFee}>Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
