
import { Suspense } from 'react';
import HollandTestClient from './client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
    return (
        <div className="bg-secondary py-12 min-h-screen flex items-center">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-xl">
                        <CardHeader>
                            <Skeleton className="h-2 w-full mb-4" />
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-2/3 mt-4" />
                        </CardHeader>
                        <CardContent className="p-0">
                           <div className="space-y-px">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3">
                                        <Skeleton className="h-6 w-2/3" />
                                        <div className="flex justify-around w-1/3">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </CardContent>
                         <CardFooter className="flex justify-end mt-4 p-4">
                            <Skeleton className="h-10 w-28" />
                         </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function HollandTestPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HollandTestClient />
    </Suspense>
  );
}
