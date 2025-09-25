'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { mobileFooterLinks } from '@/lib/nav-data';
import { Sparkles, Briefcase, Compass, LifeBuoy, UserSearch, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


export function MobileSecondaryHeader() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!isClient || !isMobile) {
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

    window.removeEventListener('scroll', controlNavbar);
    window.addEventListener('scroll', controlNavbar);

    return () => window.removeEventListener('scroll', controlNavbar);
  }, [isClient, isMobile, lastScrollY]);

  if (!isClient) {
    return (
        <header className="md:hidden sticky top-16 z-30 w-full bg-background/95 h-14 border-b" />
    )
  }

  const icons: { [key: string]: React.ElementType } = {
    '/viec-lam-cua-toi': Briefcase,
    '/lo-trinh': Compass,
    '/tao-ho-so-ai': Sparkles,
    '/cam-nang': LifeBuoy,
    '/tu-van-vien': UserSearch,
    '/gioi-thieu': Info,
  };


  return (
    <header className={cn(
        "md:hidden sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b transition-transform duration-300",
        !showNav && "-translate-y-full"
    )}>
       <div className="w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex items-center h-14 px-2">
            {mobileFooterLinks.map(({ href, label }) => {
                const isActive = (href !== '/' && activePath.startsWith(href)) || (href === '/' && activePath === '/');
                const isAiProfile = href === '/tao-ho-so-ai';
                const Icon = icons[href];
                
                return (
                    <Link href={href} key={href} className={cn(
                        "flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors flex-shrink-0 w-auto px-4 py-2 rounded-md",
                        isActive ? 'text-primary font-bold bg-primary/10' : ''
                    )}>
                    {Icon && isAiProfile ? (
                        <div className="flex items-center gap-2">
                            <Icon className={cn("h-4 w-4", isAiProfile && "text-accent-orange")} />
                            <span className="text-center leading-tight">{label}</span>
                        </div>
                    ) : (
                        <span className="text-center leading-tight">{label}</span>
                    )}
                    </Link>
                )
            })}
        </div>
      </div>
    </header>
  );
}
