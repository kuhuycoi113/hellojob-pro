
'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message, User } from '@/lib/chat-data';
import { jobData } from '@/lib/mock-data';
import { JobCard } from '../job-card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '../ui/button';

interface ChatMessageProps {
  message: Message;
  currentUser: User;
}

export function ChatMessage({ message, currentUser }: ChatMessageProps) {
  const { assignedConsultant, sendMessage } = useChat();
  const isCurrentUser = message.sender.id === currentUser.id;
  
  // If the message is from the bot, display the assigned consultant's info instead.
  const displayUser = !isCurrentUser 
    ? (message.sender.isBot ? (assignedConsultant || message.sender) : message.sender)
    : message.sender;
    
  const isWelcomeMessage = message.id === 'msg-bot-welcome';

  const recommendedJobs = message.recommendations
    ? message.recommendations
        .map(rec => jobData.find(job => job.id === rec.id))
        .filter((job): job is NonNullable<typeof job> => job !== undefined)
    : [];

  const handleSuggestedReplyClick = (reply: string) => {
    sendMessage(reply);
  };


  if (message.isLoading) {
    return (
        <div className="flex items-start gap-2 justify-start">
            <Avatar className="h-8 w-8">
                <AvatarImage src={displayUser.avatarUrl || undefined} alt={displayUser.name} />
                <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                 <p className="text-xs text-muted-foreground mb-1 ml-3">
                    <Link href={`/tu-van-vien/${displayUser.id}`} className="hover:underline hover:text-primary">
                        Tư vấn viên {displayUser.name}
                    </Link>
                </p>
                <div className="bg-background rounded-2xl rounded-bl-none px-4 py-2 border flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground italic">AI đang tìm kiếm...</span>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
      {!isCurrentUser && (
        <Avatar id="AVATARCHAT01" className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={displayUser.avatarUrl || undefined} alt={displayUser.name} />
            <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1 items-start" style={{ maxWidth: 'calc(100% - 40px)' }}>
        {!isCurrentUser && (
            <p className="text-xs text-muted-foreground ml-3">
                <Link id="TUVANVIENCHAT01" href={`/tu-van-vien/${displayUser.id}`} className="hover:underline hover:text-primary">
                    Tư vấn viên {displayUser.name}
                </Link>
            </p>
        )}

        {message.attachment ? (
             <div className={cn(
                'w-48 rounded-2xl overflow-hidden',
                 isCurrentUser ? 'self-end rounded-br-none' : 'rounded-bl-none'
             )}>
                {message.attachment.type === 'image' && (
                    <Image src={message.attachment.url} alt={message.attachment.fileName || 'Attachment'} width={200} height={200} className="object-cover w-full h-auto"/>
                )}
                 {message.attachment.type === 'video' && (
                    <video src={message.attachment.url} controls className="w-full h-auto" />
                )}
             </div>
        ) : (
            <div
                className={cn(
                'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 w-fit',
                isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none self-end'
                    : 'bg-background rounded-bl-none border'
                )}
            >
                <p id={isWelcomeMessage ? "CAUCHAOCHAT01" : undefined} className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
        )}

        {recommendedJobs.length > 0 && (
            <div className="w-full max-w-xs md:max-w-sm flex-shrink-0 mt-1">
                <div className="space-y-2">
                {recommendedJobs.map((job, index) => {
                    const reason = message.recommendations?.[index]?.reason;
                    return (
                        <div key={job.id}>
                            {reason && <p className="text-xs text-muted-foreground font-semibold mb-1 ml-2">✨ {reason}</p>}
                            <JobCard job={job} variant="chat" />
                        </div>
                    )
                })}
                </div>
            </div>
        )}

        {!isCurrentUser && message.suggestedReplies && message.suggestedReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 ml-3">
                {message.suggestedReplies.map((reply, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                        onClick={() => handleSuggestedReplyClick(reply)}
                    >
                        {reply}
                    </Button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
