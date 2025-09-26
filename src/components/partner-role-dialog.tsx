
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Plane, UserCheck, Handshake, Briefcase, Users, UserSquare, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from './custom-icons';

type Language = 'vi' | 'ja' | 'en';

interface PartnerRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (roleId: string) => void;
  onLanguageChange: (lang: Language) => void;
  initialLang?: Language;
}

const roles = {
  vi: [
    { id: 'haken_staff', icon: UserSquare, title: 'Nhân viên phái cử', desc: 'Nhân viên tuyển dụng/đối ngoại của Công ty XKLĐ.' },
    { id: 'jp_hr_staff', icon: UserCog, title: 'Nhân viên Nhân lực Nhật', desc: 'Nhân viên tại Nghiệp đoàn, Shien, Shokai, Haken.' },
    { id: 'dispatch', icon: Plane, title: 'Công ty phái cử', desc: 'Tuyển và phái cử lao động từ Việt Nam.' },
    { id: 'support', icon: UserCheck, title: 'Cơ quan hỗ trợ (Shien Kikan)', desc: 'Hỗ trợ các công ty và người lao động.' },
    { id: 'enterprise', icon: Building, title: 'Xí nghiệp tiếp nhận', desc: 'Trực tiếp tuyển dụng và sử dụng lao động.' },
    { id: 'union', icon: Handshake, title: 'Nghiệp đoàn (Kumiai)', desc: 'Quản lý và hỗ trợ thực tập sinh.' },
    { id: 'shokai', icon: Users, title: 'Công ty giới thiệu có phí (Yuryo Shokai)', desc: 'Cung cấp dịch vụ giới thiệu việc làm có tính phí.' },
    { id: 'haken', icon: Briefcase, title: 'Công ty Haken', desc: 'Cung cấp dịch vụ phái cử lao động tạm thời.' },
  ],
  ja: [
    { id: 'haken_staff', icon: UserSquare, title: '送り出し機関の社員', desc: '送り出し機関の採用・渉外担当者。' },
    { id: 'jp_hr_staff', icon: UserCog, title: '日本人材法人の社員', desc: '監理団体、支援機関、職業紹介所、派遣会社の社員。' },
    { id: 'dispatch', icon: Plane, title: '送り出し機関', desc: 'ベトナムから労働者を募集・派遣する。' },
    { id: 'support', icon: UserCheck, title: '支援機関', desc: '企業と労働者を支援する。' },
    { id: 'enterprise', icon: Building, title: '受け入れ企業', desc: '労働者を直接雇用・使用する。' },
    { id: 'union', icon: Handshake, title: '監理団体 (組合)', desc: '技能実習生を管理・支援する。' },
    { id: 'shokai', icon: Users, title: '有料職業紹介事業所', desc: '有料の職業紹介サービスを提供する。' },
    { id: 'haken', icon: Briefcase, title: '派遣会社', desc: '一時的な労働者派遣サービスを提供する。' },
  ],
  en: [
    { id: 'haken_staff', icon: UserSquare, title: 'Sending Company Staff', desc: 'Recruitment/external affairs staff of a sending company.' },
    { id: 'jp_hr_staff', icon: UserCog, title: 'Japan-side HR Staff', desc: 'Staff at a supervising, support, placement, or staffing agency.' },
    { id: 'dispatch', icon: Plane, title: 'Sending Company', desc: 'Recruit and dispatch workers from Vietnam.' },
    { id: 'support', icon: UserCheck, title: 'Support Organization (Shien Kikan)', desc: 'Support companies and workers.' },
    { id: 'enterprise', icon: Building, title: 'Accepting Company', desc: 'Directly recruit and employ workers.' },
    { id: 'union', icon: Handshake, title: 'Supervising Organization (Kumiai)', desc: 'Manage and support technical interns.' },
    { id: 'shokai', icon: Users, title: 'Paid Employment Placement Agency', desc: 'Provide paid job placement services.' },
    { id: 'haken', icon: Briefcase, title: 'Temporary Staffing Agency (Haken)', desc: 'Provide temporary worker dispatch services.' },
  ],
};


export function PartnerRoleDialog({ isOpen, onOpenChange, onSelect, onLanguageChange, initialLang = 'vi' }: PartnerRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    onSelect(roleId);
  };

  const handleLangChange = (lang: Language) => {
      setCurrentLang(lang);
      onLanguageChange(lang);
  }

  const dialogTitles = {
    vi: 'Bạn là ai?',
    ja: 'あなたの役割をお選びください',
    en: 'What is your role?',
  };

  const dialogDescriptions = {
    vi: 'Chọn vai trò phù hợp nhất với bạn để chúng tôi có thể hỗ trợ tốt hơn.',
    ja: 'より良いサポートを提供するために、あなたに最も適した役割を選択してください。',
    en: 'Select the role that best fits you so we can provide better support.',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl" id="NTD002">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">{dialogTitles[currentLang]}</DialogTitle>
          <DialogDescription className="text-center">
            {dialogDescriptions[currentLang]}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={currentLang} onValueChange={(value) => handleLangChange(value as Language)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vi" className="flex items-center gap-2"><VnFlagIcon /> Tiếng Việt</TabsTrigger>
                <TabsTrigger value="ja" className="flex items-center gap-2"><JpFlagIcon /> 日本語</TabsTrigger>
                <TabsTrigger value="en" className="flex items-center gap-2"><EnFlagIcon /> English</TabsTrigger>
            </TabsList>
            
            <div className="pt-6 max-h-[60vh] overflow-y-auto">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roles[currentLang].map((role) => (
                        <Card 
                            key={role.id} 
                            onClick={() => handleRoleSelect(role.id)}
                            className={cn(
                                "text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center",
                                selectedRole === role.id && "ring-2 ring-primary border-primary"
                            )}
                        >
                            <role.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="font-bold text-base mb-1">{role.title}</h3>
                            <p className="text-muted-foreground text-xs flex-grow">{role.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
