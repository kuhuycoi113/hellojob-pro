
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NhaTuyenDungPageContent from './landing/can-bo-tuyen-dung/page'; // Default landing

export default function NhaTuyenDungPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // This effect will run on the client side to handle redirection
    useEffect(() => {
        if (searchParams.get('action') === 'register') {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('action'); // Clean up the action param
            router.replace(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
        }
    }, [searchParams, router]);

    // Render a fallback or the main content while waiting for potential redirection
    return (
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin"/></div>}>
        <NhaTuyenDungPageContent />
      </Suspense>
    );
}
