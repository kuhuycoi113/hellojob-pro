
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Conversation, Message, User, conversations, currentUser, helloJobBot, Attachment } from '@/lib/chat-data';
import { consultants } from "@/lib/consultant-data";
import { recommendJobs, type JobRecommendationResponse } from '@/ai/flows/recommend-jobs-flow';

interface ChatContextType {
  isChatOpen: boolean;
  activeConversation: Conversation | null;
  assignedConsultant: User | null;
  openChat: (user?: User) => void;
  closeChat: () => void;
  sendMessage: (text: string, attachment?: Attachment) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [assignedConsultant, setAssignedConsultant] = useState<User | null>(null);

  useEffect(() => {
    // Assign a random consultant on initial load if one isn't already assigned
    const consultantId = localStorage.getItem('assignedConsultantId');
    let consultant = null;
    if (consultantId) {
        consultant = consultants.find(c => c.id === consultantId) || null;
    }
    
    if (!consultant) {
        consultant = consultants[Math.floor(Math.random() * consultants.length)];
        localStorage.setItem('assignedConsultantId', consultant.id);
    }
    setAssignedConsultant(consultant);

    // Initialize the default conversation with the bot/assigned consultant
     const botConversation = conversations.find(c => c.id === 'convo-bot-hellojob');
     if (botConversation && consultant && botConversation.messages.length === 0) {
       botConversation.messages.push({
         id: 'msg-bot-welcome',
         sender: consultant,
         text: `Chào bạn, tôi là ${consultant.name}, tư vấn viên của HelloJob. Tôi có thể giúp gì cho bạn?`,
         timestamp: new Date().toISOString(),
       });
     }

  }, []);

  const openChat = (user?: User) => {
    // If a specific user (consultant) is provided, open chat with them.
    // Otherwise, default to the globally assigned consultant or the bot.
    const targetUser = user || assignedConsultant || helloJobBot;
    
    let conversation = conversations.find(c => c.participants.some(p => p.id === targetUser.id));
    
    // If no conversation exists for this target user, create a new one.
    if (!conversation) {
        const initialMessage = `Chào bạn, tôi là ${targetUser.name}, tư vấn viên của HelloJob. Tôi có thể giúp gì cho bạn?`;
        
        conversation = {
            id: `convo-${targetUser.id}`,
            participants: [currentUser, targetUser],
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: targetUser,
                    text: initialMessage,
                    timestamp: new Date().toISOString()
                }
            ]
        }
        // Add the new conversation to the list if it's not already there
        if (!conversations.some(c => c.id === conversation!.id)) {
            conversations.push(conversation);
        }
    }
    
    setActiveConversation(conversation);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    // We don't nullify activeConversation so the state is preserved if the user re-opens
  };

  const sendMessage = async (text: string, attachment?: Attachment) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      text: text,
      timestamp: new Date().toISOString(),
      attachment: attachment,
    };

    const updatedConversation = { 
        ...activeConversation, 
        messages: [...activeConversation.messages, newMessage] 
    };
    setActiveConversation(updatedConversation);
    
    const convoIndex = conversations.findIndex(c => c.id === activeConversation.id);
    if(convoIndex !== -1) {
        conversations[convoIndex] = updatedConversation;
    }

    // AI logic is removed. The conversation now waits for a real person to reply.
  };

  const value = {
    isChatOpen,
    activeConversation,
    assignedConsultant,
    openChat,
    closeChat,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
