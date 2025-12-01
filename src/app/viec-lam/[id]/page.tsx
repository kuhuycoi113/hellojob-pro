import { findSuggestedJobs, getJobByCode } from '@/actions/job-action';
import { formatSpecialCondition, generateBulletJobCrawl, getJobImage } from '@/lib/utils';
import { notFound } from 'next/navigation';
import React, { cache } from 'react';
import JobDetailClientPage from './client';
import { Metadata } from 'next';

interface PageProps {
    params: { id: string };
}
export const getJobByCodeCached = cache(async (id: string) => {
    // đảm bảo trả về plain object (no dates/prototypes)
    const job = await getJobByCode(id);
    return job ? JSON.parse(JSON.stringify(job)) : null;
});
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = (await params) as { id: string };
    const data = await getJobByCodeCached(id);
    let avatar: any = "/img/sample/no-image.jpg";
    if (!!data?.avatar?.length) {
        avatar = data?.avatar;
    }
    let title = `HelloJob - ${data?.visa},${data?.job}
              ${data?.numberRecruits ? ` ${data?.numberRecruits} người` : ""}
              ${data?.specialConditions?.length > 0 ? ` (${formatSpecialCondition(data?.specialConditions).join(", ")})` : ""}`;
    let isExpired = false;
    if (data?.expiredDate < Date.now()) {
        isExpired = true;
    }
    if (isExpired) {
        title = "[HẾT HẠN] " + title;
    }
    return {
        title,
        openGraph: {
            title,
            images: [
                {
                    url: `${process.env.DOMAIN}/api/public/getJobMetaImage?jobCode=${id}`,
                    width: 1200,
                    height: 630,
                    alt: "HelloJob",
                },
            ],
            url: `${process.env.DOMAIN}/viec-lam/${id}`,
        },
    };
}
const JobPage = async ({ params }: PageProps) => {
    const { id } = (await params) as { id: string };
    const job = await getJobByCodeCached(id);

    if (job === null) {
        return notFound();
    }
    let behavioralSuggestions = [];
    try {
        behavioralSuggestions = (await findSuggestedJobs(job)).docs;
    } catch (error) {

    }
    // You can fetch job data here using params.id if needed
    return (
        <JobDetailClientPage job={job} behavioralSuggestions={behavioralSuggestions} />
    );
};

export default JobPage;