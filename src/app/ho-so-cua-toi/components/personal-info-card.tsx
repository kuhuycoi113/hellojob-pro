'use client';
import { LineIcon, MessengerIcon, ZaloIcon } from "@/components/custom-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateProfileForApplication } from "@/lib/validators";
import { Badge, Edit, UserCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export const PersonalInfoCard = ({ candidate, setIsProfileEditDialogOpen, translation, showEditButton = true }: { candidate: any, setIsProfileEditDialogOpen: any, translation: any, showEditButton?: boolean }) => {
    const { phone, zalo, messenger, line } = candidate.personalInfo;
    const hasContactInfo = !!(phone || zalo || messenger || line);
    const missingFields = validateProfileForApplication(candidate);
    const hasMissingFields = missingFields.length > 0;
    const notUpdatedText = <span className="text-muted-foreground italic">{translation.noInfo}</span>;

    const formatPhoneNumber = (phone: string | undefined): string => {
        if (!phone) return 'Chưa cập nhật';
        const cleanPhone = phone.replace(/\s/g, '');
        if (cleanPhone.length === 9) { // Assumes VN mobile without leading 0
            return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
        }
        if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) { // VN Mobile
            return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
        }
        if (cleanPhone.length === 11 && (cleanPhone.startsWith('0') || cleanPhone.startsWith('81'))) { // JP Mobile
            return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
        }
        return phone; // Fallback
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center"><UserCog className="mr-3 text-primary" /> {translation.personalInfo}</CardTitle>
                {showEditButton && <Button variant="ghost" size="icon" onClick={() => setIsProfileEditDialogOpen(true)}>
                    <Edit className="h-4 w-4" />
                </Button>}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p><strong>{translation.dateOfBirth}:</strong> {candidate.personalInfo.dateOfBirth ? format(new Date(candidate.personalInfo.dateOfBirth), 'dd/MM/yyyy') : notUpdatedText}</p>
                <p><strong>{translation.gender}:</strong> {candidate.personalInfo.gender || notUpdatedText}</p>
                <p><strong>{translation.height}:</strong> {candidate.personalInfo.height && parseInt(candidate.personalInfo.height) > 0 ? `${candidate.personalInfo.height} cm` : notUpdatedText}</p>
                <p><strong>{translation.weight}:</strong> {candidate.personalInfo.weight && parseInt(candidate.personalInfo.weight) > 0 ? `${candidate.personalInfo.weight} kg` : notUpdatedText}</p>
                <p><strong>{translation.tattoo}:</strong> {candidate.personalInfo.tattooStatus || notUpdatedText}</p>
                <p><strong>{translation.hepatitisB}:</strong> {candidate.personalInfo.hepatitisBStatus || notUpdatedText}</p>
                <p><strong>{translation.japaneseProficiency}:</strong> {candidate.personalInfo.japaneseProficiency || notUpdatedText}</p>
                <p><strong>{translation.englishProficiency}:</strong> {candidate.personalInfo.englishProficiency || notUpdatedText}</p>
            </CardContent>
            <CardContent>
                {hasContactInfo ? (
                    <div id="HIENTHILIENHE01" className="space-y-2">
                        {phone && <Button asChild variant="outline" className="w-full justify-start"><Link href={`tel:${phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatPhoneNumber(phone)}</Link></Button>}
                        {messenger && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://m.me/${messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0" /><span className="truncate">{`https://facebook.com/${messenger}`}</span></Link></Button>}
                        {zalo && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://zalo.me/${zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4" />{formatPhoneNumber(zalo)}</Link></Button>}
                        {line && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://line.me/ti/p/~${line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0" /><span className="truncate">{`https://line.me/ti/p/~${line}`}</span></Link></Button>}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center gap-4 mb-3 text-muted-foreground">
                            <Image src="/img/phone.svg" alt="Phone" width={24} height={24} />
                            <ZaloIcon className="h-6 w-6" />
                            <MessengerIcon className="h-6 w-6" />
                            <LineIcon className="h-6 w-6" />
                        </div>
                        <div className="text-sm text-muted-foreground mt-4 text-center">
                            Cung cấp ít nhất một phương thức liên hệ để <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">Ứng tuyển</Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}