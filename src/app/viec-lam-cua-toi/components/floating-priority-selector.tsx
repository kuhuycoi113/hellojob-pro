'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldCheck, ThumbsUp, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export 
const FloatingPrioritySelector = ({ onHighlight }: { onHighlight: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [feeButtonText, setFeeButtonText] = useState('Phí thấp');
    const [companyButtonText, setCompanyButtonText] = useState('Công ty uy tín');
    const [transformStyle, setTransformStyle] = useState({});
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const vietnamVisaDetails = [
            'Thực tập sinh 3 năm',
            'Thực tập sinh 1 năm',
            'Đặc định đầu Việt',
            'Đặc định đi mới',
            'Kỹ sư, tri thức đầu Việt'
        ];

        const japanVisaDetails = [
            'Đặc định đầu Nhật',
            'Kỹ sư, tri thức đầu Nhật'
        ];

        try {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            if (storedProfile) {
                const profile = JSON.parse(storedProfile);
                const userVisaDetail = profile.aspirations?.desiredVisaDetail;
                if (userVisaDetail) {
                    if (vietnamVisaDetails.includes(userVisaDetail)) {
                        setCompanyButtonText('Công ty phái cử uy tín');
                    } else if (japanVisaDetails.includes(userVisaDetail)) {
                        setCompanyButtonText('Công ty tiếp nhận uy tín');
                    }

                    if (userVisaDetail === 'Thực tập sinh 3 Go') {
                        setFeeButtonText('Nghiệp đoàn uy tín');
                        setCompanyButtonText('Công ty tiếp nhận uy tín');
                    } else if (userVisaDetail === "Kỹ sư, tri thức đầu Nhật") {
                        setFeeButtonText("Shokai uy tín");
                    } else if (userVisaDetail === "Đặc định đầu Nhật") {
                        setFeeButtonText("Shien uy tín");
                    }
                }
            }
        } catch (e) {
            console.error("Could not parse user profile from localStorage", e);
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); // Show after 2 seconds

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleClose = () => {
        const targetButton = document.getElementById('highlight-target-button');
        const cardElement = cardRef.current;

        if (targetButton && cardElement) {
            const targetRect = targetButton.getBoundingClientRect();
            const cardRect = cardElement.getBoundingClientRect();

            const translateX = targetRect.left - cardRect.left + (targetRect.width / 2) - (cardRect.width / 2);
            const translateY = targetRect.top - cardRect.top + (targetRect.height / 2) - (cardRect.height / 2);

            setTransformStyle({
                transform: `translate(${translateX}px, ${translateY}px) scale(0.1)`,
                opacity: 0,
            });
        }

        setIsClosing(true);
        setTimeout(() => {
            onHighlight();
            setIsVisible(false); // Hide the component after animation
        }, 700); // This duration must match the CSS transition duration
    };

    useEffect(() => {
        let closeTimer: NodeJS.Timeout;
        if (isVisible && !isClosing) {
            closeTimer = setTimeout(() => {
                handleClose();
            }, 3000);
        }
        return () => clearTimeout(closeTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, isClosing]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            ref={cardRef}
            style={isClosing ? transformStyle : {}}
            className={cn(
                "fixed bottom-24 left-4 z-50 transition-all duration-700",
                !isClosing && "animate-in slide-in-from-bottom"
            )}
        >
            {!isClosing && (
                <Card className="shadow-2xl w-full max-w-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold flex items-center justify-between">
                            <span>Ưu tiên tìm việc theo?</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-start" onClick={handleClose}>
                            <TrendingUp className="mr-2 h-4 w-4 text-accent-green" /> Lương tốt
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={handleClose}>
                            <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> {feeButtonText}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={handleClose}>
                            <ThumbsUp className="mr-2 h-4 w-4 text-accent-orange" /> {companyButtonText}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};