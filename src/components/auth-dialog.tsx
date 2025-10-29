'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn, exitInAppBrowser } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRedirect } from '@/lib/useRedirect';
import { facebookAuth, googleAuth } from '@/lib/auth.util';
import { useLoadingCallback } from '@/lib/useLoadingCallback';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const [authType, setAuthType] = useState<'login' | 'register'>('register');
  const { setRole, postLoginAction } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [hasLogged, setHasLogged] = useState(false);
  const searchParams = useSearchParams();
  const getQueryParams = () => {
    const queryParamString = new URLSearchParams(searchParams).toString();
    return queryParamString;
  };
  useEffect(() => {
    let url = `${window.location.origin}/xac-thuc?${getQueryParams()}`;
    exitInAppBrowser(url);
  }, []);
  // useRedirect();

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const [handleLoginWithGoogle, isGoogleLoading, googleError] = useLoadingCallback(async () => {
    setHasLogged(false);
    googleAuth(null)
      .then((res) => {
        setHasLogged(true);

        toast({
          title: "Đang xác thực",
          description: "Hệ thống đang xác thực. Vui lòng chờ trong giây lát.",
          className: 'bg-green-500 text-white',
          duration: 2000,
        })
        // window.location.replace('/thong-tin-tai-khoan');
      })
      .catch((error) => {

        toast({
          title: "Xảy ra lỗi",
          description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
          className: 'bg-red-500 text-white',
          duration: 2000,
        })
      });
  });
  const [handleLoginWithFacebook, isFacebookLoading, facebookError] = useLoadingCallback(async () => {
    setHasLogged(false);
    facebookAuth(null)
      .then((res) => {
        setHasLogged(true);

        toast({
          title: "Đang xác thực",
          description: "Hệ thống đang xác thực. Vui lòng chờ trong giây lát.",
          className: 'bg-green-500 text-white',
          duration: 2000,
        })
        // window.location.replace('/thong-tin-tai-khoan');
      })
      .catch((error) => {
        toast({
          title: "Xảy ra lỗi",
          description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
          className: 'bg-red-500 text-white',
          duration: 2000,
        })
      });
  });

  const handleSimulateLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRole('candidate-empty-profile');
    onOpenChange(false);
    toast({
      title: "Đăng nhập giả lập thành công!",
      description: "Vai trò: Đã đăng nhập (Profile trắng).",
      duration: 2000,
    })
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
            <Button variant="outline" className="w-full justify-start h-12 text-base"
              disabled={isFacebookLoading || hasLogged}
              onClick={handleLoginWithFacebook}>
              <Image src="/img/Facebook.svg" alt="Facebook" width={20} height={20} className="mr-3 h-5 w-5" />
              Tiếp tục với Facebook
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base"
              disabled={isGoogleLoading || hasLogged}
              onClick={handleLoginWithGoogle}>
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
            <div className="flex justify-end mt-2">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={handleSimulateLogin}>
                Giả lập đăng nhập
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden md:block relative">
          <Image src="/img/viet-img/SSO(6).png" alt="Hành trình vạn dặm" fill className="object-cover" data-ai-hint="team collaboration" />
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
