'use client';
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, LogIn } from "lucide-react";
import { useState } from "react";

export const LoggedOutView = () => {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-center text-center py-20">
                <Card className="max-w-2xl p-8 shadow-2xl">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Briefcase className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-headline">Quản lý việc làm của bạn</CardTitle>
                        <CardDescription className="text-base pt-2">
                            Đăng nhập để xem các công việc được gợi ý riêng cho bạn, theo dõi các đơn đã ứng tuyển và quản lý các việc làm đã lưu.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => setIsAuthDialogOpen(true)} size="lg">
                            <LogIn className="mr-2" />Đăng ký / Đăng nhập
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </>
    )
}