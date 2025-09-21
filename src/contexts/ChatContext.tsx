
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
  }, []);

  const openChat = (user?: User) => {
    let targetUser = user || assignedConsultant || helloJobBot;
    
    let conversation = conversations.find(c => c.participants.some(p => p.id === targetUser.id));
    
    if (!conversation) {
        // Use the target user (consultant) as the sender of the initial message
        const initialMessage = `Chào bạn, tôi là ${targetUser.name}, tư vấn viên của HelloJob. Tôi có thể giúp gì cho bạn?`;
        
        conversation = {
            id: `convo-${targetUser.id}`,
            participants: [currentUser, targetUser],
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: targetUser, // The sender is now the consultant
                    text: initialMessage,
                    timestamp: new Date().toISOString()
                }
            ]
        }
        if (!conversations.some(c => c.id === conversation!.id)) {
            conversations.push(conversation);
        }
    }
    
    setActiveConversation(conversation);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setActiveConversation(null);
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

    if (attachment) {
        // Simulate human consultant response for file uploads for demo purposes
        setTimeout(() => {
            const responseText = `Đã nhận được tệp: ${attachment.fileName}`;

            const consultantResponse: Message = {
                id: `msg-${Date.now() + 1}`,
                sender: assignedConsultant || helloJobBot,
                text: responseText,
                timestamp: new Date().toISOString(),
            };
            
            setActiveConversation(prev => {
                if (!prev) return null;
                const latestMessages = [...prev.messages, consultantResponse];
                const latestConvo = { ...prev, messages: latestMessages };
                
                const idx = conversations.findIndex(c => c.id === latestConvo.id);
                if(idx !== -1) conversations[idx] = latestConvo;

                return latestConvo;
            });

        }, 1500);
    }
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
