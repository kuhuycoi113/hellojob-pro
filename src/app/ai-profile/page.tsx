'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AiProfileClientPage = dynamic(() => import('@/app/ai-profile/client'), {
  ssr: false,
  loading: () => (
    <div className="bg-secondary flex-grow">
        <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="max-w-6xl mx-auto text-center mb-12">
                 <Skeleton className="h-20 w-20 mx-auto mb-4 rounded-full" />
                 <Skeleton className="h-12 w-3/4 mx-auto" />
                 <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
                 <div className="space-y-6">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    </div>
  ),
});

export default function AiProfilePage() {
  return <AiProfileClientPage />;
}
