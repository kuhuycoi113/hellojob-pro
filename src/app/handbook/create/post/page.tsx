
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send, Lightbulb, Pencil, MessageCircleQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const inspirationPrompts = [
  {
    icon: MessageCircleQuestion,
    title: 'Chia sẻ một trải nghiệm cá nhân',
    description: 'Kể về một thử thách bạn đã vượt qua, một câu chuyện thành công, hoặc một khoảnh khắc hài hước trong thời gian ở Nhật.',
  },
  {
    icon: Lightbulb,
    title: 'Đưa ra lời khuyên',
    description: 'Chia sẻ mẹo về việc tìm nhà, tiết kiệm tiền, học tiếng Nhật, hoặc bất cứ điều gì có thể giúp ích cho người khác.',
  },
  {
    icon: Pencil,
    title: 'Đặt một câu hỏi',
    description: 'Bắt đầu một cuộc thảo luận bằng cách hỏi cộng đồng về ý kiến hoặc lời khuyên của họ về một chủ đề nào đó.',
  },
];

export default function CreateTextPostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title.trim() || !content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Vui lòng điền đầy đủ thông tin',
        description: 'Chuyên mục, tiêu đề, và nội dung không được để trống.',
      });
      return;
    }

    console.log({ category, title, content });

    toast({
      title: 'Gửi bài viết thành công!',
      description: 'Cảm ơn bạn đã đóng góp. Bài viết của bạn sẽ được kiểm duyệt trước khi đăng.',
      className: 'bg-green-500 text-white',
    });

    router.push('/handbook');
  };

  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold font-headline">Chia sẻ bài viết của bạn</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Đóng góp kiến thức và kinh nghiệm của bạn cho cộng đồng. Bài viết sẽ được kiểm duyệt trước khi đăng.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-semibold">Chuyên mục</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">Tiêu đề</Label>
                    <Input
                      id="title"
                      placeholder="Nhập một tiêu đề hấp dẫn cho bài viết của bạn"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="font-semibold">Nội dung</Label>
                    <Textarea
                      id="content"
                      placeholder="Viết câu chuyện của bạn ở đây..."
                      rows={15}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="lg">Gửi bài viết</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Bạn cần cảm hứng?</CardTitle>
                <CardDescription>Dưới đây là một vài ý tưởng để bạn bắt đầu:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {inspirationPrompts.map((prompt) => (
                  <div key={prompt.title} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                       <prompt.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{prompt.title}</h4>
                      <p className="text-sm text-muted-foreground">{prompt.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
