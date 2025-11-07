'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({ href, label, className, icon: Icon, onClick }: { href: string; label: string, className?: string, icon?: React.ElementType, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {

    const pathname = usePathname();
    return <Link
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
};