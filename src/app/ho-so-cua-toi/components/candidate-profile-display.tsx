'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Edit, GraduationCap, School, User, Award, Star, FileDown, PlusCircle, Trash2, RefreshCw, X, Camera, Trophy, LogOut, Target, FilePen, Send, FileArchive, UploadCloud, CakeIcon } from 'lucide-react';
import Image from 'next/image';
import { auth as firebaseAuth } from "@/lib/firebase";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PdfIcon } from '@/components/custom-icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EditProfileDialog } from '@/app/ho-so-cua-toi/components/candidate-edit-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { signOut } from 'firebase/auth';
import { DownloadProfileDialog } from './download-profile-dialog';
import { EditDialog } from './edit-dialog';
import { DocumentGrid } from './document-grid';
import { PersonalInfoCard } from './personal-info-card';
import { SendProfileDialog } from './send-profile-dialog';
import { MediaCarousel } from './media-carousel';
import { BodyPhotosCarousel } from './body-photos-carousel';
import { SendOptionsDialog } from './send-options-dialog';
import { format, formatDate } from "date-fns";
import { visaDetailsByVisaType } from '@/lib/visa-data';
import { NameAvatar } from '@/components/ui/name-avatar';
import { updateAvatar } from '@/actions/user-action';
import { EditAspirationsDialog } from '@/app/viec-lam-cua-toi/components/edit-aspirations-dialog';
import { Share } from 'next/font/google';
import { ShareProfileDialog } from './share-profile-dialog';
const translations = {
    vi: {
        personalInfo: "Thông tin cá nhân",
        dateOfBirth: "Ngày sinh",
        gender: "Giới tính",
        height: "Chiều cao",
        weight: "Cân nặng",
        tattoo: "Hình xăm",
        hepatitisB: "Viêm gan B",
        japaneseProficiency: "Năng lực tiếng Nhật",
        englishProficiency: "Năng lực tiếng Anh",
        documentsSection: "Hồ sơ/Giấy tờ",
        vietnamDocs: "Giấy tờ Việt Nam",
        japanDocs: "Giầy tờ Nhật Bản",
        otherDocs: "Giấy tờ nước ngoài/Du học",
        aspirations: "Nguyện vọng",
        desiredIndustry: "Ngành nghề",
        desiredJobDetail: "Công việc chi tiết",
        desiredVisaType: "Loại Visa",
        desiredVisaDetail: "Chi tiết loại hình visa mong muốn",
        desiredLocation: "Địa điểm",
        desiredSalary: "Lương cơ bản",
        desiredNetSalary: "Thực lĩnh",
        financialAbility: "Khả năng tài chính",
        interviewLocation: "Nơi phỏng vấn",
        interviewDate: "Ngày phỏng vấn",
        specialAspirations: "Yêu cầu khác",
        about: "Giới thiệu bản thân",
        workExperience: "Kinh nghiệm làm việc",
        education: "Học vấn",
        skillsAndInterests: "Kỹ năng & Lĩnh vực",
        skills: "Kỹ năng",
        interests: "Lĩnh vực quan tâm",
        certifications: "Chứng chỉ & Giải thưởng",
        notes: "Ghi chú",
        videos: "Video",
        bodyPhotos: "Ảnh hình thể",
        noInfo: "Chưa cập nhật",
        clickToUpdate: "Nhấn vào đây để cập nhật",
    }
}
const emptyCandidate: EnrichedCandidateProfile = {
    name: '',
    headline: '',
    location: '',
    about: '',
    education: [],
    experience: [],
    personalInfo: {},
    aspirations: {},
    interests: [],
    skills: [],
    certifications: [],
    documents: {
        vietnam: ['Xác nhận cư trú', 'Xác nhận dân sự', 'Căn cước mặt trước', 'Căn cước mặt sau', 'Hộ chiếu mặt trước', 'Hộ chiếu mặt sau', 'Giấy khám sức khỏe', 'Bằng học vấn', 'Xác nhận tình trạng hôn nhân', 'Giấy tờ khác'].map(name => ({ name: { vi: name }, isDefault: true })),
        japan: ['Thẻ ngoại kiều mặt trước', 'Thẻ ngoại kiều mặt sau', 'Ảnh CV gốc mặt trước', 'Ảnh CV gốc mặt sau', 'Giấy kết thúc 3 năm mặt trước', 'Giấy kết thúc 3 năm mặt sau', 'Chứng chỉ tokutei', 'Chứng chỉ tiếng Nhật', 'Giấy Shiteisho', 'Giấy đánh giá Hyokachoso', 'Giấy tờ khác'].map(name => ({ name: { vi: name }, isDefault: true })),
        other: ['Thẻ ID', 'Bằng ngoại ngữ', 'Sổ tiết kiệm', 'Xác nhận công việc người bảo lãnh 1', 'Xác nhận công việc người bảo lãnh 2', 'Thẻ ID người bảo lãnh 1', 'Thẻ ID người bảo lãnh 2', 'Giấy tờ khác'].map(name => ({ name: { vi: name }, isDefault: true })),
    },
    videos: [],
    images: [],
};
const commonSkills = ['Vận hành máy CNC', 'AutoCAD', 'Kiểm tra chất lượng', 'Làm việc nhóm', 'Giải quyết vấn đề', 'Tiếng Anh giao tiếp'];
const formatYen = (value?: string) => {
    if (!value) return 'N/A';

    const numericValue = typeof value === 'string'
        ? parseInt(value.replace(/[^0-9]/g, ''), 10)
        : value;

    if (isNaN(numericValue)) return 'N/A';
    return `${numericValue.toLocaleString('ja-JP')} yên`;
};
export default function CandidateProfileDisplay({ user, role }: { user: any, role: string }) {
    const { toast } = useToast();
    // const { role, user } = useAuth();
    const [profileByLang, setProfileByLang] = useState<ProfilesByLang>({ vi: null, ja: null, en: null });
    const [newSkill, setNewSkill] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [currentLang, setCurrentLang] = useState<'vi'>('vi');
    const [isSendOptionsOpen, setIsSendOptionsOpen] = useState(false);
    const [languageToSend, setLanguageToSend] = useState('');
    const [isNewProfile, setIsNewProfile] = useState(false);
    const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
    const [activeDocTab, setActiveDocTab] = useState('japan');
    const isMobile = useIsMobile();
    const [isAddDocDialogOpen, setIsAddDocDialogOpen] = useState(false);
    const [currentDocTypeToAdd, setCurrentDocTypeToAdd] = useState<'vietnam' | 'japan' | 'other' | null>(null);
    const [newDocName, setNewDocName] = useState<DocumentName>({ vi: '', ja: '', en: '' });
    const [newDocFile, setNewDocFile] = useState<File | null>(null);
    const [newDocFilePreview, setNewDocFilePreview] = useState<string | null>(null);
    const [expandedGrids, setExpandedGrids] = useState({ vietnam: false, japan: false, other: false });
    const [lastDocumentsState, setLastDocumentsState] = useState<EnrichedCandidateProfile['documents'] | null>(null);

    const [isAspirationsDialogOpen, setIsAspirationsDialogOpen] = useState(false);

    useEffect(() => {
        let isNew = false;
        let profileToLoad: EnrichedCandidateProfile;

        const defaultImages: MediaItem[] = [
            { src: 'https://placehold.co/400x600.png', alt: 'Ảnh trước', "data-ai-hint": 'front view portrait' },
            { src: 'https://placehold.co/400x600.png', alt: 'Ảnh trái', "data-ai-hint": 'left side portrait' },
            { src: 'https://placehold.co/400x600.png', alt: 'Ảnh phải', "data-ai-hint": 'right side portrait' },
            { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân trước', "data-ai-hint": 'full body front' },
            { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân trái', "data-ai-hint": 'full body left' },
            { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân phải', "data-ai-hint": 'full body right' },
        ];

        const defaultVideos: MediaItem[] = [
            { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Giới thiệu bản thân', "data-ai-hint": 'self introduction video' },
            { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Tay nghề 1', "data-ai-hint": 'skill demonstration' },
            { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Tay nghề 2', "data-ai-hint": 'welding skill' },
        ];


        // Normalize documents structure
        // if (parsedProfile.documents) {
        //     Object.keys(parsedProfile.documents).forEach(docType => {
        //         if (Array.isArray(parsedProfile.documents[docType])) {
        //             parsedProfile.documents[docType] = parsedProfile.documents[docType].map((doc: any) => {
        //                 if (typeof doc === 'string') return { name: { vi: doc } };
        //                 if (typeof doc.name === 'string') return { ...doc, name: { vi: doc.name } };
        //                 return doc;
        //             });
        //         }
        //     });
        // }
        const loadedUser: any = user ?? {};
        profileToLoad = {
            ...emptyCandidate,
            ...loadedUser,
            personalInfo: { ...emptyCandidate.personalInfo, ...loadedUser.personalInfo },
            aspirations: { ...emptyCandidate.aspirations, ...loadedUser.aspirations },
            documents: loadedUser.documents ? loadedUser.documents : emptyCandidate.documents,
            avatarUrl: loadedUser.avatarUrl || undefined,
            videos: loadedUser?.videos ?? defaultVideos,
            images: loadedUser?.images ?? defaultImages,
        };
        setProfileByLang({ vi: profileToLoad, ja: null, en: null });
        setIsNewProfile(isNew);
    }, [role]);

    const handleSave = (updatedCandidate: EnrichedCandidateProfile) => {
        setProfileByLang({ vi: updatedCandidate, ja: null, en: null });
        setCurrentLang('vi');
        setIsNewProfile(false);
    };

    useEffect(() => {
        if (profileByLang.vi && (role === 'candidate')) {
            localStorage.setItem('generatedCandidateProfile', JSON.stringify(profileByLang.vi));
            // Manually trigger a storage event so the header updates
            window.dispatchEvent(new Event('storage'));
        }
    }, [profileByLang.vi, role]);



    const getDisplayedProfile = (): EnrichedCandidateProfile | null => {
        const { vi, ja, en } = profileByLang;
        if (!vi) return null;

        const baseProfile = vi;
        const translatedProfile = profileByLang[currentLang];

        if (currentLang === 'vi' || !translatedProfile) {
            return baseProfile;
        }

        const mergeDeep = (target: any, source: any): any => {
            const output = { ...target };
            if (isObject(target) && isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (isObject(source[key])) {
                        if (!(key in target))
                            Object.assign(output, { [key]: source[key] });
                        else
                            output[key] = mergeDeep(target[key], source[key]);
                    } else if (Array.isArray(source[key])) {
                        if (key === 'skills' || key === 'interests' || key === 'certifications' || key === 'specialAspirations') {
                            Object.assign(output, { [key]: source[key] });
                        } else if (key === 'education' || key === 'experience') {
                            const targetArray = target[key] || [];
                            const sourceArray = source[key] || [];
                            output[key] = targetArray.map((item: any, index: number) => {
                                if (sourceArray[index]) {
                                    return mergeDeep(item, sourceArray[index]);
                                }
                                return item;
                            });
                        }
                    } else if (source[key] !== undefined && source[key] !== null) {
                        Object.assign(output, { [key]: source[key] });
                    }
                });
            }
            return output;
        };

        const isObject = (item: any) => {
            return (item && typeof item === 'object' && !Array.isArray(item));
        };

        return mergeDeep(baseProfile, translatedProfile) as EnrichedCandidateProfile;
    };

    const candidate = getDisplayedProfile();
    const t = translations[currentLang];
    const notUpdatedText = <span className="text-muted-foreground italic">{t.noInfo}</span>;


    if (!candidate) {
        return (
            <div className="bg-secondary">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-5xl mx-auto">
                        <Card className="shadow-2xl overflow-hidden">
                            <CardHeader className="p-0">
                                <Skeleton className="h-32 bg-gray-300" />
                                <div className="p-6 flex flex-col md:flex-row items-center md:items-end -mt-16">
                                    <Skeleton className="h-32 w-32 rounded-full border-4 border-background bg-gray-400" />
                                    <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left space-y-2">
                                        <Skeleton className="h-8 w-64" />
                                        <Skeleton className="h-6 w-80" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Skeleton className="h-96 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    const handleMediaChange = (type: 'avatar' | 'image' | 'document', e: React.ChangeEvent<HTMLInputElement>, index?: number, docType?: 'vietnam' | 'japan' | 'other') => {
        const file = e.target.files?.[0];
        if (file && profileByLang.vi) {
            const reader = new FileReader();
            reader.onload = async () => {
                const newUrl = reader.result as string;
                const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
                if (type === 'avatar') {
                    if (!!user) {
                        debugger
                        const newAvatarUrl = await updateAvatar(user.uid, user.avatarUrl, file)
                        user.avatarUrl = newAvatarUrl;
                        toast({
                            title: "Cập nhật Avatar thành công!",
                            description: "Bạn đã cập nhật Avatar thành công. Avatar sẽ giúp bạn tiếp cận được nhiều nhà tuyển dụng hơn.",
                            className: 'bg-green-500 text-white'
                        });
                    }

                } else if (type === 'image' && index !== undefined) {
                    newProfile.images[index].src = newUrl;
                } else if (type === 'document' && docType && index !== undefined) {
                    if (!newProfile.documents) newProfile.documents = {};
                    if (!newProfile.documents[docType]) newProfile.documents[docType] = [];
                    newProfile.documents[docType][index].url = newUrl;
                    newProfile.documents[docType][index].fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
                }

                setProfileByLang({ vi: newProfile, ja: null, en: null });
                setCurrentLang('vi');

                localStorage.setItem('generatedCandidateProfile', JSON.stringify(newProfile));
                window.dispatchEvent(new Event('storage'));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = (section: 'experience' | 'education' | 'certifications' | 'documents', docType: 'vietnam' | 'japan' | 'other', newDoc?: DocumentItem) => {
        if (!profileByLang.vi) return;
        const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
        if (section === 'experience') {
            newProfile.experience.push({ company: '', role: '', period: '', description: '' });
        } else if (section === 'education') {
            newProfile.education.push({ school: '', degree: '', gradYear: new Date().getFullYear() });
        } else if (section === 'certifications') {
            newProfile.certifications.push('');
        } else if (section === 'documents' && docType && newDoc) {
            if (!newProfile.documents) {
                newProfile.documents = { vietnam: [], japan: [], other: [] };
            }
            if (!newProfile.documents[docType]) {
                newProfile.documents[docType] = [];
            }
            newProfile.documents[docType].push(newDoc);
        }
        setProfileByLang({ vi: newProfile, ja: null, en: null });
        setCurrentLang('vi');
    };

    const handleRemoveItem = (
        section: 'experience' | 'education' | 'certifications' | 'skills' | 'interests' | 'documents',
        indexOrValue: number | string,
        docType?: 'vietnam' | 'japan' | 'other'
    ) => {
        if (!profileByLang.vi) return;
        const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
        if (section === 'skills' || section === 'interests') {
            // @ts-ignore
            newProfile[section] = newProfile[section].filter(item => item !== indexOrValue);
        } else if (section === 'documents' && docType && typeof indexOrValue === 'number') {
            // @ts-ignore
            newProfile.documents[docType].splice(indexOrValue, 1);
        } else if (typeof indexOrValue === 'number') {
            // @ts-ignore
            newProfile[section].splice(indexOrValue, 1);
        }
        setProfileByLang({ vi: newProfile, ja: null, en: null });
        setCurrentLang('vi');
    };

    const handleAddNewChip = (field: 'skills' | 'interests') => {
        if (!profileByLang.vi) return;
        const valueToAdd = field === 'skills' ? newSkill.trim() : newInterest.trim();
        if (valueToAdd && !profileByLang.vi[field].includes(valueToAdd)) {
            const newProfile = {
                ...profileByLang.vi,
                [field]: [...profileByLang.vi[field], valueToAdd],
            };
            setProfileByLang({ vi: newProfile, ja: null, en: null });
            setCurrentLang('vi');
            if (field === 'skills') {
                setNewSkill('');
            } else {
                setNewInterest('');
            }
        }
    };

    const handleOpenAddDocDialog = (docType: 'vietnam' | 'japan' | 'other') => {
        setCurrentDocTypeToAdd(docType);
        setNewDocName({ vi: '', ja: '', en: '' });
        setNewDocFile(null);
        setNewDocFilePreview(null);
        setIsAddDocDialogOpen(true);
    };

    const handleAddNewDocument = () => {
        if (newDocName.vi.trim() && newDocFilePreview && currentDocTypeToAdd) {
            handleAddItem('documents', currentDocTypeToAdd, {
                name: newDocName,
                url: newDocFilePreview,
                isDefault: false,
                fileType: newDocFile?.type.startsWith('image/') ? 'image' : 'pdf'
            });
            setIsAddDocDialogOpen(false);
            setExpandedGrids(prev => ({ ...prev, [currentDocTypeToAdd]: true }));
        } else {
            toast({
                variant: "destructive",
                title: "Thông tin chưa đủ",
                description: "Vui lòng nhập tên Tiếng Việt và tải lên tệp cho giấy tờ.",
            });
        }
    };

    const handleNewDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewDocFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewDocFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRestoreDocuments = () => {
        if (!profileByLang.vi) return;
        const currentDocs = profileByLang.vi.documents;
        setLastDocumentsState(JSON.parse(JSON.stringify(currentDocs))); // Save current state for undo

        const defaultDocs = emptyCandidate.documents || { vietnam: [], japan: [], other: [] };
        const newDocs: EnrichedCandidateProfile['documents'] = { vietnam: [], japan: [], other: [] };

        for (const type of ['vietnam', 'japan', 'other'] as const) {
            const restoredDocsForType: DocumentItem[] = [];
            const defaultDocNames = new Set(defaultDocs[type]?.map(d => d.name.vi));

            // 1. Preserve default docs with uploaded images
            defaultDocs[type]?.forEach(defaultDoc => {
                const currentDoc = currentDocs?.[type]?.find(d => d.name.vi === defaultDoc.name.vi);
                if (currentDoc && currentDoc.url) {
                    restoredDocsForType.push(currentDoc);
                } else {
                    restoredDocsForType.push(defaultDoc);
                }
            });

            // 2. Preserve user-added docs with uploaded images
            currentDocs?.[type]?.forEach(currentDoc => {
                if (!defaultDocNames.has(currentDoc.name.vi) && currentDoc.url) {
                    restoredDocsForType.push(currentDoc);
                }
            });

            newDocs[type] = restoredDocsForType;
        }

        const newProfile = { ...profileByLang.vi, documents: newDocs };
        setProfileByLang({ vi: newProfile, ja: null, en: null });
        setCurrentLang('vi');

        toast({
            title: "Khôi phục thành công!",
            description: "Danh sách giấy tờ đã được khôi phục.",
            action: (
                <Button variant="ghost" onClick={handleUndoRestore}>Hoàn tác</Button>
            ),
        });
    };

    const handleUndoRestore = () => {
        if (lastDocumentsState && profileByLang.vi) {
            const newProfile = { ...profileByLang.vi, documents: lastDocumentsState };
            setProfileByLang({ vi: newProfile, ja: null, en: null });
            setCurrentLang('vi');
            setLastDocumentsState(null); // Clear undo state
            toast({
                title: "Đã hoàn tác!",
                description: "Danh sách giấy tờ đã được quay lại như cũ.",
            });
        }
    };

    const editButtonText = isNewProfile ? 'Tạo hồ sơ' : 'Sửa hồ sơ';

    const handleLogout = async () => {
        await signOut(firebaseAuth);
        window.location.href = '/';
    };
    const notPreview = role !== 'previewer';
    return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <Card className="shadow-2xl overflow-hidden">
                        <CardHeader className="p-0">
                            <div className="bg-gradient-to-tr from-primary to-accent h-32" />
                            <div className="p-6 flex flex-col md:flex-row items-center md:items-end -mt-16">
                                <div className="relative group">
                                    <NameAvatar src={user?.avatarUrl} fullName={user?.personalInfo?.fullName} size={128} />
                                    {/* <Avatar id="PROFILEAVATAR01" className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                                        <AvatarImage id="PROFILEAVATAR03" src={user?.avatarUrl || undefined} alt={user?.personalInfo?.fullName} data-ai-hint="professional headshot" className="object-cover" />
                                        <AvatarFallback><b>{user?.personalInfo?.fullName?.charAt(0)?.toUpperCase()}</b></AvatarFallback>
                                    </Avatar> */}
                                    <Label htmlFor="avatar-upload" className="absolute bottom-1 right-1 cursor-pointer bg-black/50 text-white p-2 rounded-full group-hover:bg-black/70 transition-colors">
                                        <Camera className="h-5 w-5" />
                                        <span className="sr-only">Change avatar</span>
                                    </Label>
                                    <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleMediaChange('avatar', e)} />
                                </div>
                                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                    <h1 className="text-3xl font-headline font-bold" style={{ textTransform: 'capitalize' }}>{user?.personalInfo?.fullName || 'Chưa có tên'}</h1>
                                    <p className="text-muted-foreground">{user?.profileHeadline || 'Cập nhật hồ sơ của bạn'}</p>
                                    <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                                        <CakeIcon className="h-4 w-4" /> {user?.personalInfo?.dateOfBirth ? format(user?.personalInfo?.dateOfBirth, 'dd/MM/yyyy') : 'Chưa cập nhật'}
                                    </p>
                                </div>
                                {notPreview &&
                                    <div className="md:ml-auto mt-4 md:mt-0 flex items-center gap-2">
                                        <DownloadProfileDialog>
                                            <Button variant="outline" size="icon" className="sm:hidden"><FileDown /></Button>
                                        </DownloadProfileDialog>
                                        <DownloadProfileDialog>
                                            <Button variant="outline" className="hidden sm:inline-flex"><FileDown /> Tải hồ sơ</Button>
                                        </DownloadProfileDialog>
                                        <ShareProfileDialog uid={user?.id || ''}>
                                            <div>
                                                <Button variant="outline" size="icon" className="sm:hidden"><Send /></Button>
                                                <Button variant="outline" className="hidden sm:inline-flex"><Send /> Gửi hồ sơ</Button>
                                            </div>
                                        </ShareProfileDialog>
                                        <Button variant="outline" size="icon" className="sm:hidden" onClick={() => setIsProfileEditDialogOpen(true)}><Edit /></Button>
                                        <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setIsProfileEditDialogOpen(true)}><Edit /> {editButtonText}</Button>
                                    </div>
                                }
                            </div>
                        </CardHeader>

                        {/* Mobile Personal Info Card */}
                        <div className="p-6 pt-0 lg:hidden">
                            <PersonalInfoCard candidate={candidate} setIsProfileEditDialogOpen={setIsProfileEditDialogOpen} translation={t} />
                        </div>

                        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><User className="mr-3 text-primary" />{t.about}</CardTitle>
                                        {notPreview && <EditDialog
                                            title="Chỉnh sửa Giới thiệu bản thân"
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => <Textarea value={temp.about} onChange={e => handleChange('about', e.target.value)} rows={6} />}
                                            candidate={profileByLang.vi!}
                                            description="Viết một đoạn giới thiệu ngắn về bản thân, kỹ năng và mục tiêu nghề nghiệp của bạn."
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>}
                                    </CardHeader>
                                    <CardContent>
                                        {candidate.about ? (
                                            <p className="text-muted-foreground whitespace-pre-line">{candidate.about}</p>
                                        ) : (
                                            <div className="text-muted-foreground">
                                                <span>{notUpdatedText}</span>
                                                {notPreview && <EditDialog title="Chỉnh sửa Giới thiệu bản thân" onSave={handleSave} renderContent={(temp, handleChange) => <Textarea value={temp.about} onChange={e => handleChange('about', e.target.value)} rows={6} />} candidate={profileByLang.vi!}>
                                                    <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                </EditDialog>}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {candidate.videos.length > 0 && <MediaCarousel items={candidate.videos} title={t.videos} />}

                                {candidate.images.length > 0 && <BodyPhotosCarousel items={candidate.images} onImageChange={(e, index) => handleMediaChange('image', e, index)} translation={t} />}


                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><Briefcase className="mr-3 text-primary" />{t.workExperience}</CardTitle>
                                        {notPreview && <EditDialog
                                            title="Chỉnh sửa Kinh nghiệm làm việc"
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => (
                                                <div className="space-y-6">
                                                    {temp.experience.map((exp: any, index: number) => (
                                                        <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="font-bold">Kinh nghiệm #{index + 1}</h4>
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('experience', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                            </div>
                                                            <Label>Vai trò</Label><Input value={exp.role} onChange={e => handleChange('experience', index, 'role', e.target.value)} />
                                                            <Label>Công ty</Label><Input value={exp.company} onChange={e => handleChange('experience', index, 'company', e.target.value)} />
                                                            <Label>Thời gian</Label><Input value={exp.period} onChange={e => handleChange('experience', index, 'period', e.target.value)} />
                                                            <Label>Mô tả</Label><Textarea value={exp.description} onChange={e => handleChange('experience', index, 'description', e.target.value)} />
                                                        </div>
                                                    ))}
                                                    <Button variant="outline" className="w-full" onClick={() => handleAddItem('experience', 'vietnam', undefined)}><PlusCircle className="mr-2" /> Thêm kinh nghiệm</Button>
                                                </div>
                                            )}
                                            candidate={profileByLang.vi!}
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {candidate.experience.length > 0 ? candidate.experience.map((exp: any, index: number) => (
                                            <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                                                <h4 className="font-bold">{exp.role}</h4>
                                                <p className="font-semibold text-sm text-primary">{exp.company}</p>
                                                <p className="text-xs text-muted-foreground mb-1">{exp.period}</p>
                                                <p className="text-sm text-muted-foreground">{exp.description}</p>
                                            </div>
                                        )) : (
                                            <div className="text-muted-foreground">
                                                <span>{notUpdatedText}</span>
                                                {notPreview && <EditDialog title="Chỉnh sửa Kinh nghiệm làm việc" onSave={handleSave} renderContent={(temp, handleChange) => (
                                                    <div className="space-y-6">
                                                        {temp.experience.map((exp: any, index: number) => (
                                                            <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <h4 className="font-bold">Kinh nghiệm #{index + 1}</h4>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('experience', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                                </div>
                                                                <Label>Vai trò</Label><Input value={exp.role} onChange={e => handleChange('experience', index, 'role', e.target.value)} />
                                                                <Label>Công ty</Label><Input value={exp.company} onChange={e => handleChange('experience', index, 'company', e.target.value)} />
                                                                <Label>Thời gian</Label><Input value={exp.period} onChange={e => handleChange('experience', index, 'period', e.target.value)} />
                                                                <Label>Mô tả</Label><Textarea value={exp.description} onChange={e => handleChange('experience', index, 'description', e.target.value)} />
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" className="w-full" onClick={() => handleAddItem('experience', 'vietnam', undefined)}><PlusCircle className="mr-2" /> Thêm kinh nghiệm</Button>
                                                    </div>
                                                )} candidate={profileByLang.vi!}>
                                                    <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                </EditDialog>}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><GraduationCap className="mr-3 text-primary" />{t.education}</CardTitle>
                                        {notPreview && <EditDialog
                                            title="Chỉnh sửa Học vấn"
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => (
                                                <div className="space-y-6">
                                                    {temp.education.map((edu: any, index: number) => (
                                                        <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="font-bold">Học vấn #{index + 1}</h4>
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('education', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                            </div>
                                                            <Label>Trường</Label><Input value={edu.school} onChange={e => handleChange('education', index, 'school', e.target.value)} />
                                                            <Label>Chuyên ngành</Label><Input value={edu.degree} onChange={e => handleChange('education', index, 'degree', e.target.value)} />
                                                            <Label>Năm tốt nghiệp</Label><Input type="number" value={edu.gradYear} onChange={e => handleChange('education', index, 'gradYear', parseInt(e.target.value))} />
                                                        </div>
                                                    ))}
                                                    <Button variant="outline" className="w-full" onClick={() => handleAddItem('education', 'vietnam', undefined)}><PlusCircle className="mr-2" /> Thêm học vấn</Button>
                                                </div>
                                            )}
                                            candidate={profileByLang.vi!}
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {candidate.education.length > 0 ? candidate.education.map((edu: any, index: number) => (
                                            <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                                                <p className="font-semibold flex items-center gap-2"><School className="h-4 w-4" /> {edu.school}</p>
                                                <p className="text-muted-foreground ml-6">Chuyên ngành: {edu.degree}</p>
                                                <p className="text-muted-foreground ml-6">Tốt nghiệp năm: {edu.gradYear}</p>
                                            </div>
                                        )) : (
                                            <div className="text-muted-foreground">
                                                <span>{notUpdatedText}</span>
                                                {notPreview && <EditDialog title="Chỉnh sửa Học vấn" onSave={handleSave} renderContent={(temp, handleChange) => (
                                                    <div className="space-y-6">
                                                        {temp.education.map((edu: any, index: number) => (
                                                            <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <h4 className="font-bold">Học vấn #{index + 1}</h4>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('education', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                                </div>
                                                                <Label>Trường</Label><Input value={edu.school} onChange={e => handleChange('education', index, 'school', e.target.value)} />
                                                                <Label>Chuyên ngành</Label><Input value={edu.degree} onChange={e => handleChange('education', index, 'degree', e.target.value)} />
                                                                <Label>Năm tốt nghiệp</Label><Input type="number" value={edu.gradYear} onChange={e => handleChange('education', index, 'gradYear', parseInt(e.target.value))} />
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" className="w-full" onClick={() => handleAddItem('education', 'vietnam', undefined)}><PlusCircle className="mr-2" /> Thêm học vấn</Button>
                                                    </div>
                                                )} candidate={profileByLang.vi!}>
                                                    <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                </EditDialog>}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><FileArchive className="mr-3 text-primary" /> {t.documentsSection}</CardTitle>
                                        {notPreview && <EditDialog
                                            title="Chỉnh sửa Hồ sơ/Giấy tờ"
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => (
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="font-bold mb-2">Giấy tờ Việt Nam</h4>
                                                        {(temp.documents?.vietnam || []).map((doc, index) => (
                                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                                <Input value={doc.name.vi} onChange={(e) => handleChange('documents', 'vietnam', index, { ...doc, name: { ...doc.name, vi: e.target.value } })} />
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'vietnam')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" onClick={() => handleOpenAddDocDialog('vietnam')}><PlusCircle className="mr-2 h-4 w-4" /> Thêm</Button>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-2">Giấy tờ Nhật Bản</h4>
                                                        {(temp.documents?.japan || []).map((doc, index) => (
                                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                                <Input value={doc.name.vi} onChange={(e) => handleChange('documents', 'japan', index, { ...doc, name: { ...doc.name, vi: e.target.value } })} />
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'japan')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" onClick={() => handleOpenAddDocDialog('japan')}><PlusCircle className="mr-2 h-4 w-4" /> Thêm</Button>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-2">Giấy tờ nước ngoài / Du học</h4>
                                                        {(temp.documents?.other || []).map((doc, index) => (
                                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                                <Input value={doc.name.vi} onChange={(e) => handleChange('documents', 'other', { ...doc, name: { ...doc.name, vi: e.target.value } })} />
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'other')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" onClick={() => handleOpenAddDocDialog('other')}><PlusCircle className="mr-2 h-4 w-4" /> Thêm</Button>
                                                    </div>
                                                </div>
                                            )}
                                            candidate={profileByLang.vi!}
                                            footerContent={
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost"><RefreshCw className="mr-2 h-4 w-4" />Khôi phục danh sách</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xác nhận khôi phục?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Những giấy tờ đã bị xoá sẽ được khôi phục về danh sách ban đầu. Các giấy tờ bạn đã thêm (nếu có ảnh) và các ảnh đã tải lên sẽ được giữ nguyên. Bạn có muốn tiếp tục?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleRestoreDocuments}>Đồng ý</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            }
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>}
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs defaultValue="japan" value={activeDocTab} onValueChange={setActiveDocTab} className="w-full">
                                            <TabsList className={cn("w-full", isMobile ? "flex justify-between" : "grid grid-cols-3")}>
                                                <TabsTrigger
                                                    value="vietnam"
                                                    className={cn("doc-tab-vn flex-1 md:flex-auto", isMobile && activeDocTab !== 'vietnam' && "flex-shrink basis-0")}
                                                >
                                                    {isMobile ? (activeDocTab === 'vietnam' ? t.vietnamDocs : 'Việt Nam') : t.vietnamDocs}
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="japan"
                                                    className={cn("doc-tab-jp flex-1 md:flex-auto", isMobile && activeDocTab !== 'japan' && "flex-shrink basis-0")}
                                                >
                                                    {isMobile ? (activeDocTab === 'japan' ? t.japanDocs : 'Nhật Bản') : t.japanDocs}
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="other"
                                                    className={cn("doc-tab-other flex-1 md:flex-auto", isMobile && activeDocTab !== 'other' && "flex-shrink basis-0")}
                                                >
                                                    {isMobile ? (activeDocTab === 'other' ? t.otherDocs : 'Du học') : t.otherDocs}
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="vietnam" className="pt-4">
                                                {(candidate.documents?.vietnam?.length || 0) > 0 ? (
                                                    <DocumentGrid
                                                        documents={candidate.documents!.vietnam!}
                                                        docType="vietnam"
                                                        handleMediaChange={handleMediaChange}
                                                        onAddClick={handleOpenAddDocDialog}
                                                        onRemoveClick={handleRemoveItem as any}
                                                        isExpanded={expandedGrids.vietnam}
                                                        setIsExpanded={(expanded) => setExpandedGrids(prev => ({ ...prev, vietnam: expanded }))}
                                                    />
                                                ) : (<p className="text-sm text-muted-foreground py-4 text-center">{notUpdatedText}</p>)}
                                            </TabsContent>
                                            <TabsContent value="japan" className="pt-4">
                                                {(candidate.documents?.japan?.length || 0) > 0 ? (
                                                    <DocumentGrid
                                                        documents={candidate.documents!.japan!}
                                                        docType="japan"
                                                        handleMediaChange={handleMediaChange}
                                                        onAddClick={handleOpenAddDocDialog}
                                                        onRemoveClick={handleRemoveItem as any}
                                                        isExpanded={expandedGrids.japan}
                                                        setIsExpanded={(expanded) => setExpandedGrids(prev => ({ ...prev, japan: expanded }))}
                                                    />
                                                ) : (<p className="text-sm text-muted-foreground py-4 text-center">{notUpdatedText}</p>)}
                                            </TabsContent>
                                            <TabsContent value="other" className="pt-4">
                                                {(candidate.documents?.other?.length || 0) > 0 ? (
                                                    <DocumentGrid
                                                        documents={candidate.documents!.other!}
                                                        docType="other"
                                                        handleMediaChange={handleMediaChange}
                                                        onAddClick={handleOpenAddDocDialog}
                                                        onRemoveClick={handleRemoveItem as any}
                                                        isExpanded={expandedGrids.other}
                                                        setIsExpanded={(expanded) => setExpandedGrids(prev => ({ ...prev, other: expanded }))}
                                                    />
                                                ) : (<p className="text-sm text-muted-foreground py-4 text-center">{notUpdatedText}</p>)}
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><FilePen className="mr-3 text-primary" />{t.notes}</CardTitle>
                                        {notPreview && <EditDialog
                                            title="Chỉnh sửa Ghi chú"
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => <Textarea value={temp.notes || ''} onChange={e => handleChange('notes', e.target.value)} rows={4} placeholder="Ghi chú về nguyện vọng, khả năng tài chính, thời gian có thể đi..." />}
                                            candidate={profileByLang.vi!}
                                            description="Thêm bất kỳ ghi chú hoặc thông tin bổ sung nào về nguyện vọng, hoàn cảnh của bạn."
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>}
                                    </CardHeader>
                                    <CardContent>
                                        {candidate.notes ? (
                                            <p className="text-muted-foreground whitespace-pre-line">{candidate.notes}</p>
                                        ) : (
                                            <div className="text-muted-foreground">
                                                <span>{notUpdatedText}</span>
                                                {notPreview && <EditDialog title="Chỉnh sửa Ghi chú" onSave={handleSave} renderContent={(temp, handleChange) => <Textarea value={temp.notes || ''} onChange={e => handleChange('notes', e.target.value)} rows={4} placeholder="Ghi chú về nguyện vọng, khả năng tài chính, thời gian có thể đi..." />} candidate={profileByLang.vi!}>
                                                    <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                </EditDialog>}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                {/* Desktop Personal Info Card */}
                                <div className="hidden lg:block">
                                    <PersonalInfoCard candidate={candidate} setIsProfileEditDialogOpen={setIsProfileEditDialogOpen} translation={t} showEditButton={notPreview} />
                                </div>
                                <EditAspirationsDialog
                                    isOpen={isAspirationsDialogOpen}
                                    onOpenChange={(open) => {
                                        setIsAspirationsDialogOpen(open);
                                        const vi = profileByLang.vi;
                                        if (!!vi) {
                                            vi.aspirations = {
                                                ...vi.aspirations,
                                                ...user?.aspirations ?? {}
                                            }
                                        }
                                        console.log(user?.aspirations)
                                        // const updatetedAspiration:any = {
                                        //     vi: {
                                        //         aspiratiopns: user?.aspirations ?? {}
                                        //     }
                                        // };
                                        setProfileByLang(prev => ({ ...prev, ...{ vi } }));
                                    }}
                                />
                                <Card id="HSCV_NGUYENVONG">
                                    <CardHeader id="HSCV_NGUYENVONG_HEADER" className="flex flex-row items-center justify-between">
                                        <CardTitle id="HSCV_NGUYENVONG_LABEL" className="font-headline text-xl flex items-center"><Target className="mr-3 text-primary" /> {t.aspirations}</CardTitle>
                                        {notPreview && <Button id="HSCV_NGUYENVONG_BUTTON_EDIT" variant="ghost" size="icon" onClick={() => setIsAspirationsDialogOpen(true)}><Edit className="h-4 w-4" /></Button>}
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div id="HSCV_NGUYENVONG_LOAIVISA"><p><strong>{t.desiredVisaType}:</strong> {candidate.aspirations?.visa || notUpdatedText}</p></div>
                                        <div id="HSCV_NGUYENVONG_CHITIETVISA"><p><strong>{t.desiredVisaDetail}:</strong> {candidate.aspirations?.visaDetail || notUpdatedText}</p></div>
                                        <div id="HSCV_NGUYENVONG_NGANHNGHE"><p><strong>{t.desiredIndustry}:</strong> {candidate.aspirations.career || notUpdatedText}</p></div>
                                        <div id="HSCV_NGUYENVONG_CONGVIECCUTHE"><p><strong>{t.desiredJobDetail}:</strong> {candidate.aspirations?.job || notUpdatedText}</p></div>
                                        <div id="HSCV_NGUYENVONG_DIADIEM"><p><strong>{t.desiredLocation}:</strong> {candidate.aspirations?.workLocation || notUpdatedText}</p></div>
                                        <div id="HSCV_NGUYENVONG_LUONGCANBAN"><p><strong>{t.desiredSalary}:</strong> {formatYen(candidate.aspirations?.basicSalary)}</p></div>
                                        <div id="HSCV_NGUYENVONG_THUCLINH"><p><strong>{t.desiredNetSalary}:</strong> {formatYen(candidate.aspirations?.realSalary)}</p></div>
                                        <div id="HSCV_NGUYENVONG_KHACHINHTAICHINH">
                                            {['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đầu Việt', 'Kỹ sư, tri thức đầu Việt'].includes(candidate.aspirations?.visaDetail || '') && (
                                                <p><strong>{t.financialAbility}:</strong> {candidate.aspirations?.fee || notUpdatedText}</p>
                                            )}
                                        </div>
                                        <div id="HSCV_NGUYENVONG_NOIPHONGVAN"><p><strong>{t.interviewLocation}:</strong> {candidate.aspirations?.interviewLocation || notUpdatedText}</p></div>

                                        <div id="HSCV_NGUYENVONG_TIMEPHONGVAN"><p><strong>{t.interviewDate}:</strong> {
                                            (() => {
                                                let text = '';
                                                switch (candidate.aspirations?.interviewDateType) {
                                                    case 'flexible': {
                                                        return 'Đủ người thì phỏng vấn';
                                                    }
                                                    case 'util': {
                                                        text += 'Đến ngày ';
                                                        break;
                                                    }
                                                    case 'exact': {
                                                        text += 'Đúng ngày ';
                                                        break;
                                                    }
                                                    case 'from': {
                                                        text += 'Đến ngày ';
                                                        break;
                                                    }
                                                    default: {
                                                        return notUpdatedText;
                                                    }
                                                }
                                                return text + formatDate(candidate.aspirations?.interviewDate, 'dd/MM/yyyy');
                                            })()
                                        }</p></div>
                                        <div id="HSCV_NGUYENVONG_GIOITINH" className="space-y-1">
                                            <p><strong>{t.gender}:</strong> {candidate.aspirations?.gender || notUpdatedText}</p>
                                        </div>
                                        <div id="HSCV_NGUYENVONG_YEUCAUKHAC" className="space-y-1">
                                            <p><strong>{t.tattoo}:</strong> {candidate.aspirations?.tattooRequirement || notUpdatedText}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><Star className="mr-3 text-primary" /> {t.skillsAndInterests}</CardTitle>
                                        <EditDialog
                                            title="Chỉnh sửa Kỹ năng & Lĩnh vực"
                                            description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn."
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => (
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="font-bold">Kỹ năng</Label>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {temp.skills.map((skill: any) => (<Badge key={skill} variant="secondary" className="pr-1">{skill}<button onClick={() => handleRemoveItem('skills', skill)} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5"><X className="h-3 w-3" /></button></Badge>))}
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                            {commonSkills.filter(s => !temp.skills.includes(s)).map((skill) => (<div key={skill} className="flex items-center space-x-2"><Checkbox id={`skill-${skill}`} onCheckedChange={(checked) => handleChange('skills', skill, checked)} checked={temp.skills.includes(skill)} /><Label htmlFor={`skill-${skill}`} className="text-sm font-normal cursor-pointer">{skill}</Label></div>))}
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Thêm kỹ năng khác..." /><Button onClick={() => handleAddNewChip('skills')}>Thêm</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            candidate={profileByLang.vi!}
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>
                                    </CardHeader>
                                    <CardContent>
                                        <h4 className="font-semibold mb-2 text-sm">{t.skills}</h4>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {candidate.skills.length > 0 ? candidate.skills.map((skill: any) => <Badge key={skill} variant="secondary">{skill}</Badge>) :
                                                <div className="text-muted-foreground text-sm">
                                                    <span>{notUpdatedText}</span>
                                                    <EditDialog title="Chỉnh sửa Kỹ năng & Lĩnh vực" description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn." onSave={handleSave} renderContent={(temp, handleChange) => (
                                                        <div></div>
                                                    )} candidate={profileByLang.vi!}>
                                                        <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                    </EditDialog>
                                                </div>}
                                        </div>
                                        <h4 className="font-semibold mb-2 text-sm">{t.interests}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.interests.length > 0 ? candidate.interests.map((interest: any) => <Badge key={interest} className="bg-accent-blue text-white">{interest}</Badge>) :
                                                <div className="text-muted-foreground text-sm">
                                                    <span>{notUpdatedText}</span>
                                                    <EditDialog title="Chỉnh sửa Kỹ năng & Lĩnh vực" description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn." onSave={handleSave} renderContent={(temp, handleChange) => (
                                                        <div></div>
                                                    )} candidate={profileByLang.vi!}>
                                                        <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                    </EditDialog>
                                                </div>}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="font-headline text-xl flex items-center"><Award className="mr-3 text-primary" /> {t.certifications}</CardTitle>
                                        <EditDialog
                                            title="Chỉnh sửa Chứng chỉ & Giải thưởng"
                                            onSave={handleSave}
                                            renderContent={(temp, handleChange) => (
                                                <div className="space-y-6">
                                                    {temp.certifications.map((cert: any, index: number) => (<div key={index} className="p-4 border rounded-lg space-y-2 relative"><div className="flex justify-between items-center mb-2"><Label htmlFor={`cert-${index}`}>Chứng chỉ #{index + 1}</Label><Button variant="ghost" size="icon" onClick={() => handleRemoveItem('certifications', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div><Input id={`cert-${index}`} value={cert} onChange={(e) => handleChange('certifications', index, null, e.target.value)} /></div>))}
                                                    <Button variant="outline" className="w-full" onClick={() => handleAddItem('certifications', 'vietnam', undefined)}><PlusCircle className="mr-2" /> Thêm chứng chỉ</Button>
                                                </div>
                                            )}
                                            candidate={profileByLang.vi!}
                                        >
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </EditDialog>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {candidate.certifications.length > 0 ? candidate.certifications.map((cert: any, index: number) => (
                                            <p key={index} className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-muted-foreground" />{cert}</p>
                                        )) :
                                            <div className="text-muted-foreground text-sm">
                                                <span>{notUpdatedText}</span>
                                                <EditDialog title="Chỉnh sửa Chứng chỉ & Giải thưởng" onSave={handleSave} renderContent={(temp, handleChange) => (
                                                    <div />
                                                )} candidate={profileByLang.vi!}>
                                                    <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                                                </EditDialog>
                                            </div>}
                                    </CardContent>
                                </Card> */}

                                {notPreview && !!user && <div className="text-center pt-4">
                                    <Button variant="link" className="text-muted-foreground text-sm" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Đăng xuất
                                    </Button>
                                </div>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <SendOptionsDialog open={isSendOptionsOpen} languageToSend={languageToSend} candidate={candidate} onOpenChange={setIsSendOptionsOpen} />
            <EditProfileDialog
                isOpen={isProfileEditDialogOpen}
                onOpenChange={setIsProfileEditDialogOpen}
                onSaveSuccess={(updatedProfile) => {
                    toast({
                        title: 'Cập nhật thành công!',
                        description: 'Thông tin của bạn đã được lưu.',
                        className: 'bg-green-500 text-white'
                    });
                    // Force a re-render to ensure UI consistency after saving           
                    if (updatedProfile) {
                        setProfileByLang(prev => ({ ...prev, vi: updatedProfile }));
                    }
                }}
            />
            <Dialog open={isAddDocDialogOpen} onOpenChange={setIsAddDocDialogOpen}>
                <DialogContent className="sm:max-w-xl" id="THEMGIAYTO01">
                    <DialogHeader>
                        <DialogTitle>Thêm giấy tờ mới</DialogTitle>
                        <DialogDescription>
                            Đặt tên cho giấy tờ và tải lên tệp (PDF hoặc ảnh) tương ứng.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <Tabs defaultValue="vi" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="vi" className="doc-lang-tab-vi">Tiếng Việt</TabsTrigger>
                                <TabsTrigger value="ja" className="doc-lang-tab-ja">Tiếng Nhật</TabsTrigger>
                                <TabsTrigger value="en" className="doc-lang-tab-en">Tiếng Anh</TabsTrigger>
                            </TabsList>
                            <TabsContent value="vi" className="pt-2">
                                <Input
                                    id="doc-name-vi"
                                    value={newDocName.vi}
                                    onChange={e => setNewDocName(prev => ({ ...prev, vi: e.target.value }))}
                                    placeholder="VD: Sơ yếu lý lịch"
                                />
                            </TabsContent>
                            <TabsContent value="ja" className="pt-2">
                                <Input
                                    id="doc-name-ja"
                                    value={newDocName.ja || ''}
                                    onChange={e => setNewDocName(prev => ({ ...prev, ja: e.target.value }))}
                                    placeholder="例: 履歴書"
                                />
                            </TabsContent>
                            <TabsContent value="en" className="pt-2">
                                <Input
                                    id="doc-name-en"
                                    value={newDocName.en || ''}
                                    onChange={e => setNewDocName(prev => ({ ...prev, en: e.target.value }))}
                                    placeholder="E.g., Resume"
                                />
                            </TabsContent>
                        </Tabs>

                        <div className="space-y-2">
                            <Label>Tệp giấy tờ</Label>
                            <Label
                                htmlFor="zalo-qr-file-input"
                                className="relative flex flex-col items-center justify-center w-full h-48 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors bg-secondary/50"
                            >
                                {newDocFilePreview ? (
                                    newDocFile?.type.startsWith('image/') ? (
                                        <Image
                                            src={newDocFilePreview}
                                            alt="Xem trước"
                                            fill
                                            className="object-contain rounded-md"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <PdfIcon className="w-16 h-16" />
                                            <p className="mt-2 text-sm font-semibold">{newDocFile?.name}</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="space-y-2 text-center">
                                        <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
                                        <p className="font-semibold text-foreground">
                                            Nhấp hoặc kéo thả file vào đây
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG</p>
                                    </div>
                                )}
                                <Input
                                    id="zalo-qr-file-input"
                                    type="file"
                                    className="sr-only"
                                    accept="application/pdf,image/png,image/jpeg"
                                    onChange={handleNewDocFileChange}
                                />
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Hủy</Button>
                        </DialogClose>
                        <Button onClick={handleAddNewDocument}>Lưu giấy tờ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}