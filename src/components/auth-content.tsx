import React, { FC, useEffect, useState } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { exitInAppBrowser } from "@/lib/utils";
import { facebookAuth, googleAuth } from "@/lib/auth.util";
import { useLoadingCallback } from "@/lib/useLoadingCallback";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
const AuthContent: FC<{ children: React.ReactElement, onOpenChange: (open: boolean) => void }> = ({ children, onOpenChange }) => {

  const { setRole, postLoginAction } = useAuth();
  const { toast } = useToast();
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

  React.useEffect(() => {
    onIdTokenChanged(auth, async (firebaseUser) => {
      if (!!firebaseUser) {
        onOpenChange(false);
      }
    });
  }, []);

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
    <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl md:grid md:grid-cols-2 relative">
      <div className="bg-background p-8 md:p-12 flex flex-col justify-center">
        {children}
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

        <div className="mt-auto flex flex-col">
          <p className="mt-6 text-center text-xs text-muted-foreground">
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
        <Image src="/img/viet-img/SSO(6).png" unoptimized alt="Hành trình vạn dặm" fill className="object-cover" data-ai-hint="team collaboration" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h3 className="text-2xl font-bold font-headline">"Hành trình vạn dặm, bắt đầu từ một bước chân."</h3>
          <p className="text-sm opacity-80 mt-2">- Lão Tử</p>
        </div>
      </div>
    </div>
  );
};

export default AuthContent;