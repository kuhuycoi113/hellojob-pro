
'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { MessageSquare, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Job } from '@/lib/mock-data';


// Define a more generic type for the contact person
type ContactPerson = {
    id: string;
    name: string;
    avatar: string;
};

interface ContactButtonsProps {
    contact: ContactPerson;
    job?: Job; // Make job optional
    showChatText?: boolean; // New prop to control text visibility
}

export function ContactButtons({ contact, job, showChatText = false }: ContactButtonsProps) {
  const { openChat } = useChat();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChatClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    openChat(contact as any, job, job ? "Cho mình hỏi về việc làm này." : undefined);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Prevent card's onClick from firing
  };

  const handlePopoverTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
  }

  if (!isClient) {
    return null; // Render nothing on the server and during initial client render
  }

  return (
    <>
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-1">
             <Button
                size={showChatText ? 'sm' : 'icon'}
                variant="default"
                className={cn(
                    'h-8 hover:bg-primary/90',
                    showChatText ? 'w-auto px-3' : 'w-8'
                )}
                onClick={handleChatClick}
            >
                <MessageSquare className="h-4 w-4"/>
                {showChatText && <span className="ml-2">Chat với Tư vấn viên</span>}
            </Button>
            <Button asChild variant="outline" size="icon" className="h-8 w-8 border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600">
                <Link href="https://m.me/your_user_id" target="_blank" onClick={handleLinkClick}>
                     <Image src="/img/Mess.svg" alt="Messenger" width={20} height={20} />
                </Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="h-8 w-8 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600">
                <Link href="https://zalo.me/your_zalo_id" target="_blank" onClick={handleLinkClick}>
                   <Image src="/img/Zalo.svg" alt="Zalo" width={20} height={20} />
                </Link>
            </Button>
             <Button asChild variant="outline" size="icon" className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600">
                 <Link href="tel:09012345678" onClick={handleLinkClick}>
                    <Image src="/img/phone.svg" alt="Phone" width={20} height={20} />
                </Link>
            </Button>
        </div>

        {/* Mobile Buttons */}
         <div className="md:hidden">
            <Popover>
                <PopoverAnchor asChild>
                    <PopoverTrigger asChild>
                        <div id="MB4NUT01" className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button size="icon" variant="default" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleChatClick}>
                                <MessageSquare className="h-4 w-4"/>
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 border-purple-500 hover:bg-purple-50">
                                <Image src="/img/Mess.svg" alt="Messenger" width={18} height={18} />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 border-blue-500 hover:bg-blue-50">
                                <Image src="/img/Zalo.svg" alt="Zalo" width={18} height={18} />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 border-green-500 hover:bg-green-50">
                                <Image src="/img/phone.svg" alt="Phone" width={18} height={18} />
                            </Button>
                        </div>
                    </PopoverTrigger>
                </PopoverAnchor>
                <PopoverContent id="LIENHETOMOBILE01" className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                        <Button size="icon" className="h-16 w-16 bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                            <MessageSquare className="h-8 w-8"/>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-16 w-16 border-purple-500 hover:bg-purple-50">
                            <Link href="https://m.me/your_user_id" target="_blank" onClick={handleLinkClick}>
                                <Image src="/img/Mess.svg" alt="Messenger" width={32} height={32} />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-16 w-16 border-blue-500 hover:bg-blue-50">
                            <Link href="https://zalo.me/your_zalo_id" target="_blank" onClick={handleLinkClick}>
                              <Image src="/img/Zalo.svg" alt="Zalo" width={32} height={32} />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-16 w-16 border-green-500 hover:bg-green-50">
                             <Link href="tel:09012345678" onClick={handleLinkClick}>
                                <Image src="/img/phone.svg" alt="Phone" width={32} height={32} />
                            </Link>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    </>
  );
}
