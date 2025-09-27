
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
import { Card } from './ui/card';
import { HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'vi' | 'ja' | 'en';

interface VisaDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (visaDetail: string) => void;
  onBack: () => void;
  lang: Language;
  visaType: string;
}

const visaDetailContent = {
  vi: {
    title: 'Chọn chương trình Thực tập sinh',
    description: 'Vui lòng chọn loại chương trình thực tập sinh phù hợp.',
    options: [
      { id: 'tts_3_nam', title: 'Thực tập sinh 3 năm', desc: 'Chương trình phổ biến nhất, làm việc tại Nhật trong 3 năm.' },
      { id: 'tts_1_nam', title: 'Thực tập sinh 1 năm', desc: 'Chương trình ngắn hạn dành cho một số ngành nghề nhất định.' },
      { id: 'tts_3_go', title: 'Thực tập sinh 3 Go', desc: 'Dành cho người đã hoàn thành TTS 3 năm và muốn quay lại.' },
    ]
  },
  ja: {
    title: '技能実習プログラムを選択',
    description: '適切な技能実習プログラムを選択してください。',
    options: [
      { id: 'tts_3_nam', title: '技能実習3年', desc: '最も一般的なプログラムで、日本で3年間働きます。' },
      { id: 'tts_1_nam', title: '技能実習1年', desc: '特定の職種向けの短期プログラム。' },
      { id: 'tts_3_go', title: '技能実習3号', desc: '3年間の技能実習を修了し、再入国を希望する方向け。' },
    ]
  },
  en: {
    title: 'Select Trainee Program',
    description: 'Please select the appropriate technical intern training program.',
    options: [
      { id: 'tts_3_nam', title: '3-Year Technical Intern', desc: 'The most common program, working in Japan for 3 years.' },
      { id: 'tts_1_nam', title: '1-Year Technical Intern', desc: 'A short-term program for specific job types.' },
      { id: 'tts_3_go', title: 'Technical Intern No. 3', desc: 'For those who have completed the 3-year program and wish to return.' },
    ]
  }
};

export function VisaDetailDialog({ isOpen, onOpenChange, onSelect, onBack, lang, visaType }: VisaDetailDialogProps) {
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const handleSelect = (detailId: string) => {
    setSelectedDetail(detailId);
    onSelect(detailId);
  };
  
  // For now, we only have content for 'Thực tập sinh kỹ năng'.
  // In the future, this can be expanded.
  const content = visaDetailContent[lang];
  const dialogId = visaType === 'tts' ? 'NTD004-1' : 'visa-detail-dialog';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl" id={dialogId}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.options.map((option) => (
                    <Card 
                        key={option.id} 
                        onClick={() => handleSelect(option.id)}
                        className={cn(
                            "text-center p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center",
                            selectedDetail === option.id && "ring-2 ring-primary border-primary"
                        )}
                    >
                        <div className="rounded-full p-3 w-fit mb-4 bg-orange-100 text-orange-500">
                            <HardHat className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{option.title}</h3>
                        <p className="text-muted-foreground text-sm flex-grow">{option.desc}</p>
                    </Card>
                ))}
            </div>
        </div>

        <div className="mt-6 text-center">
            <Button variant="ghost" onClick={onBack}>
                {lang === 'ja' ? '戻る' : lang === 'en' ? 'Back' : 'Quay lại'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
