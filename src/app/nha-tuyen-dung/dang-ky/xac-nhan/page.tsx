'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EmployerDetailPage from '../client';

export default function ConfirmationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleEdit = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
    };

    const handleConfirm = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/nha-tuyen-dung/dang-ky/hoan-thanh?${params.toString()}`);
    };

    return (
        <div>
            {/* The main content is the disabled version of the employer detail page */}
            <EmployerDetailPage isConfirmationMode={true} />

            {/* Sticky footer for actions */}
            <div className="sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
                    <p className="font-semibold text-foreground">Bạn đã chắc chắn với các thông tin đã điền chưa?</p>
                    <div className="flex gap-4">
                        <Button variant="outline" size="lg" onClick={handleEdit}>
                            Sửa lại
                        </Button>
                        <Button size="lg" onClick={handleConfirm} className="bg-accent-green hover:bg-accent-green/90 text-white">
                            Xác nhận & Tiếp tục
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
