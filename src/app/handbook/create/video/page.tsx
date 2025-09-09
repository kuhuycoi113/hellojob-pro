
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateVideoPostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setFileName(file.name);
      toast({
        title: 'Tệp đã được chọn',
        description: file.name,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast({ variant: 'destructive', title: 'Vui lòng chọn một video.' });
      return;
    }
    if (!title.trim()) {
      toast({ variant: 'destructive', title: 'Vui lòng nhập tiêu đề.' });
      return;
    }
    if (!category) {
        toast({ variant: 'destructive', title: 'Vui lòng chọn danh mục.' });
        return;
    }

    // Simulate form submission
    console.log({ title, description, category, videoFile });

    toast({
      title: 'Tải lên thành công!',
      description: 'Video của bạn đã được gửi đi và đang chờ xử lý.',
      className: 'bg-green-500 text-white',
    });

    router.push('/handbook');
  };

  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
             <div className="inline-block bg-red-100 p-4 rounded-full mb-4">
              <Film className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Chia sẻ video dài</h1>
            <p className="text-muted-foreground mt-2">
              Đóng góp các video chuyên sâu, phỏng vấn hoặc vlog của bạn cho cộng đồng.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Label
                    htmlFor="video-upload-long"
                    className="relative block w-full h-64 px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                      <UploadCloud className="w-12 h-12 text-muted-foreground" />
                      <p className="font-semibold text-foreground">
                        {fileName || 'Kéo và thả tệp video để tải lên'}
                      </p>
                      <p className="text-sm text-muted-foreground">Video của bạn sẽ được hiển thị ở chế độ công khai.</p>
                      <Button type="button" variant="outline" asChild>
                         <label htmlFor="video-upload-long-btn" className="cursor-pointer">
                            Chọn tệp
                            <input
                                id="video-upload-long-btn"
                                type="file"
                                className="sr-only"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                         </label>
                      </Button>
                    </div>
                     <Input
                        id="video-upload-long"
                        type="file"
                        className="opacity-0 w-full h-full absolute inset-0 cursor-pointer"
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                  </Label>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold font-headline">Chi tiết</h3>
                     <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề (bắt buộc)</Label>
                        <Input
                            id="title"
                            placeholder="Thêm tiêu đề để mô tả video của bạn"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Cho người xem biết về video của bạn"
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Danh mục</Label>
                         <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Chọn một chuyên mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kinh-nghiem-phong-van">Kinh nghiệm phỏng vấn</SelectItem>
                                <SelectItem value="cuoc-song-o-nhat">Cuộc sống ở Nhật</SelectItem>
                                <SelectItem value="thu-tuc-visa">Thủ tục & Visa</SelectItem>
                                <SelectItem value="khac">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg">Đăng</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
