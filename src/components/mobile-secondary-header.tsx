
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { mobileFooterLinks } from '@/lib/nav-data';

export function MobileSecondaryHeader() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <header className="md:hidden sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b">
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
