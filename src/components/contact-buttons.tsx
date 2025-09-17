
'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '@/contexts/ChatContext';

// Define a more generic type for the contact person
type ContactPerson = {
    id: string;
    name: string;
    avatar: string;
};

interface ContactButtonsProps {
    contact: ContactPerson;
}

export function ContactButtons({ contact }: ContactButtonsProps) {
  const { openChat } = useChat();

  const handleChatClick = () => {
    // @ts-ignore
    openChat(contact);
  };

  return (
    <>
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                <MessageSquare className="mr-2 h-4 w-4"/>
                Chat
            </Button>
            <Button asChild variant="outline" size="icon" className="border-purple-500 hover:bg-purple-50">
                <Link href="https://m.me/your_user_id" target="_blank">
                     <Image src="/img/Mess.svg" alt="Messenger" width={20} height={20} />
                </Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="border-blue-500 hover:bg-blue-50">
                <Link href="https://zalo.me/your_zalo_id" target="_blank">
                   <Image src="/img/Zalo.svg" alt="Zalo" width={20} height={20} />
                </Link>
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="border-green-500 hover:bg-green-50">
                        <Image src="/img/phone.svg" alt="Phone" width={20} height={20} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-semibold text-lg">090-1234-5678</p>
                        <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText('090-1234-5678')}>Sao chép</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        {/* Mobile Buttons */}
         <div className="md:hidden">
            <Popover>
                <PopoverTrigger asChild>
                    <div id="MB4NUT01" className="flex items-center gap-2">
                        <Button size="icon" variant="default" className="h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90">
                            <MessageSquare className="h-5 w-5"/>
                        </Button>
                        <Button size="icon" variant="outline" className="h-9 w-9 border-purple-500/50">
                            <Image src="/img/Mess.svg" alt="Messenger" width={20} height={20} />
                        </Button>
                         <Button size="icon" variant="outline" className="h-9 w-9 border-blue-500/50">
                            <Image src="/img/Zalo.svg" alt="Zalo" width={20} height={20} />
                        </Button>
                         <Button size="icon" variant="outline" className="h-9 w-9 border-green-500/50">
                            <Image src="/img/phone.svg" alt="Phone" width={20} height={20} />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                    <div className="flex gap-2">
                        <Button size="icon" className="h-14 w-14 bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                            <MessageSquare className="h-7 w-7"/>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-14 w-14 border-purple-500 hover:bg-purple-50">
                            <Link href="https://m.me/your_user_id" target="_blank">
                                <Image src="/img/Mess.svg" alt="Messenger" width={32} height={32} />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-14 w-14 border-blue-500 hover:bg-blue-50">
                            <Link href="https://zalo.me/your_zalo_id" target="_blank">
                              <Image src="/img/Zalo.svg" alt="Zalo" width={32} height={32} />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-14 w-14 border-green-500 hover:bg-green-50">
                             <Link href="tel:09012345678">
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
