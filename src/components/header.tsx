
'use client';

import Link from 'next/link';
import { Briefcase, Menu, X, Building, PlusCircle, User, LogOut, Shield, FileText, Gift, MessageSquareWarning, Settings, LifeBuoy, LayoutGrid, Sparkles, BookOpen, Compass, Home, Info, Handshake, ChevronDown, Gem, UserPlus, MessageSquare, LogIn, Pencil, FastForward, ListChecks, GraduationCap, UserCheck, HardHat, ChevronRight, Search, Loader2 } from 'lucide-react';
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
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Image from 'next/image';
import { useChat } from '@/contexts/ChatContext';
import { mainNavLinks, quickAccessLinks, mobileFooterLinks } from '@/lib/nav-data';
import { useAuth, type Role } from '@/contexts/AuthContext';
import { Industry, allIndustries, industriesByJobType } from '@/lib/industry-data';
import { AuthDialog } from './auth-dialog';
import { locations, allJapanLocations, japanRegions } from '@/lib/location-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSecondaryHeader } from './mobile-secondary-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './ui/select';
import { Label } from './ui/label';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { Input } from './ui/input';
import type { SearchFilters } from './job-search/search-results';
import { recommendJobs } from '@/ai/flows/recommend-jobs-flow';
import { CreateProfileDialog } from './create-profile-dialog';
import { Badge } from './ui/badge';


export const Logo = ({ className }: { className?: string }) => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={120} height={40} className={cn("h-10 w-auto", className)} priority />
);

export function Header() {
  const pathname = usePathname();
  const { role, setRole, isLoggedIn, profileName, profileHeadline, avatarUrl, applicationCount } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();


  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient || !isMobile) {
      setShowNav(true);
      return;
    }
    
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down hide the navbar
        setShowNav(false);
      } else { // if scroll up show the navbar
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [isClient, isMobile, lastScrollY]);

  const NavLink = ({ href, label, className, icon: Icon, onClick }: { href: string; label: string, className?: string, icon?: React.ElementType, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-primary py-2 font-medium flex items-center gap-2',
        (pathname === href || (pathname.startsWith(href) && href !== '/')) ? 'text-primary font-bold' : 'text-foreground/80',
        className
      )}
       onClick={onClick}
    >
      {Icon && <Icon className={cn("h-5 w-5", href === '/tao-ho-so-ai' && 'text-accent-orange')} />}
      {label}
    </Link>
  );

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
              href="/ho-so-cua-toi"
              className="block hover:bg-accent rounded-md p-2 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={avatarUrl || "https://placehold.co/100x100.png"}
                    alt="User"
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>{profileName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 overflow-hidden">
                  <p className="text-base font-medium leading-none truncate">{profileName || 'Ứng viên'}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{profileHeadline || 'Cập nhật hồ sơ của bạn'}</p>
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ) : null }
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
        {process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION === 'true' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={role}
              onValueChange={(value) => setRole(value as Role)}
            >
              <DropdownMenuLabel>Mô phỏng vai trò người dùng</DropdownMenuLabel>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DropdownMenuRadioItem value="candidate-full-profile">
                  Đã đăng nhập (Profile full)
                </DropdownMenuRadioItem>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DropdownMenuRadioItem value="candidate">
                  Đã đăng nhập (Có Profile)
                </DropdownMenuRadioItem>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DropdownMenuRadioItem value="candidate-empty-profile">
                  Đã đăng nhập (Profile trắng)
                </DropdownMenuRadioItem>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DropdownMenuRadioItem value="guest">Khách (Chưa đăng nhập)</DropdownMenuRadioItem>
              </DropdownMenuItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileRoleSwitcher = () => {
    const { role, setRole } = useAuth();
    if (process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION !== 'true') {
      return null;
    }
    return (
      <div className="p-4 mt-auto border-t">
        <Label className="text-xs font-medium text-muted-foreground">Mô phỏng vai trò</Label>
        <Select value={role} onValueChange={(value) => setRole(value as Role)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="candidate-full-profile">Đã đăng nhập (Profile full)</SelectItem>
            <SelectItem value="candidate">Đã đăng nhập (Có Profile)</SelectItem>
            <SelectItem value="candidate-empty-profile">Đã đăng nhập (Profile trắng)</SelectItem>
            <SelectItem value="guest">Khách (Chưa đăng nhập)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  const LoggedInContent = () => (
    <>
       <div className="p-4">
            <Link href="/ho-so-cua-toi" className="block" >
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary hover:bg-accent/20">
                <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl || "https://placehold.co/100x100.png"} alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>{profileName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 overflow-hidden">
                    <p className="text-base font-medium leading-none truncate">{profileName || 'Ứng viên'}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                        {profileHeadline || 'Cập nhật hồ sơ của bạn'}
                    </p>
                </div>
            </div>
            </Link>
        </div>
        
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
                    <link.icon className="h-8 w-8"/>
                    </div>
                    <span className={cn("text-xs text-center leading-tight font-medium", isActive ? "text-primary" : "text-foreground")}>{link.label}</span>
                </Link>
                )
            })}
            </div>
        </div>
        <MobileRoleSwitcher />
    </>
  );

const LoggedOutContent = () => {
    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
          <p className="text-sm text-center text-muted-foreground">Đăng nhập để trải nghiệm đầy đủ tính năng của HelloJob.</p>
          <Button asChild className="w-full" size="lg" onClick={() => setIsAuthDialogOpen(true)}>
              <Link href="#"><LogIn className="mr-2"/>Đăng nhập / Đăng ký</Link>
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
                        <link.icon className="h-8 w-8"/>
                        </div>
                        <span className={cn("text-xs text-center leading-tight font-medium", isActive ? "text-primary" : "text-foreground")}>{link.label}</span>
                    </Link>
                    )
                })}
            </div>
          </div>
          <MobileRoleSwitcher />
        </div>
    );
};

  const isEditing = role === 'candidate' || role === 'candidate-full-profile';
  const createProfileButtonText = isEditing ? 'Sửa hồ sơ' : 'Tạo hồ sơ';
  const createProfileButtonTextMobile = isEditing ? 'Sửa' : 'Tạo';
  const myJobsLink = applicationCount > 0 ? '/viec-lam-cua-toi?highlight=applied' : '/viec-lam-cua-toi';

  return (
    <>
    <div className={cn(
        "sticky top-0 z-50 w-full transition-transform duration-300",
        isClient && !showNav && isMobile && "-translate-y-full"
    )}>
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                        icon={link.href === '/tao-ho-so-ai' ? Sparkles : undefined}
                    />
                ))}
                </nav>
                <div className="hidden md:flex items-center gap-2">
                    
                    {isClient && (
                        <>
                            
                            {isLoggedIn ? (
                                <Link href="/ho-so-cua-toi" className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <Avatar className="h-10 w-10 cursor-pointer transition-transform duration-300 hover:scale-110 hover:ring-2 hover:ring-primary hover:ring-offset-2">
                                        <AvatarImage src={avatarUrl || undefined} alt="User Avatar" data-ai-hint="user avatar" />
                                        <AvatarFallback>{profileName?.charAt(0) || 'A'}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            ): (
                                <Button onClick={() => setIsAuthDialogOpen(true)}>Đăng nhập / Đăng ký</Button>
                            )}

                            <CreateProfileDialog>
                               <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white">{createProfileButtonText}</Button>
                            </CreateProfileDialog>

                             <Button asChild className="relative">
                                <Link href={myJobsLink}>
                                    Việc của tôi
                                    {applicationCount > 0 && (
                                        <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full bg-red-500 p-0 text-xs">
                                            {applicationCount > 9 ? '9+' : applicationCount}
                                        </Badge>
                                    )}
                                </Link>
                            </Button>
                           
                            <MainMenu />
                        </>
                    )}
                </div>
                {isClient && isMobile && (
                    <div className="flex items-center gap-2">
                        
                        {!isLoggedIn && (
                            <Button size="sm" onClick={() => setIsAuthDialogOpen(true)}>Đăng nhập</Button>
                        )}
                        
                        <CreateProfileDialog>
                           <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white" size="sm">
                               {createProfileButtonTextMobile}
                           </Button>
                        </CreateProfileDialog>

                         <Button asChild variant="default" size="sm" className="relative">
                            <Link href={myJobsLink}>
                                Việc
                                {applicationCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full bg-red-500 p-0 text-xs">
                                        {applicationCount > 9 ? '9+' : applicationCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="flex flex-col p-0">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle><Logo /></SheetTitle>
                                </SheetHeader>
                                {isLoggedIn ? <LoggedInContent /> : <LoggedOutContent />}
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
            </div>
        </header>
        {isClient && isMobile && <MobileSecondaryHeader />}
    </div>
    <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={(open) => {
        setIsAuthDialogOpen(open);
    }} />
    </>
  );
}
