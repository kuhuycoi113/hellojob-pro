import { CandidateProfile } from "@/ai/schemas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Link2, UserCog } from "lucide-react";

export const SendOptionsDialog = ({ open, languageToSend, candidate, onOpenChange }: { open: boolean, languageToSend: string, candidate: any, onOpenChange: (open: boolean) => void }) => {

    const handleSendToConsultant = () => {
        toast({
            title: "Đã gửi hồ sơ!",
            description: `Hồ sơ ${languageToSend} của bạn đã được gửi tới các tư vấn viên phù hợp.`,
            className: "bg-green-500 text-white"
        });
        onOpenChange(false);
    };

    const handleGetShareLink = () => {
        const link = `${window.location.origin}/ho-so-cua-toi/public/${candidate?.name.toLowerCase().replace(/\s/g, '-')}`;
        navigator.clipboard.writeText(link);
        toast({
            title: "Đã sao chép đường dẫn!",
            description: "Bạn có thể gửi đường dẫn này cho người khác.",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Gửi hồ sơ</DialogTitle>
                    <DialogDescription>
                        Chọn cách bạn muốn chia sẻ hồ sơ này.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Button onClick={handleSendToConsultant} className="w-full justify-start h-auto p-4" variant="outline">
                        <UserCog className="mr-4 h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold text-base">Gửi cho tư vấn viên</p>
                            <p className="text-xs text-muted-foreground text-left">Hồ sơ của bạn sẽ được gửi đến các tư vấn viên phù hợp trong hệ thống.</p>
                        </div>
                    </Button>
                    <Button onClick={handleGetShareLink} className="w-full justify-start h-auto p-4" variant="outline">
                        <Link2 className="mr-4 h-6 w-6 text-green-500" />
                        <div>
                            <p className="font-semibold text-base">Lấy đường dẫn chia sẻ</p>
                            <p className="text-xs text-muted-foreground text-left">Tạo một đường dẫn công khai để gửi hồ sơ cho bất kỳ ai.</p>
                        </div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};