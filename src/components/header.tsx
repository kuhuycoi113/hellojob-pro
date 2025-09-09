
'use client';

import Link from 'next/link';
import { Briefcase, Menu, X, Building, PlusCircle, User, LogOut, Shield, FileText, Gift, MessageSquareWarning, Settings, LifeBuoy, LayoutGrid, Sparkles, BookOpen, Compass, Home, Info, Handshake, ChevronDown, Gem, UserPlus, MessageSquare, LogIn, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Image from 'next/image';
import { useChat } from '@/contexts/ChatContext';
import { mainNavLinks, quickAccessLinks } from '@/lib/nav-data';
import { useAuth } from '@/contexts/AuthContext';


export const Logo = ({ className }: { className?: string }) => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={120} height={40} className={cn("h-10 w-auto", className)} priority />
);

export function Header() {
  const pathname = usePathname();
  const { openChat } = useChat();
  const { role, setRole } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoggedIn = role === 'candidate';


  const NavLink = ({ href, label, className, icon: Icon, onClick }: { href: string; label: string, className?: string, icon?: React.ElementType, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-primary py-2 block font-medium flex items-center gap-2',
        (pathname === href || (pathname.startsWith(href) && href !== '/')) ? 'text-primary font-bold' : 'text-foreground/80',
        className
      )}
       onClick={(e) => {
        if(onClick) onClick(e);
      }}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label}
    </Link>
  );
  
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === '/') {
        e.preventDefault();
        window.location.reload();
      }
  }

  const MainMenu = () => (
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
              href="/candidate-profile"
              className="block hover:bg-accent rounded-md p-2 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="https://placehold.co/100x100.png"
                    alt="User"
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    Lê Ngọc Hân
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Ứng viên Thực tập sinh
                  </p>
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ) : (
          <div className="p-2">
             <Button asChild className="w-full" size="sm">
              <Link href="/candidate-profile"><LogIn className="mr-2 h-4 w-4"/>Đăng nhập / Đăng ký</Link>
            </Button>
          </div>
        )}
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
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(value) => setRole(value as 'candidate' | 'guest')}
        >
          <DropdownMenuLabel>Mô phỏng vai trò người dùng</DropdownMenuLabel>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DropdownMenuRadioItem value="candidate">
              Ứng viên đã đăng nhập
            </DropdownMenuRadioItem>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DropdownMenuRadioItem value="guest">Khách</DropdownMenuRadioItem>
          </DropdownMenuItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {mainNavLinks.map((link) => (
            <NavLink 
                key={link.href} 
                href={link.href}
                label={link.label}
                icon={(link.href === '/ai-profile' && role === 'guest') ? Sparkles : undefined}
                onClick={link.href === '/' ? handleHomeClick : undefined} 
            />
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Tạo hồ sơ</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center">Chọn phương thức tạo hồ sơ</DialogTitle>
                  <DialogDescription className="text-center">
                    Bắt đầu hành trình của bạn với HelloJob bằng cách dễ nhất cho bạn.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <DialogClose asChild>
                    <Link href="/ai-profile">
                      <Card className="text-center p-3 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                        <h3 className="font-bold text-base mb-1">Tạo hồ sơ bằng AI</h3>
                        <p className="text-muted-foreground text-xs">Tải lên CV hoặc mô tả mong muốn, AI sẽ tự động điền thông tin.</p>
                      </Card>
                    </Link>
                  </DialogClose>
                  <DialogClose asChild>
                    <Link href="/register">
                      <Card className="text-center p-3 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                        <Pencil className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <h3 className="font-bold text-base mb-1">Nhập liệu thủ công</h3>
                        <p className="text-muted-foreground text-xs">Tự điền thông tin chi tiết vào biểu mẫu có sẵn của chúng tôi.</p>
                      </Card>
                    </Link>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <Button asChild variant="outline">
              <Link href="/jobs">Trang việc làm</Link>
            </Button>
             {isClient && (
                <>
                    {isLoggedIn ? (
                         <Link href="/candidate-profile">
                            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        </Link>
                    ): (
                       null
                    )}
                    <MainMenu />
                </>
             )}
        </div>
        <div className="md:hidden">
            <Button variant="default" size="icon" onClick={() => openChat()}>
                <MessageSquare />
                <span className="sr-only">Chat</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
