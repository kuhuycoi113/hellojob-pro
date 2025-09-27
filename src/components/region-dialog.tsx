
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
import { cn } from '@/lib/utils';

type Language = 'vi' | 'ja' | 'en';

interface RegionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (region: string) => void;
  onBack: () => void;
  lang: Language;
}

const contentByLang = {
    vi: {
        title: 'Chọn khu vực làm việc',
        description: 'Lựa chọn khu vực bạn muốn làm việc tại Nhật Bản.',
        backButton: 'Quay lại',
    },
    ja: {
        title: '希望勤務地を選択',
        description: '日本で働きたい地域を選択してください。',
        backButton: '戻る',
    },
    en: {
        title: 'Select Work Region',
        description: 'Choose the region in Japan where you want to work.',
        backButton: 'Back',
    }
};

const regions = [
  'Hokkaido', 'Tohoku', 'Kanto', 
  'Chubu', 'Kansai', 'Chugoku', 
  'Shikoku', 'Kyushu', 'Okinawa'
];

export function RegionDialog({ isOpen, onOpenChange, onSelect, onBack, lang }: RegionDialogProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleSelect = (region: string) => {
    setSelectedRegion(region);
    onSelect(region);
  };
  
  const content = contentByLang[lang];
  const dialogId = "NTD006";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" id={dialogId}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
                {regions.map((region) => (
                    <Button 
                        key={region} 
                        onClick={() => handleSelect(region)}
                        variant="outline"
                        className={cn(
                            "h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center whitespace-normal",
                            selectedRegion === region && "ring-2 ring-primary border-primary bg-primary/10"
                        )}
                    >
                        <span className="font-semibold text-base">{region}</span>
                    </Button>
                ))}
            </div>
        </div>

        <div className="mt-6 text-center">
            <Button variant="ghost" onClick={onBack}>
                {content.backButton}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
