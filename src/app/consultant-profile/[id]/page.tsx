

'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Briefcase, Handshake, MessageSquare, PieChart, Send, ShieldCheck, Sparkles, Star, Target, Users, Phone, ChevronRight } from 'lucide-react';
import { MessengerIcon, ZaloIcon } from '@/components/custom-icons';
import { ContactButtons } from '@/components/contact-buttons';
import { consultants as consultantData } from '@/lib/consultant-data';
import { jobData, type Job } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';
import Link from 'next/link';
import { industryGroups } from '@/lib/industry-data';

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

            <Card className="shadow-lg p-4">
                <ContactButtons contact={consultant} />
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
                        <Button variant="link" asChild><Link href="/jobs">Xem tất cả <ChevronRight className="h-4 w-4"/></Link></Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {consultantJobs.length > 0 ? (
                        consultantJobs.map(job => (
                            <JobCard key={job.id} job={job} showRecruiterName={false} />
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
