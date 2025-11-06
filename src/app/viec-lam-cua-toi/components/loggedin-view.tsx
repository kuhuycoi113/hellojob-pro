'use client';
import { matchJobsToProfile } from "@/ai/flows/match-jobs-to-profile-flow";
import { CandidateProfile } from "@/ai/schemas";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Job, jobData } from "@/lib/mock-data";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmptyProfileView } from "./empty-profile-view";
import { visaDetailsByVisaType } from "@/lib/visa-data";
import { industriesByJobType } from "@/lib/industry-data";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import SuggestedJobs from "./suggested-jobs";
import AppliedJobs from "./applied-jobs";
import { SavedJobs } from "./saved-jobs";
import BehavioralJobs from "./behavioral-jobs";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressTracker } from "@/components/progress-tracker";
import { JobStatsChart } from "@/components/dashboard/job-stats-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit, Eye, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileViewersDialog } from "@/components/profile-viewers-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/location-data";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const viewers = [
    { name: 'A', src: 'https://placehold.co/40x40.png?text=A' },
    { name: 'B', src: 'https://placehold.co/40x40.png?text=B' },
    { name: 'C', src: 'https://placehold.co/40x40.png?text=C' },
    { name: 'D', src: 'https://placehold.co/40x40.png?text=D' },
    { name: 'E', src: 'https://placehold.co/40x40.png?text=E' },
    { name: 'F', src: 'https://placehold.co/40x40.png?text=F' },
];

const aspirations = [
    { id: 1, title: 'Kỹ sư cơ khí, Osaka', salary: '220,000 JPY', type: 'Kỹ sư' },
    { id: 2, title: 'Chế biến thực phẩm, Tokyo', salary: '180,000 JPY', type: 'Tokutei' },
];

export const LoggedInView = () => {
    const { role } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isViewersDialogOpen, setIsViewersDialogOpen] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [behavioralSuggestedJobs, setBehavioralSuggestedJobs] = useState<any[]>([]); // CANHANHOA01
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [isLoadingBehavioral, setIsLoadingBehavioral] = useState(true); // CANHANHOA01
    const [isAspirationsDialogOpen, setIsAspirationsDialogOpen] = useState(false);
    const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
    const [tempAspirations, setTempAspirations] = useState<Partial<CandidateProfile['aspirations'] & { educationRequirement?: string, languageRequirement?: string, yearsOfExperience?: string, specialConditions?: string[] }>>({});
    const [tempDesiredIndustry, setTempDesiredIndustry] = useState('');
    const [suggestionPrinciple, setSuggestionPrinciple] = useState<'salary' | 'fee' | 'company' | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const { toast } = useToast();
    const [tempSalary, setTempSalary] = useState('');
    const [tempFee, setTempFee] = useState('');
    const [chartData, setChartData] = useState([]);
    const JPY_VND_RATE = 180;
    const USD_VND_RATE = 26300;


    const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
    const [isSuggestionHighlighted, setIsSuggestionHighlighted] = useState(false);

    const [feeButtonText, setFeeButtonText] = useState('Phí thấp');
    const [companyButtonText, setCompanyButtonText] = useState('Công ty uy tín');
    const [suggestionType, setSuggestionType] = useState<'accurate' | 'related'>('accurate');

    useEffect(() => {
        // Generate dynamic chart data
        const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const dynamicChartData = days.map(day => ({
            name: day,
            'Việc làm phù hợp với bạn': Math.floor(Math.random() * 15) + 1,
            'Người có nhu cầu tìm việc giống bạn': Math.floor(Math.random() * 10) + 1
        }));
        // @ts-ignore
        setChartData(dynamicChartData);
    }, []);

    useEffect(() => {
        if (searchParams.get('highlight') === 'suggested') {
            setOpenAccordion('item-1');
            setIsSuggestionHighlighted(true);
            const timer = setTimeout(() => setIsSuggestionHighlighted(false), 2500);

            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.delete('highlight');
            router.replace(nextUrl.toString(), { scroll: false });

            return () => clearTimeout(timer);
        } else {
            setOpenAccordion('item-1');
        }
    }, [searchParams, router]);


    const fetchSuggestedJobs = useCallback(async () => {
        setIsLoadingSuggestions(true);
        try {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            if (storedProfile) {
                const profile: Partial<CandidateProfile> = JSON.parse(storedProfile);
                const matchResults = await matchJobsToProfile(profile, 'related', []); // Pass empty signals for profile-based suggestions
                setSuggestedJobs(matchResults.map(r => r.job));
            } else {
                setSuggestedJobs(jobData.slice(0, 20));
            }
        } catch (error) {
            console.error("Failed to fetch profile-based suggestions:", error);
            setSuggestedJobs(jobData.slice(0, 20));
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, []);

    // CANHANHOA01: New function to fetch behavior-based suggestions
    const fetchBehavioralSuggestions = useCallback(async () => {
        setIsLoadingBehavioral(true);
        try {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            if (storedProfile) {
                const profile: Partial<CandidateProfile> = JSON.parse(storedProfile);
                const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
                // The flow will now receive signals. If signals are empty, it will fall back to profile-based matching.
                const matchResults = await matchJobsToProfile(profile, 'related', behavioralSignals);
                setBehavioralSuggestedJobs(matchResults);
            } else {
                setBehavioralSuggestedJobs([]);
            }
        } catch (error) {
            console.error("Failed to fetch behavioral suggestions:", error);
            setBehavioralSuggestedJobs([]);
        } finally {
            setIsLoadingBehavioral(false);
        }
    }, []);

    const fetchSavedJobs = useCallback(() => {
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        const savedJobsData = jobData.filter(job => savedJobIds.includes(job.id));
        setSavedJobs(savedJobsData);
    }, []);

    useEffect(() => {
        if (role === 'candidate-empty-profile') {
            setIsLoadingSuggestions(false);
            setIsLoadingBehavioral(false);
            return;
        }
        fetchSuggestedJobs();
        fetchBehavioralSuggestions(); // Fetch behavioral suggestions
        fetchSavedJobs();

        const handleStorageChange = () => {
            fetchSavedJobs();
            fetchBehavioralSuggestions(); // Re-fetch when behavior changes
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, [role, fetchSuggestedJobs, fetchSavedJobs, fetchBehavioralSuggestions, forceUpdate]);


    const handleSaveAspirations = () => {
        const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
        let profile = storedProfileRaw ? JSON.parse(storedProfileRaw) : {};
        profile = {
            ...profile,
            aspirations: tempAspirations,
            desiredIndustry: tempDesiredIndustry,
        };
        localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
        if (suggestionPrinciple) {
            localStorage.setItem('suggestionPrinciple', suggestionPrinciple);
        } else {
            localStorage.removeItem('suggestionPrinciple');
        }
        localStorage.setItem('suggestionType', suggestionType);
        console.log("Suggestion principle saved:", suggestionPrinciple);
        console.log("Suggestion type saved:", suggestionType);
        setIsAspirationsDialogOpen(false);
        setForceUpdate(prev => prev + 1); // Trigger a re-fetch
    };

    const openFeeDialog = () => {
        const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
        if (storedProfileRaw) {
            const profile = JSON.parse(storedProfileRaw);
            setTempAspirations(profile.aspirations || {}); // Load aspirations to get visa detail
            setTempFee(profile.aspirations?.financialAbility || '');
        }
        setIsFeeDialogOpen(true);
    };

    const handleSaveFee = () => {
        setTempAspirations(prev => ({ ...prev, financialAbility: tempFee }));
        setIsFeeDialogOpen(false);
        toast({
            title: "Đã cập nhật phí mong muốn",
            description: `Mức phí tối đa mới là ${parseInt(tempFee || '0').toLocaleString('en-US')} USD.`,
        });
    };

    // Logic for the Fee Dialog (MPMM01)
    const getFeePlaceholder = () => {
        const visaDetail = tempAspirations.desiredVisaDetail;
        if (visaDetail === 'Thực tập sinh 1 năm') return "1000";
        if (visaDetail === 'Đặc định đầu Việt') return "1600";
        return "3000";
    };

    const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let num = parseInt(rawValue.replace(/[,.]/g, ''), 10);

        if (isNaN(num)) {
            setTempFee('');
            return;
        }

        const visaDetail = tempAspirations.desiredVisaDetail;
        let limit = 3800; // Default limit
        if (visaDetail === 'Thực tập sinh 1 năm') limit = 1400;
        if (visaDetail === 'Đặc định đầu Việt') limit = 2500;

        if (num > limit) {
            num = limit;
        }

        setTempFee(String(num));
    };

    const getFeeDisplayValue = (value: string) => {
        if (!value) return '';
        const num = Number(value.replace(/[^0-9]/g, ''));
        if (isNaN(num)) return '';
        return num.toLocaleString('en-US');
    };

    const getConvertedFeeValue = (value: string) => {
        const num = Number(value);
        if (isNaN(num) || num === 0) return '≈ 0 triệu VNĐ';

        const vndValue = num * USD_VND_RATE;
        const valueInMillions = vndValue / 1000000;
        const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `≈ ${formattedVnd.replace('.', ',')} triệu VNĐ`;
    };


    if (role === 'candidate-empty-profile') {
        return <EmptyProfileView />;
    }

    const visaDetailsOptions: { [key: string]: { name: string, slug: string }[] } = visaDetailsByVisaType;
    const visaTypes = Object.keys(visaDetailsByVisaType);
    const availableIndustries = tempAspirations.desiredVisaType ? (industriesByJobType[tempAspirations.desiredVisaType as keyof typeof industriesByJobType] || []) : Object.values(industriesByJobType).flat();

    const educationLevels = ["Không yêu cầu", "Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon"];
    const languageLevels = ["Không yêu cầu", "N5", "N4", "N3", "N2", "N1"];
    const experienceYears = ['Không yêu cầu', 'Dưới 1 năm', '1-2 năm', '2-3 năm', 'Trên 3 năm'];
    const allSpecialConditions = ['Lương tốt', 'Tăng ca', 'Công ty uy tín', 'Hỗ trợ nhà ở', 'Bay nhanh'];


    return (
        <>
            <div className="text-center md:text-left mb-8">
                <h1 className="text-3xl font-bold font-headline">Trang quản lý việc làm</h1>
                <p className="text-muted-foreground mt-1">Quản lý toàn bộ hành trình tìm việc của bạn tại một nơi duy nhất.</p>
            </div>
            {/* Main Content */}
            <div className="w-full mb-8">
                <Accordion
                    type="single"
                    className="w-full space-y-4"
                    value={openAccordion}
                    onValueChange={setOpenAccordion}
                >
                    <SuggestedJobs setIsAspirationsDialogOpen={setIsAspirationsDialogOpen}
                        setSuggestionPrinciple={setSuggestionPrinciple} setSuggestionType={setSuggestionType}
                        setTempAspirations={tempAspirations} setTempDesiredIndustry={setTempDesiredIndustry}
                        isLoadingSuggestions={isLoadingSuggestions} isSuggestionHighlighted={isSuggestionHighlighted} />
                    <AppliedJobs />
                    <SavedJobs />

                    {/* CANHANHOA01: New Module */}
                    <BehavioralJobs />
                </Accordion>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Việc làm phù hợp/tuần" value="12" change="+5.2%" />
                <StatCard title="Việc làm phù hợp/tháng" value="48" change="+8.1%" />
                <StatCard title="Việc làm cùng ngành nghề" value="315" />
                <StatCard title="Lượt xem hồ sơ" value={viewers.length} change="+12" />
            </div>

            {/* Progress Tracker */}
            <div className="mb-8">
                <h2 className="text-xl font-bold font-headline mb-4">Tiến độ của bạn</h2>
                <ProgressTracker />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <JobStatsChart data={chartData} />
                <div className="lg:col-span-1">
                    {/* Aspirations Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold font-headline">Nguyện vọng tìm việc</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {aspirations.map(asp => (
                                <Card key={asp.id} className="shadow-lg">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <Badge className="mb-1">{asp.type}</Badge>
                                            <p className="font-bold">{asp.title}</p>
                                            <p className="text-sm text-green-600 font-semibold">{asp.salary}</p>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                            <Card className="shadow-lg border-dashed flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer min-h-[100px]">
                                <CardContent className="p-4 text-center">
                                    <PlusCircle className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                                    <p className="font-semibold text-sm">Thêm nguyện vọng</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <Card
                        className="shadow-lg md:col-span-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => setIsViewersDialogOpen(true)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nhà tuyển dụng đã xem hồ sơ</CardTitle>
                            <Eye className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{viewers.length}</div>
                            <div className="flex items-center mt-2">
                                <div className="flex -space-x-2 overflow-hidden">
                                    {viewers.slice(0, 5).map((viewer, index) => (
                                        <Avatar key={index} className="inline-block h-6 w-6 border-2 border-background">
                                            <AvatarImage src={viewer.src} />
                                            <AvatarFallback>{viewer.name}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                {viewers.length > 5 && (
                                    <span className="text-xs font-semibold text-muted-foreground ml-3">+{viewers.length - 5}</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <ProfileViewersDialog isOpen={isViewersDialogOpen} onClose={() => setIsViewersDialogOpen(false)} />
            <Dialog open={isAspirationsDialogOpen} onOpenChange={setIsAspirationsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Sửa điều kiện gợi ý</DialogTitle>
                        <DialogDescription>
                            Thay đổi các nguyện vọng để nhận được gợi ý việc làm phù hợp hơn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="visa-type-modal">Loại visa mong muốn</Label>
                            <Select
                                value={tempAspirations.desiredVisaType || ''}
                                onValueChange={value => setTempAspirations(prev => ({ ...prev, desiredVisaType: value, desiredVisaDetail: '' }))}
                            >
                                <SelectTrigger id="visa-type-modal"><SelectValue placeholder="Chọn loại visa" /></SelectTrigger>
                                <SelectContent>
                                    {visaTypes.map(vt => <SelectItem key={vt} value={vt}>{vt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="visa-detail-modal">Chi tiết visa</Label>
                            <Select
                                value={tempAspirations.desiredVisaDetail || ''}
                                onValueChange={value => setTempAspirations(prev => ({ ...prev, desiredVisaDetail: value }))}
                                disabled={!tempAspirations.desiredVisaType}
                            >
                                <SelectTrigger id="visa-detail-modal"><SelectValue placeholder="Chọn chi tiết" /></SelectTrigger>
                                <SelectContent>
                                    {(visaDetailsOptions[tempAspirations.desiredVisaType || ''] || []).map(vd => <SelectItem key={vd.slug} value={vd.name}>{vd.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="industry-modal">Ngành nghề mong muốn</Label>
                            <Select
                                value={tempDesiredIndustry}
                                onValueChange={value => setTempDesiredIndustry(value)}
                                disabled={!tempAspirations.desiredVisaType}
                            >
                                <SelectTrigger id="industry-modal">
                                    <SelectValue placeholder="Chọn ngành nghề" >
                                        {tempDesiredIndustry || "Chọn ngành nghề"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location-modal">Địa điểm mong muốn</Label>
                            <Select
                                value={tempAspirations.desiredLocation || ''}
                                onValueChange={value => setTempAspirations(prev => ({ ...prev, desiredLocation: value }))}
                            >
                                <SelectTrigger id="location-modal"><SelectValue placeholder="Chọn địa điểm" /></SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="all">Tất cả Nhật Bản</SelectItem>
                                    {Object.entries(locations['Nhật Bản']).map(([region, prefectures]) => (
                                        <SelectGroup key={region}>
                                            <SelectLabel>{region}</SelectLabel>
                                            <SelectItem value={region}>Toàn bộ vùng {region}</SelectItem>
                                            {(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label className="font-semibold">Nguyên tắc gợi ý</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={suggestionType === 'accurate' ? 'default' : 'outline'}
                                    onClick={() => setSuggestionType('accurate')}
                                    className="justify-center text-left h-auto py-2"
                                >
                                    Chính xác 100%
                                </Button>
                                <Button
                                    variant={suggestionType === 'related' ? 'default' : 'outline'}
                                    onClick={() => setSuggestionType('related')}
                                    className="justify-center text-left h-auto py-2"
                                >
                                    Thêm cả việc liên quan
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label className="font-semibold">Ưu tiên tìm việc</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSuggestionPrinciple('salary');
                                    }}
                                    className={cn(
                                        "justify-start text-left h-auto py-2",
                                        suggestionPrinciple === 'salary' && "ring-2 ring-primary border-primary bg-primary/10"
                                    )}
                                >
                                    <div>
                                        <p className="font-semibold">Lương tốt</p>
                                        <p className="text-xs opacity-80 font-normal">Ưu tiên việc có lương cao</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSuggestionPrinciple('fee');
                                        openFeeDialog();
                                    }}
                                    className={cn(
                                        "justify-start text-left h-auto py-2",
                                        suggestionPrinciple === 'fee' && "ring-2 ring-primary border-primary bg-primary/10"
                                    )}
                                >
                                    <div>
                                        <p className="font-semibold">{feeButtonText}</p>
                                        <p className="text-xs opacity-80 font-normal">Ưu tiên phí thấp / uy tín</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setSuggestionPrinciple('company')}
                                    className={cn(
                                        "justify-start text-left h-auto py-2",
                                        suggestionPrinciple === 'company' && "ring-2 ring-primary border-primary bg-primary/10"
                                    )}
                                >
                                    <div>
                                        <p className="font-semibold">{companyButtonText}</p>
                                        <p className="text-xs opacity-80 font-normal">Ưu tiên công ty uy tín</p>
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-semibold">
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Thêm điều kiện mở rộng
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Học vấn</Label>
                                        <Select value={tempAspirations.educationRequirement} onValueChange={value => setTempAspirations(prev => ({ ...prev, educationRequirement: value }))}>
                                            <SelectTrigger><SelectValue placeholder="Bất kỳ" /></SelectTrigger>
                                            <SelectContent>
                                                {educationLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Trình độ tiếng Nhật</Label>
                                        <Select value={tempAspirations.languageRequirement} onValueChange={value => setTempAspirations(prev => ({ ...prev, languageRequirement: value }))}>
                                            <SelectTrigger><SelectValue placeholder="Bất kỳ" /></SelectTrigger>
                                            <SelectContent>
                                                {languageLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Số năm kinh nghiệm</Label>
                                        <Select value={tempAspirations.yearsOfExperience} onValueChange={value => setTempAspirations(prev => ({ ...prev, yearsOfExperience: value }))}>
                                            <SelectTrigger><SelectValue placeholder="Bất kỳ" /></SelectTrigger>
                                            <SelectContent>
                                                {experienceYears.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <Label>Các điều kiện khác</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                                        {allSpecialConditions.map(item => (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`cond-modal-${item}`}
                                                    checked={tempAspirations.specialConditions?.includes(item)}
                                                    onCheckedChange={checked => {
                                                        const current = tempAspirations.specialConditions || [];
                                                        const newConditions = checked
                                                            ? [...current, item]
                                                            : current.filter(c => c !== item);
                                                        setTempAspirations(prev => ({ ...prev, specialConditions: newConditions }));
                                                    }}
                                                />
                                                <Label htmlFor={`cond-modal-${item}`} className="text-sm font-normal cursor-pointer">{item}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                    <DialogFooter className="flex-row justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline">Hủy</Button>
                        </DialogClose>
                        <Button onClick={handleSaveAspirations}>Lưu và tìm lại</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isFeeDialogOpen} onOpenChange={setIsFeeDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    {/* MPMM01 */}
                    <DialogHeader>
                        <DialogTitle>Mức phí mong muốn</DialogTitle>
                        <DialogDescription>Nhập mức phí tối đa bạn sẵn sàng chi trả (USD).</DialogDescription>
                    </DialogHeader>
                    <div className="pt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fee-usd">Phí tối đa (USD)</Label>
                            <Input
                                id="fee-usd"
                                type="text"
                                placeholder={getFeePlaceholder()}
                                value={getFeeDisplayValue(tempFee)}
                                onChange={handleFeeInputChange}
                            />
                            <p className="text-xs text-muted-foreground">{getConvertedFeeValue(tempFee)}</p>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button variant="outline" onClick={() => setIsFeeDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSaveFee}>Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}