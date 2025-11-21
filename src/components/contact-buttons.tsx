'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Job } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';


// Define a more generic type for the contact person

interface ContactButtonsProps {
    contact: {
        name?: string;
        messengerId?: string;
        zalo?: string;
        phone?: string;
        groupLink?: string;
        groupName?: string
    };
    job?: Job; // Make job optional
    variant?: 'default' | 'compact';
    showChatText?: boolean;
    chatText?: string;
}

export function ContactButtons({ contact, job, variant = 'default', showChatText = false }: ContactButtonsProps) {
    const { role } = useAuth();
    if (!contact) {
        return <></>;
    }
    const { openChat } = useChat();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChatClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent card's onClick from firing
        if (role === 'admin' && !!contact.groupLink) {
            window.open(contact.groupLink, '_blank');
        } else {
            openChat(contact as any, job, job ? "Cho mình hỏi về việc làm này." : undefined);
        }
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
    if (role === 'admin') {
        return (
            <>
                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-1">
                    <Button
                        size={variant === 'default' ? 'sm' : 'icon'}
                        variant="default"
                        className={cn(
                            'h-8 hover:bg-primary/90',
                            variant === 'compact' ? 'w-8' : 'w-auto px-3'
                        )}
                        onClick={handleChatClick}
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span className={cn('ml-2', (variant === 'compact') ? 'hidden' : 'inline')}>
                            {contact.groupName}
                        </span>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="opacity-50 h-8 w-8 border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600">
                        <Link href={`#`} onClick={handleLinkClick}>
                            <Image src="/img/Mess.svg" alt="Messenger" width={20} height={20} />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className={cn("h-8 w-8 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600", !contact.zalo ? 'opacity-50' : '')}>
                        <Link href={`${contact.zalo ?? '#'}`} target="_blank" onClick={handleLinkClick}>
                            <Image src="/img/Zalo.svg" alt="Zalo" width={20} height={20} />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="opacity-50 h-8 w-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600">
                        <Link href={`#`} onClick={handleLinkClick}>
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
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" disabled={!contact.messengerId} className="opacity-50 h-8 w-8 border-purple-500 hover:bg-purple-50">
                                        <Image src="/img/Mess.svg" alt="Messenger" width={18} height={18} />
                                    </Button>
                                    <Button size="icon" variant="outline" disabled={!contact.zalo} className={cn('h-8 w-8 border-blue-500 hover:bg-blue-50', !contact.zalo ? 'opacity-50' : '')}>
                                        <Image src="/img/Zalo.svg" alt="Zalo" width={18} height={18} />
                                    </Button>
                                    <Button size="icon" variant="outline" disabled={!contact.phone} className="opacity-50 h-8 w-8 border-green-500 hover:bg-green-50">
                                        <Image src="/img/phone.svg" alt="Phone" width={18} height={18} />
                                    </Button>
                                </div>
                            </PopoverTrigger>
                        </PopoverAnchor>
                        <PopoverContent id="LIENHETOMOBILE01" className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                                <Button size="icon" className="h-16 w-16 bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                                    <MessageSquare className="h-8 w-8" />
                                </Button>
                                <Button asChild variant="outline" size="icon" disabled={!contact.messengerId} className="h-16 w-16 border-purple-500 hover:bg-purple-50 opacity-50">
                                    <Link href={`#`} target="_blank" onClick={handleLinkClick}>
                                        <Image src="/img/Mess.svg" alt="Messenger" width={32} height={32} />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="icon" disabled={!contact.zalo} className={cn("h-16 w-16 border-blue-500 hover:bg-blue-50", !contact.zalo ? 'opacity-50' : '')}>
                                    <Link href={`${contact.zalo ?? '#'}`} target="_blank" onClick={handleLinkClick}>
                                        <Image src="/img/Zalo.svg" alt="Zalo" width={32} height={32} />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="icon" disabled={!contact.phone} className="h-16 w-16 border-green-500 hover:bg-green-50 opacity-50">
                                    <Link href={`#`} onClick={handleLinkClick}>
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

    return (
        <>
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-1">
                <Button
                    size={variant === 'default' ? 'sm' : 'icon'}
                    variant="default"
                    className={cn(
                        'h-8 hover:bg-primary/90',
                        variant === 'compact' ? 'w-8' : 'w-auto px-3'
                    )}
                    onClick={handleChatClick}
                >
                    <MessageSquare className="h-4 w-4" />
                    <span className={cn('ml-2', (variant === 'compact' || !showChatText) ? 'hidden' : 'inline')}>
                        Chat với Tư vấn viên
                    </span>
                </Button>
                <Button asChild variant="outline" size="icon" className="h-8 w-8 border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600">
                    <Link href={`https://m.me/${contact.messengerId}`} target="_blank" onClick={handleLinkClick}>
                        <Image src="/img/Mess.svg" alt="Messenger" width={20} height={20} />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="icon" className="h-8 w-8 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600">
                    <Link href={`${contact.zalo}`} target="_blank" onClick={handleLinkClick}>
                        <Image src="/img/Zalo.svg" alt="Zalo" width={20} height={20} />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="icon" className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600">
                    <Link href={`tel:${contact.phone}`} onClick={handleLinkClick}>
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
                                    <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" disabled={!contact.messengerId} className="h-8 w-8 border-purple-500 hover:bg-purple-50">
                                    <Image src="/img/Mess.svg" alt="Messenger" width={18} height={18} />
                                </Button>
                                <Button size="icon" variant="outline" disabled={!contact.zalo} className="h-8 w-8 border-blue-500 hover:bg-blue-50">
                                    <Image src="/img/Zalo.svg" alt="Zalo" width={18} height={18} />
                                </Button>
                                <Button size="icon" variant="outline" disabled={!contact.phone} className="h-8 w-8 border-green-500 hover:bg-green-50">
                                    <Image src="/img/phone.svg" alt="Phone" width={18} height={18} />
                                </Button>
                            </div>
                        </PopoverTrigger>
                    </PopoverAnchor>
                    <PopoverContent id="LIENHETOMOBILE01" className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                            <Button size="icon" className="h-16 w-16 bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                                <MessageSquare className="h-8 w-8" />
                            </Button>
                            <Button asChild variant="outline" size="icon" disabled={!contact.messengerId} className="h-16 w-16 border-purple-500 hover:bg-purple-50">
                                <Link href={`https://m.me/${contact.messengerId}`} target="_blank" onClick={handleLinkClick}>
                                    <Image src="/img/Mess.svg" alt="Messenger" width={32} height={32} />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" disabled={!contact.zalo} className="h-16 w-16 border-blue-500 hover:bg-blue-50">
                                <Link href={`${contact.zalo}`} target="_blank" onClick={handleLinkClick}>
                                    <Image src="/img/Zalo.svg" alt="Zalo" width={32} height={32} />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" disabled={!contact.phone} className="h-16 w-16 border-green-500 hover:bg-green-50">
                                <Link href={`tel:${contact.phone}`} onClick={handleLinkClick}>
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
