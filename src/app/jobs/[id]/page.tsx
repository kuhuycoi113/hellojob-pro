

'use client';

import { notFound } from 'next/navigation';
import { jobData, type Job } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, CalendarDays, DollarSign, Heart, MapPin, Sparkles, UserCheck, FileText, Share2, Users, ClipboardCheck, Wallet, UserRound, ArrowLeft, Video, Image as ImageIcon, Milestone, Languages, Cake, ChevronsRight, Info, Star, GraduationCap, Weight, Ruler, Dna, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { cn } from '@/lib/utils';
import { consultants } from '@/lib/chat-data';

const JobDetailSection = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-xl"><Icon className="text-primary h-6 w-6"/>{title}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground prose-sm md:prose-base">
            {children}
        </CardContent>
    </Card>
);

const JPY_VND_RATE = 180; // Example rate

const formatCurrency = (value?: string, currency: 'JPY' | 'VND' = 'JPY') => {
    if (!value) return 'N/A';
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return value;
    
    if (currency === 'VND') {
        return `${numericValue.toLocaleString('vi-VN')} VNĐ`;
    }
    return `${numericValue.toLocaleString('ja-JP')} yên`;
};

const convertToVnd = (jpyValue?: string) => {
    if (!jpyValue) return null;
    const numericValue = parseInt(jpyValue.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return null;
    const vndValue = numericValue * JPY_VND_RATE;
    return `≈ ${vndValue.toLocaleString('vi-VN')} VNĐ`;
};


export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const job = jobData.find(j => j.id === resolvedParams.id);

    if (!job) {
        notFound();
    }
    
    const jobIndex = parseInt(job.id.replace('JP-DEMO', ''), 10);
    const assignedConsultant = consultants[jobIndex % consultants.length];

    const RequirementItem = ({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value?: string | number, className?: string }) => {
        if (!value) return null;
        return (
            <div className={cn("flex items-start gap-3", className)}>
                <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-muted-foreground">{value}</p>
                </div>
            </div>
        )
    };

    return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại trang Việc làm</Link>
                    </Button>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <h1 className="text-2xl md:text-3xl font-bold font-headline mb-3">{job.title}</h1>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                                    <p className="flex items-center gap-2"><Building className="h-4 w-4"/> {job.recruiter.company}</p>
                                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {job.workLocation}</p>
                                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Đăng {job.postedTime}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-4">
                                     <Button size="lg" className="w-full sm:w-auto bg-accent-orange text-white">Ứng tuyển ngay</Button>
                                     <Button size="lg" variant="outline" className="w-full sm:w-auto"><Heart className="mr-2"/> Lưu tin</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-headline text-xl"><Info className="text-primary h-6 w-6"/>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <RequirementItem icon={Milestone} label="Loại Visa" value={job.visaType}/>
                                <RequirementItem icon={ChevronsRight} label="Chi tiết Visa" value={job.visaDetail}/>
                                <RequirementItem icon={Briefcase} label="Ngành nghề" value={job.industry}/>
                                <RequirementItem icon={MapPin} label="Nơi phỏng vấn" value={job.interviewLocation}/>
                                <RequirementItem icon={User} label="Giới tính" value={job.gender}/>
                                <RequirementItem icon={Users} label="Số lượng" value={`${job.quantity} người`}/>
                                <RequirementItem icon={Cake} label="Yêu cầu tuổi" value={job.ageRequirement}/>
                                <RequirementItem icon={Languages} label="Yêu cầu ngoại ngữ" value={job.languageRequirement}/>
                                <RequirementItem icon={CalendarDays} label="Ngày phỏng vấn" value={job.interviewDate}/>
                                <RequirementItem icon={ClipboardCheck} label="Số vòng" value={`${job.interviewRounds} vòng`}/>
                                <RequirementItem icon={Wallet} label="Mức phí" value={job.netFee}/>
                                <RequirementItem icon={Star} label="Điều kiện đặc biệt" value={job.specialConditions}/>
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-headline text-xl"><UserCheck className="text-primary h-6 w-6"/>Yêu cầu chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <RequirementItem icon={GraduationCap} label="Yêu cầu học vấn" value={job.educationRequirement}/>
                                <RequirementItem icon={Briefcase} label="Kinh nghiệm" value={job.experienceRequirement}/>
                                <RequirementItem icon={CalendarDays} label="Số năm kinh nghiệm" value={job.yearsOfExperience}/>
                                <RequirementItem icon={Ruler} label="Chiều cao" value={job.heightRequirement}/>
                                <RequirementItem icon={Weight} label="Cân nặng" value={job.weightRequirement}/>
                                {job.hepatitisBRequirement === 'Không nhận viêm gan B' && (
                                    <RequirementItem icon={Dna} label="Viêm gan B" value={job.hepatitisBRequirement}/>
                                )}
                                <RequirementItem icon={User} label="Hình xăm" value={job.tattooRequirement}/>
                                <RequirementItem icon={ImageIcon} label="Yêu cầu thị lực" value={job.visionRequirement}/>
                                <RequirementItem icon={ClipboardCheck} label="Hình thức phỏng vấn" value={job.interviewFormat}/>
                            </CardContent>
                        </Card>

                        <JobDetailSection title="Mô tả công việc & Ghi chú" icon={FileText}>
                            <div dangerouslySetInnerHTML={{ __html: job.details.description }} />
                        </JobDetailSection>

                         <JobDetailSection title="Quyền lợi & Chế độ" icon={Sparkles}>
                             <div dangerouslySetInnerHTML={{ __html: job.details.benefits }} />
                        </JobDetailSection>

                        { (job.details.videoUrl || (job.details.images && job.details.images.length > 0)) &&
                            <JobDetailSection title="Hình ảnh & Video công việc" icon={ImageIcon}>
                                <div className="space-y-6">
                                    {job.details.videoUrl && (
                                        <div className="aspect-video">
                                            <iframe className="w-full h-full rounded-lg" src={job.details.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </div>
                                    )}
                                    {job.details.images && job.details.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {job.details.images.map((image, index) => (
                                                <Image key={index} src={image.src} alt={image.alt} width={600} height={400} className="rounded-lg object-cover" data-ai-hint={image.dataAiHint} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </JobDetailSection>
                        }

                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                        <Card className="shadow-lg">
                            <CardHeader>
                               <CardTitle className="text-lg">Mức lương</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Lương cơ bản</p>
                                    <p className="text-2xl font-bold text-accent-green">{formatCurrency(job.salary.basic, 'JPY')}</p>
                                    {job.salary.basic && <p className="text-xs text-muted-foreground">{convertToVnd(job.salary.basic)}</p>}
                                    {job.salary.actual && (
                                        <div className="pt-2">
                                            <p className="font-semibold text-muted-foreground">Thực lĩnh: ~{formatCurrency(job.salary.actual, 'JPY')}</p>
                                            {job.salary.actual && <p className="text-xs text-muted-foreground">{convertToVnd(job.salary.actual)}</p>}
                                        </div>
                                    )}
                               </div>
                               <div className="border-t pt-4 space-y-2 text-sm">
                                   {job.salary.annualIncome && <p>Thu nhập năm: <strong>{job.salary.annualIncome}</strong></p>}
                                   {job.salary.annualBonus && <p>Thưởng: <strong>{job.salary.annualBonus}</strong></p>}
                               </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg">
                             <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2"><UserRound/>Tư vấn viên</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                     <Avatar className="h-12 w-12">
                                        <AvatarImage src={assignedConsultant.avatarUrl} alt={assignedConsultant.name} />
                                        <AvatarFallback>{assignedConsultant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-primary">{assignedConsultant.name}</p>
                                        <p className="text-sm text-muted-foreground">{assignedConsultant.mainExpertise}</p>
                                    </div>
                                </div>
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={`/consultant-profile/${assignedConsultant.id}`}>Xem hồ sơ tư vấn viên</Link>
                                </Button>
                             </CardContent>
                             <div className="border-t p-4 flex justify-center">
                                 <Button variant="ghost" className="text-muted-foreground text-sm"><Share2 className="mr-2 h-4 w-4"/>Chia sẻ tin này</Button>
                             </div>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
}
