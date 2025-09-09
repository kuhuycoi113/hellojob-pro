
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, PhoneOff, Video as VideoIcon, VideoOff, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoCallDialog({ isOpen, onClose }: VideoCallDialogProps) {
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Stop media tracks when dialog is closed
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      return;
    }

    const getMediaPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (error) {
        console.error('Error accessing camera/mic:', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Quyền truy cập bị từ chối',
          description: 'Vui lòng cấp quyền truy cập camera và micro trong cài đặt trình duyệt.',
          duration: 5000,
        });
      }
    };

    getMediaPermissions();

    // Cleanup on component unmount (though the dialog closing handles it too)
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

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(prev => !prev);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 bg-black text-white border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Video Call</DialogTitle>
        </DialogHeader>
        <div className="relative h-[80vh]">
           {/* Remote participant video (placeholder) */}
            <Image
              src="https://placehold.co/1920x1080.png?text=Consultant"
              alt="Remote participant"
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="video call participant"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* User video preview */}
            <div className="absolute bottom-6 right-6">
                <Card className="h-40 w-60 overflow-hidden border-2 border-primary shadow-lg bg-black">
                    <video ref={userVideoRef} className="h-full w-full object-cover" autoPlay muted />
                </Card>
            </div>
             {hasPermission === false && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Lỗi Camera/Micro</AlertTitle>
                        <AlertDescription>
                           Không thể truy cập camera. Vui lòng kiểm tra lại quyền truy cập.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
        <DialogFooter className="flex-row items-center justify-center gap-4 p-4 bg-black/80 sm:justify-center">
            <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={toggleMic}>
                {isMicMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={toggleVideo}>
                {isVideoOff ? <VideoOff /> : <VideoIcon />}
            </Button>
            <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={onClose}>
                <PhoneOff />
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
