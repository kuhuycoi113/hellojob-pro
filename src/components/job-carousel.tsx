'use client';

import { JobCard } from '@/components/job-card';
import type { Job } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface JobCarouselProps {
    title: string;
    jobs: Job[];
    viewAllLink: string;
}

export function JobCarousel({ title, jobs, viewAllLink }: JobCarouselProps) {
    if (jobs.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline">{title}</h2>
                <Button asChild variant="link">
                    <Link href={viewAllLink}>Xem tất cả <ChevronRight className="h-4 w-4" /></Link>
                </Button>
            </div>
            <Carousel opts={{
                align: "start",
                dragFree: true,
            }}
            className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {jobs.map((job, index) => (
                        <CarouselItem key={job.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                             <div className="h-full">
                                <JobCard job={job} showRecruiterName={false} variant="grid-item" showPostedTime={true} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </section>
    );
}
