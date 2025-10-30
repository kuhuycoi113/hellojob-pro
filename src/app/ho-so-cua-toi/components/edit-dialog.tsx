import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export const EditDialog = ({
    children,
    title,
    onSave,
    renderContent,
    description,
    candidate,
    dialogId,
    footerContent,
}: {
    children: React.ReactNode;
    title: string;
    onSave: (updatedCandidate: EnrichedCandidateProfile) => void;
    renderContent: (
        tempData: EnrichedCandidateProfile,
        handleTempChange: (
            section: keyof EnrichedCandidateProfile | 'personalInfo' | 'aspirations' | 'documents',
            ...args: any[]
        ) => void
    ) => React.ReactNode;
    description?: string;
    candidate: EnrichedCandidateProfile;
    dialogId?: string;
    footerContent?: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempCandidate, setTempCandidate] = useState<EnrichedCandidateProfile>(candidate);

    useEffect(() => {
        if (isOpen) {
            setTempCandidate(JSON.parse(JSON.stringify(candidate)));
        }
    }, [isOpen, candidate]);

    const handleSave = () => {
        onSave(tempCandidate);
        setIsOpen(false);
    };

    // ...existing code...
    const handleTempChange = (
        section: keyof EnrichedCandidateProfile | 'personalInfo' | 'aspirations' | 'documents',
        ...args: any[]
    ) => {
        setTempCandidate(prev => {
            if (!prev) return prev; // <-- tránh trả về null (fix)
            const newCandidate = JSON.parse(JSON.stringify(prev));

            if (section === 'personalInfo' || section === 'aspirations') {
                const [field, value] = args;
                // @ts-ignore
                newCandidate[section] = { ...newCandidate[section], [field]: value };
            } else if (section === 'documents') {
                const [docType, index, value] = args;
                // ensure structure exists
                newCandidate.documents = newCandidate.documents ?? { vietnam: [], japan: [], other: [] };
                newCandidate.documents[docType] = newCandidate.documents[docType] ?? [];
                newCandidate.documents[docType][index] = value;
            } else if (['experience', 'education', 'certifications'].includes(section as string)) {
                const [index, field, value] = args;
                if (field) {
                    // @ts-ignore
                    newCandidate[section][index][field] = value;
                } else {
                    // @ts-ignore
                    newCandidate[section][index] = value;
                }
            } else if (['skills', 'interests'].includes(section as string)) {
                const [value, isAdding] = args;
                // @ts-ignore
                const currentValues = newCandidate[section] ?? [];
                // @ts-ignore
                newCandidate[section] = isAdding ? [...currentValues, value] : currentValues.filter((item: string) => item !== value);
            } else {
                const [value] = args;
                // @ts-ignore
                newCandidate[section] = value;
            }

            return newCandidate;
        });
    };
    // ...existing code...

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]" id={dialogId}>
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    {renderContent(tempCandidate, handleTempChange)}
                </div>
                <DialogFooter>
                    {footerContent && <div>{footerContent}</div>}
                    <DialogClose asChild>
                        <Button variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSave} className="bg-primary text-white">
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};