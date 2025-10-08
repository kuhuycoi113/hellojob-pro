'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EmployerDetailPage from '../client';

export default function CompletionPage() {
    const router = useRouter();

    const handleCreateAccount = () => {
        // Logic to navigate to account creation page
        // For now, we can just log it or redirect to a placeholder
        console.log("Redirecting to create account...");
        router.push('/dang-ky'); // Or wherever the registration page is
    };

    const handleLater = () => {
        // Navigate to the homepage or another relevant page
        router.push('/');
    };

    return (
        <div>
            {/* The main content is the disabled version of the employer detail page */}
            <EmployerDetailPage isConfirmationMode={true} showCtas={false} />

            {/* Sticky footer for success message and actions */}
            <div className="sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
                    <div className="flex-grow">
                        <p className="font-semibold text-foreground">Thông tin của bạn đã được gửi, chúng tôi sẽ sớm liên hệ với bạn.</p>
                        <p className="text-sm text-muted-foreground">Bạn có muốn tạo tài khoản để lưu lại thông tin không?</p>
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        <Button variant="outline" size="lg" onClick={handleLater}>
                            Để sau
                        </Button>
                        <Button size="lg" onClick={handleCreateAccount} className="bg-accent-orange hover:bg-accent-orange/90 text-white">
                            Tạo tài khoản
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
