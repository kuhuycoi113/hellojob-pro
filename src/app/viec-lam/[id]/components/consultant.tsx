import { ContactButtons } from "@/components/contact-buttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NameAvatar } from "@/components/ui/name-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast";
import { consultants } from "@/lib/consultant-data";
import { Copy, Share2, User, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const JobDetailConsultant = ({ job }: any) => {
    const { role } = useAuth();
    const [isConsultantPopoverOpen, setIsConsultantPopoverOpen] = useState(false);
    const assignedConsultant = consultants.find(c => c.id === job.salerID) ?? consultants[0];

    const handleShare = async () => {
        const shareUrl = `https://vi.hellojob.jp/viec-lam/${job.id}`;
        const shareData = {
            title: job.title,
            text: `Hãy xem công việc này trên HelloJob: ${job.title}`,
            url: shareUrl,
        };
        const copyLink = () => {
            navigator.clipboard.writeText(shareUrl);
            toast({
                title: "Đã sao chép liên kết!",
                description: "Bạn có thể dán và chia sẽ liên kết việc làm này.",
            });
        }
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('Share cancelled by user.');
                } else {
                    console.error("Error sharing:", err);
                    copyLink();
                }
            }
        } else {
            copyLink();
        }
    };
    switch (role) {
        case 'admin': {

            let titleLinkGroup = "#";
            let contactLink = "#";
            switch (job.source) {
                case "ZALO": {
                    contactLink = job.contact?.length ? `https://zalo.me/${job.contact}` : job.senderLink;
                    titleLinkGroup = job.groupLink;
                    break;
                }
                case "FACEBOOK": {
                    contactLink = job.contact;
                    titleLinkGroup = job.postLink ?? job.contact ?? job.groupLink;
                    break;
                }
                case "SUNRISE": {
                    titleLinkGroup = job.contact;
                    break;
                }
            }
            const poster = {
                groupName: job.groupName,
                groupLink: titleLinkGroup,
                zalo: contactLink
            };

            return <Card
                id="MDTVV01"
                className="shadow-lg group hover:shadow-xl hover:border-primary transition-all"
            >
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors"><UserRound />Tư vấn viên</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Popover open={isConsultantPopoverOpen} onOpenChange={setIsConsultantPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <NameAvatar fullName={job.sender} className="h-12 w-12 cursor-pointer transition-transform hover:scale-110" />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-100" side="top" align="start">
                                <div className="flex gap-2">
                                    <NameAvatar fullName={job.sender} size={30} />
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-semibold">{job.sender}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {job.groupName}
                                        </p>
                                        {(contactLink || titleLinkGroup) && <Button asChild size="sm" variant="link" className="h-auto p-0">
                                            <Link href={contactLink ?? titleLinkGroup} target='_blank'>Thử truy cập</Link>
                                        </Button>}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <div>
                            <Link href={contactLink ?? titleLinkGroup} target="_blank">
                                <p className="font-semibold text-primary hover:underline">{job.sender}</p>
                            </Link>
                            <p className="text-sm text-muted-foreground">{job.groupName}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <ContactButtons contact={poster} job={job} showChatText={true} />
                    </div>
                </CardContent>
                <div className="border-t p-4 grid grid-cols-2 gap-2">
                    <Button variant="ghost" className="text-muted-foreground text-sm" onClick={handleShare}>
                        <Copy className="mr-2 h-4 w-4" />Giới thiệu việc làm
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground text-sm">
                        <Share2 className="mr-2 h-4 w-4" />Giới thiệu tư vấn viên
                    </Button>
                    <Button asChild variant="ghost" className="text-muted-foreground text-sm">
                        <Link href="/tu-van-vien"><Users className="mr-2 h-4 w-4" />Tư vấn viên khác</Link>
                    </Button>
                    <Button asChild variant="ghost" className="text-muted-foreground text-sm">
                        <Link href={contactLink ?? titleLinkGroup}><User className="mr-2 h-4 w-4" />Xem hồ sơ chi tiết</Link>
                    </Button>
                </div>
            </Card>
        }
        default: {
            return <Card
                id="MDTVV01"
                className="shadow-lg group hover:shadow-xl hover:border-primary transition-all"
            >
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors"><UserRound />Tư vấn viên</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Link href={`/tu-van-vien/${assignedConsultant.id}`} onClick={(e) => e.stopPropagation()}>
                            <NameAvatar fullName={assignedConsultant.name} src={assignedConsultant.avatarUrl} className="h-12 w-12 cursor-pointer transition-transform hover:scale-110" />
                        </Link>
                        <div>
                            <Link href={`/tu-van-vien/${assignedConsultant.id}`} onClick={(e) => e.stopPropagation()}>
                                <p className="font-semibold text-primary hover:underline">{assignedConsultant.name}</p>
                            </Link>
                            <p className="text-sm text-muted-foreground">{assignedConsultant.mainExpertise}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <ContactButtons contact={assignedConsultant as any} job={job} showChatText={true} />
                    </div>
                </CardContent>
                <div className="border-t p-4 grid grid-cols-2 gap-2">
                    <Button variant="ghost" className="text-muted-foreground text-sm" onClick={handleShare}>
                        <Copy className="mr-2 h-4 w-4" />Giới thiệu việc làm
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground text-sm">
                        <Share2 className="mr-2 h-4 w-4" />Giới thiệu tư vấn viên
                    </Button>
                    <Button asChild variant="ghost" className="text-muted-foreground text-sm">
                        <Link href="/tu-van-vien"><Users className="mr-2 h-4 w-4" />Tư vấn viên khác</Link>
                    </Button>
                    <Button asChild variant="ghost" className="text-muted-foreground text-sm">
                        <Link href={`/tu-van-vien/${assignedConsultant.id}`}><User className="mr-2 h-4 w-4" />Xem hồ sơ chi tiết</Link>
                    </Button>
                </div>
            </Card>
        }
    }

}