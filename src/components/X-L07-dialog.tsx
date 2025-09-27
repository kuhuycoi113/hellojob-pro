'use client';

import { useState } from 'react';
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
import { Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type Language = 'vi' | 'ja' | 'en';

interface XL07DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (fee: string) => void;
  onBack: () => void;
  lang: Language;
}

const contentByLang = {
    vi: {
        title: 'Nhập phí quản lý bạn đề xuất cho đối tác',
        label: 'Phí quản lý/tháng',
        placeholder: 'Ví dụ: 20,000 JPY',
        backButton: 'Quay lại',
        continueButton: 'Lưu, xem kết quả và để lại thông tin liên hệ',
        continueButtonMobile: 'Lưu, xem kết quả, để lại liên hệ',
    },
    ja: {
        title: 'パートナーに提案する管理費を入力してください',
        label: '管理費/月',
        placeholder: '例: 20,000 JPY',
        backButton: '戻る',
        continueButton: '保存して適切なパートナーを探す',
        continueButtonMobile: '保存して結果を見る',
    },
    en: {
        title: 'Enter the management fee you propose to the partner',
        label: 'Management Fee/Month',
        placeholder: 'Example: 20,000 JPY',
        backButton: 'Back',
        continueButton: 'Save and Find Partners',
        continueButtonMobile: 'Save & Find',
    }
};

export function XL07Dialog({ isOpen, onOpenChange, onSelect, onBack, lang }: XL07DialogProps) {
  const [fee, setFee] = useState<string>('');
  const isMobile = useIsMobile();

  const handleSelect = () => {
    onSelect(fee);
  };
  
  const content = contentByLang[lang];
  const dialogId = "X007";
  const continueText = isMobile ? content.continueButtonMobile : content.continueButton;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" id={dialogId}>
        <DialogHeader className="text-center items-center">
            <div className="p-2 bg-primary/10 rounded-full w-fit">
                <Handshake className="h-6 w-6 text-primary"/>
            </div>
          <DialogTitle className="text-2xl font-headline">{content.title}</DialogTitle>
        </DialogHeader>
        
        <div className="pt-4">
            <Label htmlFor="management-fee">{content.label}</Label>
            <Input
                id="management-fee"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder={content.placeholder}
                className="mt-2"
            />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={onBack}>
                {content.backButton}
            </Button>
            <Button onClick={handleSelect}>
                {continueText}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
