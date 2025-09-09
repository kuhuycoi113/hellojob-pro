'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AiProfileClientPage = dynamic(() => import('@/app/ai-profile/client'), {
  ssr: false,
  loading: () => (
    <div className="bg-secondary flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                 <Skeleton className="h-20 w-80 mx-auto" />
                 <Skeleton className="h-8 w-full max-w-2xl mx-auto" />
                 <Skeleton className="h-64 w-full" />
                 <Skeleton className="h-48 w-full" />
            </div>
        </div>
    </div>
  ),
});

export default function AiProfilePage() {
  return <AiProfileClientPage />;
}
