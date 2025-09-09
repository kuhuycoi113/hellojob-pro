
'use client';

import Link from 'next/link';
import { Briefcase, Menu, X, Building, PlusCircle, User, LogOut, Shield, FileText, Gift, MessageSquareWarning, Settings, LifeBuoy, LayoutGrid, Sparkles, BookOpen, Compass, Home, Info, Handshake, ChevronDown, Gem, UserPlus, MessageSquare, LogIn, Pencil, FastForward, ListChecks, GraduationCap, UserCheck, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { openChat } = useChat();
  const { role, setRole } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [profileCreationStep, setProfileCreationStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  
  const FirstStepDialog = () => (
    <>
      <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Chọn mục tiêu của bạn</DialogTitle>
          <DialogDescription className="text-center">
            Bạn muốn tạo hồ sơ để làm gì?
          </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Card onClick={() => setProfileCreationStep(2)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
            <FastForward className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Tạo nhanh</h3>
            <p className="text-muted-foreground text-xs">Để HelloJob AI gợi ý việc phù hợp ngay lập tức.</p>
        </Card>
        <Card onClick={() => setProfileCreationStep(3)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
            <ListChecks className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Tạo chi tiết</h3>
            <p className="text-muted-foreground text-xs">Để hoàn thiện hồ sơ và sẵn sàng ứng tuyển vào công việc mơ ước.</p>
        </Card>
      </div>
    </>
  );

  const QuickCreateStepDialog = () => (
    <>
      <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Chọn loại hình lao động</DialogTitle>
          <DialogDescription className="text-center">
            Hãy chọn loại hình phù hợp nhất với trình độ và mong muốn của bạn.
          </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Card onClick={() => setProfileCreationStep(4)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px]">
            <HardHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Thực tập sinh</h3>
            <p className="text-muted-foreground text-xs">Lao động phổ thông, 18-40 tuổi.</p>
        </Card>
        <Card onClick={() => setProfileCreationStep(5)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px]">
            <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Kỹ năng đặc định</h3>
            <p className="text-muted-foreground text-xs">Lao động có hoặc cần thi tay nghề.</p>
        </Card>
        <Card onClick={() => setProfileCreationStep(6)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px]">
            <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Kỹ sư, tri thức</h3>
            <p className="text-muted-foreground text-xs">Tốt nghiệp CĐ, ĐH, có thể định cư.</p>
        </Card>
      </div>
      <Button variant="link" onClick={() => setProfileCreationStep(1)} className="mt-4 mx-auto block">Quay lại</Button>
    </>
  );

  const DetailedCreateStepDialog = () => (
     <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Chọn phương thức tạo hồ sơ</DialogTitle>
          <DialogDescription className="text-center">
            Bắt đầu hành trình của bạn với HelloJob bằng cách dễ nhất cho bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <DialogClose asChild>
            <Link href="/ai-profile">
              <Card className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">Tạo hồ sơ bằng AI</h3>
                <p className="text-muted-foreground text-xs">Tải lên CV hoặc mô tả mong muốn, AI sẽ tự động điền thông tin.</p>
              </Card>
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link href="/register">
              <Card className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                <Pencil className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">Nhập liệu thủ công</h3>
                <p className="text-muted-foreground text-xs">Tự điền thông tin chi tiết vào biểu mẫu có sẵn của chúng tôi.</p>
              </Card>
            </Link>
          </DialogClose>
        </div>
        <Button variant="link" onClick={() => setProfileCreationStep(1)} className="mt-4 mx-auto block">Quay lại</Button>
      </>
  );
  
    const VisaDetailStepDialog = ({ title, options, backStep }: { title: string, options: {label: string, description: string}[], backStep: number }) => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-headline text-center">{title}</DialogTitle>
        <DialogDescription className="text-center">
          Chọn loại hình chi tiết để tiếp tục.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {options.map(option => (
          <DialogClose key={option.label} asChild>
            <Link href="/ai-profile">
                <Card className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px]">
                    <h3 className="font-bold text-base mb-1">{option.label}</h3>
                    <p className="text-muted-foreground text-xs">{option.description}</p>
                </Card>
            </Link>
          </DialogClose>
        ))}
      </div>
      <Button variant="link" onClick={() => setProfileCreationStep(backStep)} className="mt-4 mx-auto block">Quay lại</Button>
    </>
  );

  const renderDialogContent = () => {
    switch (profileCreationStep) {
      case 1:
        return <FirstStepDialog />;
      case 2:
        return <QuickCreateStepDialog />;
      case 3:
        return <DetailedCreateStepDialog />;
      case 4:
         return <VisaDetailStepDialog 
                    title="Chọn loại Thực tập sinh" 
                    options={[
                        { label: 'Thực tập sinh 3 năm', description: 'Chương trình phổ thông nhất' },
                        { label: 'Thực tập sinh 1 năm', description: 'Chương trình ngắn hạn' },
                        { label: 'Thực tập sinh 3 Go', description: 'Dành cho người có kinh nghiệm' },
                    ]} 
                    backStep={2} 
                />;
      case 5:
         return <VisaDetailStepDialog 
                    title="Chọn loại Kỹ năng đặc định" 
                    options={[
                        { label: 'Đặc định đầu Nhật', description: 'Dành cho người đang ở Nhật' },
                        { label: 'Đặc định đầu Việt', description: 'Dành cho người ở Việt Nam' },
                        { label: 'Đặc định đi mới', description: 'Lần đầu đăng ký' },
                    ]} 
                    backStep={2} 
                />;
      case 6:
         return <VisaDetailStepDialog 
                    title="Chọn loại Kỹ sư, tri thức" 
                    options={[
                        { label: 'Kỹ sư đầu Nhật', description: 'Dành cho kỹ sư đang ở Nhật' },
                        { label: 'Kỹ sư đầu Việt', description: 'Dành cho kỹ sư ở Việt Nam' },
                    ]} 
                    backStep={2} 
                />;
      default:
        return <FirstStepDialog />;
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
           <DropdownMenuItem asChild>
            <div className="p-2">
                <Button asChild className="w-full" size="lg" onClick={() => router.push('/candidate-profile')}>
                    <Link href="/candidate-profile">Đăng nhập / Đăng ký</Link>
                </Button>
            </div>
           </DropdownMenuItem>
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
                icon={link.href === '/ai-profile' ? Sparkles : undefined}
                onClick={link.href === '/' ? handleHomeClick : undefined} 
            />
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setProfileCreationStep(1); }}>
              <DialogTrigger asChild>
                <Button variant="default">Tạo hồ sơ</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                 {renderDialogContent()}
              </DialogContent>
            </Dialog>
            
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
                       <Button asChild variant="outline">
                           <Link href="/candidate-profile">Đăng nhập / Đăng ký</Link>
                       </Button>
                    )}
                    <Button asChild variant="ghost">
                        <Link href="/jobs">
                            Trang việc làm
                        </Link>
                    </Button>
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
