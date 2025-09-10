
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send } from 'lucide-react';
import { AuthDialog } from '../auth-dialog';

type Comment = {
  id: number;
  author: {
    name: string;
    avatar: string;
    dataAiHint: string;
  };
  text: string;
  timestamp: string;
  replies?: Comment[];
};

const mockComments: Comment[] = [
  {
    id: 1,
    author: {
      name: 'Trần Văn Mạnh',
      avatar: 'https://placehold.co/100x100.png?text=M',
      dataAiHint: 'male portrait',
    },
    text: 'Bài viết rất hữu ích, cảm ơn HelloJob đã chia sẻ. Mình sắp sang Nhật theo diện Tokutei ngành thực phẩm, đọc bài này thấy tự tin hơn hẳn.',
    timestamp: '2 giờ trước',
    replies: [
      {
        id: 3,
        author: {
          name: 'HelloJob Team',
          avatar: '/img/favi2.png',
          dataAiHint: 'company logo',
        },
        text: 'Cảm ơn bạn đã tin tưởng. Chúc bạn có một hành trình thuận lợi và thành công tại Nhật Bản nhé!',
        timestamp: '1 giờ trước',
      },
    ],
  },
  {
    id: 2,
    author: {
      name: 'Lê Thị An',
      avatar: 'https://placehold.co/100x100.png?text=A',
      dataAiHint: 'female portrait',
    },
    text: 'Cho mình hỏi, thực tập sinh đã hoàn thành 3 năm về nước thì có được miễn thi tay nghề khi chuyển sang Tokutei cùng ngành không ạ?',
    timestamp: '5 giờ trước',
  },
];

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} data-ai-hint={comment.author.dataAiHint}/>
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <div className="bg-secondary p-3 rounded-lg">
            <p className="font-semibold text-sm">{comment.author.name}</p>
            <p className="text-sm text-muted-foreground">{comment.text}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {comment.timestamp}
        </p>
        {comment.replies && (
          <div className="mt-4 space-y-4 pl-8 border-l ml-4">
            {comment.replies.map(reply => <CommentItem key={reply.id} comment={reply} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentSection = () => {
    const { role } = useAuth();
    const isLoggedIn = role === 'candidate';
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState('');
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newCommentData: Comment = {
            id: Date.now(),
            author: { name: 'Lê Ngọc Hân', avatar: 'https://placehold.co/100x100.png', dataAiHint: 'user avatar' },
            text: newComment,
            timestamp: 'Vừa xong',
        };
        
        setComments(prev => [newCommentData, ...prev]);
        setNewComment('');
    };

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="px-0">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                    <MessageSquare className="h-6 w-6"/> Thảo luận ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="space-y-6">
                    {isLoggedIn ? (
                         <form onSubmit={handleCommentSubmit} className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow relative">
                                <Textarea 
                                    placeholder="Viết bình luận của bạn..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="pr-12"
                                />
                                <Button type="submit" size="icon" className="absolute top-2 right-2 h-8 w-8">
                                    <Send className="h-4 w-4"/>
                                </Button>
                            </div>
                        </form>
                    ): (
                        <div 
                            className="p-4 border rounded-lg text-center bg-secondary cursor-pointer hover:border-primary"
                            onClick={() => setIsAuthDialogOpen(true)}
                        >
                            <p className="text-muted-foreground">
                                <span className="font-semibold text-primary">Đăng nhập</span> để tham gia thảo luận
                            </p>
                        </div>
                    )}
                   

                    <div className="space-y-6">
                        {comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>
            </CardContent>
            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </Card>
    )
}
