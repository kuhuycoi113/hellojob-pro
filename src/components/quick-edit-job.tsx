import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Image from "next/image";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { allIndustries } from "@/lib/industry-data";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Check, ChevronsUpDown, EyeOff, MapPin } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Calendar } from "./ui/calendar";
import { ScrollArea } from "./ui/scroll-area";
import { visaDetailsByVisaType } from "@/lib/visa-data";
import { cn } from "@/lib/utils";
import { parse } from "date-fns";
import { vi } from "date-fns/locale";
import { allJapanLocations } from "@/lib/location-data";
import { toast } from "@/hooks/use-toast";

type Job = {
    title: string;
    company?: string;
    location?: string;
};

interface QuickEditJobProps {
    job: any;
    isQuickEditOpen: boolean;
    setIsQuickEditOpen: (open: boolean) => void;
}
const formatSalaryInput = (value: string | undefined): string => {
    if (!value) return '';
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
};

const parseSalaryInput = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
};
export default function QuickEditJob({
    job,
    isQuickEditOpen,
    setIsQuickEditOpen
}: QuickEditJobProps) {
    const [editableJob, setEditableJob] = useState<any>(job);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isJobDetailPopoverOpen, setIsJobDetailPopoverOpen] = useState(false);
    const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);
    const [interviewDate, setInterviewDate] = useState<string | null>(null);
    const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [locationSearch, setLocationSearch] = useState('');
    const [isClosed, setIsClosed] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    const handleImageFileChange = (e: any) => {

    }
    const handleQuickEditIndustryChange = () => {

    }
    const handleQuickEditJobDetailChange = (newDescription: string) => {
        setEditableJob((prev: any) => ({
            ...prev,
            details: { ...prev.details, description: newDescription }
        }));
    };
    const handleApplyLocations = () => {
        const locationNames = selectedLocations.map(slug => allJapanLocations.find(l => l.slug === slug)?.name).filter(Boolean).join(', ');
        setEditableJob((prev: any) => ({ ...prev, workLocation: locationNames }));
        setIsLocationPopoverOpen(false);
    };

    const handleCloseJob = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const closedJobs = JSON.parse(localStorage.getItem('closedJobs') || '[]');
        if (!closedJobs.includes(job.id)) {
            closedJobs.push(job.id);
            localStorage.setItem('closedJobs', JSON.stringify(closedJobs));
            setIsClosed(true);
            toast({
                title: "Đã đóng đơn",
                description: "Việc làm này sẽ được ẩn đi.",
            });
        }
    };
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
                        <div className="col-span-3">
                            <Label
                                htmlFor="image-upload-input-list"
                                className="relative flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors bg-secondary/50"
                            >
                                <Image
                                    src={imagePreview || editableJob.image.src}
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
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title-edit" className="text-right">Tiêu đề</Label>
                        <Input id="title-edit" value={editableJob.title} onChange={(e) => setEditableJob({ ...editableJob, title: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="visa-edit" className="text-right">Loại Visa</Label>
                        <Select onValueChange={(value) => setEditableJob({ ...editableJob, visaDetail: value })} value={editableJob.visaDetail}>
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
                        <Select onValueChange={handleQuickEditIndustryChange} value={editableJob.industry}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {allIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Chi tiết công việc</Label>
                        <Popover open={isJobDetailPopoverOpen} onOpenChange={setIsJobDetailPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isJobDetailPopoverOpen}
                                    className="col-span-3 justify-between font-normal"
                                    disabled={availableJobDetails.length === 0}
                                >
                                    <span className="truncate">
                                        {editableJob.details.description.match(/Chi tiết công việc: ([^.]*)/)?.[1]?.trim() || "Chọn công việc chi tiết"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder="Tìm công việc..." />
                                    <CommandList>
                                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                        <CommandGroup>
                                            {availableJobDetails.map((detail) => (
                                                <CommandItem
                                                    key={detail}
                                                    value={detail}
                                                    onSelect={(currentValue) => {
                                                        const newDescription = `Chi tiết công việc: ${currentValue}. ${editableJob.details.description.replace(/Chi tiết công việc: [^.]*\.?/, '').trim()}`;
                                                        handleQuickEditJobDetailChange(newDescription);
                                                        setIsJobDetailPopoverOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            editableJob.details.description.includes(`Chi tiết công việc: ${detail}`) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {detail}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary-edit" className="text-right">Lương cơ bản</Label>
                        <div className="col-span-3 flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring">
                            <Input
                                id="salary-edit"
                                value={formatSalaryInput(editableJob.salary.basic)}
                                onChange={(e) => setEditableJob({ ...editableJob, salary: { ...editableJob.salary, basic: parseSalaryInput(e.target.value) } })}
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
                                value={formatSalaryInput(editableJob.salary.actual || '')}
                                onChange={(e) => setEditableJob({ ...editableJob, salary: { ...editableJob.salary, actual: parseSalaryInput(e.target.value) } })}
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
                                    {interviewDate ? interviewDate : <span>Chọn ngày</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={interviewDate ? parse(interviewDate, 'dd/MM/yyyy', new Date()) : undefined}
                                    onSelect={(date) => {
                                        if (date) {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const newOffset = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                            setEditableJob((prev: any) => ({ ...prev, interviewDateOffset: newOffset }));
                                        }
                                    }}
                                    initialFocus
                                    locale={vi}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Địa điểm</Label>
                        <Popover open={isLocationPopoverOpen} onOpenChange={setIsLocationPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="col-span-3 justify-start">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <span className="truncate">
                                        {selectedLocations.length > 0 ? selectedLocations.map(slug => allJapanLocations.find(l => l.slug === slug)?.name).filter(Boolean).join(', ') : 'Chọn địa điểm'}
                                    </span>
                                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-2" align="start">
                                <Input
                                    placeholder="Tìm tỉnh thành..."
                                    className="mb-2"
                                    value={locationSearch}
                                    onChange={(e) => setLocationSearch(e.target.value)}
                                />
                                <ScrollArea className="h-[250px]">
                                    <div className="flex flex-wrap gap-2 p-2">
                                        {allJapanLocations
                                            .filter(prefecture => prefecture.name.toLowerCase().includes(locationSearch.toLowerCase()))
                                            .map(prefecture => {
                                                const isSelected = selectedLocations.includes(prefecture.slug);
                                                return (
                                                    <Button
                                                        key={prefecture.slug}
                                                        variant={isSelected ? "default" : "outline"}
                                                        size="sm"
                                                        className="h-auto px-2 py-1"
                                                        onClick={() => {
                                                            const newSelection = isSelected
                                                                ? selectedLocations.filter(s => s !== prefecture.slug)
                                                                : [...selectedLocations, prefecture.slug];
                                                            setSelectedLocations(newSelection);
                                                        }}
                                                    >
                                                        {prefecture.name}
                                                    </Button>
                                                );
                                            })}
                                    </div>
                                </ScrollArea>
                                <div className="p-2 border-t mt-2">
                                    <Button onClick={handleApplyLocations} size="sm" className="w-full">
                                        Áp dụng điền vào
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
                    <Button variant="destructive" onClick={(e) => { handleCloseJob(e); setIsQuickEditOpen(false); }} className="sm:mr-auto">
                        <EyeOff className="mr-2 h-4 w-4" /> Đóng đơn
                    </Button>
                    <Button variant="outline" onClick={() => setIsQuickEditOpen(false)}>Hủy</Button>
                    <Button onClick={() => {
                        let finalJobState = { ...editableJob };
                        if (imagePreview) {
                            finalJobState.image = { ...finalJobState.image, src: imagePreview };
                        }
                        const updatedJobs = JSON.parse(localStorage.getItem('updatedJobs') || '{}');
                        updatedJobs[job.id] = { ...updatedJobs[job.id], ...finalJobState };
                        localStorage.setItem('updatedJobs', JSON.stringify(updatedJobs));
                        setEditableJob(finalJobState);
                        toast({ title: "Đã lưu thay đổi!" });
                        setIsQuickEditOpen(false);
                        setImagePreview(null);
                        setNewImageFile(null);
                    }}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}