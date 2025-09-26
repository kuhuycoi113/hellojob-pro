
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
import { Phone } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FacebookIcon = () => (
    <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
        <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v12.022C24.529,41.938,25.539,41.974,26.572,41.974z"></path>
    </svg>
);


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
                 <Button variant="outline" className="w-full justify-center h-12 text-base">
                    <FacebookIcon />
                    Tiếp tục với Facebook
                 </Button>
                 <Button variant="outline" className="w-full justify-center h-12 text-base">
                    <Image src="/img/google.svg" alt="Google" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Google
                 </Button>
                 <Button variant="outline" className="w-full justify-center h-12 text-base">
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
            <Image src="https://storage.googleapis.com/hellojob-staging-storage-4a39d.appspot.com/uploads/1722416175782_2 workers.png" alt="Japanese workers" fill className="object-cover" data-ai-hint="happy worker japan"/>
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
