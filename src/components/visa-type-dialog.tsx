
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
import { HardHat, UserCheck, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'vi' | 'ja' | 'en';

interface VisaTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (visaType: string) => void;
  onBack: () => void;
  lang: Language;
}

const visaTypeContent = {
  vi: {
    title: 'Bạn muốn tuyển loại Visa nào?',
    description: 'Hãy chọn loại visa phù hợp với nhu cầu tuyển dụng của bạn.',
    roles: [
      { id: 'tts', icon: HardHat, title: 'Thực tập sinh kỹ năng', desc: 'Chương trình dành cho lao động phổ thông, đào tạo kỹ năng tại Nhật Bản.', color: 'blue' },
      { id: 'tokutei', icon: UserCheck, title: 'Kỹ năng đặc định', desc: 'Lao động có kinh nghiệm làm việc dài hạn.', color: 'yellow' },
      { id: 'engineer', icon: Briefcase, title: 'Kỹ sư, tri thức', desc: 'Chuyên gia có trình độ cao, bằng cấp chuyên ngành.', color: 'green' },
    ]
  },
  ja: {
    title: 'どのビザタイプを募集しますか？',
    description: '採用ニーズに最も適したビザタイプを選択してください。',
    roles: [
      { id: 'tts', icon: HardHat, title: '技能実習', desc: '一般労働者向けの日本での技能訓練プログラム。', color: 'blue' },
      { id: 'tokutei', icon: UserCheck, title: '特定技能', desc: '長期就労経験のある労働者向け。', color: 'yellow' },
      { id: 'engineer', icon: Briefcase, title: '技術・人文知識・国際業務', desc: '高度な資格と専門学位を持つ専門家。', color: 'green' },
    ]
  },
  en: {
    title: 'Which Visa Type do you want to recruit?',
    description: 'Please select the visa type that best suits your recruitment needs.',
    roles: [
      { id: 'tts', icon: HardHat, title: 'Technical Intern Trainee', desc: 'Program for general workers, providing skills training in Japan.', color: 'blue' },
      { id: 'tokutei', icon: UserCheck, title: 'Specified Skilled Worker', desc: 'For experienced workers for long-term employment.', color: 'yellow' },
      { id: 'engineer', icon: Briefcase, title: 'Engineer/Specialist in Humanities', desc: 'Professionals with high qualifications and specialized degrees.', color: 'green' },
    ]
  }
};


const iconColors = {
    blue: 'bg-blue-100 text-blue-500',
    yellow: 'bg-yellow-100 text-yellow-500',
    green: 'bg-green-100 text-green-500',
}

export function VisaTypeDialog({ isOpen, onOpenChange, onSelect, onBack, lang }: VisaTypeDialogProps) {
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);

  const handleSelect = (visaId: string) => {
    setSelectedVisa(visaId);
    onSelect(visaId);
  };

  const content = visaTypeContent[lang];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" id="NTD003">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.roles.map((visa) => (
                    <Card 
                        key={visa.id} 
                        onClick={() => handleSelect(visa.id)}
                        className={cn(
                            "text-center p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center",
                            selectedVisa === visa.id && "ring-2 ring-primary border-primary"
                        )}
                    >
                        <div className={cn("rounded-full p-3 w-fit mb-4", iconColors[visa.color as keyof typeof iconColors])}>
                            <visa.icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{visa.title}</h3>
                        <p className="text-muted-foreground text-sm flex-grow">{visa.desc}</p>
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
