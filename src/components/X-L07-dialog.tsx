
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
        label: 'Phí quản lý/tháng (JPY)',
        placeholder: 'Ví dụ: 20,000',
        backButton: 'Quay lại',
        continueButton: 'Tiếp tục',
    },
    ja: {
        title: 'パートナーに提案する管理費を入力してください',
        label: '管理費/月 (JPY)',
        placeholder: '例: 20,000',
        backButton: '戻る',
        continueButton: '続ける',
    },
    en: {
        title: 'Enter the management fee you propose to the partner',
        label: 'Management Fee/Month (JPY)',
        placeholder: 'Example: 20,000',
        backButton: 'Back',
        continueButton: 'Continue',
    }
};

export function XL07Dialog({ isOpen, onOpenChange, onSelect, onBack, lang }: XL07DialogProps) {
  const [fee, setFee] = useState<string>('');
  const isMobile = useIsMobile();

  const handleSelect = () => {
    onSelect(fee.replace(/,/g, ''));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/[^0-9]/g, '');
    if (numericValue) {
        setFee(parseInt(numericValue, 10).toLocaleString('en-US'));
    } else {
        setFee('');
    }
  };
  
  const content = contentByLang[lang];
  const dialogId = "X007";
  const continueText = isMobile ? (lang === 'ja' ? '続ける' : (lang === 'en' ? 'Continue' : 'Tiếp tục')) : (lang === 'ja' ? '保存して結果を表示し、連絡先を残す' : (lang === 'en' ? 'Save, view results, and leave contact information' : 'Lưu, xem kết quả và để lại thông tin liên hệ'));


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
                onChange={handleInputChange}
                placeholder={content.placeholder}
                className="mt-2"
                type="text"
                inputMode="numeric"
            />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={onBack}>
                {content.backButton}
            </Button>
            <Button onClick={handleSelect}>
                {isMobile ? content.continueButton : 'Lưu, xem kết quả và để lại thông tin liên hệ'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
