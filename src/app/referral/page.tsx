
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function ReferralPage() {
  const { toast } = useToast();
  const referralLink = 'https://hellojob.vn/register?ref=ABCD123';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Đã sao chép!',
      description: 'Đường link giới thiệu đã được sao chép vào bộ nhớ tạm.',
    });
  };

  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
             <div className="inline-block bg-orange-100 p-4 rounded-full mb-4">
                <UserPlus className="h-10 w-10 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Giới thiệu bạn bè, Mở khóa kiến thức</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Mỗi lượt giới thiệu thành công sẽ mở khóa một bài học bất kỳ. Lượt giới thiệu được tính là thành công khi người bạn mời hoàn thành trên 50% thông tin hồ sơ.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8 text-center">
                <h3 className="font-bold text-lg mb-4">Chia sẻ qua mã QR</h3>
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-lg shadow-md inline-block">
                        <Image
                            src="https://placehold.co/300x300.png"
                            alt="Mã QR giới thiệu"
                            width={250}
                            height={250}
                            data-ai-hint="qr code"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full mb-8">
                    <hr className="flex-grow border-border"/>
                    <span className="text-muted-foreground text-sm font-semibold">HOẶC</span>
                    <hr className="flex-grow border-border"/>
                </div>
                
                <h3 className="font-bold text-lg mb-4">Chia sẻ qua đường link</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input readOnly value={referralLink} className="text-center sm:text-left"/>
                    <Button onClick={copyToClipboard} variant="outline" className="shrink-0">
                        <Copy className="mr-2 h-4 w-4" /> Sao chép
                    </Button>
                </div>

                <Button size="lg" className="mt-6 w-full sm:w-auto">
                    <Share2 className="mr-2 h-4 w-4" /> Chia sẻ ngay
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
