
'use client';

import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import EmployerDetailPage from './client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function PageLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const partnerId = searchParams.get('partnerId');

  useEffect(() => {
    if (!partnerId) {
      router.replace('/nha-tuyen-dung');
    }
  }, [partnerId, router]);

  if (!partnerId) {
    // Show a skeleton loader that matches the page layout
    return (
       <div className="bg-secondary">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <Skeleton className="h-64 w-full mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
  
  return <EmployerDetailPage />;
}

// This is the main page component
export default function EmployerRegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-16 w-16 animate-spin text-primary"/>
            </div>
        }>
            <PageLogic />
        </Suspense>
    );
}
