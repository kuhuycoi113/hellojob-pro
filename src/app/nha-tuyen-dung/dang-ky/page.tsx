
'use client';

import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import EmployerDetailPage from './client';
import { useSearchParams, useRouter } from 'next/navigation';

function PageLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const partnerId = searchParams.get('partnerId');

  useEffect(() => {
    if (!partnerId) {
      // If there's no partnerId, redirect to the main employers page.
      router.replace('/nha-tuyen-dung');
    }
  }, [partnerId, router]);

  // If partnerId doesn't exist, we'll be redirecting, so we can show a loader.
  // If it exists, EmployerDetailPage will be rendered.
  if (!partnerId) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return <EmployerDetailPage />;
}

// This is the main page component
export default function EmployerRegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-16 w-16 animate-spin text-primary"/>
            </div>
        }>
            <PageLogic />
        </Suspense>
    );
}
