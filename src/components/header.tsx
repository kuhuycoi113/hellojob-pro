
'use client';

import Link from 'next/link';
import { Briefcase, Menu, X, Building, PlusCircle, User, LogOut, Shield, FileText, Gift, MessageSquareWarning, Settings, LifeBuoy, LayoutGrid, Sparkles, BookOpen, Compass, Home, Info, Handshake, ChevronDown, Gem, UserPlus, MessageSquare, LogIn, Pencil, FastForward, ListChecks, GraduationCap, UserCheck, HardHat, ChevronRight } from 'lucide-react';
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
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { AuthDialog } from './auth-dialog';
import { locations } from '@/lib/location-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSecondaryHeader } from './mobile-secondary-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';


export const Logo = ({ className }: { className?: string }) => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={120} height={40} className={cn("h-10 w-auto", className)} priority />
);

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { openChat } = useChat();
  const { role, setRole, isLoggedIn } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [profileCreationStep, setProfileCreationStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState<string | null>(null);
  const [selectedVisaDetail, setSelectedVisaDetail] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isCreateDetailOpen, setIsCreateDetailOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();


  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isMobile) {
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
  }, [isMobile, lastScrollY]);


  const handleCreateProfileRedirect = () => {
    const preferences = {
      desiredVisaType: selectedVisaType || undefined,
      desiredVisaDetail: selectedVisaDetail || undefined,
      desiredIndustry: selectedIndustry?.name || undefined,
      desiredLocation: selectedRegion || undefined,
    };

    if (isLoggedIn) {
      console.log("Applying preferences for logged in user:", preferences);
      const existingProfileRaw = localStorage.getItem('generatedCandidateProfile');
      let profile = existingProfileRaw ? JSON.parse(existingProfileRaw) : {};
      
      const updatedAspirations = { ...profile.aspirations };
      if (preferences.desiredVisaType) updatedAspirations.desiredVisaType = preferences.desiredVisaType;
      if (preferences.desiredVisaDetail) updatedAspirations.desiredVisaDetail = preferences.desiredVisaDetail;
      if (preferences.desiredLocation) updatedAspirations.desiredLocation = preferences.desiredLocation;

      profile = {
        ...profile,
        aspirations: updatedAspirations,
      };
      if (preferences.desiredIndustry) profile.desiredIndustry = preferences.desiredIndustry;

      localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
      setIsDialogOpen(false);
      router.push('/my-jobs?highlight=suggested');
    } else {
      sessionStorage.setItem('onboardingPreferences', JSON.stringify(preferences));
      sessionStorage.setItem('postLoginRedirect', '/my-jobs?highlight=suggested');
      setIsDialogOpen(false);
      setIsConfirmLoginOpen(true);
    }
  };

  const handleConfirmLogin = () => {
    setIsConfirmLoginOpen(false);
    setIsAuthDialogOpen(true);
  };
  
    const handleCreateDetailedProfile = (method: 'ai' | 'manual') => {
        setIsCreateDetailOpen(false);
        setIsDialogOpen(false);
        if (method === 'ai') {
            router.push('/ai-profile');
        } else {
            router.push('/register');
        }
    };

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
      {Icon && <Icon className={cn("h-5 w-5", href === '/ai-profile' && 'text-accent-orange')} />}
      {label}
    </Link>
  );
  
  const FirstStepDialog = () => (
    <>
      {/* Screen: THSN001 */}
      <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Chọn phương thức tạo hồ sơ</DialogTitle>
          <DialogDescription className="text-center">
            Bạn muốn tạo hồ sơ để làm gì?
          </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Card onClick={() => setProfileCreationStep(2)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
            <FastForward className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Tạo nhanh</h3>
            <p className="text-muted-foreground text-xs">Để HelloJob AI gợi ý việc làm phù hợp cho bạn ngay lập tức.</p>
        </Card>
        <Card onClick={() => { setIsDialogOpen(false); setIsCreateDetailOpen(true); }} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
            <ListChecks className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Tạo chi tiết</h3>
            <p className="text-muted-foreground text-xs">Để hoàn thiện hồ sơ và sẵn sàng ứng tuyển vào công việc mơ ước.</p>
        </Card>
      </div>
    </>
  );

  const QuickCreateStepDialog = () => (
    <>
      {/* Screen: THSN002 */}
      <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Chọn loại hình lao động</DialogTitle>
          <DialogDescription className="text-center">
            Hãy chọn loại hình phù hợp nhất với trình độ và mong muốn của bạn.
          </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Button 
            onClick={() => { setSelectedVisaType('Thực tập sinh kỹ năng'); setProfileCreationStep(3); }} 
            variant="outline" 
            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
            <HardHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Thực tập sinh kỹ năng</h3>
            <p className="text-muted-foreground text-xs">Lao động phổ thông, 18-40 tuổi.</p>
        </Button>
        <Button 
            onClick={() => { setSelectedVisaType('Kỹ năng đặc định'); setProfileCreationStep(3); }} 
            variant="outline" 
            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
            <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Kỹ năng đặc định</h3>
            <p className="text-muted-foreground text-xs">Lao động có hoặc cần thi tay nghề.</p>
        </Button>
        <Button 
            onClick={() => { setSelectedVisaType('Kỹ sư, tri thức'); setProfileCreationStep(3); }} 
            variant="outline" 
            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
            <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Kỹ sư, tri thức</h3>
            <p className="text-muted-foreground text-xs">Tốt nghiệp CĐ, ĐH, có thể định cư.</p>
        </Button>
      </div>
      <Button variant="link" onClick={() => setProfileCreationStep(1)} className="mt-4 mx-auto block">Quay lại</Button>
    </>
  );

  const visaDetailsOptions: { [key: string]: { label: string, description: string }[] } = {
    'Thực tập sinh kỹ năng': [
      { label: 'Thực tập sinh 3 năm', description: 'Chương trình phổ thông nhất' },
      { label: 'Thực tập sinh 1 năm', description: 'Chương trình ngắn hạn' },
      { label: 'Thực tập sinh 3 Go', description: 'Dành cho người có kinh nghiệm' },
    ],
    'Kỹ năng đặc định': [
      { label: 'Đặc định đầu Nhật', description: 'Dành cho người đang ở Nhật' },
      { label: 'Đặc định đầu Việt', description: 'Dành cho người ở Việt Nam' },
      { label: 'Đặc định đi mới', description: 'Lần đầu đăng ký' },
    ],
    'Kỹ sư, tri thức': [
      { label: 'Kỹ sư đầu Nhật', description: 'Dành cho kỹ sư đang ở Nhật' },
      { label: 'Kỹ sư đầu Việt', description: 'Dành cho kỹ sư ở Việt Nam' },
    ],
  };

  const VisaDetailStepDialog = () => {
    if (!selectedVisaType) return null;
    const options = visaDetailsOptions[selectedVisaType];
    
    let screenIdComment = '';
    if (selectedVisaType === 'Thực tập sinh kỹ năng') screenIdComment = '// Screen: THSN003-1';
    else if (selectedVisaType === 'Kỹ năng đặc định') screenIdComment = '// Screen: THSN003-2';
    else if (selectedVisaType === 'Kỹ sư, tri thức') screenIdComment = '// Screen: THSN003-3';
    
    return (
        <>
        <span className="hidden">{screenIdComment}</span>
        <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-center">Chọn loại {selectedVisaType}</DialogTitle>
            <DialogDescription className="text-center">
            Chọn loại hình chi tiết để tiếp tục.
            </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {options.map(option => (
                <Button key={option.label} onClick={() => { setSelectedVisaDetail(option.label); setProfileCreationStep(4); }} variant="outline" className="h-auto p-4 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                    <h3 className="font-bold text-base mb-1">{option.label}</h3>
                    <p className="text-muted-foreground text-xs">{option.description}</p>
                </Button>
            ))}
        </div>
        <Button variant="link" onClick={() => setProfileCreationStep(2)} className="mt-4 mx-auto block">Quay lại</Button>
        </>
    )
  };

  const IndustryStepDialog = () => {
    if (!selectedVisaType) return null;
    const industries = industriesByJobType[selectedVisaType as keyof typeof industriesByJobType] || [];
    
    let screenIdComment = '';
    if (selectedVisaType === 'Thực tập sinh kỹ năng') screenIdComment = '// Screen: THSN004-1';
    else if (selectedVisaType === 'Kỹ năng đặc định') screenIdComment = '// Screen: THSN004-2';
    else if (selectedVisaType === 'Kỹ sư, tri thức') screenIdComment = '// Screen: THSN004-3';

    return (
        <>
            <span className="hidden">{screenIdComment}</span>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn ngành nghề mong muốn</DialogTitle>
                <DialogDescription className="text-center">
                    Lựa chọn ngành nghề bạn quan tâm nhất để chúng tôi gợi ý việc làm chính xác hơn.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                {industries.map(industry => (
                    <Button key={industry.slug} onClick={() => {setSelectedIndustry(industry); setProfileCreationStep(5);}} variant="outline" className="h-auto p-3 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                        <p className="font-semibold text-sm">{industry.name}</p>
                    </Button>
                ))}
            </div>
            <Button variant="link" onClick={() => setProfileCreationStep(3)} className="mt-4 mx-auto block">Quay lại</Button>
        </>
    );
  };
  
  const japanRegions = ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu', 'Okinawa'];

  const RegionStepDialog = () => {
    return (
         <>
            {/* Screen: THSN005 */}
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn khu vực làm việc</DialogTitle>
                <DialogDescription className="text-center">
                    Lựa chọn khu vực bạn muốn làm việc tại Nhật Bản.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                 {japanRegions.map(region => (
                    <Button 
                        key={region} 
                        variant="outline"
                        onClick={() => setSelectedRegion(region)} 
                        className={cn(
                            "h-auto p-3 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary",
                            selectedRegion === region ? "ring-2 ring-primary border-primary bg-primary/10" : ""
                        )}
                    >
                        <p className="font-semibold text-sm">{region}</p>
                    </Button>
                ))}
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
                <Button variant="link" onClick={() => setProfileCreationStep(4)}>Quay lại</Button>
                <Button variant="secondary" className="bg-accent-orange hover:bg-accent-orange/90 text-white" onClick={handleCreateProfileRedirect}>Lưu và xem việc làm phù hợp</Button>
            </div>
        </>
    )
  }


  const renderDialogContent = () => {
    switch (profileCreationStep) {
      case 1: return <FirstStepDialog />;
      case 2: return <QuickCreateStepDialog />;
      case 3: return <VisaDetailStepDialog />;
      case 4: return <IndustryStepDialog />;
      case 5: return <RegionStepDialog />;
      default: return <FirstStepDialog />;
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
                  {role === 'candidate-empty-profile' ? (
                     <>
                        <p className="text-base font-medium leading-none">Hoàn thiện hồ sơ</p>
                        <p className="text-xs leading-none text-muted-foreground">Nhà tuyển dụng đang chờ bạn!</p>
                     </>
                  ) : (
                    <>
                      <p className="text-base font-medium leading-none">Lê Ngọc Hân</p>
                      <p className="text-xs leading-none text-muted-foreground">Ứng viên Thực tập sinh</p>
                    </>
                  )}
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
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(value) => setRole(value as 'candidate' | 'candidate-empty-profile' | 'guest')}
        >
          <DropdownMenuLabel>Mô phỏng vai trò người dùng</DropdownMenuLabel>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileRoleSwitcher = () => {
    const { role, setRole } = useAuth();
    return (
      <div className="p-4 mt-auto border-t">
        <Label className="text-xs font-medium text-muted-foreground">Mô phỏng vai trò</Label>
        <Select value={role} onValueChange={(value) => setRole(value as Role)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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
            <Link href="/candidate-profile" className="block" >
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary hover:bg-accent/20">
                <Avatar className="h-12 w-12">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none">Lê Ngọc Hân</p>
                <p className="text-xs leading-none text-muted-foreground">
                    Ứng viên Thực tập sinh
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
                    id={link.href === '/roadmap' ? 'MMN01' : undefined}
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
          <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
                {quickAccessLinks.map((link) => {
                    const isActive = false;
                    return (
                    <Link 
                        key={link.href}
                        id={link.href === '/roadmap' ? 'MMN01' : undefined}
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


  return (
    <>
    <div className={cn(
        "sticky top-0 z-50 w-full transition-transform duration-300",
        !showNav && isMobile && "-translate-y-full"
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
                        icon={link.href === '/ai-profile' ? Sparkles : undefined}
                    />
                ))}
                </nav>
                <div className="hidden md:flex items-center gap-2">
                    
                    {isClient && (
                        <>
                            {isLoggedIn ? (
                                <Link href="/candidate-profile" className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <Avatar className="h-10 w-10 cursor-pointer transition-transform duration-300 hover:scale-110 hover:ring-2 hover:ring-primary hover:ring-offset-2">
                                        <AvatarImage src={"https://placehold.co/100x100.png" || undefined} alt="User Avatar" data-ai-hint="user avatar" />
                                        <AvatarFallback>A</AvatarFallback>
                                    </Avatar>
                                </Link>
                            ): (
                                <Button onClick={() => setIsAuthDialogOpen(true)}>Đăng nhập / Đăng ký</Button>
                            )}
                            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setProfileCreationStep(1); }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white">Tạo hồ sơ</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                    {renderDialogContent()}
                                </DialogContent>
                            </Dialog>
                            <Button asChild>
                                <Link href="/my-jobs">
                                Trang việc làm
                                </Link>
                            </Button>
                            <MainMenu />
                        </>
                    )}
                </div>
                <div className="md:hidden flex items-center gap-2">
                    {isClient && !isLoggedIn && (
                        <Button size="sm" onClick={() => setIsAuthDialogOpen(true)}>Đăng nhập</Button>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setProfileCreationStep(1); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white" size="sm">Tạo</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            {renderDialogContent()}
                        </DialogContent>
                    </Dialog>
                    <Button asChild variant="default" size="sm">
                        <Link href="/my-jobs">Việc</Link>
                    </Button>
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="flex flex-col">
                            <SheetHeader>
                                <SheetTitle><Logo /></SheetTitle>
                            </SheetHeader>
                            {isLoggedIn ? <LoggedInContent /> : <LoggedOutContent />}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
        <MobileSecondaryHeader />
    </div>
     <AlertDialog open={isConfirmLoginOpen} onOpenChange={setIsConfirmLoginOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
                Bạn cần có tài khoản để lưu các lựa chọn và xem việc làm phù hợp. Đi đến trang đăng ký/đăng nhập?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Từ chối</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogin}>
                Đồng ý
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
     <Dialog open={isCreateDetailOpen} onOpenChange={setIsCreateDetailOpen}>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Bạn muốn tạo hồ sơ chi tiết bằng cách nào?</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Card onClick={() => handleCreateDetailedProfile('ai')} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Dùng AI</h3>
                    <p className="text-muted-foreground text-xs">Tải lên CV, AI sẽ tự động điền thông tin.</p>
                </Card>
                <Card onClick={() => handleCreateDetailedProfile('manual')} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                    <Pencil className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Thủ công</h3>
                    <p className="text-muted-foreground text-xs">Tự điền thông tin vào biểu mẫu chi tiết.</p>
                </Card>
            </div>
             <div className="mt-4 text-center">
                <Button variant="link" onClick={() => { setIsCreateDetailOpen(false); setIsDialogOpen(true); }}>Quay lại</Button>
            </div>
        </DialogContent>
    </Dialog>
    <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={(open) => {
        setIsAuthDialogOpen(open);
    }} />
    </>
  );
}





    
