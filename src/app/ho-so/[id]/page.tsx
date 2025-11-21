import { findByUID } from '@/actions/user-action';
import CandidateProfileDisplay from '@/app/ho-so-cua-toi/components/candidate-profile-display';
import { notFound } from 'next/navigation';


// This would typically be a server component fetching data, 
// but for now we keep it client-side to reuse the existing logic.
export default async function PublicCandidateProfilePage({ params }: { params: any }) {
    // In a real application, you would use params.id to fetch the specific candidate's data.
    // For this example, it will re-use the data from localStorage, same as the main profile page.
    const { id: uid } = await params;
    const user = await findByUID(uid);
    if (!user) {
        return notFound();
    }
    const role = 'previewer';
    return <CandidateProfileDisplay user={user} role={role} />;
}
