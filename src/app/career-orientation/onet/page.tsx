
import { Suspense } from 'react';
import OnetClientPage from './client';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
    return (
        <div className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <Skeleton className="h-12 w-3/4 mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                    </div>
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
}


export default function OnetPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OnetClientPage />
    </Suspense>
  );
}
