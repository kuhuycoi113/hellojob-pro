
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, LogIn, UserPlus, Sparkles, Star } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { jobData, type Job } from '@/lib/mock-data';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import type { CandidateProfile } from '@/ai/schemas';
import { Skeleton } from './ui/skeleton';

const CTAForGuest = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <Card className="text-center py-12 px-6 shadow-lg col-span-full">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <UserPlus className="h-10 w-10 text-primary"/>
        </div>
        <p className="font-semibold text-lg">Đăng ký để nhận gợi ý việc làm phù hợp</p>
        <p className="text-muted-foreground mt-2 mb-6">Tạo hồ sơ của bạn để AI của chúng tôi có thể tìm ra những cơ hội tốt nhất dành cho bạn.</p>
        <Button onClick={onLoginClick}>
            <LogIn className="mr-2 h-4 w-4" />
            Đăng nhập / Đăng ký
        </Button>
    </Card>
);

const CTAForEmptyProfile = () => (
    <Card className="text-center py-12 px-6 shadow-lg col-span-full">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <UserPlus className="h-10 w-10 text-primary" />
        </div>
        <p className="font-semibold text-lg">Tạo hồ sơ để được hiển thị việc làm phù hợp</p>
        <p className="text-muted-foreground mt-2 mb-6">Hoàn thiện hồ sơ của bạn để nhận được những gợi ý việc làm phù hợp nhất từ HelloJob AI.</p>
        <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-accent-orange hover:bg-accent-orange/90 text-white">
                <Link href="/tao-ho-so-ai">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tạo hồ sơ nhanh bằng AI
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dang-ky">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tạo hồ sơ chi tiết
                </Link>
            </Button>
        </div>
    </Card>
);

interface CtaHienThiViec08Props {
  lang: 'vi' | 'ja' | 'en';
}

export function CtaHienThiViec08({ lang }: CtaHienThiViec08Props) {
  const { role, isLoggedIn } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
        const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
        const storedProfile = localStorage.getItem('generatedCandidateProfile');
        const profile: Partial<CandidateProfile> | null = storedProfile ? JSON.parse(storedProfile) : null;

        const matchResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
        setSuggestions(matchResults.slice(0, 4));
    } catch (error) {
        console.error("Failed to fetch behavioral suggestions for CTA:", error);
        setSuggestions(jobData.slice(4, 8).map(job => ({ job })));
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'behavioralSignals' || event.key === 'generatedCandidateProfile' || event.key === null) {
            fetchSuggestions();
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchSuggestions]);
  
  const handleLoginClick = () => {
      setIsAuthDialogOpen(true);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
         Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)
      );
    }
    
    if (suggestions.length === 0) {
        if (isLoggedIn) {
            return <CTAForEmptyProfile />;
        }
        return <CTAForGuest onLoginClick={handleLoginClick} />;
    }

    return (
        suggestions.map((item) => (
            <JobCard key={item.job.id} job={item.job} />
        ))
    );
  };
  
  const content = {
    vi: {
        title: "Mẫu hiển thị việc cho ứng viên",
        subtitle: "応募者向け求人表示 / Job Display for Candidates"
    },
    ja: {
        title: "応募者向け求人表示",
        subtitle: "Mẫu hiển thị việc cho ứng viên / Job Display for Candidates"
    },
    en: {
        title: "Job Display for Candidates",
        subtitle: "Mẫu hiển thị việc cho ứng viên / 応募者向け求人表示"
    },
  }[lang];


  return (
    <section id="HIENTHIVIEC08" className="w-full mt-20 md:mt-28">
        <div className="container mx-auto px-4 md:px-6">
             <div className="mb-8">
                <h2 className="text-2xl font-headline font-bold text-left mb-2 flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-primary" />
                    <span>{content.title}</span>
                </h2>
                <p className="text-muted-foreground text-left">{content.subtitle}</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderContent()}
            </div>
            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </div>
    </section>
  )
}
