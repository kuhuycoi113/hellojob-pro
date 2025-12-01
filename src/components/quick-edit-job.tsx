import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Image from "next/image";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { CAREERS } from "@/lib/industry-data";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Check, ChevronsUpDown, EyeOff, MapPin, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Calendar } from "./ui/calendar";
import { ScrollArea } from "./ui/scroll-area";
import { japanJobTypes, visaDetailsByVisaType } from "@/lib/visa-data";
import { cn, formatVisa } from "@/lib/utils";
import { format, formatDate, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { allJapanLocations, japanRegions } from "@/lib/location-data";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import JOBS from '@/lib/jobs.json';
import { Textarea } from "./ui/textarea";
import { updateJob } from "@/actions/job-action";
import { toast } from "@/hooks/use-toast";
interface Job {
    id?: string;
    visa?: string;
    job?: string;
    career?: string;
    basicSalary?: number; realSalary?: number; interviewDay?: string; workLocation?: string; avatar?: string; filter?: any;
    aiContent?: string;
    formImage?: string
}
interface QuickEditJobProps {
    isQuickEditOpen: boolean;
    setIsQuickEditOpen: (open: boolean) => void;
}
const formatSalaryInput = (number: number | undefined): string => {
    const value = number ? '' + number : '';
    if (!value || !value?.length) return '';
    const num = Number(value.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
};

const parseSalaryInput = (value: string): number => {
    return Number(value.replace(/[^0-9]/g, ''));
};
const allProvinces = japanRegions.flatMap(region =>
    region.prefectures.map(p => p.name)
);
export default function QuickEditJob({
    isQuickEditOpen,
    setIsQuickEditOpen
}: QuickEditJobProps) {
    const { postLoginAction, clearPostLoginAction, setPostLoginAction } = useAuth()
    const [editableJob, setEditableJob] = useState<Job>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [locationSearch, setLocationSearch] = useState('');
    const [isClosed, setIsClosed] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [newFormImageFile, setNewFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [locationSearchTerm, setLocationSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleFormImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewFormImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        if (!!editableJob?.visa) {
            const visa = formatVisa(editableJob.visa);
            const parentVisaSlug = Object.keys(visaDetailsByVisaType).find(key =>
                (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.name === visa)
            )
            const industries = CAREERS[parentVisaSlug as keyof typeof CAREERS];
            setAvailableIndustries(industries ?? []);
        } else {
            setAvailableIndustries([]);
        }
    }, [editableJob?.visa]);

    useEffect(() => {
        // done
        if (!!editableJob?.career && !!editableJob?.visa) {
            const visa = formatVisa(editableJob.visa);
            const parentVisaSlug = Object.keys(visaDetailsByVisaType).find(key =>
                (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.name === visa)
            )
            const visaCode = japanJobTypes.find(v => v.slug === parentVisaSlug)?.code;
            const parentIndustry = editableJob.career;
            const jobDetails = JOBS.filter(item => item.parent === parentIndustry && item.value.startsWith(visaCode || ''))?.map(j => j.label) || [];
            setAvailableJobDetails(jobDetails);
            // Reset job detail if industry changes
            if (!jobDetails.includes(editableJob.job as string)) {
                delete editableJob.job;
            }
        } else {
            setAvailableJobDetails([]);
        }
    }, [editableJob.career, setEditableJob]);
    useEffect(() => {
        if (postLoginAction?.type === 'QUICK_EDIT_JOB') {
            const { id, visa, job, career, basicSalary, realSalary, interviewDay, workLocation, avatar, aiContent, filter, formImage } = { ...postLoginAction.data };
            const editJob: any = {
                id, visa, job, career, basicSalary, realSalary, interviewDay, workLocation, avatar, aiContent, formImage
            }
            if (!!filter) {
                editJob.filter = filter
            }
            setEditableJob(editJob);
        }
    }, [postLoginAction])
    if (!editableJob) {
        return;
    }
    const handleSave = async () => {
        setIsSaving(true);
        const success = await updateJob(editableJob, newImageFile, newFormImageFile);
        if (success) {
            toast({
                title: 'Cập nhật nhanh việc làm thành công!',
                className: 'bg-green-500 text-white',
            });
            clearPostLoginAction();
            setPostLoginAction({ type: 'EDITED_JOB', data: editableJob });
            setIsQuickEditOpen(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Cập nhật nhanh việc làm không thành công!',
            });
        }
        setIsSaving(false);
    }
    return (

        <Dialog open={isQuickEditOpen} onOpenChange={setIsQuickEditOpen}>
            <DialogContent className="sm:max-w-xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa nhanh đơn hàng</DialogTitle>
                    <DialogDescription>
                        Thay đổi các thông tin chính của đơn hàng tại đây.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Hình ảnh</Label>
                        <div className="col-span-1">
                            <Label
                                htmlFor="image-upload-input-list"
                                className="relative flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors bg-secondary/50"
                            >
                                <Image
                                    src={imagePreview || editableJob.avatar || '/img/no-image.jpg'}
                                    alt="Ảnh xem trước"
                                    fill
                                    className="object-contain rounded-md p-1"
                                />
                                <Input
                                    id="image-upload-input-list"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                />
                            </Label>
                        </div>
                        <Label className="text-right">Form đơn</Label>
                        <div className="col-span-1">
                            <Label
                                htmlFor="image-upload-input-form"
                                className="relative flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors bg-secondary/50"
                            >
                                <Image
                                    src={formImagePreview || editableJob.formImage || '/img/no-image.jpg'}
                                    alt="Ảnh form Đơn"
                                    fill
                                    className="object-contain rounded-md p-1"
                                />
                                <Input
                                    id="image-upload-input-form"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleFormImageFileChange}
                                />
                            </Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="visa-edit" className="text-right">Loại Visa</Label>
                        <Select onValueChange={(value) => setEditableJob(prev => ({ ...prev, visa: value?.replace('Đặc định', 'Tokutei') ?? null }))} value={formatVisa(editableJob?.visa ?? '') ?? ''}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(visaDetailsByVisaType).map(([group, details]) => (
                                    <SelectGroup key={group}>
                                        <SelectLabel>{group}</SelectLabel>
                                        {(details as { name: string, slug: string }[]).map(d => <SelectItem key={d.slug} value={d.name}>{d.name}</SelectItem>)}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="industry-edit" className="text-right">Ngành nghề</Label>
                        <Select
                            value={editableJob.career || ''}
                            onValueChange={(value) => {
                                setEditableJob(prev => ({ ...prev, career: value }));
                            }}
                            disabled={!editableJob.visa}
                        >
                            <SelectTrigger className="col-span-3" id="industry-modal">
                                <SelectValue placeholder="Chọn ngành nghề" >
                                    {editableJob.career || "Chọn ngành nghề"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {availableIndustries.map((ind, index) => <SelectItem key={`${ind}-${index}`} value={ind}>{ind}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Chi tiết công việc</Label>
                        <Select
                            value={editableJob.job || undefined}
                            onValueChange={value => setEditableJob(prev => ({ ...prev, job: value }))}
                            disabled={!editableJob.career || availableJobDetails.length === 0}
                        >
                            <SelectTrigger
                                id="job-detail-modal"
                                className={cn("col-span-3", !editableJob.job && !editableJob.career && "text-xs italic text-muted-foreground")}
                            >
                                <SelectValue
                                    placeholder={editableJob.job ?? (!editableJob.career ? "Hãy chọn Ngành nghề mong muốn" : "Chọn công việc chi tiết")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {availableJobDetails.map(job => (
                                    <SelectItem key={job} value={job}>{job}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary-edit" className="text-right">Lương cơ bản</Label>
                        <div className="col-span-3 flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring">
                            <Input
                                id="salary-edit"
                                value={formatSalaryInput(editableJob.basicSalary)}
                                onChange={(e) => setEditableJob({ ...editableJob, basicSalary: parseSalaryInput(e.target.value) })}
                                className="border-0 focus-visible:ring-0"
                            />
                            <span className="bg-secondary px-3 py-2 text-sm text-muted-foreground rounded-r-md">JPY</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="net-salary-edit" className="text-right">Thực lĩnh</Label>
                        <div className="col-span-3 flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring">
                            <Input
                                id="net-salary-edit"
                                value={formatSalaryInput(editableJob.realSalary)}
                                onChange={(e) => setEditableJob({ ...editableJob, realSalary: parseSalaryInput(e.target.value) })}
                                className="border-0 focus-visible:ring-0"
                            />
                            <span className="bg-secondary px-3 py-2 text-sm text-muted-foreground rounded-r-md">JPY</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Ngày phỏng vấn</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editableJob.interviewDay ? editableJob.interviewDay : <span>Chọn ngày</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={editableJob.interviewDay ? parse(editableJob.interviewDay, 'dd-MM-yyyy', new Date()) : undefined}
                                    onSelect={(date) => {
                                        if (date) {
                                            setEditableJob((prev: any) => ({ ...prev, interviewDay: formatDate(date, 'dd-MM-yyyy') }));
                                        }
                                    }}
                                    today={undefined}
                                    initialFocus
                                    locale={vi}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Địa điểm</Label>
                        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className=" col-span-3 justify-start text-left font-normal h-auto min-h-10">
                                    <div className="truncate">
                                        {!!editableJob.workLocation?.length ? (
                                            editableJob.workLocation.split(', ').map(locName => {
                                                if (allProvinces.includes(locName)) {
                                                    return <Badge key={locName} variant="secondary" className='mr-1'>
                                                        {locName}
                                                    </Badge>
                                                }
                                            })
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
                                                            checked={region.prefectures.every(p => editableJob.workLocation?.includes(p.name))}
                                                            onCheckedChange={(checked) => {
                                                                const locations = editableJob.workLocation?.split(', ').filter(item => allProvinces.includes(item));
                                                                const currentSelection = new Set(locations || []);
                                                                region.prefectures.forEach(p => {
                                                                    if (checked) {
                                                                        currentSelection.add(p.name);
                                                                    } else {
                                                                        currentSelection.delete(p.name);
                                                                    }
                                                                });
                                                                setEditableJob(prev => ({ ...prev, workLocation: Array.from(currentSelection).join(', ') }));
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
                                                                        checked={editableJob.workLocation?.includes(p.name)}
                                                                        onCheckedChange={(checked) => {
                                                                            const locations = editableJob.workLocation?.split(', ').filter(item => allProvinces.includes(item));
                                                                            const currentSelection = new Set(locations || []);
                                                                            if (checked) {
                                                                                currentSelection.add(p.name);
                                                                            } else {
                                                                                currentSelection.delete(p.name);
                                                                            }
                                                                            setEditableJob(prev => ({ ...prev, workLocation: Array.from(currentSelection).join(', ') }));
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
                                    <Button onClick={() => setIsLocationDialogOpen(false)} disabled={isSaving}>Xác nhận</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Nội dung AI</Label>
                        <Textarea className="col-span-3" defaultValue={editableJob.aiContent} rows={5}
                            onChange={(e) => setEditableJob({ ...editableJob, aiContent: e.target.value })} />
                    </div>
                </div>
                <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsQuickEditOpen(false)}>Hủy</Button>
                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}