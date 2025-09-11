
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

const GoogleIcon = () => (
    <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.546,44,29.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const FacebookIcon = () => (
    <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
        <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v12.022C24.529,41.938,25.539,41.974,26.572,41.974z"></path>
    </svg>
);


export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const [authType, setAuthType] = useState<'login' | 'register'>('register');
  const { setRole } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('candidate');
    onOpenChange(false);
    toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn đã quay trở lại.",
        className: 'bg-green-500 text-white',
        duration: 2000,
    })

    // Check for a redirect path and navigate
    const redirectPath = sessionStorage.getItem('postLoginRedirect');
    if (redirectPath) {
        sessionStorage.removeItem('postLoginRedirect');
        router.push(redirectPath);
    } else {
        router.push('/candidate-profile'); // Default redirect
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-8 md:p-12 flex flex-col justify-center">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-3xl font-headline">
                {authType === 'register' ? 'Chào mừng bạn đến với HelloJob!' : 'Chào mừng trở lại!'}
              </DialogTitle>
              <DialogDescription>
                {authType === 'register' ? 'Tạo tài khoản để mở khóa tiềm năng sự nghiệp của bạn.' : 'Đăng nhập để tiếp tục hành trình của bạn.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
                 <Button variant="outline" className="w-full justify-center h-12 text-base">
                    <GoogleIcon />
                    Tiếp tục với Google
                 </Button>
                 <Button variant="outline" className="w-full justify-center h-12 text-base">
                    <FacebookIcon />
                    Tiếp tục với Facebook
                 </Button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">HOẶC</span>
              </div>
            </div>

             <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email hoặc Số điện thoại</Label>
                    <Input id="email" placeholder="email@example.com" type="email" />
                </div>
                 {authType === 'register' ? (
                    <Button type="submit" className="w-full h-11 text-base">Đăng ký</Button>
                 ) : (
                    <Button type="submit" className="w-full h-11 text-base">Đăng nhập</Button>
                 )}
            </form>

            <div className="mt-6 text-center text-sm">
                {authType === 'register' ? (
                    <>
                        Đã có tài khoản?{' '}
                        <Button variant="link" className="p-0 h-auto" onClick={() => setAuthType('login')}>
                            Đăng nhập
                        </Button>
                    </>
                ) : (
                    <>
                        Chưa có tài khoản?{' '}
                        <Button variant="link" className="p-0 h-auto" onClick={() => setAuthType('register')}>
                            Đăng ký ngay
                        </Button>
                    </>
                )}
            </div>
            <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
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
            <Image src="https://placehold.co/800x1200.png" alt="HelloJob" fill className="object-cover" data-ai-hint="happy worker japan"/>
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
