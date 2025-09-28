
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
    }
};

const formatNumber = (numStr: string | number) => {
    if (!numStr) return '';
    const num = Number(String(numStr).replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
};

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
        
        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <Card className="bg-secondary">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5"/>{content.summaryTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p><strong>Loại hình:</strong> {recruitmentPrefs?.desiredVisaType}</p>
                    <p><strong>Chi tiết:</strong> {recruitmentPrefs?.desiredVisaDetail}</p>
                    <p><strong>Ngành nghề:</strong> {recruitmentPrefs?.desiredIndustry}</p>
                    <p><strong>Địa điểm:</strong> {recruitmentPrefs?.desiredLocation}</p>
                    <p><strong>Phí giới thiệu:</strong> {formatNumber(recruitmentPrefs?.referralFee)} JPY</p>
                    <p><strong>Phí quản lý:</strong> {formatNumber(recruitmentPrefs?.managementFee)} JPY/tháng</p>
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

        <DialogFooter className="flex-col items-center gap-4 border-t pt-6">
            <div className="text-center">
                <p className="text-sm font-semibold">{content.supportTitle}</p>
                <p className="text-sm">Email: <a href="mailto:chairman@hellojob.jp" className="text-primary hover:underline">chairman@hellojob.jp</a></p>
                <div className="flex justify-center gap-2 mt-2">
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
            <Button onClick={onComplete} className="w-full sm:w-auto">
                {content.completeButton}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
