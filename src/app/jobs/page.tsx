

'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Bookmark, Star, Eye, List, LayoutGrid, PlusCircle, Edit, LogIn, UserPlus, Loader2, Sparkles } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { jobData, type Job } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { JobListRow } from '@/components/job-list-row';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileViewersDialog } from '@/components/profile-viewers-dialog';
import { StatCard } from '@/components/dashboard/stat-card';
import { JobStatsChart } from '@/components/dashboard/job-stats-chart';
import { ProgressTracker } from '@/components/progress-tracker';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import { type CandidateProfile } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthDialog } from '@/components/auth-dialog';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';


const aspirations = [
    { id: 1, title: 'Kỹ sư cơ khí, Osaka', salary: '220,000 JPY', type: 'Kỹ sư' },
    { id: 2, title: 'Chế biến thực phẩm, Tokyo', salary: '180,000 JPY', type: 'Tokutei' },
];

const appliedJobs = jobData.slice(0, 3).map(job => ({ ...job, applicationStatus: 'NTD đã xem', appliedDate: '2024-07-20' }));
const savedJobs = jobData.slice(2, 5);


const viewers = [
  { name: 'A', src: 'https://placehold.co/40x40.png?text=A' },
  { name: 'B', src: 'https://placehold.co/40x40.png?text=B' },
  { name: 'C', src: 'https://placehold.co/40x40.png?text=C' },
  { name: 'D', src: 'https://placehold.co/40x40.png?text=D' },
  { name: 'E', src: 'https://placehold.co/40x40.png?text=E' },
  { name: 'F', src: 'https://placehold.co/40x40.png?text=F' },
];

const EmptyProfileView = () => (
    <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold font-headline">Bắt đầu hành trình tìm việc của bạn</h1>
        <p className="text-muted-foreground mt-1">
            Hoàn thiện hồ sơ của bạn để nhận được những gợi ý việc làm phù hợp nhất từ HelloJob AI.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
             <Button asChild className="bg-accent-orange hover:bg-accent-orange/90 text-white">
                <Link href="/ai-profile">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tạo hồ sơ nhanh
                </Link>
            </Button>
            <Button asChild>
                <Link href="/candidate-profile">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Xem trang hồ sơ và khởi tạo
                </Link>
            </Button>
        </div>
    </div>
);


const LoggedInView = () => {
    const { role } = useAuth();
    const [isViewersDialogOpen, setIsViewersDialogOpen] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [visibleJobsCount, setVisibleJobsCount] = useState(8); // Show 8 jobs initially
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchParams = useSearchParams();
    const [isHighlighted, setIsHighlighted] = useState(false);
    
    // Initialize accordion state directly from searchParams
    const [openAccordion, setOpenAccordion] = useState<string | undefined>(
        searchParams.get('highlight') === 'suggested' ? 'item-1' : undefined
    );

    useEffect(() => {
        const highlight = searchParams.get('highlight');
        if (highlight === 'suggested') {
            setIsHighlighted(true);
            const timer = setTimeout(() => setIsHighlighted(false), 2500); // Highlight for 2.5 seconds
            return () => clearTimeout(timer);
        }
    }, [searchParams]);


    useEffect(() => {
        if (role === 'candidate-empty-profile') {
            setIsLoadingSuggestions(false);
            return;
        }

        const fetchSuggestedJobs = async () => {
            setIsLoadingSuggestions(true);
            try {
                const storedProfile = localStorage.getItem('generatedCandidateProfile');
                if (storedProfile) {
                    const profile: CandidateProfile = JSON.parse(storedProfile);
                    const matchResults = await matchJobsToProfile(profile);
                    // Extract job object from each match result
                    const jobs = matchResults.map(result => result.job);
                    setSuggestedJobs(jobs);
                } else {
                    // Fallback to some default jobs if no profile is found
                    setSuggestedJobs(jobData.slice(0, 20));
                }
            } catch (error) {
                console.error("Failed to fetch suggested jobs:", error);
                setSuggestedJobs(jobData.slice(0, 20)); // Fallback on error
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        fetchSuggestedJobs();
    }, [role]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prev => prev + 8);
            setIsLoadingMore(false);
        }, 500); // Simulate network delay
    };

    if (role === 'candidate-empty-profile') {
        return <EmptyProfileView />;
    }

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
                collapsible 
                className="w-full" 
                value={openAccordion}
                onValueChange={setOpenAccordion}
            >
                <AccordionItem value="item-1" className={cn(
                    "transition-all duration-1000 ease-out",
                    isHighlighted ? "ring-2 ring-offset-2 ring-yellow-400 shadow-2xl rounded-lg" : ""
                )}>
                    <AccordionTrigger className="bg-background px-6 rounded-t-lg font-semibold text-base hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span>Gợi ý cho bạn</span>
                            <Badge>{isLoadingSuggestions ? '...' : suggestedJobs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background p-6 rounded-b-lg">
                       {isLoadingSuggestions ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4 space-y-3">
                                            <Skeleton className="h-28 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-full" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                       ) : suggestedJobs.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {suggestedJobs.slice(0, visibleJobsCount).map((job) => ( <JobCard key={job.id} job={job} showRecruiterName={false} /> ))}
                                </div>
                                {visibleJobsCount < suggestedJobs.length && (
                                    <div className="text-center mt-8">
                                        <Button onClick={handleLoadMore} disabled={isLoadingMore}>
                                            {isLoadingMore ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang tải...
                                                </>
                                            ) : (
                                                'Xem thêm'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                       ) : (
                           <div className="text-center py-8 text-muted-foreground">
                             <p>Không tìm thấy công việc nào phù hợp với hồ sơ của bạn.</p>
                             <p className="text-sm mt-2">Hãy thử cập nhật <Link href="/candidate-profile" className="text-primary underline">hồ sơ và nguyện vọng</Link> của bạn.</p>
                           </div>
                       )}
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger className="bg-background px-6 rounded-t-lg font-semibold text-base hover:no-underline mt-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            <span>Việc đã ứng tuyển</span>
                            <Badge>{appliedJobs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background p-6 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {appliedJobs.map((job) => ( <JobCard key={job.id} job={job} showRecruiterName={false} /> ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="bg-background px-6 rounded-t-lg font-semibold text-base hover:no-underline mt-4">
                        <div className="flex items-center gap-3">
                            <Bookmark className="h-5 w-5 text-red-500" />
                            <span>Việc đã lưu</span>
                            <Badge>{savedJobs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background p-6 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {savedJobs.map((job) => ( <JobCard key={job.id} job={job} showRecruiterName={false} /> ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Job phù hợp/tuần" value="12" change="+5.2%" />
            <StatCard title="Job phù hợp/tháng" value="48" change="+8.1%" />
            <StatCard title="Job cùng ngành nghề" value="315" />
            <StatCard title="Lượt xem hồ sơ" value={viewers.length} change="+12" />
        </div>
        
        {/* Progress Tracker */}
        <div className="mb-8">
            <h2 className="text-xl font-bold font-headline mb-4">Tiến độ của bạn</h2>
            <ProgressTracker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <JobStatsChart />
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
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                         <Card className="shadow-lg border-dashed flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer min-h-[100px]">
                            <CardContent className="p-4 text-center">
                               <PlusCircle className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
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

const LoggedOutView = () => {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    return (
        <>
        <div className="flex items-center justify-center text-center py-20">
            <Card className="max-w-2xl p-8 shadow-2xl">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Briefcase className="h-12 w-12 text-primary"/>
                    </div>
                    <CardTitle className="text-3xl font-headline">Quản lý việc làm của bạn</CardTitle>
                    <CardDescription className="text-base pt-2">
                        Đăng nhập để xem các công việc được gợi ý riêng cho bạn, theo dõi các đơn đã ứng tuyển và quản lý các việc làm đã lưu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setIsAuthDialogOpen(true)} size="lg">
                        <LogIn className="mr-2"/>Đăng ký / Đăng nhập
                    </Button>
                </CardContent>
            </Card>
        </div>
        <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </>
    )
}

function JobsDashboardPageContent() {
    const { role } = useAuth();
    const isLoggedIn = role === 'candidate' || role === 'candidate-empty-profile';
  
    return (
      <div className="bg-secondary min-h-screen">
        <div className="container mx-auto px-2 md:px-4 py-8">
          {isLoggedIn ? <LoggedInView /> : <LoggedOutView />}
        </div>
      </div>
    );
}


export default function JobsDashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <JobsDashboardPageContent />
        </Suspense>
    )
}
