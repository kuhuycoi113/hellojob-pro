
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EmployerDetailPage from '../client';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth-dialog';
import { useState } from 'react';

export default function CompletionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setPostLoginAction } = useAuth();
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    const handleCreateAccount = () => {
        const recruiterData = Object.fromEntries(searchParams.entries());
        setPostLoginAction({
            type: 'REGISTER_RECRUITER',
            data: { recruiterData }
        });
        setIsAuthDialogOpen(true);
    };

    const handleLater = () => {
        router.push('/');
    };

    return (
        <div>
            {/* The main content is the disabled version of the employer detail page */}
            <EmployerDetailPage isConfirmationMode={true} showCtas={false} />

            {/* Sticky footer for success message and actions */}
            <div className="sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
                    <div className="flex items-center gap-3">
                         <CheckCircle className="h-8 w-8 text-accent-orange flex-shrink-0"/>
                        <div className="flex-grow">
                             <p className="font-semibold text-foreground">Thông tin của bạn đã được gửi, chúng tôi sẽ sớm liên hệ với bạn.</p>
                             <p className="text-sm text-muted-foreground">Bạn có muốn tạo tài khoản để lưu lại thông tin không?</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-shrink-0 mt-4 sm:mt-0">
                        <Button variant="outline" size="lg" onClick={handleLater}>
                            Để sau
                        </Button>
                        <Button size="lg" onClick={handleCreateAccount} className="bg-primary hover:bg-primary/90 text-white">
                            Tạo tài khoản
                        </Button>
                    </div>
                </div>
            </div>
             <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </div>
    );
}
