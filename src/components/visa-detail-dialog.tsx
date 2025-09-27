
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
import { HardHat, UserCheck, Plane, UserPlus, Users, Briefcase } from 'lucide-react';
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
  tts: {
    vi: {
      title: 'Chọn chương trình Thực tập sinh',
      description: 'Vui lòng chọn loại chương trình thực tập sinh phù hợp.',
      options: [
        { id: 'tts_3_nam', icon: HardHat, title: 'Thực tập sinh 3 năm', desc: 'Chương trình phổ biến nhất, làm việc tại Nhật trong 3 năm.' },
        { id: 'tts_1_nam', icon: HardHat, title: 'Thực tập sinh 1 năm', desc: 'Chương trình ngắn hạn dành cho một số ngành nghề nhất định.' },
        { id: 'tts_3_go', icon: HardHat, title: 'Thực tập sinh 3 Go', desc: 'Dành cho người đã hoàn thành TTS 3 năm và muốn quay lại.' },
      ]
    },
    ja: {
      title: '技能実習プログラムを選択',
      description: '適切な技能実習プログラムを選択してください。',
      options: [
        { id: 'tts_3_nam', icon: HardHat, title: '技能実習3年', desc: '最も一般的なプログラムで、日本で3年間働きます。' },
        { id: 'tts_1_nam', icon: HardHat, title: '技能実習1年', desc: '特定の職種向けの短期プログラム。' },
        { id: 'tts_3_go', icon: HardHat, title: '技能実習3号', desc: '3年間の技能実習を修了し、再入国を希望する方向け。' },
      ]
    },
    en: {
      title: 'Select Trainee Program',
      description: 'Please select the appropriate technical intern training program.',
      options: [
        { id: 'tts_3_nam', icon: HardHat, title: '3-Year Technical Intern', desc: 'The most common program, working in Japan for 3 years.' },
        { id: 'tts_1_nam', icon: HardHat, title: '1-Year Technical Intern', desc: 'A short-term program for specific job types.' },
        { id: 'tts_3_go', icon: HardHat, title: 'Technical Intern No. 3', desc: 'For those who have completed the 3-year program and wish to return.' },
      ]
    }
  },
  tokutei: {
    vi: {
        title: 'Chọn loại Kỹ năng đặc định',
        description: 'Chọn chương trình Kỹ năng đặc định bạn muốn tuyển.',
        options: [
          { id: 'dac_dinh_dau_nhat', icon: Users, title: 'Đặc định đầu Nhật', desc: 'Để tuyển ứng viên ở Nhật' },
          { id: 'dac_dinh_dau_viet', icon: Plane, title: 'Đặc định đầu Việt', desc: 'Để tuyển ứng viên từ Việt Nam' },
          { id: 'dac_dinh_di_moi', icon: UserPlus, title: 'Đặc định đi mới', desc: 'Để tuyển ứng viên mới' },
        ]
    },
    ja: {
        title: '特定技能の種類を選択',
        description: '募集したい特定技能プログラムを選択してください。',
        options: [
          { id: 'dac_dinh_dau_nhat', icon: Users, title: '国内（日本在住者）', desc: '日本在住の候補者を採用' },
          { id: 'dac_dinh_dau_viet', icon: Plane, title: '国外（ベトナム在住者）', desc: 'ベトナムから候補者を採用' },
          { id: 'dac_dinh_di_moi', icon: UserPlus, title: '新規（未経験者）', desc: '新規の候補者を採用' },
        ]
    },
    en: {
        title: 'Select Specified Skilled Worker Type',
        description: 'Choose the Specified Skilled Worker program you want to recruit for.',
        options: [
          { id: 'dac_dinh_dau_nhat', icon: Users, title: 'Domestic (in Japan)', desc: 'To recruit candidates already in Japan' },
          { id: 'dac_dinh_dau_viet', icon: Plane, title: 'Overseas (in Vietnam)', desc: 'To recruit candidates from Vietnam' },
          { id: 'dac_dinh_di_moi', icon: UserPlus, title: 'New Candidates', desc: 'To recruit new candidates' },
        ]
    }
  },
  engineer: { // Placeholder for Engineer
    vi: {
        title: 'Chọn loại Kỹ sư/Tri thức',
        description: 'Chọn chương trình Kỹ sư/Tri thức bạn muốn tuyển.',
        options: [
          { id: 'ks_dau_nhat', icon: Briefcase, title: 'Kỹ sư đầu Nhật', desc: 'Tuyển kỹ sư đã có kinh nghiệm tại Nhật' },
          { id: 'ks_dau_viet', icon: Briefcase, title: 'Kỹ sư đầu Việt', desc: 'Tuyển kỹ sư từ Việt Nam' },
        ]
    },
    ja: {
        title: '技術・人文知識・国際業務の種類を選択',
        description: '募集したいプログラムを選択してください。',
        options: [
          { id: 'ks_dau_nhat', icon: Briefcase, title: '国内エンジニア', desc: '日本での経験があるエンジニアを採用' },
          { id: 'ks_dau_viet', icon: Briefcase, title: '国外エンジニア', desc: 'ベトナムからエンジニアを採用' },
        ]
    },
    en: {
        title: 'Select Engineer/Specialist Type',
        description: 'Choose the program you want to recruit for.',
        options: [
          { id: 'ks_dau_nhat', icon: Briefcase, title: 'Engineer (In Japan)', desc: 'Recruit engineers with experience in Japan' },
          { id: 'ks_dau_viet', icon: Briefcase, title: 'Engineer (In Vietnam)', desc: 'Recruit engineers from Vietnam' },
        ]
    }
  }
};


export function VisaDetailDialog({ isOpen, onOpenChange, onSelect, onBack, lang, visaType }: VisaDetailDialogProps) {
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const handleSelect = (detailId: string) => {
    setSelectedDetail(detailId);
    onSelect(detailId);
  };
  
  const contentData = visaDetailContent[visaType as keyof typeof visaDetailContent] || visaDetailContent.tts;
  const content = contentData[lang];
  const dialogId = visaType === 'tts' ? 'NTD004-1' : (visaType === 'tokutei' ? 'NTD004-2' : 'visa-detail-dialog');
  
  const iconColors = {
    tts: 'bg-orange-100 text-orange-500',
    tokutei: 'bg-blue-100 text-blue-500',
    engineer: 'bg-green-100 text-green-500',
  };

  const currentIconColor = iconColors[visaType as keyof typeof iconColors] || 'bg-gray-100 text-gray-500';

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
                        <div className={cn("rounded-full p-3 w-fit mb-4", currentIconColor)}>
                            <option.icon className="h-8 w-8" />
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
