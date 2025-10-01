
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, LogIn, UserPlus, Sparkles, Star, FastForward, ListChecks, HardHat, UserCheck, GraduationCap, PlusCircle, Pencil, BrainCircuit } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { jobData, type Job } from '@/lib/mock-data';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import type { CandidateProfile } from '@/ai/schemas';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { cn } from '@/lib/utils';

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

        // API is called for all users. If profile & signals are null/empty, it returns default jobs.
        const matchResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
        setSuggestions(matchResults.slice(0, 4));
    } catch (error) {
        console.error("Failed to fetch behavioral suggestions for CTA:", error);
        // Fallback to generic popular jobs on error
        setSuggestions(jobData.slice(4, 8).map(job => ({ job })));
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
    // Optional: Re-fetch when user logs in/out or when behavior signals change
    const handleStorageChange = () => fetchSuggestions();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
  )
}
