
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Conversation, Message, User, conversations, currentUser, helloJobBot, consultants, Attachment } from '@/lib/chat-data';
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
        const initialMessage = `Chào bạn, tôi là ${targetUser.name}, tư vấn viên của HelloJob. Tôi có thể giúp gì cho bạn?`;
        
        conversation = {
            id: `convo-${targetUser.id}`,
            participants: [currentUser, targetUser],
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: helloJobBot, // The first message is always from the bot system
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

    if (text) {
        // Simple greeting detection
        const lowerCaseText = text.toLowerCase().trim();
        const greetings = ['chào', 'hello', 'hi', 'xin chào'];
        if (greetings.some(greeting => lowerCaseText.startsWith(greeting))) {
            const greetingResponse: Message = {
                id: `msg-greeting-${Date.now()}`,
                sender: helloJobBot,
                text: 'Chào bạn, HelloJob có thể giúp gì cho bạn hôm nay?',
                timestamp: new Date().toISOString(),
                 suggestedReplies: ["Tôi muốn tìm việc", "Tôi cần tư vấn", "Tôi muốn xem lại hồ sơ"]
            };
            setActiveConversation(prev => prev ? { ...prev, messages: [...prev.messages, greetingResponse] } : null);
            return;
        }


        const loadingMessage: Message = {
            id: `msg-loading-${Date.now()}`,
            sender: helloJobBot,
            text: '...',
            isLoading: true,
            timestamp: new Date().toISOString(),
        };
        setActiveConversation(prev => prev ? { ...prev, messages: [...prev.messages, loadingMessage] } : null);

        try {
            const aiResult = await recommendJobs(text);
            const aiResponseMessage: Message = {
                id: `msg-ai-${Date.now()}`,
                sender: helloJobBot,
                text: aiResult.message,
                recommendations: aiResult.recommendations,
                suggestedReplies: aiResult.suggestedReplies || [],
                timestamp: new Date().toISOString(),
            };

            setActiveConversation(prev => {
                if (!prev) return null;
                const filteredMessages = prev.messages.filter(m => !m.isLoading);
                const newMessages = [...filteredMessages, aiResponseMessage];
                const newConvo = { ...prev, messages: newMessages };
                
                const idx = conversations.findIndex(c => c.id === newConvo.id);
                if (idx !== -1) conversations[idx] = newConvo;

                return newConvo;
            });

        } catch (error) {
             console.error("AI Recommendation Error:", error);
             const errorMessage: Message = {
                id: `msg-error-${Date.now()}`,
                sender: helloJobBot,
                text: 'Rất tiếc, đã có lỗi xảy ra khi tìm kiếm việc làm. Bạn có muốn kết nối với một tư vấn viên không?',
                timestamp: new Date().toISOString(),
             };
             setActiveConversation(prev => {
                if (!prev) return null;
                const filteredMessages = prev.messages.filter(m => !m.isLoading);
                const newMessages = [...filteredMessages, errorMessage];
                const newConvo = { ...prev, messages: newMessages };
                
                const idx = conversations.findIndex(c => c.id === newConvo.id);
                if (idx !== -1) conversations[idx] = newConvo;

                return newConvo;
            });
        }
    } else if (attachment) {
        // Simulate human consultant response for file uploads
        setTimeout(() => {
            const responseText = `Đã nhận được tệp: ${attachment.fileName}`;

            const consultantResponse: Message = {
                id: `msg-${Date.now() + 1}`,
                sender: helloJobBot,
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
