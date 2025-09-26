
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
import { Building, User, Briefcase, Handshake, Scale, UserCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from './custom-icons';

interface PartnerRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const roles = {
  vi: [
    { id: 'enterprise', icon: Building, title: 'Xí nghiệp/Công ty tiếp nhận', desc: 'Đang tìm kiếm nhân sự' },
    { id: 'dispatch', icon: Handshake, title: 'Công ty phái cử', desc: 'Đang có ứng viên' },
    { id: 'union', icon: Users, title: 'Nghiệp đoàn', desc: 'Hỗ trợ thực tập sinh' },
    { id: 'shokai', icon: Briefcase, title: 'Shokai/Giới thiệu việc làm', desc: 'Có việc làm cho ứng viên' },
    { id: 'lawyer', icon: Scale, title: 'Luật sư/Văn phòng luật', desc: 'Hỗ trợ thủ tục pháp lý' },
    { id: 'individual', icon: UserCircle, title: 'Cá nhân/Khác', desc: 'Cộng tác viên hoặc vai trò khác' },
  ],
  ja: [
    { id: 'enterprise', icon: Building, title: '受け入れ企業', desc: '人材を探している' },
    { id: 'dispatch', icon: Handshake, title: '送り出し機関', desc: '候補者がいる' },
    { id: 'union', icon: Users, title: '監理団体', desc: '実習生を支援する' },
    { id: 'shokai', icon: Briefcase, title: '紹介会社', desc: '候補者向けの仕事がある' },
    { id: 'lawyer', icon: Scale, title: '弁護士/法律事務所', desc: '法的手続きを支援する' },
    { id: 'individual', icon: UserCircle, title: '個人/その他', desc: '協力者または他の役割' },
  ],
  en: [
    { id: 'enterprise', icon: Building, title: 'Accepting Company', desc: 'Looking for personnel' },
    { id: 'dispatch', icon: Handshake, title: 'Dispatching Company', desc: 'Have candidates' },
    { id: 'union', icon: Users, title: 'Supervising Organization', desc: 'Support for trainees' },
    { id: 'shokai', icon: Briefcase, title: 'Recruitment Agency (Shokai)', desc: 'Have jobs for candidates' },
    { id: 'lawyer', icon: Scale, title: 'Lawyer/Law Office', desc: 'Support for legal procedures' },
    { id: 'individual', icon: UserCircle, title: 'Individual/Other', desc: 'Collaborator or other roles' },
  ],
};

type Language = 'vi' | 'ja' | 'en';

export function PartnerRoleDialog({ isOpen, onOpenChange }: PartnerRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('vi');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // Here you would typically handle the logic after a role is selected,
    // e.g., redirecting to a specific registration form.
    console.log(`Selected role: ${roleId}`);
    onOpenChange(false); // Close dialog after selection
  };

  const dialogTitles = {
    vi: 'Bạn là ai?',
    ja: 'あなたは誰ですか？',
    en: 'Who are you?',
  };

  const dialogDescriptions = {
    vi: 'Chọn vai trò phù hợp nhất với bạn để chúng tôi có thể hỗ trợ tốt hơn.',
    ja: 'より良いサポートを提供するために、あなたに最も適した役割を選択してください。',
    en: 'Select the role that best fits you so we can provide better support.',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" id="NTD002">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">{dialogTitles[currentLang]}</DialogTitle>
          <DialogDescription className="text-center">
            {dialogDescriptions[currentLang]}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="vi" onValueChange={(value) => setCurrentLang(value as Language)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vi" className="flex items-center gap-2"><VnFlagIcon /> Tiếng Việt</TabsTrigger>
                <TabsTrigger value="ja" className="flex items-center gap-2"><JpFlagIcon /> 日本語</TabsTrigger>
                <TabsTrigger value="en" className="flex items-center gap-2"><EnFlagIcon /> English</TabsTrigger>
            </TabsList>
            
            <div className="pt-6">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                            <p className="text-muted-foreground text-xs">{role.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </Tabs>

        <div className="mt-4 text-center">
            <Button variant="link" onClick={() => onOpenChange(false)}>Quay lại</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
