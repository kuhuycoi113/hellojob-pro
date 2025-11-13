'use client';
import AuthContent from '@/components/auth-content';
import { Button } from '@/components/ui/button';
import { useRedirect } from '@/lib/useRedirect';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


const XacThucPage: React.FC = () => {
    useRedirect();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
            <div className='relative'>
                <Button asChild variant="outline" size="sm" className="absolute left-0" style={{ top: '-40px' }}>
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại trang chủ</Link>
                </Button>
                <AuthContent onOpenChange={() => { }}>
                    <div className='flex flex-col space-y-1.5 sm:text-left mb-6 text-left'>
                        <h1 className='font-semibold tracking-tight text-center text-3xl font-headline'>Chào mừng bạn đến với HelloJob!</h1>
                        <p className='text-sm text-muted-foreground text-center'>Tạo tài khoản để mở khóa tiềm năng sự nghiệp của bạn.</p>
                    </div>
                </AuthContent>
            </div>
        </div>
    );
};

export default XacThucPage;