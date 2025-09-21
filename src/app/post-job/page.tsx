// This file is deprecated and will be removed.
// The new job posting page is located at /doi-tac/dang-tin-tuyen-dung
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeprecatedPostJobPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/doi-tac/dang-tin-tuyen-dung');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p>Redirecting to the new job posting page...</p>
        </div>
    );
}
