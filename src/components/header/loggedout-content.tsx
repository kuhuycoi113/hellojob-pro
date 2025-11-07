import Link from "next/link";
import { Button } from "../ui/button";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { LogIn } from "lucide-react";
import { quickAccessLinks } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

export const LoggedOutContent = ({ setIsAuthDialogOpen }: { setIsAuthDialogOpen: any }) => {
    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <p className="text-sm text-center text-muted-foreground">Đăng nhập để trải nghiệm đầy đủ tính năng của HelloJob.</p>
            <Button asChild className="w-full" size="lg" onClick={() => setIsAuthDialogOpen(true)}>
                <Link href="#"><LogIn className="mr-2" />Đăng nhập / Đăng ký</Link>
            </Button>
            <DropdownMenuSeparator />
            <div className="p-2">
                <div className="grid grid-cols-3 gap-2">
                    {quickAccessLinks.map((link) => {
                        const isActive = false;
                        return (
                            <Link
                                key={link.href}
                                id={link.href === '/lo-trinh' ? 'MMN01' : undefined}
                                href={link.href}
                                className={cn("flex flex-col items-center justify-start p-2 h-24 cursor-pointer rounded-md hover:bg-accent/80", isActive ? "bg-primary/10 ring-2 ring-primary" : "bg-secondary")}>
                                <div className={cn("h-10 flex items-center justify-center", isActive ? "text-primary" : "text-muted-foreground")}>
                                    <link.icon className="h-8 w-8" />
                                </div>
                                <span className={cn("text-xs text-center leading-tight font-medium", isActive ? "text-primary" : "text-foreground")}>{link.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
            {/* <MobileRoleSwitcher /> */}
        </div>
    );
};