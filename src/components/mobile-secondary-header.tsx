
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

export function MobileSecondaryHeader() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();


  useEffect(() => {
    if (!isMobile) {
      setShowNav(true);
      return;
    }
  
    const controlNavbar = () => {
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

  return (
    <header className={cn(
        "md:hidden sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b transition-transform duration-300",
        !showNav && "-translate-y-full"
    )}>
       <div className="w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex items-center h-14 px-2">
            {mobileFooterLinks.map(({ href, icon: Icon, label }) => {
            const isActive = (href !== '/' && activePath.startsWith(href)) || (href === '/' && activePath === '/');
            return (
                <Link href={href} key={href} className={cn(
                    "flex flex-col items-center justify-center text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0 w-20 pt-1",
                    isActive ? 'text-primary font-bold' : ''
                )}>
                <Icon className={cn("h-6 w-6 mb-1")} />
                <span className="text-center leading-tight">{label}</span>
                </Link>
            )
            })}
        </div>
      </div>
    </header>
  );
}
