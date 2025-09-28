
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
import { Handshake, QrCode, Mail, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ZaloIcon, MessengerIcon, LineIcon } from './custom-icons';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


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

const formatPhoneNumberInput = (value: string, country: string): string => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');

    if (country === '+84') { // Vietnam (10 digits starting with 0)
        if (cleanValue.length === 0) return '';
        if (!cleanValue.startsWith('0')) return `0${cleanValue}`.slice(0,10);
        if (cleanValue.length === 1) return `(0)`;

        const mobilePart = cleanValue.substring(1);
        if (mobilePart.length <= 3) return `(0) ${mobilePart}`;
        if (mobilePart.length <= 6) return `(0) ${mobilePart.slice(0, 3)} ${mobilePart.slice(3)}`;
        return `(0) ${mobilePart.slice(0, 3)} ${mobilePart.slice(3, 6)} ${mobilePart.slice(6, 9)}`;
    }

    if (country === '+81') { // Japan (11 digits total starting with 0)
        if (cleanValue.length === 0) return '';
        if (!cleanValue.startsWith('0')) return `0${cleanValue}`.slice(0,11);
        if (cleanValue.length === 1) return `(0)`;
        
        const mobilePart = cleanValue.substring(1); 
        if (mobilePart.length <= 2) return `(0)${mobilePart}`;
        if (mobilePart.length <= 6) return `(0)${mobilePart.slice(0,2)} ${mobilePart.slice(2, 6)}`;
        return `(0)${mobilePart.slice(0,2)} ${mobilePart.slice(2,6)} ${mobilePart.slice(6,10)}`;
    }

    return cleanValue;
};

const parseMessengerInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    try {
        if (trimmedInput.startsWith('http') || trimmedInput.includes('facebook.com') || trimmedInput.includes('m.me')) {
            const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);
            
            if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
                const id = url.searchParams.get('id');
                if (id && /^\d+$/.test(id)) {
                    return id; // Return numeric ID if found in profile.php
                }
                // For vanity URLs like facebook.com/username
                const pathParts = url.pathname.split('/').filter(part => part && part !== 'profile.php' && part !== 'people');
                if (pathParts.length > 0) {
                    return pathParts[pathParts.length - 1];
                }
            }
             if (url.hostname.includes('m.me')) {
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                     return pathParts[pathParts.length - 1];
                }
            }
        }
    } catch (error) {
        // Not a valid URL, treat as a potential username
        console.warn("Could not parse Messenger input as URL, treating as username:", error);
    }
    // Fallback: treat as username, remove any URL-like parts
    return trimmedInput.split('/').pop() || trimmedInput;
};

const parseZaloInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    if (trimmedInput.includes('zalo.me/')) {
        const parts = trimmedInput.split('/');
        return parts.pop()?.replace(/\D/g, '') || '';
    }
    return trimmedInput.replace(/\D/g, '');
};

const parseLineInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
      if (trimmedInput.startsWith('http') && trimmedInput.includes('line.me/')) {
          const url = new URL(trimmedInput);
          const pathParts = url.pathname.split('/');
          let potentialId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
          if (potentialId) {
             // Remove query parameters
             potentialId = potentialId.split('?')[0];
             // Remove leading ~ or @ if present
             return potentialId.replace(/^[~@]/, '');
          }
      }
  } catch (error) {
       console.warn("Could not parse Line input as URL, treating as ID:", error);
  }
  // Fallback to treat the whole input as an ID, removing potential URL parts and special characters
  return trimmedInput.split('/').pop()?.replace(/^[~@]/, '') || trimmedInput.replace(/^[~@]/, '');
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
  const [errors, setErrors] = useState<{ messenger?: string, line?: string }>({});

  const validateField = (field: 'messenger' | 'line', value: string) => {
    if (!value) {
        setErrors(prev => ({...prev, [field]: undefined }));
        return true;
    }

    let isValid = false;
    let errorMessage = "Định dạng không hợp lệ.";

    if (field === 'messenger') {
        isValid = /^(https?:\/\/(www\.)?(facebook|m)\.com\/|m\.me\/|[\w.]{5,})/.test(value);
        errorMessage = "Vui lòng nhập link Facebook/Messenger hoặc username hợp lệ.";
    } else if (field === 'line') {
        isValid = /^(https?:\/\/line\.me\/|@?[\w.-]+)/.test(value);
        errorMessage = "Vui lòng nhập link Line hoặc Line ID hợp lệ.";
    }
    
    if (isValid) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
        setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
    return isValid;
  };

  const handleComplete = () => {
    const isMessengerValid = validateField('messenger', messenger);
    const isLineValid = validateField('line', line);
    
    if (!isMessengerValid || !isLineValid) {
        toast({ variant: 'destructive', title: 'Thông tin không hợp lệ', description: 'Vui lòng sửa các lỗi được hiển thị trước khi lưu.' });
        return;
    }

    if (!email) {
        toast({ variant: 'destructive', title: 'Thiếu thông tin', description: 'Vui lòng nhập địa chỉ email.' });
        return;
    }
    if (!phone && !zalo && !messenger && !line) {
        toast({ variant: 'destructive', title: 'Thiếu thông tin', description: 'Vui lòng cung cấp ít nhất một phương thức liên hệ khác.' });
        return;
    }
    onComplete({ 
        email, 
        phone: `${phoneCountry}${phone}`, 
        zalo: parseZaloInput(zalo), 
        messenger: parseMessengerInput(messenger), 
        line: parseLineInput(line) 
    });
  };
  
  const content = contentByLang[lang];
  
  const formatNumber = (numStr: string | number) => {
    if (!numStr) return '';
    const num = Number(String(numStr).replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" id="X008">
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
                    <p><strong>Phí giới thiệu:</strong> {formatNumber(recruitmentPrefs?.referralFee)} JPY</p>
                    <p><strong>Phí quản lý:</strong> {formatNumber(recruitmentPrefs?.managementFee)} JPY/tháng</p>
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
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Image src="/img/phone.svg" alt="Phone" width={16} height={16} />
                                {content.phoneLabel}
                            </Label>
                             <div className="flex items-center">
                                <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                                    <SelectTrigger className="w-[80px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN</SelectItem>
                                        <SelectItem value="+81">JP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="phone" type="tel" placeholder={phoneCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(phone, phoneCountry)} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
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
                                <Input id="zalo" type="tel" placeholder={zaloCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(zalo, zaloCountry)} onChange={(e) => setZalo(e.target.value.replace(/\D/g, ''))} />
                            </div>
                        </div>
                         <div className="space-y-1">
                             <Label htmlFor="messenger" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4" />{content.messengerLabel}</Label>
                            <Input
                                id="messenger"
                                placeholder="Dán link Facebook / Messenger hoặc username"
                                value={messenger}
                                onChange={(e) => setMessenger(e.target.value)}
                                onBlur={(e) => validateField('messenger', e.target.value)}
                                className={cn(errors.messenger && "border-destructive")}
                            />
                            {errors.messenger && <p className="text-xs text-destructive">{errors.messenger}</p>}
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="line" className="flex items-center gap-2"><LineIcon className="h-4 w-4" />{content.lineLabel}</Label>
                            <Input
                                id="line"
                                placeholder="Dán link Line hoặc nhập ID của bạn"
                                value={line}
                                onChange={(e) => setLine(e.target.value)}
                                onBlur={(e) => validateField('line', e.target.value)}
                                className={cn(errors.line && "border-destructive")}
                            />
                             {errors.line && <p className="text-xs text-destructive">{errors.line}</p>}
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

    