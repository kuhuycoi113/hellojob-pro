
'use client';

import { useState, useEffect, useCallback } from 'react';
import { JobCard } from '@/components/job-card';
import type { Job } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import type { CandidateProfile } from '@/ai/schemas';
import { Skeleton } from './ui/skeleton';
import { BrainCircuit } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { CtaViecLamGoiY } from './cta-viec-lam-goi-y';
import { Card } from './ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import { AuthDialog } from './auth-dialog';

const CTAForGuest = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <Card className="text-center py-12 px-6 shadow-lg col-span-full">
        <div className="mx-auto bg-purple-100 p-4 rounded-full w-fit mb-4">
            <BrainCircuit className="h-10 w-10 text-purple-500"/>
        </div>
        <p className="font-semibold text-lg">Đăng nhập để nhận gợi ý việc làm được cá nhân hoá</p>
        <p className="text-muted-foreground mt-2 mb-6">Dựa trên hành vi của bạn, AI sẽ đề xuất những công việc phù hợp nhất.</p>
        <Button onClick={onLoginClick}>
            <LogIn className="mr-2 h-4 w-4" />
            Đăng nhập / Đăng ký
        </Button>
    </Card>
);

const CTAForEmptyProfile = () => (
    <Card className="text-center py-12 px-6 shadow-lg col-span-full">
        <div className="mx-auto bg-purple-100 p-4 rounded-full w-fit mb-4">
            <UserPlus className="h-10 w-10 text-purple-500"/>
        </div>
        <p className="font-semibold text-lg">Hoàn thiện hồ sơ để AI gợi ý việc làm tốt hơn</p>
        <p className="text-muted-foreground mt-2 mb-6">Càng nhiều thông tin, gợi ý của chúng tôi sẽ càng chính xác với mong muốn của bạn.</p>
        <Button asChild>
            <Link href="/ho-so-cua-toi">
                <UserPlus className="mr-2 h-4 w-4" />
                Cập nhật hồ sơ ngay
            </Link>
        </Button>
    </Card>
);


export function CtaViecLamPhuHop() {
    const { role, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    const fetchSuggestions = useCallback(async () => {
        setIsLoading(true);
        try {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
            const profile: Partial<CandidateProfile> | null = storedProfile ? JSON.parse(storedProfile) : null;

            const matchResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
            setSuggestions(matchResults.slice(0, 4));
        } catch (error) {
            console.error("Failed to fetch behavioral suggestions for CTA:", error);
            setSuggestions([]); // Fallback to empty on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestions();
        const handleStorageChange = () => fetchSuggestions();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [fetchSuggestions]);

    const renderContent = () => {
        if (!isLoggedIn) {
            return <CTAForGuest onLoginClick={() => setIsAuthDialogOpen(true)} />;
        }

        if (role === 'candidate-empty-profile') {
            return <CTAForEmptyProfile />;
        }
        
        if (isLoading) {
          return (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)
          );
        }
        
        if (suggestions.length === 0) {
             return (
                <div className="col-span-full text-center py-8 text-muted-foreground bg-background rounded-lg">
                    <p>Hãy xem và lưu một vài công việc để chúng tôi có thể gợi ý tốt hơn cho bạn!</p>
                    <Button asChild variant="link" className="mt-2">
                        <Link href="/viec-lam">Bắt đầu tìm kiếm</Link>
                    </Button>
                </div>
            );
        }

        return (
            suggestions.map((item) => (
                <JobCard key={item.job.id} job={item.job} />
            ))
        );
    };
  
    return (
        <section id="VIECPHUHOP02" className="w-full">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-headline font-bold text-center mb-12">
                    <BrainCircuit className="inline-block mr-3 text-purple-500 h-8 w-8" />
                    Có thể bạn quan tâm
                </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderContent()}
                </div>
                <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
            </div>
        </section>
    );
}
