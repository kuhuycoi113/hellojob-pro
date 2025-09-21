
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Phone, Video, X, Paperclip, Image as ImageIcon } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { type Conversation, type Message, currentUser, type User, type Attachment, helloJobBot } from '@/lib/chat-data';
import { useChat } from '@/contexts/ChatContext';
import Link from 'next/link';
import Image from 'next/image';
import { VideoCallDialog } from '../video-call-dialog';
import { VoiceCallDialog } from '../voice-call-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const { sendMessage, closeChat, assignedConsultant } = useChat();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCallDialogOpen, setIsVideoCallDialogOpen] = useState(false);
  const [isVoiceCallDialogOpen, setIsVoiceCallDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const displayContact = assignedConsultant || conversation.participants.find(p => p.id !== currentUser.id) || helloJobBot;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleVideoCallClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        router.push(`/goi-video?redirect=${encodeURIComponent(pathname)}`);
    } else {
      e.preventDefault();
      setIsVideoCallDialogOpen(true);
    }
  };

  const handleVoiceCallClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        router.push(`/goi-thoai?redirect=${encodeURIComponent(pathname)}`);
    } else {
      e.preventDefault();
      setIsVoiceCallDialogOpen(true);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const MAX_IMAGES = 50;
    const MAX_VIDEOS = 20;
    const MAX_IMAGE_SIZE_MB = 3;
    const MAX_VIDEO_SIZE_MB = 200;
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));

    if (imageFiles.length > MAX_IMAGES) {
        toast({ variant: 'destructive', title: 'Lỗi tải lên', description: `Bạn chỉ có thể gửi tối đa ${MAX_IMAGES} ảnh một lần.` });
        return;
    }
    if (videoFiles.length > MAX_VIDEOS) {
        toast({ variant: 'destructive', title: 'Lỗi tải lên', description: `Bạn chỉ có thể gửi tối đa ${MAX_VIDEOS} video một lần.` });
        return;
    }

    const allFiles = [...imageFiles, ...videoFiles];

    for (const file of allFiles) {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
            toast({ variant: 'destructive', title: 'Ảnh quá lớn', description: `Ảnh "${file.name}" vượt quá giới hạn ${MAX_IMAGE_SIZE_MB}MB.` });
            continue; // Skip this file
        }
        if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
            toast({ variant: 'destructive', title: 'Video quá lớn', description: `Video "${file.name}" vượt quá giới hạn ${MAX_VIDEO_SIZE_MB}MB.` });
            continue; // Skip this file
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const attachment: Attachment = {
                type: isImage ? 'image' : 'video',
                url: e.target?.result as string,
                fileName: file.name
            };
            sendMessage('', attachment);
        };
        reader.readAsDataURL(file);
    }
    
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-secondary">
        {/* Header */}
        <header className="flex items-center gap-3 p-3 border-b bg-primary text-primary-foreground shadow-md flex-shrink-0">
          <div className="flex-shrink-0">
             {/* CHATAVATAR1 */}
             <Avatar className="h-10 w-10 border-2 border-white bg-white">
                <AvatarImage src="/img/favi2.png" alt="HelloJob AI" />
                <AvatarFallback>HJ</AvatarFallback>
              </Avatar>
          </div>

          <div>
             <div className="flex items-center gap-2">
                 {/* CHATNAME1 */}
                 <p className="text-sm font-bold font-headline leading-tight">HelloJob</p>
                 <div className="w-2 h-2 rounded-full bg-green-400"></div>
             </div>
            <p className="text-xs text-primary-foreground/80 font-semibold">Đang hoạt động</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20" onClick={handleVoiceCallClick}>
                <Phone />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20" onClick={handleVideoCallClick}>
                <Video />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20" onClick={closeChat}><X /></Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {conversation.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} currentUser={currentUser} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <footer className="p-4 border-t bg-background flex-shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <input 
              type="file" 
              ref={imageInputRef} 
              className="hidden" 
              onChange={handleImageChange}
              accept="image/*,video/*"
              multiple
            />
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" onClick={handleFileButtonClick}><Paperclip /></Button>
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" onClick={handleImageButtonClick}><ImageIcon /></Button>
            </div>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập câu hỏi của bạn ở đây..."
              className="flex-grow rounded-full pl-4 pr-12 h-12 bg-secondary"
            />
            <Button type="submit" size="icon" className="absolute right-2 h-9 w-9 bg-primary rounded-full">
              <Send className="h-5 w-5"/>
            </Button>
          </form>
        </footer>
      </div>
      <VideoCallDialog isOpen={isVideoCallDialogOpen} onClose={() => setIsVideoCallDialogOpen(false)} />
      <VoiceCallDialog isOpen={isVoiceCallDialogOpen} onClose={() => setIsVoiceCallDialogOpen(false)} />
    </>
  );
}
