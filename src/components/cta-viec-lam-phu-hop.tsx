
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

export function CtaViecLamPhuHop() {
    const { isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const fetchSuggestions = useCallback(async () => {
        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
            const profile: Partial<CandidateProfile> | null = storedProfile ? JSON.parse(storedProfile) : null;

            const matchResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
            setSuggestions(matchResults.slice(0, 4));
        } catch (error) {
            console.error("Failed to fetch behavioral suggestions for CTA:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchSuggestions();

        const handleStorageChange = () => fetchSuggestions();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [fetchSuggestions]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <section id="VIECLAMPHUHOP01" className="w-full">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-headline font-bold text-center mb-12">
                    <BrainCircuit className="inline-block mr-3 text-purple-500 h-8 w-8" />
                    Có thể bạn quan tâm
                </h2>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)}
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestions.map((item) => (
                            <JobCard key={item.job.id} job={item.job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground bg-background rounded-lg">
                        <p>Hãy xem và lưu một vài công việc để chúng tôi có thể gợi ý tốt hơn cho bạn!</p>
                        <Button asChild variant="link" className="mt-2">
                            <Link href="/viec-lam">Bắt đầu tìm kiếm</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
