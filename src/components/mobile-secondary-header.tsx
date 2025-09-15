
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { mobileFooterLinks } from '@/lib/nav-data';
import { useIsMobile } from '@/hooks/use-mobile';


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
      // If scrolling down and past the header height, hide the nav.
      if (window.scrollY > lastScrollY && window.scrollY > 128) { // 128px is h-16 (header) + h-14 (secondary header)
        setShowNav(false);
      } else { // If scrolling up, show the nav.
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
