
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, ShieldCheck, UserPlus, Gem } from 'lucide-react';
import { PayPayIcon, LinePayIcon } from './custom-icons';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentDialog({ isOpen, onClose, onSuccess }: PaymentDialogProps) {
    const { toast } = useToast();

    const handlePayment = () => {
        // In a real app, you would handle the payment processing here.
        // For this demo, we'll just simulate a success.
        toast({
            title: "Thanh toán thành công!",
            description: "Bạn đã mở khóa toàn bộ nội dung khóa học này.",
            className: "bg-green-500 text-white",
        });
        onSuccess();
    };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Mở khóa toàn bộ khóa học</DialogTitle>
          <DialogDescription>
            Để xem toàn bộ nội dung, vui lòng chọn một trong các phương thức dưới đây.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="credit-card" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credit-card">Thanh toán trực tiếp</TabsTrigger>
            <TabsTrigger value="gateways">Cổng khác</TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-card">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Số thẻ</Label>
                <div className="relative">
                  <Input id="card-number" placeholder="0000 0000 0000 0000" />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="expiry-date">Ngày hết hạn</Label>
                    <Input id="expiry-date" placeholder="MM/YY" />
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                 </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="card-holder">Tên chủ thẻ</Label>
                <Input id="card-holder" placeholder="NGUYEN VAN A" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gateways">
             <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground text-center">Chọn một trong các cổng thanh toán phổ biến tại Nhật Bản.</p>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                        <PayPayIcon />
                        <span>PayPay</span>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col gap-2">
                        <LinePayIcon />
                        <span>Line Pay</span>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col gap-2">
                        <svg className="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f7931a" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/><path fill="#f7931a" d="M12,11.43H10.88v2.14h-1V9.43h1V11h.88V9.43h1v4.14h-1Z"/></svg>
                        <span>Konbini</span>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col gap-2">
                        <svg className="h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22,12a10,10,0,1,0-10,10,10,10,0,0,0,10-10ZM12,18a6,6,0,1,1,6-6,6,6,0,0,1-6,6Z"/><path d="M12,8a4,4,0,1,0,4,4,4,4,0,0,0-4-4Z"/></svg>
                        <span>Bank Transfer</span>
                    </Button>
                </div>
             </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-col gap-3 sm:flex-col sm:space-x-0">
          <Button className="w-full" size="lg" onClick={handlePayment}>Thanh toán 29.000 VND</Button>
          <div className="flex items-center gap-4 w-full">
            <hr className="flex-grow border-border"/>
            <span className="text-muted-foreground text-xs font-semibold">HOẶC</span>
            <hr className="flex-grow border-border"/>
          </div>
          <Button asChild variant="secondary" className="w-full bg-green-100 hover:bg-green-200 text-green-700 border-green-200 border" size="lg">
            <Link href="/premium">
                <Gem className="mr-2"/> Đăng ký tài khoản Premium
            </Link>
          </Button>
           <Button asChild variant="outline" className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200" size="lg">
             <Link href="/referral">
                <UserPlus className="mr-2"/> Giới thiệu ứng viên khác
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
             <ShieldCheck className="h-4 w-4 text-green-500" />
             <span>Thanh toán được bảo mật</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
