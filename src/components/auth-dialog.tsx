
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
import { useAuth, type Role } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { app } from '@/firebase/config';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const [authType, setAuthType] = useState<'login' | 'register'>('register');
  const { setRole, postLoginAction } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth(app);

  const handleProviderLogin = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      // This user object contains all the info from the provider.
      const user = result.user;
      
      onOpenChange(false);
      toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${user.displayName || 'bạn'} đã quay trở lại.`,
          className: 'bg-green-500 text-white',
          duration: 2000,
      });

      // The onAuthStateChanged listener in AuthContext will handle the rest.
      
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
          variant: 'destructive',
          title: "Đăng nhập thất bại",
          description: error.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  const handleGoogleLogin = () => handleProviderLogin(new GoogleAuthProvider());
  const handleFacebookLogin = () => handleProviderLogin(new FacebookAuthProvider());

  const handleSimulateLogin = (role: Role) => {
    setRole(role);
    onOpenChange(false);
    toast({
        title: "Chuyển đổi vai trò thành công!",
        description: `Bạn đang mô phỏng vai trò: ${role}`,
    });
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
                 <Button variant="outline" className="w-full justify-start h-12 text-base" onClick={handleFacebookLogin}>
                    <Image src="/img/Facebook.svg" alt="Facebook" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Facebook
                 </Button>
                 <Button variant="outline" className="w-full justify-start h-12 text-base" onClick={handleGoogleLogin}>
                    <Image src="/img/google.svg" alt="Google" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Google
                 </Button>
                 <Button variant="outline" className="w-full justify-start h-12 text-base">
                    <Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-3 h-5 w-5" />
                    Tiếp tục với Số điện thoại
                 </Button>
            </div>

            <div className="mt-auto pt-8 flex flex-col">
                <p className="text-xs text-muted-foreground">
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
                {process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION === 'true' && (
                 <div className="flex flex-wrap justify-end mt-2 gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleSimulateLogin('guest')}>Guest</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleSimulateLogin('candidate-empty-profile')}>Empty</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleSimulateLogin('candidate')}>Partial</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleSimulateLogin('candidate-full-profile')}>Full</Button>
                </div>
                )}
            </div>
        </div>
        <div className="hidden md:block relative">
            <Image src="/img/viet-img/SSO(6).png" alt="Hành trình vạn dặm" fill className="object-cover" data-ai-hint="team collaboration"/>
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
