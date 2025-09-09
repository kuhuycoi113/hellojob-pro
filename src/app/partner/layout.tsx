
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Briefcase, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const PartnerHeader = () => (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/partner/dashboard" className="flex items-center gap-2">
                <span className="font-semibold text-lg">Partner Portal</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/partner/dashboard" className="font-medium hover:text-primary transition-colors flex items-center gap-2"><LayoutDashboard/> Bảng điều khiển</Link>
                <Link href="/partner/post-job" className="font-medium hover:text-primary transition-colors flex items-center gap-2"><PlusCircle/> Đăng tin mới</Link>
            </nav>
            <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5"/>
                 </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer h-9 w-9">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="Partner" data-ai-hint="company logo"/>
                            <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Công ty TNHH ABC</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Cài đặt tài khoản</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                           <LogOut className="mr-2 h-4 w-4" />
                           Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </header>
);

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary">
      <PartnerHeader />
      <main>{children}</main>
    </div>
  );
}
