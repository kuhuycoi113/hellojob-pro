
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import VideoCallClient from './client';

function Loading() {
    return (
        <div className="flex h-screen w-full flex-col bg-black text-white items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin"/>
            <p className="mt-4">Đang tải cuộc gọi...</p>
        </div>
    )
}

export default function VideoCallPage() {
    return (
        <Suspense fallback={<Loading />}>
            <VideoCallClient />
        </Suspense>
    );
}
