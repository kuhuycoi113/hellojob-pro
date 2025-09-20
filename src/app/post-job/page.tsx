// This file is deprecated and will be removed.
// The new job posting page is located at /partner/post-job
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeprecatedPostJobPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/partner/post-job');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p>Redirecting to the new job posting page...</p>
        </div>
    );
}
