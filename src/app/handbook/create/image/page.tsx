
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateImagePostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Kích thước tệp không được vượt quá 10MB.',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({ variant: 'destructive', title: 'Vui lòng chọn một hình ảnh.' });
      return;
    }
    if (!title.trim()) {
      toast({ variant: 'destructive', title: 'Vui lòng nhập tiêu đề.' });
      return;
    }

    // Simulate form submission
    console.log({ title, caption, imageFile });

    toast({
      title: 'Đăng bài thành công!',
      description: 'Bài viết của bạn đã được gửi đi và đang chờ duyệt.',
      className: 'bg-green-500 text-white',
    });

    router.push('/cam-nang');
  };

  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-100 p-4 rounded-full mb-4">
              <ImageIcon className="h-10 w-10 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Chia sẻ bài viết ảnh</h1>
            <p className="text-muted-foreground mt-2">
              Một hình ảnh đáng giá ngàn lời nói. Hãy chia sẻ khoảnh khắc của bạn với cộng đồng.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Hình ảnh</Label>
                  <div className="mt-2">
                    <Label
                      htmlFor="image-upload"
                      className="relative flex justify-center w-full h-64 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors"
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Xem trước ảnh"
                          fill
                          className="object-contain rounded-md"
                        />
                      ) : (
                        <div className="space-y-1 text-center">
                          <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div className="flex text-sm text-muted-foreground">
                            <p className="pl-1">Nhấp hoặc kéo thả file vào đây để tải lên</p>
                          </div>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF lên đến 10MB</p>
                        </div>
                      )}
                       <Input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleImageChange}
                      />
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    placeholder="Thêm tiêu đề cho ảnh của bạn"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Chú thích</Label>
                  <Textarea
                    id="caption"
                    placeholder="Viết chú thích ở đây..."
                    rows={5}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg">Đăng bài</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
