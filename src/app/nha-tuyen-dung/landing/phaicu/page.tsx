
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, DollarSign, Users, Search, CheckCircle, TrendingUp, BarChart, FileSignature, ShieldCheck, BrainCircuit, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from '@/components/custom-icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XL01Dialog } from '@/components/X-L01-dialog';
import { YL01Dialog } from '@/components/Y-L01-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { CtaHienThiViec08 } from '@/components/cta-hien-thi-viec-08';
import { ActivityPhotos } from '@/components/activity-photos';


type Language = 'vi' | 'ja' | 'en';

const pageContent = {
    vi: {
        heroTitle: {
            main: "Giải pháp Công nghệ cho Công ty Phái cử Việt Nam",
            points: [
                "Kết nối trực tiếp với Nghiệp đoàn & Xí nghiệp Nhật Bản.",
                "Tự động hóa quy trình, giảm chi phí, tối đa lợi nhuận.",
                "Xây dựng thương hiệu phái cử uy tín trên nền tảng số."
            ]
        },
        heroDescription: "HelloJob mang đến giải pháp công nghệ toàn diện, giúp các công ty phái cử (xuất khẩu lao động) vượt qua mọi thách thức, chủ động kết nối đối tác và đột phá trong kỷ nguyên số.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "3 Thách thức lớn nhất của Công ty Phái cử",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà bạn đang đối mặt hàng ngày trong cuộc cạnh tranh khốc liệt.",
        painPoints: [
            {
                icon: Users,
                title: 'Nguồn lao động không đáp ứng yêu cầu',
                description: 'Lao động thiếu tay nghề, ngoại ngữ; trong khi đối tác Nhật ngày càng nâng cao tiêu chuẩn, dẫn đến tỷ lệ trượt đơn hàng cao và lãng phí chi phí đào tạo.',
            },
            {
                icon: FileSignature,
                title: 'Rủi ro pháp lý & uy tín',
                description: 'Quy định pháp luật thay đổi liên tục, rủi ro lao động bỏ trốn gây mất uy tín, ảnh hưởng đến giấy phép và các hợp đồng quốc tế.',
            },
            {
                icon: DollarSign,
                title: 'Áp lực tài chính & chi phí',
                description: 'Doanh thu phụ thuộc phí dịch vụ bị siết chặt, trong khi chi phí tuyển dụng, đào tạo, quản lý ngày càng cao, gây khó khăn cho việc vận hành và tái đầu tư.',
            },
        ],
        solutionsTitle: "Giải pháp Công nghệ từ HelloJob dành cho bạn",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng các công cụ mạnh mẽ và tự động.",
        solutions: [
            {
                icon: Users,
                title: 'Mở rộng mạng lưới, Nâng cao chất lượng nguồn',
                image: '/img/NTD/phaicu01.jpg',
                details: [
                    'Kết nối trực tiếp với hàng trăm Nghiệp đoàn và Xí nghiệp tại Nhật đang có nhu cầu tuyển dụng.',
                    'Đăng tin tuyển dụng miễn phí, không giới hạn để thu hút ứng viên chất lượng từ khắp nơi trên nền tảng của chúng tôi.',
                    'Sử dụng hệ thống E-learning để chuẩn hóa đào tạo ngoại ngữ và kỹ năng cho lao động.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Tối ưu hóa vận hành & Tăng cường lợi nhuận',
                image: '/img/NTD/phaicu02.jpg',
                details: [
                    'Cung cấp bộ công cụ số hóa để quản lý ứng viên, lịch phỏng vấn và theo dõi tiến độ, giảm thiểu giấy tờ và quy trình thủ công.',
                    'Hệ thống báo cáo tự động giúp theo dõi hiệu quả, tối ưu chi phí và lợi nhuận trên từng đơn hàng.',
                    'Giảm chi phí marketing và tuyển sinh nhờ nguồn ứng viên có sẵn trên nền tảng.',
                ],
            },
            {
                icon: ShieldCheck,
                title: 'Xây dựng thương hiệu & Giảm thiểu rủi ro pháp lý',
                image: '/img/NTD/phaicu03.jpg',
                details: [
                    'Xây dựng profile doanh nghiệp chuyên nghiệp trên HelloJob để quảng bá năng lực và uy tín tới các đối tác Nhật Bản.',
                    'Cập nhật liên tục các thay đổi về luật pháp, giúp bạn luôn tuân thủ và giảm rủi ro.',
                    'Tăng cường minh bạch thông tin trong quá trình tuyển dụng để tạo niềm tin cho cả lao động và đối tác.',
                ],
            },
        ],
        finalCtaTitle: "Sẵn sàng chuyển đổi số và bứt phá trong ngành phái cử?",
        finalCtaDescription: "Trở thành đối tác của HelloJob ngay hôm nay để kết nối toàn cầu, tối ưu hóa quy trình và xây dựng thương hiệu phái cử uy tín, bền vững.",
        finalCtaRegister: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner Now"
        },
        finalCtaPost: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
    },
    ja: {
        heroTitle: {
            main: "ベトナムの送り出し機関向け技術ソリューション",
            points: ["日本の組合・企業と直接連携。", "プロセスを自動化し、コストを削減、利益を最大化。", "デジタルプラットフォーム上で信頼できるブランドを構築。"],
            description: "HelloJobは、送り出し機関（ベトナムの労働者派遣会社）があらゆる課題を克服し、主体的にパートナーと連携し、デジタル時代に飛躍するための包括的な技術ソリューションを提供します。"
        },
        ctaPostJob: { main: "無料で求人掲載", sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free" },
        ctaRegisterPartner: { main: "パートナー登録", sub: "Đăng ký đối tác / Register as Partner" },
        painPointsTitle: "送り出し機関の3大課題",
        painPointsDescription: "HelloJobは、あなたが熾烈な競争の中で日々直面している「痛み」を明確に認識しています。",
        painPoints: [
            { icon: Users, title: '人材の質が要求に満たない', description: '労働者のスキル、語学力、規律意識が不足しており、日本のパートナーの基準は高まる一方で、不合格率が高く、研修費用が無駄になります。' },
            { icon: FileSignature, title: '法的リスクと信用の問題', description: '国内外の法規制が絶えず変化し、労働者の失踪リスクが信用を損ない、ライセンスや国際契約に影響を与えます。' },
            { icon: DollarSign, title: '財政的圧力とコスト', description: '手数料収入が厳しく規制される一方、採用、研修、管理コストは増加し、運営と再投資が困難になります。' }
        ],
        solutionsTitle: "あなたのためのHelloJobの技術ソリューション",
        solutionsDescription: "私たちは強力で自動化されたツールによって、あなたの各課題を成長の機会に変えます。",
        solutions: [
            { icon: Users, title: 'ネットワークの拡大と人材の質の向上', image: '/img/NTD/phaicu01.jpg', details: ['採用ニーズのある日本の数百の組合や企業と直接連携。', '無制限の無料求人掲載で、当社のプラットフォームから質の高い候補者を全国から集めます。', 'Eラーニングシステムを活用して、労働者の語学力とスキルを標準化します。'] },
            { icon: TrendingUp, title: '運用の最適化と利益の向上', image: '/img/NTD/phaicu02.jpg', details: ['候補者管理、面接スケジュール、進捗追跡のためのデジタルツールセットを提供し、書類作業と手動プロセスを削減します。', '自動報告システムで各求人の効果を追跡し、コストと利益を最適化します。', 'プラットフォーム上の既存の候補者源のおかげで、マーケティングと採用コストを削減します。'] },
            { icon: ShieldCheck, title: 'ブランド構築と法的リスクの軽減', image: '/img/NTD/phaicu03.jpg', details: ['HelloJobでプロフェッショナルな企業プロフィールを構築し、日本のパートナーに能力と信頼性をアピール。', '法改正を継続的に更新し、常にコンプライアンスを遵守し、リスクを低減します。', '採用プロセスにおける情報の透明性を高め、労働者とパートナーの双方から信頼を築きます。'] }
        ],
        finalCtaTitle: "派遣業界でデジタル変革と飛躍を遂げる準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、グローバルに連携し、プロセスを最適化し、信頼できる持続可能な派遣ブランドを構築しましょう。",
        finalCtaRegister: { main: "パートナー登録", sub: "Đăng ký đối tác / Register as Partner Now" },
        finalCtaPost: { main: "無料で求人掲載", sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free" }
    },
    en: {
        heroTitle: {
            main: "Tech Solution for Vietnamese Sending Companies",
            points: ["Directly connect with Japanese Unions & Companies.", "Automate processes, reduce costs, maximize profits.", "Build a reputable brand on a digital platform."],
            description: "HelloJob delivers a comprehensive technology solution, helping sending companies (labor export agencies) overcome all challenges, proactively connect with partners, and achieve breakthroughs in the digital era."
        },
        ctaPostJob: { main: "Post Jobs for Free", sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載" },
        ctaRegisterPartner: { main: "Register as a Partner", sub: "Đăng ký đối tác / パートナー登録" },
        painPointsTitle: "Top 3 Challenges for Sending Companies",
        painPointsDescription: "HelloJob recognizes the \"pain points\" you face daily in a fierce market.",
        painPoints: [
            { icon: Users, title: 'Unqualified Labor Supply', description: 'Workers lack skills, language, and discipline, while Japanese partners raise standards, leading to high rejection rates and wasted training costs.' },
            { icon: FileSignature, title: 'Legal & Reputational Risks', description: 'Constantly changing regulations and the risk of absconding workers damage reputation, affecting licenses and international contracts.' },
            { icon: DollarSign, title: 'Financial Strain & Costs', description: 'Revenue is dependent on tightly regulated service fees, while recruitment, training, and management costs are rising, making operations and reinvestment difficult.' }
        ],
        solutionsTitle: "HelloJob's Tech Solutions for You",
        solutionsDescription: "We turn your challenges into growth opportunities with powerful, automated tools.",
        solutions: [
            { icon: Users, title: 'Expand Network, Enhance Source Quality', image: '/img/NTD/phaicu01.jpg', details: ['Connect directly with hundreds of Japanese unions and companies with hiring needs.', 'Post unlimited free jobs to attract quality candidates from all over our platform.', 'Utilize our E-learning system to standardize language and skills training for workers.'] },
            { icon: TrendingUp, title: 'Optimize Operations & Increase Profitability', image: '/img/NTD/phaicu02.jpg', details: ['Provides a digital toolkit to manage candidates, interview schedules, and track progress, reducing paperwork and manual processes.', 'Automatic reporting system helps track effectiveness, optimizing costs and profits for each order.', 'Reduce marketing and recruitment costs thanks to the existing candidate pool on the platform.'] },
            { icon: ShieldCheck, title: 'Build Brand & Minimize Legal Risks', image: '/img/NTD/phaicu03.jpg', details: ['Build a professional company profile on HelloJob to promote your capabilities and credibility to Japanese partners.', 'Continuously update on legal changes, helping you stay compliant and reduce risks.', 'Enhance information transparency in the recruitment process to build trust with both workers and partners.'] }
        ],
        finalCtaTitle: "Ready to Transform and Excel in the Sending Industry?",
        finalCtaDescription: "Partner with HelloJob today to connect globally, optimize processes, and build a reputable, sustainable sending brand.",
        finalCtaRegister: { main: "Register as a Partner Now", sub: "Đăng ký đối tác / パートナー登録" },
        finalCtaPost: { main: "Post Jobs for Free", sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載" }
    }
};

export default function PhaiCuLandingPage() {
  const [lang, setLang] = useState<Language>('vi');
  const t = pageContent[lang];

  const router = useRouter();
  const [isXL01DialogOpen, setIsXL01DialogOpen] = useState(false);
  const [isYL01DialogOpen, setIsYL01DialogOpen] = useState(false); 
  const [recruitmentPrefs, setRecruitmentPrefs] = useState<any>(null);

  const handleXL01Complete = (preferences: any) => {
    console.log("X-L01 Completed with:", preferences);
    setRecruitmentPrefs(preferences);
    setIsXL01DialogOpen(false);
  };
  
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
    
    router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
    setIsYL01DialogOpen(false);
  };

  return (
    <>
      <div className="bg-background">
        {/* Hero Section */}
        <section id="ND_HERO_SECTION" className="w-full bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex justify-end mb-4">
                <Tabs defaultValue={lang} onValueChange={(value) => setLang(value as Language)} className="inline-block">
                    <TabsList className="bg-black/30 backdrop-blur-sm border border-white/20">
                        <TabsTrigger value="vi" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><VnFlagIcon className="h-4 w-4" /> Tiếng Việt</TabsTrigger>
                        <TabsTrigger value="ja" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><JpFlagIcon className="h-4 w-4" /> 日本語</TabsTrigger>
                        <TabsTrigger value="en" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><EnFlagIcon className="h-4 w-4" /> English</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <div className="text-left">
                   <h1 id="ND_HERO_TITLE" className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-4 text-center md:text-left">
                      {t.heroTitle.main}
                  </h1>
                  <ul id="ND_HERO_POINTS_LIST" className="space-y-2 mb-6">
                      {t.heroTitle.points.map((point, index) => (
                          <li key={index} className="flex items-center justify-start">
                              <span className="text-2xl text-white/90 mr-2">・</span>
                              <span className="text-lg md:text-xl text-white/90">{point}</span>
                          </li>
                      ))}
                  </ul>
                <p id="ND_HERO_DESCRIPTION" className="text-lg text-primary-foreground/80 mb-8">
                  {t.heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90" id="ND_HERO_CTA_POSTJOB" onClick={() => setIsXL01DialogOpen(true)}>
                        <div className="text-center">
                            <span className="font-semibold">{t.ctaPostJob.main}</span>
                            <div className="text-xs opacity-80">{t.ctaPostJob.sub}</div>
                        </div>
                    </Button>
                    <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="ND_HERO_CTA_REGISTER" onClick={() => setIsYL01DialogOpen(true)}>
                        <div className="text-center">
                            <span className="font-semibold">{t.ctaRegisterPartner.main}</span>
                            <div className="text-xs opacity-80">{t.ctaRegisterPartner.sub}</div>
                        </div>
                    </Button>
                </div>
              </div>
               <div id="ND_HERO_IMAGE" className="relative hidden md:block">
                  <div className="relative aspect-video">
                      <Image
                          src="/img/NTD/phaicu_hero.jpg"
                          alt="Hợp tác cùng phát triển với HelloJob"
                          fill
                          className="object-cover rounded-lg shadow-2xl"
                          data-ai-hint="vietnamese workers team"
                      />
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section id="ND_PAINPOINTS_SECTION" className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 id="ND_PAINPOINTS_TITLE" className="text-3xl md:text-4xl font-headline font-bold">{t.painPointsTitle}</h2>
              <p id="ND_PAINPOINTS_DESCRIPTION" className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t.painPointsDescription}
              </p>
            </div>
            <div id="ND_PAINPOINTS_GRID" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.painPoints.map((point, index) => (
                <Card key={point.title} id={`ND_PAINPOINT_${index + 1}`} className="text-center p-8 shadow-lg bg-background">
                  <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit mb-4">
                    <point.icon className="h-10 w-10 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-3">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Solutions Section */}
         <section id="ND_SOLUTIONS_SECTION" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <h2 id="ND_SOLUTIONS_TITLE" className="text-3xl md:text-4xl font-headline font-bold text-primary">{t.solutionsTitle}</h2>
              <p id="ND_SOLUTIONS_DESCRIPTION" className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t.solutionsDescription}
              </p>
            </div>
            <div id="ND_SOLUTIONS_LIST" className="space-y-16">
              {t.solutions.map((solution, index) => (
                <div key={index} id={`ND_SOLUTION_${index + 1}`} className={cn("grid md:grid-cols-2 gap-8 md:gap-12 items-center")}>
                   <div className={cn("flex flex-col space-y-4", index % 2 !== 0 ? 'md:order-last' : '')}>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="inline-block bg-primary/10 p-3 rounded-full w-fit">
                            <solution.icon className="h-8 w-8 text-primary"/>
                        </div>
                    </div>
                     <div className={cn("relative aspect-video h-60 w-full md:h-80 rounded-lg shadow-xl overflow-hidden")}>
                        <Image src={solution.image} alt={solution.title} fill className="object-cover" data-ai-hint="solution illustration"/>
                    </div>
                  </div>
                  <div className={cn("space-y-4", index % 2 !== 0 ? 'md:order-first' : '')}>
                      <h3 className="text-2xl font-bold font-headline">{solution.title}</h3>
                      <ul className="space-y-3">
                          {solution.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-3">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                                  <span className="text-muted-foreground">{detail}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
         </section>

        {/* Final CTA Section */}
        <section id="ND_FINAL_CTA_SECTION" className="bg-accent text-white py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 id="ND_FINALCTA_TITLE" className="text-3xl font-headline font-bold mb-4">{t.finalCtaTitle}</h2>
            <p id="ND_FINALCTA_DESCRIPTION" className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
              {t.finalCtaDescription}
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" id="ND_FINALCTA_POSTJOB" onClick={() => setIsXL01DialogOpen(true)}>
                    <div className="text-center">
                        <span className="font-semibold">{t.finalCtaPost.main}</span>
                        <div className="text-xs opacity-80">{t.finalCtaPost.sub}</div>
                    </div>
                </Button>
                <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="ND_FINALCTA_REGISTER" onClick={() => setIsYL01DialogOpen(true)}>
                    <div className="text-center">
                        <span className="font-semibold">{t.finalCtaRegister.main}</span>
                        <div className="text-xs opacity-80">{t.finalCtaRegister.sub}</div>
                    </div>
                </Button>
            </div>
          </div>
        </section>
        
        <ActivityPhotos id="HINHANHHOATDONG02" lang={lang}/>

      </div>
       <XL01Dialog 
        isOpen={isXL01DialogOpen} 
        onOpenChange={setIsXL01DialogOpen}
        onLanguageChange={setLang}
        initialLang={lang}
        initialStep={1}
        onComplete={handleXL01Complete}
        onBack={() => {
            setIsXL01DialogOpen(false);
        }}
      />
       <YL01Dialog 
        isOpen={isYL01DialogOpen} 
        onOpenChange={setIsYL01DialogOpen}
        onLanguageChange={setLang}
        initialLang={lang}
        initialStep={1}
        onComplete={navigateToEmployerPage}
        onBack={() => {
            setIsYL01DialogOpen(false);
        }}
      />
    </>
  );
}
