
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
import { Handshake, QrCode, Mail, Phone, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ZaloIcon, MessengerIcon, LineIcon } from './custom-icons';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';


type Language = 'vi' | 'ja' | 'en';

interface XL08DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (contactInfo: any) => void;
  onBack: () => void;
  lang: Language;
  recruitmentPrefs: any;
}

const contentByLang = {
    vi: {
        title: 'Xác nhận và Liên hệ',
        description: 'Vui lòng kiểm tra lại yêu cầu tuyển dụng và để lại thông tin để chúng tôi kết nối bạn với các đối tác phù hợp.',
        summaryTitle: 'Tóm tắt yêu cầu của bạn',
        contactTitle: 'Thông tin liên hệ',
        emailLabel: 'Email (bắt buộc)',
        otherContactLabel: 'Phương thức liên hệ khác (cần ít nhất 1)',
        phoneLabel: 'Số điện thoại',
        zaloLabel: 'Zalo',
        messengerLabel: 'Facebook Messenger',
        lineLabel: 'Line',
        backButton: 'Quay lại',
        completeButton: 'Hoàn tất & Gửi',
    },
    ja: {
        title: '確認と連絡先',
        description: '採用要件を確認し、適切なパートナーと繋がるために連絡先を残してください。',
        summaryTitle: '要件の概要',
        contactTitle: '連絡先情報',
        emailLabel: 'メールアドレス (必須)',
        otherContactLabel: 'その他の連絡方法 (最低1つ)',
        phoneLabel: '電話番号',
        zaloLabel: 'Zalo',
        messengerLabel: 'Facebook Messenger',
        lineLabel: 'Line',
        backButton: '戻る',
        completeButton: '完了して送信',
    },
    en: {
        title: 'Confirmation and Contact',
        description: 'Please review your recruitment request and leave your contact information so we can connect you with suitable partners.',
        summaryTitle: 'Your Request Summary',
        contactTitle: 'Contact Information',
        emailLabel: 'Email (required)',
        otherContactLabel: 'Other contact methods (at least 1)',
        phoneLabel: 'Phone Number',
        zaloLabel: 'Zalo',
        messengerLabel: 'Facebook Messenger',
        lineLabel: 'Line',
        backButton: 'Back',
        completeButton: 'Complete & Send',
    }
};

export function XL08Dialog({ isOpen, onOpenChange, onComplete, onBack, lang, recruitmentPrefs }: XL08DialogProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zalo, setZalo] = useState('');
  const [messenger, setMessenger] = useState('');
  const [line, setLine] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+84');
  const [zaloCountry, setZaloCountry] = useState('+84');
  const { toast } = useToast();

  const handleComplete = () => {
    if (!email) {
        toast({ variant: 'destructive', title: 'Thiếu thông tin', description: 'Vui lòng nhập địa chỉ email.' });
        return;
    }
    if (!phone && !zalo && !messenger && !line) {
        toast({ variant: 'destructive', title: 'Thiếu thông tin', description: 'Vui lòng cung cấp ít nhất một phương thức liên hệ khác.' });
        return;
    }
    onComplete({ email, phone: `${phoneCountry}${phone}`, zalo, messenger, line });
  };
  
  const content = contentByLang[lang];
  const dialogId = "X008";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" id={dialogId}>
        <DialogHeader className="text-center items-center">
            <div className="p-3 bg-primary/10 rounded-full w-fit">
                <Handshake className="h-8 w-8 text-primary"/>
            </div>
          <DialogTitle className="text-2xl font-headline">{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            <Card className="bg-secondary">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5"/>{content.summaryTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                    <p><strong>Loại hình:</strong> {recruitmentPrefs?.desiredVisaType}</p>
                    <p><strong>Chi tiết:</strong> {recruitmentPrefs?.desiredVisaDetail}</p>
                    <p><strong>Ngành nghề:</strong> {recruitmentPrefs?.desiredIndustry}</p>
                    <p><strong>Địa điểm:</strong> {recruitmentPrefs?.desiredLocation}</p>
                    <p><strong>Phí giới thiệu:</strong> {recruitmentPrefs?.referralFee} JPY</p>
                    <p><strong>Phí quản lý:</strong> {recruitmentPrefs?.managementFee} JPY/tháng</p>
                </CardContent>
            </Card>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-bold text-lg">{content.contactTitle}</h3>
                 <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4"/> {content.emailLabel}</Label>
                    <Input id="email" type="email" placeholder="contact@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                 <div className="space-y-4 p-4 rounded-lg border">
                    <Label>{content.otherContactLabel}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" />{content.phoneLabel}</Label>
                             <div className="flex items-center">
                                <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                                    <SelectTrigger className="w-[80px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN</SelectItem>
                                        <SelectItem value="+81">JP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="phone" type="tel" placeholder="901234567" className="rounded-l-none" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="zalo" className="flex items-center gap-2"><ZaloIcon className="h-4 w-4" />{content.zaloLabel}</Label>
                             <div className="flex items-center relative">
                                <Select value={zaloCountry} onValueChange={setZaloCountry}>
                                    <SelectTrigger className="w-[80px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN</SelectItem>
                                        <SelectItem value="+81">JP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="zalo" type="tel" placeholder="901234567" className="rounded-l-none" value={zalo} onChange={(e) => setZalo(e.target.value.replace(/\D/g, ''))} />
                                <div className="absolute right-2 cursor-pointer text-muted-foreground hover:text-primary">
                                    <QrCode className="h-5 w-5"/>
                                </div>
                            </div>
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="messenger" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4" />{content.messengerLabel}</Label>
                            <Input id="messenger" placeholder="Dán link hoặc username" value={messenger} onChange={(e) => setMessenger(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="line" className="flex items-center gap-2"><LineIcon className="h-4 w-4" />{content.lineLabel}</Label>
                            <Input id="line" placeholder="Dán link hoặc Line ID" value={line} onChange={(e) => setLine(e.target.value)} />
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onBack}>
                {content.backButton}
            </Button>
            <Button onClick={handleComplete}>
                {content.completeButton}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
