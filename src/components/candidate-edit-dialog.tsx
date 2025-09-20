
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { vi } from 'date-fns/locale';
import { CalendarIcon, Info, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JpFlagIcon, VnFlagIcon } from './custom-icons';
import type { CandidateProfile } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';

type EnrichedCandidateProfile = CandidateProfile & { avatarUrl?: string };

interface EditProfileDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSaveSuccess: () => void;
}

const parseMessengerInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    try {
        if (trimmedInput.startsWith('http') || trimmedInput.startsWith('www.')) {
            const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);
            
            if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
                if (url.pathname.includes('profile.php')) {
                    const id = url.searchParams.get('id');
                    if (id) return id;
                }
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                    const lastPart = pathParts[pathParts.length - 1];
                    if (lastPart !== 'profile.php' && lastPart !== 'home.php') {
                        return lastPart;
                    }
                }
            }
             if (url.hostname.includes('m.me')) {
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                     return pathParts[pathParts.length - 1];
                }
            }
        }
    } catch (error) {
        console.warn("Could not parse input as URL, treating as username:", error);
    }
    return trimmedInput.split('/').pop() || trimmedInput;
};

const parseZaloInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    if (trimmedInput.includes('zalo.me/')) {
        const parts = trimmedInput.split('/');
        return parts.pop()?.replace(/\D/g, '') || '';
    }
    return trimmedInput.replace(/\D/g, '');
};

const parseLineInput = (input: string): string => {
    if (!input) return '';
    return input.trim();
};

const formatPhoneNumberInput = (value: string, country: string): string => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');

    if (country === '+84') { // Vietnam (10 digits total)
        if (!cleanValue.startsWith('0')) return cleanValue.slice(0,9);

        const mobilePart = cleanValue.substring(1);
        if (mobilePart.length === 0) return '(0)';
        if (mobilePart.length <= 3) return `(0) ${mobilePart}`;
        if (mobilePart.length <= 6) return `(0) ${mobilePart.slice(0, 3)} ${mobilePart.slice(3)}`;
        return `(0) ${mobilePart.slice(0, 3)} ${mobilePart.slice(3, 6)} ${mobilePart.slice(6, 9)}`;
    }

    if (country === '+81') { // Japan (11 digits total starting with 0)
        if (!cleanValue.startsWith('0')) return cleanValue.slice(0,10);
        
        const mobilePart = cleanValue.substring(1); 
        if (mobilePart.length === 0) return '(0)';
        if (mobilePart.length <= 2) return `(0)${mobilePart}`;
        if (mobilePart.length <= 6) return `(0)${mobilePart.slice(0,2)} ${mobilePart.slice(2)}`;
        return `(0)${mobilePart.slice(0,2)} ${mobilePart.slice(2,6)} ${mobilePart.slice(6,10)}`;
    }

    return cleanValue;
};


const japaneseLevels = ["JLPT N5", "JLPT N4", "JLPT N3", "JLPT N2", "JLPT N1", "Kaiwa N5", "Kaiwa N4", "Kaiwa N3", "Kaiwa N2", "Kaiwa N1", "Trình độ tương đương N5", "Trình độ tương đương N4", "Trình độ tương đương N3", "Trình độ tương đương N2", "Trình độ tương đương N1"];
const englishLevels = ["Không yêu cầu", "Giao tiếp cơ bản", "Giao tiếp tốt", "TOEIC 400+", "TOEIC 500+", "TOEIC 600+", "TOEIC 700+", "TOEIC 800+", "TOEIC 900+", "IELTS 4.0+", "IELTS 5.0+", "IELTS 6.0+", "IELTS 7.0+"];


const renderLevel1Edit = (
    tempCandidate: EnrichedCandidateProfile,
    handleTempChange: (
        section: keyof EnrichedCandidateProfile | 'personalInfo',
        field: string,
        value: any
    ) => void,
    phoneCountry: string,
    setPhoneCountry: (value: string) => void,
    zaloCountry: string,
    setZaloCountry: (value: string) => void
) => {
    const height = parseInt(tempCandidate.personalInfo?.height || '160', 10);
    const weight = parseInt(tempCandidate.personalInfo?.weight || '50', 10);

    return (
        <div className="space-y-4">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle className="font-bold">Lưu ý quan trọng</AlertTitle>
                <AlertDescription>
                    Cần nhập đủ thông tin cá nhân và ít nhất 1 phương thức liên lạc (Zalo, SĐT...) để có thể sử dụng nút 
                    <Badge className="mx-1 bg-accent-orange text-white align-middle">Ứng tuyển</Badge> 
                    trên các tin tuyển dụng.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input value={tempCandidate.name} onChange={(e) => handleTempChange('name' as any, 'name' as any, e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label>Ngày sinh</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !tempCandidate.personalInfo.dateOfBirth && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tempCandidate.personalInfo.dateOfBirth ? (
                        format(new Date(tempCandidate.personalInfo.dateOfBirth), "dd/MM/yyyy")
                        ) : (
                        <span>Chọn ngày sinh</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        locale={vi}
                        selected={tempCandidate.personalInfo.dateOfBirth ? new Date(tempCandidate.personalInfo.dateOfBirth) : undefined}
                        onSelect={(date) => handleTempChange('personalInfo', 'dateOfBirth', date ? format(date, 'yyyy-MM-dd') : '')}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear() - 16}
                    />
                    </PopoverContent>
                </Popover>
                </div>
                <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select value={tempCandidate.personalInfo.gender || ''} onValueChange={value => handleTempChange('personalInfo', 'gender', value)}>
                    <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="japaneseProficiency">Năng lực tiếng Nhật</Label>
                    <Select value={tempCandidate.personalInfo.japaneseProficiency || ''} onValueChange={value => handleTempChange('personalInfo', 'japaneseProficiency', value)}>
                        <SelectTrigger id="japaneseProficiency">
                            <SelectValue placeholder="Chọn trình độ tiếng Nhật" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Không yêu cầu">Không yêu cầu</SelectItem>
                            {japaneseLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="englishProficiency">Năng lực tiếng Anh</Label>
                    <Select value={tempCandidate.personalInfo.englishProficiency || ''} onValueChange={value => handleTempChange('personalInfo', 'englishProficiency', value)}>
                        <SelectTrigger id="englishProficiency">
                            <SelectValue placeholder="Chọn trình độ tiếng Anh" />
                        </SelectTrigger>
                        <SelectContent>
                            {englishLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Chiều cao (cm)</Label>
                    <span className="text-sm font-semibold text-primary">{height} cm</span>
                </div>
                <Slider
                    value={[height]}
                    onValueChange={([value]) => handleTempChange('personalInfo', 'height', String(value))}
                    min={140}
                    max={205}
                    step={1}
                />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Cân nặng (kg)</Label>
                        <span className="text-sm font-semibold text-primary">{weight} kg</span>
                    </div>
                    <Slider
                        value={[weight]}
                        onValueChange={([value]) => handleTempChange('personalInfo', 'weight', String(value))}
                        min={40}
                        max={120}
                        step={1}
                    />
                </div>
                <div className="space-y-2">
                <Label>Hình xăm</Label>
                <Select value={tempCandidate.personalInfo.tattooStatus || ''} onValueChange={value => handleTempChange('personalInfo', 'tattooStatus', value)}>
                    <SelectTrigger><SelectValue placeholder="Chọn tình trạng hình xăm" /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Không có">Không có</SelectItem>
                    <SelectItem value="Có xăm nhỏ (kín)">Có xăm nhỏ (kín)</SelectItem>
                    <SelectItem value="Có xăm to (lộ)">Có xăm to (lộ)</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                <Label>Viêm gan B</Label>
                <Select value={tempCandidate.personalInfo.hepatitisBStatus || ''} onValueChange={value => handleTempChange('personalInfo', 'hepatitisBStatus', value)}>
                    <SelectTrigger><SelectValue placeholder="Chọn tình trạng viêm gan B" /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Không viêm gan B">Không viêm gan B</SelectItem>
                    <SelectItem value="Viêm gan B thể tĩnh">Viêm gan B thể tĩnh</SelectItem>
                    <SelectItem value="Viêm gan B thể động">Viêm gan B thể động</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="md:col-span-2 mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="flex items-center">
                            <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                            <SelectTrigger className="w-[100px] rounded-r-none">
                                <SelectValue>
                                <div className="flex items-center gap-2">
                                    {phoneCountry === '+84' ? <VnFlagIcon className="w-5 h-5 rounded-sm" /> : <JpFlagIcon className="w-5 h-5 rounded-sm" />}
                                    {phoneCountry}
                                </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+84"><div className="flex items-center gap-2"><VnFlagIcon className="w-5 h-5 rounded-sm" /> VN (+84)</div></SelectItem>
                                <SelectItem value="+81"><div className="flex items-center gap-2"><JpFlagIcon className="w-5 h-5 rounded-sm" /> JP (+81)</div></SelectItem>
                            </SelectContent>
                            </Select>
                            <Input id="phone" type="tel" placeholder={phoneCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempCandidate.personalInfo.phone || '', phoneCountry)} onChange={e => handleTempChange('personalInfo', 'phone', e.target.value.replace(/[^0-9]/g, ''))} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zalo">Zalo (Số điện thoại)</Label>
                        <div className="flex items-center relative">
                            <Select value={zaloCountry} onValueChange={setZaloCountry}>
                                <SelectTrigger className="w-[100px] rounded-r-none">
                                <SelectValue>
                                    <div className="flex items-center gap-2">
                                    {zaloCountry === '+84' ? <VnFlagIcon className="w-5 h-5 rounded-sm" /> : <JpFlagIcon className="w-5 h-5 rounded-sm" />}
                                    {zaloCountry}
                                    </div>
                                </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="+84"><div className="flex items-center gap-2"><VnFlagIcon className="w-5 h-5 rounded-sm" /> VN (+84)</div></SelectItem>
                                    <SelectItem value="+81"><div className="flex items-center gap-2"><JpFlagIcon className="w-5 h-5 rounded-sm" /> JP (+81)</div></SelectItem>
                                </SelectContent>
                            </Select>
                            <Input id="zalo" placeholder={zaloCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempCandidate.personalInfo.zalo || '', zaloCountry)} onChange={(e) => handleTempChange('personalInfo', 'zalo', e.target.value.replace(/\D/g, ''))} />
                            <Label htmlFor="zalo-qr-upload" className="absolute right-2 cursor-pointer text-muted-foreground hover:text-primary">
                                <QrCode className="h-5 w-5"/>
                            </Label>
                            <Input id="zalo-qr-upload" type="file" className="sr-only" accept="image/*" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="messenger">Facebook Messenger</Label>
                        <Input id="messenger" placeholder="Dán link Facebook / Messenger hoặc nhập username" value={tempCandidate.personalInfo.messenger || ''} onChange={(e) => handleTempChange('personalInfo', 'messenger', e.target.value)} />
                        <p className="text-xs text-muted-foreground">Hệ thống sẽ tự động lấy username của bạn.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="line">Line (Link hồ sơ)</Label>
                        <Input id="line" placeholder="Dán link Line của bạn vào đây" value={tempCandidate.personalInfo.line || ''} onChange={(e) => handleTempChange('personalInfo', 'line', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export function EditProfileDialog({ isOpen, onOpenChange, onSaveSuccess }: EditProfileDialogProps) {
    const [tempCandidate, setTempCandidate] = useState<EnrichedCandidateProfile | null>(null);
    const [phoneCountry, setPhoneCountry] = useState('+84');
    const [zaloCountry, setZaloCountry] = useState('+84');

    useEffect(() => {
        if (isOpen) {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            if (storedProfile) {
                setTempCandidate(JSON.parse(storedProfile));
            } else {
                 setTempCandidate({
                    name: '',
                    headline: '',
                    location: '',
                    about: '',
                    education: [],
                    experience: [],
                    personalInfo: { birthYear: 2000, gender: '', phone: '', japaneseProficiency: '', englishProficiency: '' },
                    skills: [],
                    interests: [],
                    certifications: [],
                    documents: {},
                    desiredIndustry: '',
                    aspirations: {},
                    notes: '',
                    videos: [],
                    images: [],
                });
            }
        }
    }, [isOpen]);

    const handleSave = () => {
        if (tempCandidate) {
            localStorage.setItem('generatedCandidateProfile', JSON.stringify(tempCandidate));
            onSaveSuccess();
            onOpenChange(false);
        }
    };

    const handleTempChange = (
        section: keyof EnrichedCandidateProfile | 'personalInfo' | 'aspirations' | 'documents',
        ...args: any[]
    ) => {
        setTempCandidate(prev => {
            if (!prev) return null;
            const newCandidate = JSON.parse(JSON.stringify(prev)); // Deep copy

            if (section === 'name') {
                 newCandidate.name = args[2];
            } else if (section === 'personalInfo' || section === 'aspirations') {
                const [field, value] = args;
                if (section === 'personalInfo' && field === 'messenger') {
                     newCandidate[section] = { ...newCandidate[section]!, [field]: parseMessengerInput(value) };
                } else if (section === 'personalInfo' && field === 'zalo') {
                    newCandidate[section] = { ...newCandidate[section]!, [field]: parseZaloInput(value) };
                } else if (section === 'personalInfo' && field === 'line') {
                     newCandidate[section] = { ...newCandidate[section]!, [field]: parseLineInput(value) };
                } else {
                     newCandidate[section] = { ...newCandidate[section], [field]: value };
                }
            } else {
                const [value] = args;
                 // @ts-ignore
                newCandidate[section] = value;
            }

            return newCandidate;
        });
    };

    if (!tempCandidate) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]" id="DIENTHONGTINCANHAN01">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Chỉnh sửa Thông tin Cá nhân</DialogTitle>
                    <DialogDescription>Cập nhật thông tin của bạn để nhà tuyển dụng có thể liên hệ.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    {renderLevel1Edit(tempCandidate, handleTempChange as any, phoneCountry, setPhoneCountry, zaloCountry, setZaloCountry)}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave} className="bg-primary text-white">
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    

    