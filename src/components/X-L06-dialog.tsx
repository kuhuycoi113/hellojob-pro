'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Handshake } from 'lucide-react';

type Language = 'vi' | 'ja' | 'en';

interface XL06DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (fee: string) => void;
  onBack: () => void;
  lang: Language;
}

const contentByLang = {
    vi: {
        title: 'Nhập phí giới thiệu bạn đề xuất cho đối tác',
        description: 'Mức phí này sẽ được đề xuất cho đối tác của bạn.',
        label: 'Phí giới thiệu',
        placeholder: 'Ví dụ: 200,000 JPY',
        backButton: 'Quay lại',
        continueButton: 'Tiếp tục',
    },
    ja: {
        title: 'パートナーに提案する紹介料を入力してください',
        description: 'この料金がパートナーに提案されます。',
        label: '紹介料',
        placeholder: '例: 200,000 JPY',
        backButton: '戻る',
        continueButton: '続ける',
    },
    en: {
        title: 'Enter the referral fee you propose to the partner',
        description: 'This fee will be proposed to your partner.',
        label: 'Referral Fee',
        placeholder: 'Example: 200,000 JPY',
        backButton: 'Back',
        continueButton: 'Continue',
    }
};

export function XL06Dialog({ isOpen, onOpenChange, onSelect, onBack, lang }: XL06DialogProps) {
  const [fee, setFee] = useState<string>('');

  const handleSelect = () => {
    onSelect(fee);
  };
  
  const content = contentByLang[lang];
  const dialogId = "X006";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" id={dialogId}>
        <DialogHeader className="text-center items-center">
            <div className="p-2 bg-primary/10 rounded-full w-fit">
                <Handshake className="h-6 w-6 text-primary"/>
            </div>
          <DialogTitle className="text-2xl font-headline">{content.title}</DialogTitle>
        </DialogHeader>
        
        <div className="pt-4">
            <Label htmlFor="referral-fee">{content.label}</Label>
            <Input
                id="referral-fee"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder={content.placeholder}
                className="mt-2"
            />
        </div>

        <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onBack}>
                {content.backButton}
            </Button>
            <Button onClick={handleSelect}>
                {content.continueButton}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
