
'use client';

import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/lib/chat-data';
import { getCurrentUser } from '@/lib/chat-data';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  const currentUser = getCurrentUser();
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h2 className="text-xl font-bold font-headline">Tin nhắn</h2>
        <Input placeholder="Tìm kiếm trong Messenger..." className="mt-4" />
      </header>
      <div className="flex-grow overflow-y-auto">
        {conversations.map((convo) => {
          const otherUser = convo.participants.find(p => p.id !== currentUser.id)!;
          const lastMessage = convo.messages[convo.messages.length - 1];
          return (
            <button
              key={convo.id}
              onClick={() => onSelectConversation(convo)}
              className={cn(
                'flex items-center gap-3 p-3 w-full text-left transition-colors',
                selectedConversation?.id === convo.id
                  ? 'bg-primary/10'
                  : 'hover:bg-secondary'
              )}
            >
              <Avatar className="h-14 w-14">
                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate">{otherUser.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
