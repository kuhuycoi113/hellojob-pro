
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { industriesByJobType, Industry } from '@/lib/industry-data';

type Language = 'vi' | 'ja' | 'en';

interface IndustryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (industry: string) => void;
  onBack: () => void;
  lang: Language;
  visaType: string;
}

const contentByLang = {
    vi: {
        title: 'Chọn ngành nghề mong muốn',
        description: 'Lựa chọn ngành nghề bạn quan tâm nhất để chúng tôi gợi ý việc làm chính xác hơn.',
        backButton: 'Quay lại',
    },
    ja: {
        title: '希望の職種を選択',
        description: '最も関心のある職種を選択して、より正確な求人情報をお届けします。',
        backButton: '戻る',
    },
    en: {
        title: 'Select Desired Industry',
        description: 'Choose the industry you are most interested in so we can provide more accurate job suggestions.',
        backButton: 'Back',
    }
};

export function IndustryDialog({ isOpen, onOpenChange, onSelect, onBack, lang, visaType }: IndustryDialogProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const handleSelect = (industrySlug: string) => {
    setSelectedIndustry(industrySlug);
    onSelect(industrySlug);
  };
  
  const content = contentByLang[lang];
  const industries = industriesByJobType[visaType as keyof typeof industriesByJobType] || [];
  
  const dialogId = `NTD005-${visaType === 'tts' ? '1' : (visaType === 'tokutei' ? '2' : '3')}`;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" id={dialogId}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {industries.map((industry) => (
                    <Button 
                        key={industry.slug} 
                        onClick={() => handleSelect(industry.slug)}
                        variant="outline"
                        className={cn(
                            "h-auto p-6 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center whitespace-normal",
                            selectedIndustry === industry.slug && "ring-2 ring-primary border-primary bg-primary/10"
                        )}
                    >
                        <span className="font-semibold text-base">{industry.name}</span>
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
