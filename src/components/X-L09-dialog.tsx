
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Info, Contact } from 'lucide-react';
import { ZaloIcon, MessengerIcon, LineIcon } from './custom-icons';
import Image from 'next/image';
import Link from 'next/link';

type Language = 'vi' | 'ja' | 'en';

interface XL09DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onBack: () => void;
  lang: Language;
  recruitmentPrefs: any;
  contactInfo: any;
}

const contentByLang = {
    vi: {
        title: 'Yêu cầu đã được gửi thành công!',
        description: 'Cảm ơn bạn đã quan tâm. Chúng tôi sẽ sớm liên hệ với bạn để thảo luận về các cơ hội hợp tác.',
        summaryTitle: 'Tóm tắt yêu cầu của bạn',
        contactTitle: 'Thông tin liên hệ của bạn',
        emailLabel: 'Email',
        phoneLabel: 'Điện thoại',
        zaloLabel: 'Zalo',
        messengerLabel: 'Messenger',
        lineLabel: 'Line',
        supportTitle: 'Nếu cần hỗ trợ ngay, vui lòng liên hệ:',
        completeButton: 'Hoàn thành',
        programType: 'Loại hình',
        details: 'Chi tiết',
        industry: 'Ngành nghề',
        location: 'Địa điểm',
        referralFee: 'Phí giới thiệu',
        managementFee: 'Phí quản lý',
        perMonth: '/tháng',
    },
    ja: {
        title: 'リクエストは正常に送信されました！',
        description: 'ご関心をお寄せいただきありがとうございます。協力の機会について話し合うため、間もなくご連絡いたします。',
        summaryTitle: 'リクエストの概要',
        contactTitle: 'あなたの連絡先情報',
        emailLabel: 'メール',
        phoneLabel: '電話',
        zaloLabel: 'Zalo',
        messengerLabel: 'メッセンジャー',
        lineLabel: 'Line',
        supportTitle: 'サポートがすぐに必要な場合は、以下にご連絡ください：',
        completeButton: '完了',
        programType: 'プログラム種別',
        details: '詳細',
        industry: '業種',
        location: '勤務地',
        referralFee: '紹介料',
        managementFee: '管理費',
        perMonth: '/月',
    },
    en: {
        title: 'Request Sent Successfully!',
        description: 'Thank you for your interest. We will contact you shortly to discuss partnership opportunities.',
        summaryTitle: 'Your Request Summary',
        contactTitle: 'Your Contact Information',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        zaloLabel: 'Zalo',
        messengerLabel: 'Messenger',
        lineLabel: 'Line',
        supportTitle: 'For immediate assistance, please contact:',
        completeButton: 'Complete',
        programType: 'Program Type',
        details: 'Details',
        industry: 'Industry',
        location: 'Location',
        referralFee: 'Referral Fee',
        managementFee: 'Management Fee',
        perMonth: '/month',
    }
};

const formatNumber = (numStr: string | number) => {
    if (!numStr) return '';
    const num = Number(String(numStr).replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
};

const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);


export function XL09Dialog({ isOpen, onOpenChange, onComplete, onBack, lang, recruitmentPrefs, contactInfo }: XL09DialogProps) {
  const content = contentByLang[lang];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" id="X009">
        <DialogHeader className="text-center items-center">
          <div className="p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-headline">{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5"/>{content.summaryTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p><strong>{content.programType}:</strong> {recruitmentPrefs?.desiredVisaType}</p>
                        <p><strong>{content.details}:</strong> {recruitmentPrefs?.desiredVisaDetail}</p>
                        <p><strong>{content.industry}:</strong> {recruitmentPrefs?.desiredIndustry}</p>
                        <p><strong>{content.location}:</strong> {recruitmentPrefs?.desiredLocation}</p>
                        <p><strong>{content.referralFee}:</strong> {formatNumber(recruitmentPrefs?.referralFee)} JPY</p>
                        <p><strong>{content.managementFee}:</strong> {formatNumber(recruitmentPrefs?.managementFee)} JPY{content.perMonth}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Contact className="h-5 w-5"/>{content.contactTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p><strong>{content.emailLabel}:</strong> {contactInfo?.email}</p>
                        {contactInfo?.phone && <p><strong>{content.phoneLabel}:</strong> {contactInfo?.phone}</p>}
                        {contactInfo?.zalo && <p><strong>{content.zaloLabel}:</strong> {contactInfo?.zalo}</p>}
                        {contactInfo?.messenger && <p><strong>{content.messengerLabel}:</strong> {contactInfo?.messenger}</p>}
                        {contactInfo?.line && <p><strong>{content.lineLabel}:</strong> {contactInfo?.line}</p>}
                    </CardContent>
                </Card>
            </div>
        </div>

        <DialogFooter className="flex-col md:flex-row md:justify-between md:items-center gap-4 border-t pt-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <p className="text-sm font-semibold">{content.supportTitle}</p>
                <a href="mailto:chairman@hellojob.jp" className="text-sm text-primary hover:underline">Email: chairman@hellojob.jp</a>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                    <div className="md:block">
                      <Logo />
                    </div>
                    <Button asChild variant="outline" size="icon" className="h-10 w-10 border-green-500 hover:bg-green-50">
                        <Link href="tel:0386667999"><Image src="/img/phone.svg" alt="Phone" width={20} height={20} /></Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="h-10 w-10 border-blue-500 hover:bg-blue-50">
                        <Link href="https://zalo.me/your_zalo_id"><ZaloIcon /></Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="h-10 w-10 border-purple-500 hover:bg-purple-50">
                        <Link href="https://m.me/your_user_id"><MessengerIcon /></Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="h-10 w-10 border-green-700 hover:bg-green-100">
                        <Link href="https://line.me/ti/p/~your_line_id"><LineIcon /></Link>
                    </Button>
                </div>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-center">
                 <Button onClick={onComplete} variant="ghost" size="lg" className="w-full md:w-auto md:px-8">
                    {content.completeButton}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
