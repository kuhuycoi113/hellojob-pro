
'use client';

import { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Briefcase, Handshake, MessageSquare, PieChart, Send, ShieldCheck, Sparkles, Star, Target, Users, Phone, ChevronRight, Bookmark, MapPin } from 'lucide-react';
import { MessengerIcon, ZaloIcon } from '@/components/custom-icons';
import { ContactButtons } from '@/components/contact-buttons';
import { consultants as consultantData } from '@/lib/consultant-data';
import { jobData, type Job } from '@/lib/mock-data';
import Link from 'next/link';
import { industryGroups } from '@/lib/industry-data';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const companyValues = [
    {
        icon: Sparkles,
        title: "Ưu điểm hệ thống",
        description: "Áp dụng công nghệ vào tìm đơn nên sẽ có hệ thống đơn rất nhiều, cho các bạn được nhiều lựa chọn và so sánh hơn thị trường."
    },
    {
        icon: Users,
        title: "Đội ngũ hỗ trợ tận tâm",
        description: "Có đội ngũ Sale và công nghệ nên luôn care giúp bạn đến lúc tìm được đơn."
    },
    {
        icon: Send,
        title: "Cập nhật thông tin liên tục",
        description: "Có hạ tầng MKT để bạn thường xuyên nhận được thông tin đơn và thông tin về TKT, thông tin về làm việc tại Nhật hữu ích nhất."
    }
]

const addedValues = [
    {
        icon: Target,
        title: "Đào tạo phỏng vấn chuyên sâu",
        description: "Tăng tỷ lệ đỗ phỏng vấn lên đến 90%."
    },
    {
        icon: Award,
        title: "Hỗ trợ phát triển tư duy và sự nghiệp",
        description: "Giúp bạn biết cần gì để có thể lên Ginou 2, ở lại Nhật lâu dài và có thăng tiến trong công việc, thu nhập tốt hơn."
    },
    {
        icon: ShieldCheck,
        title: "Đồng hành và giải quyết vấn đề",
        description: "Tư vấn giải quyết các vấn đề thắc mắc về tư duy, những khúc mắc, ứng xử, văn hoá trong cuộc sống tại Nhật."
    },
]

// PHANLOAINHOMNGANH01 Algorithm
const getJobsByGroupedExpertise = (expertise: string): Job[] | null => {
    const lowerExpertise = expertise.toLowerCase();
    let targetIndustries: string[] = [];

    for (const groupName in industryGroups) {
        if (lowerExpertise.includes(groupName.toLowerCase())) {
            targetIndustries = industryGroups[groupName as keyof typeof industryGroups];
            break;
        }
    }
    
    if (targetIndustries.length > 0) {
        return jobData.filter(job => 
            targetIndustries.some(industry => job.industry.toLowerCase().includes(industry.toLowerCase()))
        );
    }

    return null;
}

const visasForVndDisplay = [
    'Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đi mới', 'Kỹ sư, tri thức đầu Việt',
];

const JPY_VND_RATE = 180;

const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatSalaryForDisplay = (salaryValue?: string, visaDetail?: string): string => {
    if (!salaryValue) return 'N/A';
    const numericValue = parseInt(salaryValue.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return salaryValue;

    if (visaDetail && visasForVndDisplay.includes(visaDetail)) {
        const vndValue = numericValue * JPY_VND_RATE;
        const valueInMillions = vndValue / 1000000;
        
        if (valueInMillions % 1 === 0) {
            return `${valueInMillions.toLocaleString('vi-VN')}tr`;
        }
        
        const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `${formattedVnd.replace('.',',')}tr`;
    }
    
    return `${formatCurrency(salaryValue)} JPY`;
};


const ConsultantJobCard = ({ job, showRecruiterName = true, showPostedTime = false }: { job: Job, showRecruiterName?: boolean, showPostedTime?: boolean }) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [interviewDate, setInterviewDate] = useState<string | null>(null);
  const [postedTime, setPostedTime] = useState<string | null>(null);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(job.id));
    
    const today = new Date();
    const fullInterviewDate = new Date(today);
    fullInterviewDate.setDate(today.getDate() + job.interviewDateOffset);
    setInterviewDate(fullInterviewDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    
     const postedDate = new Date(today);
    postedDate.setDate(today.getDate() + job.postedTimeOffset);
    setPostedTime(`10:00 ${postedDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}`);

  }, [job.id, job.interviewDateOffset, job.postedTimeOffset]);


  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (isSaved) {
        const newSavedJobs = savedJobs.filter((id: string) => id !== job.id);
        localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
        setIsSaved(false);
    } else {
        savedJobs.push(job.id);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        setIsSaved(true);
    }
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    router.push(`/viec-lam/${job.id}`);
  };

  return (
    <div onClick={handleCardClick} className="w-full transition-shadow duration-300 hover:shadow-lg rounded-lg cursor-pointer border bg-card text-card-foreground">
        <div className="p-3 hover:bg-secondary/30">
            <div className="flex flex-col items-stretch gap-4 md:flex-row">
                <div className="relative h-48 w-full flex-shrink-0 md:h-auto md:w-48">
                    <Image src={job.image.src} alt={job.title} fill className="rounded-lg object-cover" />
                    <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                        <span>{job.id}</span>
                    </div>
                </div>
                <div className="flex flex-grow flex-col">
                    <h3 className="mb-2 text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary">{job.title}</h3>
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {job.visaDetail && <Badge variant="outline" className="border-accent-blue text-accent-blue">{job.visaDetail}</Badge>}
                        {job.salary.actual && <Badge variant="secondary" className="bg-green-100 text-green-800">Thực lĩnh: {formatSalaryForDisplay(job.salary.actual, job.visaDetail)}</Badge>}
                        <Badge variant="secondary">Cơ bản: {formatSalaryForDisplay(job.salary.basic, job.visaDetail)}</Badge>
                    </div>
                     <div className="text-xs text-muted-foreground mt-1">
                        <p className="flex items-center gap-1.5">
                            <span className="text-primary">Ngày phỏng vấn:</span>
                            <span>{interviewDate || "N/A"}</span>
                        </p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        <p className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{job.workLocation}</span>
                        </p>
                    </div>
                    <div id="DONGLIENHEUNGTUYEN01" className="mt-auto flex flex-wrap items-end justify-between gap-y-2 pt-2">
                       <div className="flex items-center gap-2">
                         <Link href={`/tu-van-vien/${job.recruiter.id}`} onClick={(e) => e.stopPropagation()}>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={job.recruiter.avatarUrl} />
                                <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                         <ContactButtons contact={job.recruiter as any} />
                       </div>
                       <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" className={cn("hidden bg-white md:flex border-gray-300", isSaved && "border border-accent-orange bg-background text-accent-orange hover:bg-accent-orange/5 hover:text-accent-orange")} onClick={handleSaveJob}>
                             <Bookmark className={cn("mr-2 h-4 w-4", isSaved ? "fill-current text-accent-orange" : "text-gray-400")} />
                             Lưu
                         </Button>
                         <Button size="sm" onClick={(e) => {e.stopPropagation(); router.push(`/viec-lam/${job.id}#apply`)}} className="bg-accent-orange text-white">Ứng tuyển</Button>
                       </div>
                    </div>
                     {showPostedTime && (
                        <p className="text-right text-[11px] text-muted-foreground mt-2">
                            <span className="text-primary">Đăng lúc:</span> {postedTime ? postedTime.split(' ')[1] : '...'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default function ConsultantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const consultant = consultantData.find(c => c.id === resolvedParams.id);

    if (!consultant) {
        notFound();
    }
    
    // HIENTHIVIEC01 Algorithm
    const getConsultantJobs = (): Job[] => {
        // First, try to get jobs explicitly assigned to the consultant
        const directlyAssignedJobs = jobData.filter(job => job.recruiter.id === consultant.id);
        
        if (directlyAssignedJobs.length > 0) {
            return directlyAssignedJobs
                .sort((a, b) => new Date(b.postedTime.split(' ')[1].split('/').reverse().join('-')).getTime() - new Date(a.postedTime.split(' ')[1].split('/').reverse().join('-')).getTime())
                .slice(0, 4);
        }
        
        // If no jobs are directly assigned, fall back to the grouped expertise logic (PHANLOAINHOMNGANH01)
        const jobsByGroup = getJobsByGroupedExpertise(consultant.mainExpertise || '');
        if (jobsByGroup) {
            return jobsByGroup
                .sort((a, b) => new Date(b.postedTime.split(' ')[1].split('/').reverse().join('-')).getTime() - new Date(a.postedTime.split(' ')[1].split('/').reverse().join('-')).getTime())
                .slice(0, 4);
        }
        
        // If no jobs are found by either method, return an empty array.
        return [];
    };

    const consultantJobs = getConsultantJobs();
    
    const calculateManagedJobsCount = () => {
       // Count directly assigned jobs first for accuracy
       const directlyAssignedCount = jobData.filter(job => job.recruiter.id === consultant.id).length;
       if (directlyAssignedCount > 0) {
           return directlyAssignedCount;
       }
       
       // If no jobs are directly assigned, count based on expertise
       const jobsByGroup = getJobsByGroupedExpertise(consultant.mainExpertise || '');
       if (jobsByGroup) {
           return jobsByGroup.length;
       }
       return 0; // Default to 0 if no jobs are found
    };
    
    const managedJobsCount = calculateManagedJobsCount();


  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Consultant Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl text-center p-6">
                <Avatar className="h-32 w-32 mx-auto border-4 border-primary shadow-lg">
                    <AvatarImage src={consultant.avatarUrl} alt={consultant.name} data-ai-hint={consultant.dataAiHint} />
                    <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-headline font-bold mt-4">{consultant.name}</h1>
                <p className="text-primary font-semibold">Tư vấn viên</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {consultant.strengths.map(strength => (
                        <Badge key={strength} variant="secondary" className="bg-green-100 text-green-800 border-green-200">{strength}</Badge>
                    ))}
                </div>
            </Card>

            <Card className="shadow-xl">
              <CardHeader><CardTitle className="font-headline text-xl">Thông tin chuyên môn</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="flex items-start gap-3"><PieChart className="h-5 w-5 mt-0.5 text-muted-foreground"/> <span><strong>Kinh nghiệm:</strong> {consultant.experience}</span></p>
                <p className="flex items-start gap-3"><Star className="h-5 w-5 mt-0.5 text-muted-foreground"/> <span><strong>Lĩnh vực chính:</strong> {consultant.mainExpertise}</span></p>
                </CardContent>
            </Card>

            <Card className="shadow-xl">
                <CardHeader><CardTitle className="font-headline text-xl">Thành tích nổi bật</CardTitle></CardHeader>
                <CardContent className="flex justify-around text-center">
                    <div>
                        <p className="text-3xl font-bold text-primary">{consultant.successfulCandidates}</p>
                        <p className="text-muted-foreground text-sm mt-1">Ứng viên thành công</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-primary">{managedJobsCount}</p>
                        <p className="text-muted-foreground text-sm mt-1">Việc làm đang quản lý</p>
                    </div>
                </CardContent>
            </Card>

            <Card id="LIENHE01" className="shadow-lg p-4">
                <ContactButtons contact={consultant} showChatText={true} />
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
             <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Ưu điểm hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {companyValues.map(item => (
                    <div key={item.title} className="flex gap-4">
                        <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center">
                             <item.icon className="h-6 w-6"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
             <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Giá trị gia tăng khi sử dụng dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {addedValues.map(item => (
                    <div key={item.title} className="flex gap-4 items-start">
                         <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center">
                             <item.icon className="h-6 w-6"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
             <Card id="consultant-jobs-section" className="shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center justify-between">
                        <span>Việc làm phụ trách</span>
                        <Button variant="link" asChild><Link href="/viec-lam">Xem tất cả <ChevronRight className="h-4 w-4"/></Link></Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {consultantJobs.length > 0 ? (
                        consultantJobs.map(job => (
                            <ConsultantJobCard key={job.id} job={job} showPostedTime={true} />
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-2">Hiện tại tư vấn viên này chưa phụ trách công việc nào.</p>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
