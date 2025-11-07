import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { quickAccessLinks } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

export const LoggedInContent = () => {
    return <>
      <div className="p-4">
        <Link href="/ho-so-cua-toi" className="block" >
          <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary hover:bg-accent/20">
            <Avatar className="h-12 w-12">
              <AvatarImage src={"https://placehold.co/100x100.png"} alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>{'A'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 overflow-hidden">
              <p className="text-base font-medium leading-none truncate">{'Ứng viên'}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {'Cập nhật hồ sơ của bạn'}
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
                id={link.href === '/lo-trinh' ? 'MMN01' : undefined}
                href={link.href}

                className={cn("flex flex-col items-center justify-start p-2 h-24 cursor-pointer rounded-md hover:bg-accent/80", isActive ? "bg-primary/10 ring-2 ring-primary" : "bg-secondary")}>
                <div className={cn("h-10 flex items-center justify-center", isActive ? "text-primary" : "text-muted-foreground")}>
                  <link.icon className="h-8 w-8" />
                </div>
                <span className={cn("text-xs text-center leading-tight font-medium", isActive ? "text-primary" : "text-foreground")}>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      {/* <MobileRoleSwitcher /> */}
    </>
};