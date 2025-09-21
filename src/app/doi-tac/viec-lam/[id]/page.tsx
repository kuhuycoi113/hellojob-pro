

'use client';

import { useState, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Cake, Dna, GraduationCap, MapPin, Phone, School, User, Award, Languages, Star, FileDown, Video, Image as ImageIcon, PlusCircle, Trash2, RefreshCw, X, Camera, MessageSquare, Facebook, Contact, UserCog, Trophy, PlayCircle, LogOut, Lock, ArrowLeft, Handshake, Megaphone, CalendarDays, ClipboardCheck, Wallet, DollarSign, FileText, UserCheck, Sparkles } from 'lucide-react';
import { PaymentDialog } from '@/components/payment-dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { jobData } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { ConsultantSuggestionDialog } from '@/components/consultant-suggestion-dialog';
import Image from 'next/image';

const mockCandidates = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Ứng viên ${i + 1}`,
    avatarUrl: `https://placehold.co/100x100.png?text=${i+1}`,
    dataAiHint: `professional portrait`,
    matchScore: 95 - i * 2,
    headline: 'Có 2 năm kinh nghiệm vận hành dây chuyền SMT tại Samsung.',
    skills: ['Vận hành máy', 'Kiểm tra chất lượng', 'Tiếng Nhật N4']
}));


const CandidateCard = ({ candidate, isLocked, onUnlock }: { candidate: typeof mockCandidates[0], isLocked: boolean, onUnlock: () => void }) => {
    const cardContent = (
        <CardContent className="p-4 flex gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint={candidate.dataAiHint}/>
                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{candidate.name}</h4>
                    <Badge variant="outline" className="border-green-500 text-green-600">
                        <Star className="h-3 w-3 mr-1 fill-green-500"/>
                        {candidate.matchScore}% Phù hợp
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{candidate.headline}</p>
                <div className="flex flex-wrap gap-1">
                    {candidate.skills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </div>
        </CardContent>
    );

    if (isLocked) {
        return (
             <Card className="shadow-lg transition-all relative overflow-hidden">
                <div className="blur-sm">{cardContent}</div>
                <button
                    onClick={onUnlock}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 cursor-pointer w-full text-left hover:bg-secondary transition-colors"
                >
                    <Lock className="h-8 w-8 text-primary mb-4" />
                    <p className="text-center font-bold text-lg">Mở khóa để xem</p>
                    <p className="text-center text-muted-foreground text-sm">Nâng cấp tài khoản để xem toàn bộ ứng viên phù hợp.</p>
                </button>
            </Card>
        );
    }
    
    return (
         <Link href={`/doi-tac/ung-vien/${candidate.id}`} className="block">
            <Card className="shadow-lg transition-all hover:border-primary">
               {cardContent}
            </Card>
        </Link>
    )

};

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


export default function MatchingCandidatesPage({ params }: { params: { id: string } }) {
    const job = jobData.find(j => j.id === params.id);
    const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [isConsultantDialogOpen, setConsultantDialogOpen] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    
    if (!job) {
        notFound();
    }

    const handleUnlock = () => {
        setPaymentDialogOpen(true);
    };

    const handlePaymentSuccess = () => {
        setUnlocked(true);
        setPaymentDialogOpen(false);
    };
    
    const freeTierLimit = 5;

    return (
        <>
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/doi-tac"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại Bảng điều khiển</Link>
                    </Button>
                </div>

                {/* Job Details Section */}
                 <div className="lg:col-span-2 space-y-6 mb-8">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{job.tags[0]}</Badge>
                            <h1 className="text-2xl md:text-3xl font-bold font-headline mb-3">{job.title}</h1>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                                <p className="flex items-center gap-2"><Building className="h-4 w-4"/> {job.recruiter.company}</p>
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Nagasaki, Nhật Bản</p>
                                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Đăng {job.postedTime}</p>
                            </div>
                        </CardHeader>
                    </Card>

                    <JobDetailSection title="Mô tả công việc" icon={FileText}>
                        <div dangerouslySetInnerHTML={{ __html: job.details.description }} />
                    </JobDetailSection>
                        <JobDetailSection title="Yêu cầu ứng viên" icon={UserCheck}>
                            <div dangerouslySetInnerHTML={{ __html: job.details.requirements }} />
                    </JobDetailSection>

                        <JobDetailSection title="Quyền lợi & Chế độ" icon={Sparkles}>
                            <div dangerouslySetInnerHTML={{ __html: job.details.benefits }} />
                    </JobDetailSection>
                </div>

                {/* Candidates Section */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                     <h2 className="text-2xl font-bold font-headline">Ứng viên phù hợp ({mockCandidates.length})</h2>
                     <div className="flex flex-wrap items-center gap-3">
                         <Button onClick={handleUnlock} className="bg-primary text-white hover:bg-primary/90">
                            <Lock className="mr-2 h-4 w-4"/>
                            Mở khóa toàn bộ ứng viên
                        </Button>
                        <Button onClick={() => setConsultantDialogOpen(true)} className="bg-accent-green text-white hover:bg-accent-green/90">
                            <Handshake className="mr-2 h-4 w-4"/>
                            Yêu cầu HelloJob hỗ trợ
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockCandidates.map((candidate, index) => (
                        <CandidateCard 
                            key={candidate.id} 
                            candidate={candidate} 
                            isLocked={!unlocked && index >= freeTierLimit}
                            onUnlock={handleUnlock}
                        />
                    ))}
                </div>
            </div>
            <PaymentDialog 
                isOpen={isPaymentDialogOpen} 
                onClose={() => setPaymentDialogOpen(false)}
                onSuccess={handlePaymentSuccess}
            />
             <ConsultantSuggestionDialog 
                isOpen={isConsultantDialogOpen} 
                onClose={() => setConsultantDialogOpen(false)}
            />
        </>
    );
}
