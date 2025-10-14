
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import EmployerDetailPage from './client';

// This is now a Server Component by default
export default function EmployerRegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-16 w-16 animate-spin text-primary"/>
            </div>
        }>
            {/* The actual page content is in the Client Component */}
            <EmployerDetailPage />
        </Suspense>
    );
}
