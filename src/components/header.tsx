

'use client';

import Link from 'next/link';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { mainNavLinks } from '@/lib/nav-data';
import { useAuth, type Role } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreateProfileDialog } from '@/components/create-profile-dialog';
import { AuthDialog } from '@/components/auth-dialog';
import { MainMenu } from '@/components/header/main-menu';
import { LoggedInContent } from '@/components/header/loggedin-content';
import { LoggedOutContent } from '@/components/header/loggedout-content';
import { NavLink } from '@/components/header/nav-link';
import { MobileSecondaryHeader } from './mobile-secondary-header';


export const Logo = ({ className }: { className?: string }) => (
  <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={120} height={40} className={cn("h-10 w-auto", className)} priority />
);

export function Header() {
  const { role, isLoggedIn } = useAuth();
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

  const isEditing = role === 'candidate'
  const createProfileButtonTextMobile = isEditing ? 'Sửa' : 'Tạo';

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

                <Button asChild variant="default" size="sm">
                  <Link href="/viec-lam-cua-toi">Việc</Link>
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
                    {isLoggedIn ? <LoggedInContent /> : <LoggedOutContent setIsAuthDialogOpen={setIsAuthDialogOpen} />}
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </header>
        {isClient && isMobile && <MobileSecondaryHeader />}
      </div>
      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={(open: any) => {
        setIsAuthDialogOpen(open);
      }} />
    </>
  );
}
