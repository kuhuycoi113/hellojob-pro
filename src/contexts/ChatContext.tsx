
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Conversation, Message, User, conversations, getCurrentUser, helloJobBot, Attachment } from '@/lib/chat-data';
import { consultants } from "@/lib/consultant-data";
import { recommendJobs, type JobRecommendationResponse } from '@/ai/flows/recommend-jobs-flow';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/lib/mock-data';

interface ChatContextType {
  isChatOpen: boolean;
  activeConversation: Conversation | null;
  assignedConsultant: User | null;
  openChat: (user?: User, job?: Job, initialMessage?: string) => void;
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
  const { role } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [assignedConsultant, setAssignedConsultant] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    // Predictable random assignment based on user ID
    // This ensures a user always gets the same consultant, but different users get different ones.
    const userIdNumber = parseInt(currentUser.id.replace(/[^0-9]/g, ''), 10) || 0;
    const consultantIndex = userIdNumber % consultants.length;
    const consultant = consultants[consultantIndex];
    setAssignedConsultant(consultant);

    const botConversation = conversations.find(c => c.id === 'convo-bot-hellojob');
    if (botConversation) {
        // Clear previous welcome messages to regenerate with the correct consultant
        botConversation.messages = botConversation.messages.filter(m => m.id !== 'msg-bot-welcome');
        
        // Add the new welcome message if it doesn't exist
        if (botConversation.messages.length === 0) {
            botConversation.messages.push({
                id: 'msg-bot-welcome',
                sender: consultant,
                text: `Chào bạn, tôi là ${consultant.name}, tư vấn viên của HelloJob. Tôi có thể giúp gì cho bạn?`,
                timestamp: new Date().toISOString(),
            });
        }
    }
  }, [role]); // Rerun this logic when the role (and thus currentUser) changes

  const openChat = (user?: User, job?: Job, initialMessage?: string) => {
    const currentUser = getCurrentUser();
    const targetUser = user || assignedConsultant || helloJobBot;
    
    let conversation = conversations.find(c => c.participants.some(p => p.id === targetUser.id));
    
    if (!conversation) {
        const initialBotMessage = `Chào bạn, tôi là ${targetUser.name}, tư vấn viên của HelloJob. Tôi có thể giúp gì cho bạn?`;
        
        conversation = {
            id: `convo-${targetUser.id}`,
            participants: [currentUser, targetUser],
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: targetUser,
                    text: initialBotMessage,
                    timestamp: new Date().toISOString()
                }
            ]
        }
        if (!conversations.some(c => c.id === conversation!.id)) {
            conversations.push(conversation);
        }
    }

    // If a job is passed, send the job card and initial message
    if (job) {
        const jobMessage: Message = {
            id: `msg-job-${Date.now()}`,
            sender: currentUser,
            text: '',
            timestamp: new Date().toISOString(),
            job: job, // Attach the job object
        };

        const textMessage: Message = {
            id: `msg-text-${Date.now()}`,
            sender: currentUser,
            text: initialMessage || 'Cho mình hỏi về việc làm này.',
            timestamp: new Date().toISOString(),
        };
        
        conversation.messages.push(jobMessage, textMessage);
    }
    
    setActiveConversation(conversation);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const sendMessage = async (text: string, attachment?: Attachment) => {
    if (!activeConversation) return;
    const currentUser = getCurrentUser();

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
