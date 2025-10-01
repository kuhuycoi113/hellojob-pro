
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobSearchPageContent from './client';

export default function JobSearchPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary"/>
        </div>
    }>
        <JobSearchPageContent searchParams={{}}/>
    </Suspense>
  );
}

    