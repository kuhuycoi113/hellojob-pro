

'use client';
import { RegisterForm } from '@/components/register-form';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const RegisterPageContent = () => {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">
              Tạo hồ sơ ứng viên
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              Hoàn thành các bước sau để nhà tuyển dụng có thể tìm thấy bạn.
            </p>
          </div>
          <RegisterForm initialStep={initialStep} />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterPageContent />
        </Suspense>
    )
}

    