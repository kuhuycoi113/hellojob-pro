
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Smartphone, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateShortVideoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for video
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Kích thước video không được vượt quá 50MB.',
        });
        return;
      }
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast({ variant: 'destructive', title: 'Vui lòng chọn một video.' });
      return;
    }
    if (!caption.trim()) {
      toast({ variant: 'destructive', title: 'Vui lòng nhập chú thích.' });
      return;
    }

    // Simulate form submission
    console.log({ caption, videoFile });

    toast({
      title: 'Đăng video thành công!',
      description: 'Video của bạn đã được gửi đi và đang chờ duyệt.',
      className: 'bg-green-500 text-white',
    });

    router.push('/handbook');
  };

  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24 flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
              <Smartphone className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Chia sẻ video ngắn</h1>
            <p className="text-muted-foreground mt-2">
              Ghi lại và chia sẻ những khoảnh khắc đáng nhớ của bạn với cộng đồng.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                <div className="w-full">
                    <Label htmlFor="video-upload" className="relative flex flex-col items-center justify-center w-full h-[480px] px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors bg-secondary/50">
                    {videoPreview ? (
                        <video
                          ref={videoRef}
                          src={videoPreview}
                          controls
                          className="w-full h-full object-contain rounded-md"
                          onMouseOver={e => e.currentTarget.play()}
                          onMouseOut={e => e.currentTarget.pause()}
                          muted
                          loop
                        />
                    ) : (
                        <div className="space-y-1 text-center">
                        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                            <p className="pl-1">Chọn video để tải lên</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Video dọc, tối đa 5 phút</p>
                        </div>
                    )}
                    <Input
                        id="video-upload"
                        type="file"
                        className="sr-only"
                        accept="video/mp4,video/quicktime,video/x-msvideo"
                        onChange={handleVideoChange}
                    />
                    </Label>
                </div>

                <div className="space-y-6 flex flex-col h-full">
                  <div className="space-y-2 flex-grow">
                    <Label htmlFor="caption" className="font-semibold">Chú thích</Label>
                    <Textarea
                      id="caption"
                      placeholder="Viết chú thích cho video của bạn..."
                      className="h-full min-h-[350px]"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">Đăng</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
