
'use client';

import Link from 'next/link';
import { Home, Sparkles, User, Briefcase, MessageSquare, LayoutGrid, X, Compass, BookOpen, LifeBuoy, Info, Handshake, Gem, UserPlus, PlusCircle, FileText, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import Image from 'next/image';
import { useChat } from '@/contexts/ChatContext';
import { mainNavLinks, quickAccessLinks, mobileFooterLinks } from '@/lib/nav-data';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';


const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);

export function MobileFooter() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState('');
  const { openChat } = useChat();
  const { role, setRole } = useAuth();
  const isLoggedIn = role !== 'guest';

  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();


  useEffect(() => {
    if (!isMobile) {
      setShowNav(true);
      return;
    }
  
    const controlNavbar = () => {
      // Logic to hide header on scroll down
      // `window.scrollY > 80` is a threshold to prevent hiding on small scrolls at the top
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [isMobile, lastScrollY]);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const isQuickAccessLinkActive = quickAccessLinks.some(link => activePath.startsWith(link.href) && link.href !== '/');

  const LoggedInContent = () => (
    <>
       <div className="p-4">
            <Link href="/candidate-profile" className="block" onClick={() => setIsOpen(false)}>
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
                const isActive = (activePath === link.href) || (link.href !== '/' && activePath.startsWith(link.href));
                return (
                <Link 
                    key={link.href}
                    id={link.href === '/roadmap' ? 'MMN01' : undefined}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
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
    </>
  );

  const LoggedOutContent = () => (
     <div className="p-4 space-y-4">
        <p className="text-muted-foreground text-center">Đăng nhập để trải nghiệm đầy đủ tính năng của HelloJob.</p>
        <Button asChild className="w-full" size="lg" onClick={() => setIsOpen(false)}>
          <Link href="/candidate-profile"><LogIn className="mr-2"/>Đăng nhập / Đăng ký</Link>
        </Button>
        <DropdownMenuSeparator/>
         <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
            {quickAccessLinks.map((link) => {
                const isActive = (activePath === link.href) || (link.href !== '/' && activePath.startsWith(link.href));
                return (
                <Link 
                    key={link.href}
                    id={link.href === '/roadmap' ? 'MMN01' : undefined}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
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
     </div>
  );

  return (
    <footer className={cn(
        "md:hidden sticky top-16 z-40 bg-background border-b transition-transform duration-300",
        !showNav && "-translate-y-full"
    )}>
      <div className="flex justify-around items-center h-16 overflow-x-auto whitespace-nowrap no-scrollbar px-2">
        {mobileFooterLinks.map(({ href, icon: Icon, label }) => {
           const isActive = (activePath === href) || (href !== '/' && activePath.startsWith(href));
           return (
            <Link href={href} key={href} className="flex flex-col items-center justify-center text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0 w-20 pt-1">
              <Icon className={cn("h-6 w-6 mb-1", isActive ? 'text-primary' : '')} />
              <span className={cn( "text-center leading-tight", isActive ? 'text-primary font-bold' : '')}>{label}</span>
            </Link>
           )
        })}
      </div>
    </footer>
  );
}

// Helper for hiding scrollbar
const noScrollbarCSS = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = noScrollbarCSS;
    document.head.appendChild(styleSheet);
}
