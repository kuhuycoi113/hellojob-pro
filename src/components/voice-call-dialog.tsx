
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, PhoneOff, User, Volume2, AlertTriangle, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface VoiceCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCallDialog({ isOpen, onClose }: VoiceCallDialogProps) {
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      return;
    }

    const getMediaPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setHasPermission(true);
      } catch (error) {
        console.error('Error accessing mic:', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Quyền truy cập bị từ chối',
          description: 'Vui lòng cấp quyền truy cập micro trong cài đặt trình duyệt.',
          duration: 5000,
        });
      }
    };

    getMediaPermissions();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [isOpen, toast]);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(prev => !prev);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8 bg-slate-800 text-white border-slate-700">
        <DialogHeader className="text-center space-y-4">
          <Avatar className="h-24 w-24 mx-auto border-4 border-slate-600">
            <AvatarImage src="https://placehold.co/100x100.png" alt="Consultant" />
            <AvatarFallback>TV</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
             <DialogTitle className="font-headline text-2xl">Đang gọi Tư vấn viên...</DialogTitle>
             <DialogDescription className="text-slate-400">Cuộc gọi sẽ được ghi âm để cải thiện chất lượng dịch vụ.</DialogDescription>
          </div>
        </DialogHeader>
        
        {hasPermission === false && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertTitle>Lỗi Micro</AlertTitle>
                <AlertDescription>
                   Không thể truy cập micro. Vui lòng kiểm tra lại quyền truy cập.
                </AlertDescription>
            </Alert>
        )}

        <DialogFooter className="flex-row items-center justify-center gap-4 pt-6 sm:justify-center">
            <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full bg-slate-700/80 hover:bg-slate-700" onClick={toggleMic}>
                {isMicMuted ? <MicOff className="h-7 w-7"/> : <Mic className="h-7 w-7"/>}
            </Button>
            <Button variant="destructive" size="icon" className="h-16 w-16 rounded-full" onClick={onClose}>
                <PhoneOff className="h-7 w-7"/>
            </Button>
            <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full bg-slate-700/80 hover:bg-slate-700">
                <Volume2 className="h-7 w-7"/>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
