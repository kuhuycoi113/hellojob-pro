import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileCode, FileText, FileType, Sheet } from "lucide-react";

export const DownloadProfileDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Tải hồ sơ xuống</DialogTitle>
                <DialogDescription>
                    Chọn định dạng bạn muốn tải xuống.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <Card className="hover:bg-secondary cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <FileCode className="h-10 w-10 text-blue-500 shrink-0" />
                        <div>
                            <p className="font-semibold">Dạng HTML</p>
                            <p className="text-xs text-muted-foreground">Tải xuống như giao diện Web.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-secondary cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <FileText className="h-10 w-10 text-red-500 shrink-0" />
                        <div>
                            <p className="font-semibold">Dạng PDF</p>
                            <p className="text-xs text-muted-foreground">Lý tưởng để gửi qua email hoặc in ấn.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-secondary cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <FileType className="h-10 w-10 text-sky-600 shrink-0" />
                        <div>
                            <p className="font-semibold">Dạng Docx</p>
                            <p className="text-xs text-muted-foreground">Dễ dàng chỉnh sửa bằng Microsoft Word.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-secondary cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Sheet className="h-10 w-10 text-green-600 shrink-0" />
                        <div>
                            <p className="font-semibold">Dạng Excel</p>
                            <p className="text-xs text-muted-foreground">Phù hợp để quản lý và phân tích dữ liệu.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DialogContent>
    </Dialog>
);