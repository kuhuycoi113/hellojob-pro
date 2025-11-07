'use client';

import { useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoggedOutView } from './components/loggedout-view';
import { LoggedInView } from './components/loggedin-view';
import { FloatingPrioritySelector } from './components/floating-priority-selector';

export default function MyJobsDashboardPage() {
    const { role,isLoggedIn, } = useAuth();
    const [isHighlighting, setIsHighlighting] = useState(false);
    const [showFloatingSelector, setShowFloatingSelector] = useState(true);

    const handleHighlight = () => {
        setIsHighlighting(true);
        setShowFloatingSelector(false); // Hide the selector after it has animated
        setTimeout(() => {
            setIsHighlighting(false);
        }, 1500); // Duration of the highlight effect
    };
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
            
        <div className="bg-secondary min-h-screen">
            <div className="container mx-auto px-2 md:px-4 py-8">
                {isLoggedIn ? (
                    <LoggedInView />
                ) : (
                    <LoggedOutView />
                )}
            </div>
            {role === 'candidate' && showFloatingSelector && <FloatingPrioritySelector onHighlight={handleHighlight} />}
        </div>
        </Suspense>
    )
}

