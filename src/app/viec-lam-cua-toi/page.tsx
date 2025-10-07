
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MyJobsDashboardPageContent from './client';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

function MyJobsDashboardPage() {
    const searchParams = useSearchParams();
    
    // By passing searchParams as a key, we force the client component to remount
    // whenever the URL query string changes, which is a robust way to solve the state issue.
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin"/></div>}>
            <MyJobsDashboardPageContent key={searchParams.toString()} searchParams={searchParams}/>
        </Suspense>
    )
}

export default function MyJobsDashboardPageWrapper() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin"/></div>}>
            <MyJobsDashboardPage />
        </Suspense>
    );
}
