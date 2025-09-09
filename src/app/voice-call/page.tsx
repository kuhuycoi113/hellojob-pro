
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, PhoneOff, User, Volume2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSearchParams, useRouter } from 'next/navigation';


export default function VoiceCallPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('Đang kết nối...');
  const streamRef = useRef<MediaStream | null>(null);
  
  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    const getMediaPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setHasPermission(true);
        setCallStatus('Đang gọi...');
      } catch (error) {
        console.error('Error accessing mic:', error);
        setHasPermission(false);
        setCallStatus('Lỗi kết nối');
        toast({
          variant: 'destructive',
          title: 'Quyền truy cập bị từ chối',
          description: 'Vui lòng cấp quyền truy cập micro trong cài đặt trình duyệt.',
          duration: 5000,
        });
      }
    };

    getMediaPermissions();

    // Cleanup function to stop media tracks when component unmounts
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [toast]);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(prev => !prev);
    }
  };

  const handleEndCall = () => {
    router.push(redirectPath);
  };


  return (
    <div className="flex h-screen w-full flex-col bg-slate-900 text-white justify-between">
       {/* Header with status */}
       <header className="text-center p-6">
         <p className="text-lg text-slate-300">{callStatus}</p>
       </header>

      {/* Main Call area */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
           <Avatar className="h-40 w-40 border-4 border-slate-700">
            <AvatarImage src="https://placehold.co/200x200.png" alt="Consultant" data-ai-hint="consultant portrait" />
            <AvatarFallback>TV</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-slate-700 p-2 rounded-full border-4 border-slate-900">
             <Avatar className="h-12 w-12">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>B</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Tư vấn viên HelloJob</h1>
        <p className="text-slate-400 mt-1">Chuyên gia tư vấn việc làm</p>

        {hasPermission === false && (
            <div className="mt-6">
                <Alert variant="destructive" className="max-w-md bg-red-900/50 border-red-500/50 text-white">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertTitle>Lỗi Micro</AlertTitle>
                    <AlertDescription>
                       Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập.
                    </AlertDescription>
                </Alert>
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-6">
        <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full bg-slate-700/80 hover:bg-slate-700" onClick={toggleMic}>
            {isMicMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
        </Button>
        <Button onClick={handleEndCall} variant="destructive" size="icon" className="h-16 w-16 rounded-full">
            <PhoneOff className="h-7 w-7" />
        </Button>
         <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full bg-slate-700/80 hover:bg-slate-700">
            <Volume2 className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
