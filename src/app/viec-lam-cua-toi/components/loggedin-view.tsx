'use client';
import { matchJobsToProfile } from "@/ai/flows/match-jobs-to-profile-flow";
import { CandidateProfile } from "@/ai/schemas";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Job, jobData } from "@/lib/mock-data";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
import { EditAspirationsDialog } from "./edit-aspirations-dialog";

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

const accordionMappings = {
    'suggested': 'item-1',
    'applied': 'item-2',
    'saved': 'item-3',
    'behavioral': 'item-4',
}

export const LoggedInView = () => {
    const { clearLastAction } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isViewersDialogOpen, setIsViewersDialogOpen] = useState(false);
    const [highlight, setHighlight] = useState<string | null>(null);
    const [chartData, setChartData] = useState([]);


    const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

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
        const highlight = searchParams.get('highlight') ?? '';
        if (highlight?.length > 0) {
            if (Object.keys(accordionMappings).includes(highlight)) {
                setOpenAccordion(accordionMappings[highlight as keyof typeof accordionMappings]);
                setHighlight(highlight);
            } else {
                setOpenAccordion('item-1');
            }

            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.delete('highlight');
            router.replace(nextUrl.toString(), { scroll: false });
            clearLastAction();
        } else {
            setOpenAccordion('item-1');
        }
    }, []);



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
                    <SuggestedJobs highlight={highlight} />
                    <AppliedJobs highlight={highlight} />
                    <SavedJobs highlight={highlight} />

                    {/* CANHANHOA01: New Module */}
                    <BehavioralJobs highlight={highlight} />
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
        </>
    )
}