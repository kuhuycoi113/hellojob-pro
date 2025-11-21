'use client';

import { useAuth } from "@/contexts/AuthContext";
import CandidateProfileDisplay from "./components/candidate-profile-display";

export default function CandidateProfilePage() {
    const { user, role } = useAuth();
    return <CandidateProfileDisplay user={user} role={role} />;
}