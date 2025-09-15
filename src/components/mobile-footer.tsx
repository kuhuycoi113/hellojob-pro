

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

  return (
    <footer className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t transition-transform duration-300",
        !showNav && "translate-y-full"
    )}>
      <div className="flex justify-around items-center h-16">
        {mobileFooterLinks.slice(0, 5).map(({ href, icon: Icon, label }) => {
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
