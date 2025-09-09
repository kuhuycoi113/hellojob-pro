
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, MessageSquare } from 'lucide-react';
import { ZaloIcon, MessengerIcon } from './custom-icons';

interface ConsultantSuggestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const consultants = [
  {
    name: 'Nguyễn Văn A',
    title: 'Chuyên gia tư vấn Tokutei',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'professional man portrait',
    successfulCandidates: 328,
  },
  {
    name: 'Trần Thị B',
    title: 'Chuyên gia tư vấn TTS',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'professional woman portrait',
    successfulCandidates: 250,
  },
  {
    name: 'Lê Văn C',
    title: 'Chuyên gia tư vấn Kỹ sư',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'experienced consultant portrait',
    successfulCandidates: 180,
  },
];

export function ConsultantSuggestionDialog({ isOpen, onClose }: ConsultantSuggestionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Yêu cầu hỗ trợ từ Chuyên gia HelloJob</DialogTitle>
          <DialogDescription>
            Liên hệ với một trong các chuyên gia của chúng tôi để được hỗ trợ tìm kiếm và giới thiệu ứng viên phù hợp nhất cho tin tuyển dụng của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {consultants.map((consultant) => (
            <Card key={consultant.name} className="text-center shadow-lg">
              <CardContent className="p-4">
                <Avatar className="h-20 w-20 mx-auto border-4 border-primary mb-3">
                  <AvatarImage src={consultant.avatarUrl} alt={consultant.name} data-ai-hint={consultant.dataAiHint} />
                  <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h4 className="font-bold text-lg">{consultant.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{consultant.title}</p>
                <p className="text-xs text-primary font-semibold">Đã hỗ trợ {consultant.successfulCandidates}+ ứng viên</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="icon" className="h-10 w-10 border-green-500 hover:bg-green-50">
                    <Phone className="h-5 w-5 text-green-500"/>
                  </Button>
                   <Button variant="outline" size="icon" className="h-10 w-10 border-blue-500 hover:bg-blue-50">
                    <ZaloIcon className="h-5 w-5"/>
                  </Button>
                   <Button variant="outline" size="icon" className="h-10 w-10 border-purple-500 hover:bg-purple-50">
                    <MessengerIcon className="h-5 w-5"/>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
