
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquareWarning, Send, Bug, Lightbulb, MessageSquarePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Vui lòng nhập nội dung góp ý',
        description: 'Nội dung góp ý không được để trống.',
      });
      return;
    }

    console.log({ feedbackType, feedbackText, email });

    toast({
      title: 'Gửi góp ý thành công!',
      description: 'Cảm ơn bạn đã đóng góp ý kiến để cải thiện HelloJob.',
      className: 'bg-green-500 text-white',
    });

    // Reset form and redirect
    setFeedbackText('');
    setEmail('');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <MessageSquareWarning className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-4xl">Gửi góp ý</CardTitle>
              <CardDescription className="!mt-3 text-lg">
                Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện sản phẩm và dịch vụ.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label className="font-bold">Loại góp ý</Label>
                  <RadioGroup
                    defaultValue="suggestion"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    onValueChange={setFeedbackType}
                    value={feedbackType}
                  >
                    <Label
                      htmlFor="suggestion"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <RadioGroupItem value="suggestion" id="suggestion" className="sr-only" />
                      <Lightbulb className="mb-3 h-6 w-6" />
                      Góp ý cải tiến
                    </Label>
                     <Label
                      htmlFor="bug"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <RadioGroupItem value="bug" id="bug" className="sr-only" />
                      <Bug className="mb-3 h-6 w-6" />
                      Báo lỗi
                    </Label>
                    <Label
                      htmlFor="other"
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <RadioGroupItem value="other" id="other" className="sr-only" />
                      <MessageSquarePlus className="mb-3 h-6 w-6" />
                      Khác
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-content" className="font-bold">Nội dung góp ý</Label>
                  <Textarea
                    id="feedback-content"
                    placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..."
                    rows={8}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email của bạn (Không bắt buộc)</Label>
                   <p className="text-sm text-muted-foreground">Cung cấp email nếu bạn muốn chúng tôi liên hệ lại.</p>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="text-center pt-4">
                  <Button size="lg" type="submit" className="w-full md:w-auto">
                    <Send className="mr-2" /> Gửi góp ý
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
