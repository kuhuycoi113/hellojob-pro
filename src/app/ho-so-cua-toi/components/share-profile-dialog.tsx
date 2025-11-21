'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import Image from "next/image";

export const ShareProfileDialog = ({ uid, children }: { uid: string, children: React.ReactNode }) => {
    const { toast } = useToast();

    const shareUrl = `${window.location.origin}/ho-so/${uid}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: "Đã sao chép!",
            description: "Đường link hồ sơ công khai đã được sao chép."
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Chia sẻ hồ sơ của bạn</DialogTitle>
                    <DialogDescription>
                        Sao chép và gửi liên kết này cho nhà tuyển dụng hoặc bất kỳ ai bạn muốn.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6 text-center">
                    <div>
                        <Label className="font-semibold">Chia sẻ qua mã QR</Label>
                        <div className="mt-2 flex justify-center">
                            <div className="p-4 bg-white rounded-lg shadow-md inline-block">
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
                                    alt="Mã QR hồ sơ"
                                    width={150}
                                    height={150}
                                    data-ai-hint="qr code"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="share-link" className="font-semibold">Hoặc sao chép liên kết</Label>
                        <div className="flex items-center space-x-2 mt-2">
                            <Input id="share-link" value={shareUrl} readOnly />
                            <Button type="button" size="icon" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};