'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AuthContent from './auth-content';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] p-0'>
        <AuthContent onOpenChange={onOpenChange}>
          <DialogHeader className="mb-6 text-left">
            <DialogTitle className="text-3xl font-headline">
              {'Chào mừng bạn đến với HelloJob!'}
            </DialogTitle>
            <DialogDescription>
              {'Tạo tài khoản để mở khóa tiềm năng sự nghiệp của bạn.'}
            </DialogDescription>
          </DialogHeader>
        </AuthContent>
      </DialogContent>
    </Dialog>
  );
}
