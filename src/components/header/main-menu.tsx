import { LayoutGrid } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { quickAccessLinks } from "@/lib/nav-data";
import { CreateProfileDialog } from "../create-profile-dialog";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

export const MainMenu = () => {
    const { isLoggedIn, role, applicationCount, savedJobCount, lastAction } = useAuth();
    const [totalNotificationCount, setTotalNotificationCount] = useState(0);
    const [myJobsLink, setMyJobsLink] = useState('/viec-lam-cua-toi');
    const isEditing = role === 'candidate'
    const createProfileButtonText = isEditing ? 'Sửa hồ sơ' : 'Tạo hồ sơ';
    useEffect(() => {
        setTotalNotificationCount(applicationCount + savedJobCount);
    }, [applicationCount, savedJobCount]);
    useEffect(() => {
        setMyJobsLink('/viec-lam-cua-toi' + (lastAction ? `?highlight=${lastAction}` : ''))
    }, [lastAction]);
    return <>

        {isLoggedIn ? (
            <Link href="/ho-so-cua-toi" className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-10 w-10 cursor-pointer transition-transform duration-300 hover:scale-110 hover:ring-2 hover:ring-primary hover:ring-offset-2">
                    <AvatarImage src={"https://placehold.co/100x100.png"} alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>{'A'}</AvatarFallback>
                </Avatar>
            </Link>
        ) : (
            <Button><Link href={'/xac-thuc'}>Đăng nhập / Đăng ký</Link></Button>
        )}

        <CreateProfileDialog>
            <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white">{createProfileButtonText}</Button>
        </CreateProfileDialog>

        <Button asChild className="relative">
            <Link href={myJobsLink}>
                Việc của tôi
                {totalNotificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full bg-red-500 p-0 text-xs">
                        {totalNotificationCount > 9 ? '9+' : totalNotificationCount}
                    </Badge>
                )}
            </Link>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[360px]" align="end" forceMount>
                {isLoggedIn ? (
                    <DropdownMenuItem asChild>
                        <Link
                            href="/ho-so-cua-toi"
                            className="block hover:bg-accent rounded-md p-2 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={"https://placehold.co/100x100.png"}
                                        alt="User"
                                        data-ai-hint="user avatar"
                                    />
                                    <AvatarFallback>{'A'}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col space-y-1 overflow-hidden">
                                    <p className="text-base font-medium leading-none truncate">{'Ứng viên'}</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">{'Cập nhật hồ sơ của bạn'}</p>
                                </div>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <div className="grid grid-cols-4 gap-2 p-2">
                        {quickAccessLinks.map((link) => (
                            <DropdownMenuItem asChild key={link.href}>
                                <Link
                                    href={link.href}
                                    className="flex flex-col items-center justify-start p-2 h-20 cursor-pointer rounded-md hover:bg-accent"
                                >
                                    <div className="h-8 flex items-center justify-center">
                                        <link.icon />
                                    </div>
                                    <span className="text-xs text-center leading-tight">
                                        {link.label}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
};
