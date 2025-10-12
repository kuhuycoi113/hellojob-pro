
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, FileSignature, BarChart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CtaNhaTuyenDungHomePage } from '@/components/cta-nha-tuyen-dung-home-page';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { YL01Dialog } from '@/components/Y-L01-dialog';
import { XL01Dialog } from '@/components/X-L01-dialog';


const partnerBenefits = [
  { 
    icon: Users,
    title: {
        vi: 'Nguồn ứng viên dồi dào',
        ja: '豊富な候補者源',
        en: 'Abundant Candidate Pool'
    },
    description: {
        vi: 'Tiếp cận hệ thống dữ liệu ứng viên Kỹ năng Đặc định (Tokutei) đã được sàng lọc và xác thực thông tin ban đầu.',
        ja: '事前にスクリーニング・検証された特定技能候補者のデータベースにアクセスできます。',
        en: 'Access a database of Special Skilled Worker (Tokutei) candidates that has been pre-screened and verified.'
    }
  },
  { 
    icon: FileSignature,
    title: {
        vi: 'Công cụ quản lý hiệu quả',
        ja: '効率的な管理ツール',
        en: 'Effective Management Tools'
    }, 
    description: {
        vi: 'Sử dụng nền tảng để quản lý tin tuyển dụng, theo dõi trạng thái ứng viên và tương tác một cách chuyên nghiệp.',
        ja: 'プラットフォームを使用して、求人情報を管理し、候補者の状況を追跡し、専門的に対話します。',
        en: 'Use the platform to manage job postings, track candidate status, and interact professionally.'
    }
  },
  { 
    icon: BarChart,
    title: {
        vi: 'Hỗ trợ Marketing & Vận hành',
        ja: 'マーケティング・運営支援',
        en: 'Marketing & Operations Support'
    },
    description: {
        vi: 'Được hỗ trợ quảng bá tin tuyển dụng trên các kênh của HelloJob, tiếp cận đúng đối tượng mục tiêu và tối ưu hóa hiệu quả.',
        ja: 'HelloJobのチャネルで求人広告を宣伝し、適切なターゲット層にリーチし、効果を最適化するためのサポートを受けられます。',
        en: 'Receive support to promote job postings on HelloJob\'s channels, reaching the right target audience and optimizing effectiveness.'
    }
  },
  {
    icon: ShieldCheck,
    title: {
        vi: 'Hợp tác minh bạch',
        ja: '透明性の高い協力体制',
        en: 'Transparent Partnership'
    },
    description: {
        vi: 'Quy trình hợp tác rõ ràng, cơ chế chia sẻ doanh thu hấp dẫn và minh bạch, đảm bảo quyền lợi cho đối tác.',
        ja: '明確な協力プロセス、魅力的で透明な収益分配メカニズムにより、パートナーの利益を保証します。',
        en: 'A clear cooperation process, along with an attractive and transparent revenue-sharing mechanism, ensures benefits for partners.'
    }
  }
];

const welcomeContent = {
    title: {
        vi: "Chào mừng các Đối tác Tuyển dụng",
        ja: "採用パートナー様へようこそ",
        en: "Welcome, Recruiting Partners"
    },
    description1: {
        vi: "HelloJob là hệ thống giúp các đối tác đăng tải thông tin việc làm miễn phí để tuyển dụng ứng viên Việt Nam. Chúng tôi chào mừng các đối tác là Cá nhân (làm việc cho các tổ chức nhân lực) hoặc Pháp nhân tại Việt Nam và Nhật Bản.",
        ja: "HelloJobはベトナム人候補者を採用するための無料求人投稿プラットフォームです。私たちは、ベトナムおよび日本国内の個人（人材組織勤務）または法人パートナーを歓迎します。",
        en: "HelloJob is a free job posting platform for partners to post jobs to recruit Vietnamese candidates. We welcome partners who are Individuals (working for HR organizations) or Legal Entities in Vietnam and Japan."
    },
    mainRecruitmentTitle: {
        vi: "Các loại hình tuyển dụng chính:",
        ja: "主な採用形態:",
        en: "Main recruitment types:"
    },
    recruitmentTypes: [
        { vi: "- Kỹ năng đặc định (特定技能)", ja: "- 特定技能", en: "- Specified Skilled Worker (特定技能)" },
        { vi: "- Thực tập sinh kỹ năng (技能実習)", ja: "- 技能実習", en: "- Technical Intern Training (技能実習)" },
        { vi: "- Kỹ sư, tri thức (技術・人文知識・国際業務 - 技人国)", ja: "- 技術・人文知識・国際業務", en: "- Engineer/Specialist in Humanities/International Services (技人国)" }
    ],
    description2: {
        vi: "Bạn có thể đăng việc làm ngay hoặc để lại thông tin liên hệ để tìm hiểu về cơ chế hợp tác.",
        ja: "すぐに求人を掲載するか、連絡先を残して協力体制についてご相談ください。",
        en: "You can post a job now or leave your contact information to learn about our partnership model."
    },
    postJobButton: {
        vi: "Đăng tin tuyển dụng ngay",
        ja: "求人を掲載",
        en: "Post Job Now"
    },
    registerPartnerButton: {
        vi: "Đăng ký đối tác",
        ja: "パートナー登録",
        en: "Register as Partner"
    }
};

type Language = 'vi' | 'ja' | 'en';

function NhaTuyenDungPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isYL01DialogOpen, setIsYL01DialogOpen] = useState(false);
  const [isXL01DialogOpen, setIsXL01DialogOpen] = useState(false);
  const [recruitmentPrefs, setRecruitmentPrefs] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState<Language>('vi');

  useEffect(() => {
    if (searchParams.get('action') === 'register') {
      setIsYL01DialogOpen(true);
    }
  }, [searchParams]);

  const navigateToEmployerPage = (data: any) => {
    const params = new URLSearchParams();
    if (data.role) params.set('role', data.role);
    if (data.sub_role) params.set('sub_role', data.sub_role);
    if (data.name) params.set('name', data.name);
    if (data.company_name) params.set('company_name', data.company_name);
    if (data.lang) params.set('lang', data.lang);

    (data.interest || []).forEach((item: string) => params.append('interest', item));
    (data.value_interest || []).forEach((item: string) => params.append('value_interest', item));
    (data.visaType || []).forEach((item: string) => params.append('visa_type', item));
    (data.visaDetail || []).forEach((item: string) => params.append('visa_detail', item));
    (data.industry || []).forEach((item: string) => params.append('industry', item));
    (data.location || []).forEach((item: string) => params.append('location', item));
    
    if (pathname) {
      params.set('from', pathname);
    }
    
    router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
    setIsYL01DialogOpen(false);
  };
  
   const handleXL01Complete = (preferences: any) => {
    console.log("X-L01 Completed with:", preferences);
    setRecruitmentPrefs(preferences);
    setIsXL01DialogOpen(false);
    // Potentially open next dialog here
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Hero Section for Partnership - Replaced with the new, specific component */}
        <CtaNhaTuyenDungHomePage />

        {/* Featured Benefits */}
        <section className="w-full py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Lợi ích dành cho Đối tác
                  <span className="block text-lg text-muted-foreground mt-2">パートナーのメリット / Benefits for Partners</span>
              </h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                Chúng tôi cung cấp một nền tảng toàn diện với các công cụ và sự hỗ trợ cần thiết để giúp bạn thành công.
                <span className="block text-sm text-muted-foreground/80 mt-1">私たちは、パートナーの成功に必要なツールとサポートを備えた包括的なプラットフォームを提供します。</span>
                <span className="block text-sm text-muted-foreground/80 mt-1">We provide a comprehensive platform with the necessary tools and support to help you succeed.</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              {partnerBenefits.map(feature => (
                <Card key={feature.title.vi} className="text-center p-6 border-t-4 border-primary shadow-lg hover:shadow-xl transition-shadow h-full">
                   <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                   <h3 className="text-xl font-bold font-headline mb-2">{feature.title.vi}</h3>
                   <p className="text-muted-foreground text-sm">{feature.description.vi}</p>
                   <div className="mt-4 pt-4 border-t border-dashed">
                      <p className="text-sm font-semibold text-muted-foreground">{feature.title.ja}</p>
                      <p className="text-xs text-muted-foreground/80 mt-1">{feature.description.ja}</p>
                   </div>
                   <div className="mt-2">
                      <p className="text-sm font-semibold text-muted-foreground">{feature.title.en}</p>
                      <p className="text-xs text-muted-foreground/80 mt-1">{feature.description.en}</p>
                   </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
              <Card className="p-8 md:p-12 bg-secondary border-none">
                   <div className="text-center">
                      <h2 className="text-3xl font-bold font-headline mb-4">
                          {welcomeContent.title.vi}
                          <span className="block text-lg text-muted-foreground mt-2">{welcomeContent.title.ja} / {welcomeContent.title.en}</span>
                      </h2>
                      <p className="text-muted-foreground max-w-4xl mx-auto">
                          {welcomeContent.description1.vi}
                          <span className="block text-sm text-muted-foreground/80 mt-2">{welcomeContent.description1.ja}</span>
                          <span className="block text-sm text-muted-foreground/80 mt-1">{welcomeContent.description1.en}</span>
                      </p>
                      <div className="mt-6 bg-background p-6 rounded-lg inline-block text-left">
                          <h3 className="font-semibold mb-3">{welcomeContent.mainRecruitmentTitle.vi}</h3>
                          <ul className="space-y-1 text-muted-foreground">
                             {welcomeContent.recruitmentTypes.map(type => (
                                 <li key={type.vi}>{type.vi}</li>
                             ))}
                          </ul>
                      </div>
                       <p className="mt-6 text-muted-foreground max-w-4xl mx-auto">
                          {welcomeContent.description2.vi}
                          <span className="block text-sm text-muted-foreground/80 mt-2">{welcomeContent.description2.ja}</span>
                          <span className="block text-sm text-muted-foreground/80 mt-1">{welcomeContent.description2.en}</span>
                      </p>
                      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                          <Button size="lg" className="bg-primary text-white hover:bg-primary/90" onClick={() => setIsXL01DialogOpen(true)}>
                            <div className="text-center">
                                <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                                <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                            </div>
                          </Button>
                         <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" onClick={() => setIsYL01DialogOpen(true)}>
                          
                            <div className="text-center">
                                <span className="font-semibold">Đăng ký đối tác</span>
                                <div className="text-xs opacity-80">パートナー登録 / Register as Partner</div>
                            </div>
                          
                        </Button>
                    </div>
                   </div>
              </Card>
          </div>
        </section>

      </div>
       <YL01Dialog 
        isOpen={isYL01DialogOpen} 
        onOpenChange={setIsYL01DialogOpen}
        onLanguageChange={setSelectedLang}
        initialLang={selectedLang}
        initialStep={1}
        onComplete={navigateToEmployerPage}
        onBack={() => setIsYL01DialogOpen(false)}
        fromPath={pathname}
      />
       <XL01Dialog 
        isOpen={isXL01DialogOpen} 
        onOpenChange={setIsXL01DialogOpen}
        onLanguageChange={setSelectedLang}
        initialLang={selectedLang}
        initialStep={1}
        onComplete={handleXL01Complete}
        onBack={() => setIsXL01DialogOpen(false)}
      />
    </>
  );
}

export default function NhaTuyenDungPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NhaTuyenDungPageContent />
        </Suspense>
    )
}
