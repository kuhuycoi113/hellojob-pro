
'use client';

import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChatWindow } from './chat-window';
import { conversations, helloJobBot, getCurrentUser } from '@/lib/chat-data';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export function FloatingChatWidget() {
  const { isChatOpen, openChat, closeChat, activeConversation } = useChat();
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const specialFooterPages = [
    '/nha-tuyen-dung/dang-ky',
    '/nha-tuyen-dung/dang-ky/xac-nhan',
    '/nha-tuyen-dung/dang-ky/hoan-thanh',
  ];

  const needsFooterAvoidance = specialFooterPages.includes(pathname);

  useEffect(() => {
    if (!needsFooterAvoidance) {
      setIsFooterVisible(false);
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        setIsFooterVisible(entry.isIntersecting);
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, 
    });

    const footerElement = document.querySelector('.mobile-sticky-footer');
    if (footerElement) {
      observerRef.current.observe(footerElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname, needsFooterAvoidance]);


  const handleToggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat(); 
    }
  };
  
  return (
    <>
      {/* Mobile full-screen overlay & button */}
      <div className={cn(
        "md:hidden fixed right-6 z-50 transition-all duration-300",
        isFooterVisible ? 'bottom-28' : 'bottom-6'
      )}>
        {isChatOpen && activeConversation ? (
          <div className="fixed inset-0 bg-background">
            <ChatWindow conversation={activeConversation} />
          </div>
        ) : (
          <Button onClick={handleToggleChat} size="icon" className="h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90">
              <MessageSquare className="h-8 w-8" />
              <span className="sr-only">Mở Chat</span>
          </Button>
        )}
      </div>

      {/* Desktop floating window */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        {isChatOpen && activeConversation && (
          <Card className="h-[80vh] max-h-[800px] w-[400px] shadow-2xl flex flex-col overflow-hidden rounded-2xl">
            <ChatWindow conversation={activeConversation} />
          </Card>
        )}
        <div className="flex justify-end mt-2">
          <Button onClick={handleToggleChat} size="icon" className="h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90">
            {isChatOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
            <span className="sr-only">{isChatOpen ? "Đóng Chat" : "Mở Chat"}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
