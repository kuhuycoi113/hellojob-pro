

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


const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);

export function Header2() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down hide the navbar
          setIsVisible(false);
        } else { // if scroll up show the navbar
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav className={cn(
        "md:hidden fixed top-16 left-0 right-0 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-40 transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="flex items-center h-16 overflow-x-auto whitespace-nowrap px-2">
        {mainNavLinks.map(({ href, icon: Icon, label }) => {
           const isActive = (activePath === href) || (href !== '/' && activePath.startsWith(href));
           return (
            <Link href={href} key={href} className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors p-3 flex-shrink-0">
              {Icon && <Icon className={cn("h-5 w-5 mr-2", isActive ? 'text-primary' : '')} />}
              <span className={cn( "text-center leading-tight", isActive ? 'text-primary font-bold' : 'font-medium')}>{label}</span>
            </Link>
           )
        })}
      </div>
    </nav>
  );
}
