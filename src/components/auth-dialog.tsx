
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const [authType, setAuthType] = useState<'login' | 'register'>('register');
  const { setRole, postLoginAction } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('candidate-empty-profile'); // Default to empty profile, context will fill it
    onOpenChange(false);
    toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn đã quay trở lại.",
        className: 'bg-green-500 text-white',
        duration: 2000,
    })

    // Check if there is a pending action. If not, check for a redirect path.
    if (postLoginAction) {
        // The action will be handled by the listener in MyJobsDashboardPageContent
        return;
    }

    const redirectPath = sessionStorage.getItem('postLoginRedirect');
    if (redirectPath) {
        sessionStorage.removeItem('postLoginRedirect');
        router.push(redirectPath);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-8 md:p-12 flex flex-col justify-center">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-3xl font-headline">
                {'Chào mừng bạn đến với HelloJob!'}
              </DialogTitle>
              <DialogDescription>
                {'Tạo tài khoản để mở khóa tiềm năng sự nghiệp của bạn.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
                 <Button variant="outline" className="w-full justify-start h-12 text-base">
                    <Image src="/img/Facebook.svg" alt="Facebook" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Facebook
                 </Button>
                 <Button variant="outline" className="w-full justify-start h-12 text-base">
                    <Image src="/img/google.svg" alt="Google" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Google
                 </Button>
                 <Button variant="outline" className="w-full justify-start h-12 text-base">
                    <Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Số điện thoại
                 </Button>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
                Bằng việc tiếp tục, bạn đồng ý với {' '}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Điều khoản dịch vụ
                </a>
                {' '} và {' '}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Chính sách bảo mật
                </a>
                {' '} của chúng tôi.
            </p>
        </div>
        <div className="hidden md:block relative">
            <Image src="/img/SSO(1).jpg" alt="Japanese workers" fill className="object-cover" data-ai-hint="happy worker japan"/>
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
             <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold font-headline">"Hành trình vạn dặm, bắt đầu từ một bước chân."</h3>
                <p className="text-sm opacity-80 mt-2">- Lão Tử</p>
             </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
