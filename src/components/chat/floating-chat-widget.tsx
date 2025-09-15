
'use client';

import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChatWindow } from './chat-window';
import { conversations, helloJobBot, currentUser } from '@/lib/chat-data';

export function FloatingChatWidget() {
  const { isChatOpen, openChat, closeChat, activeConversation } = useChat();

  const handleToggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      // Always open the chat with the bot by default
      openChat(); 
    }
  };
  
  return (
    <>
      {/* Mobile full-screen overlay & button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        {isChatOpen && activeConversation && (
          <div className="fixed inset-0 bg-background">
            <ChatWindow conversation={activeConversation} />
          </div>
        )}
        <Button onClick={handleToggleChat} size="icon" className="h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90">
            {isChatOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
            <span className="sr-only">{isChatOpen ? "Đóng Chat" : "Mở Chat"}</span>
        </Button>
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
