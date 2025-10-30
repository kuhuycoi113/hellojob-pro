import { EnFlagIcon, JpFlagIcon, VnFlagIcon } from "@/components/custom-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Send } from "lucide-react";

export const SendProfileDialog = ({setLanguageToSend,setIsSendOptionsOpen}:{setLanguageToSend: (lang: string) => void; setIsSendOptionsOpen: (open: boolean) => void;}) => {
    const handleSendClick = (lang: string) => {
        setLanguageToSend(lang);
        setIsSendOptionsOpen(true);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="hidden sm:inline-flex"><Send /> Gửi hồ sơ</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Bạn muốn gửi hồ sơ theo ngôn ngữ nào?</DialogTitle>
                    <DialogDescription>
                        Chọn một ngôn ngữ để gửi hồ sơ này cho nhà tuyển dụng.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            <VnFlagIcon className="w-8 h-6 rounded-sm" />
                            <span className="font-semibold">Tiếng Việt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />Xem trước</Button>
                            <Button size="sm" onClick={() => handleSendClick('Tiếng Việt')}><Send className="mr-2 h-4 w-4" />Gửi</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            <JpFlagIcon className="w-8 h-6 rounded-sm" />
                            <span className="font-semibold">Tiếng Nhật</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />Xem trước</Button>
                            <Button size="sm" onClick={() => handleSendClick('Tiếng Nhật')}><Send className="mr-2 h-4 w-4" />Gửi</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            <EnFlagIcon className="w-8 h-6 rounded-sm" />
                            <span className="font-semibold">Tiếng Anh</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />Xem trước</Button>
                            <Button size="sm" onClick={() => handleSendClick('Tiếng Anh')}><Send className="mr-2 h-4 w-4" />Gửi</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};