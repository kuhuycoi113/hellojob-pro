
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
            main: "Giải Pháp Toàn Diện Cho Tuyển Dụng Kỹ Năng Đặc Định",
            points: [
                "Nền tảng ứng viên 4.0, giải quyết nỗi lo nguồn.",
                "Tối ưu quy trình, giảm áp lực pháp lý.",
                "Tăng tốc độ tuyển dụng, tối đa hóa lợi nhuận, giảm sức ép hai đầu."
            ]
        },
        heroDescription: "HelloJob mang đến giải pháp công nghệ toàn diện, giúp các chuyên viên tuyển dụng Kỹ năng đặc định vượt qua mọi rào cản, tự chủ nguồn ứng viên chất lượng và vận hành hiệu quả trong môi trường pháp lý phức tạp.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "Thách Thức Của Nhà Tuyển Dụng Tokutei: Chúng Tôi Thấu Hiểu",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà bạn đang đối mặt hàng ngày trong một lĩnh vực đầy tiềm năng nhưng cũng vô cùng thách thức.",
        painPoints: [
            {
                icon: Users,
                title: 'Khan hiếm Ứng viên Chất lượng',
                description: 'Nguồn ứng viên không chỉ ít mà còn không đúng yêu cầu. Mỗi hồ sơ không đạt chuẩn là một lần lãng phí công sức, chi phí và uy tín.',
            },
            {
                icon: FileSignature,
                title: 'Áp lực Pháp lý & Quy định',
                description: 'Các quy định về COE, ngành nghề liên tục thay đổi, hồ sơ phức tạp. Một sai sót nhỏ có thể ảnh hưởng đến cả quá trình.',
            },
            {
                icon: Handshake,
                title: 'Sức ép từ Hai phía',
                description: 'Bị kẹt giữa kỳ vọng của ứng viên và yêu cầu khắt khe từ đối tác Nhật, khiến công việc luôn căng thẳng, dễ dẫn đến kiệt sức và chán nản.',
            },
        ],
        solutionsTitle: "Giải Pháp Công Nghệ Của HelloJob Dành Cho Bạn",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng các công cụ mạnh mẽ và tự động.",
        solutions: [
            {
                icon: Users,
                title: 'Nền tảng Ứng viên Tokutei 4.0: Chủ động & Đúng Chuẩn',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Tiếp cận nguồn ứng viên đã được sàng lọc ban đầu về kỹ năng và trình độ tiếng Nhật.',
                    'Hệ thống AI tự động gợi ý ứng viên phù hợp nhất với yêu cầu đơn hàng của bạn.',
                    'Xây dựng "phễu" ứng viên chất lượng của riêng bạn, nâng cao tính tự chủ trong khai thác ứng viên.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Tự động hóa & Tối ưu Quy trình',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Đăng tin tuyển dụng miễn phí, không giới hạn để tối đa hóa cơ hội tìm kiếm.',
                    'Cung cấp bộ công cụ số hóa để quản lý ứng viên, lịch phỏng vấn và theo dõi tiến độ hồ sơ.',
                    'Cập nhật liên tục các thay đổi về luật, quy định của cả Việt Nam và Nhật Bản cũng như của Công ty phái cử, để làm đúng quy định mà vẫn tạo được lợi nhuận bền vững.',
                ],
            },
            {
                icon: ShieldCheck,
                title: 'Nâng cao Uy tín, Giảm Áp lực, Gia tăng lợi nhuận',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Hồ sơ ứng viên được chuẩn hóa, giúp quá trình xử lý với đối tác Nhật nhanh chóng và chính xác hơn, giảm sức ép hai đầu.',
                    'Tăng uy tín và tỷ lệ thành công, tạo cơ sở để đàm phán tốt hơn, gia tăng lợi nhuận.',
                    'Nâng cao hình ảnh chuyên nghiệp của bạn với trang profile riêng trên nền tảng của chúng tôi.',
                ],
            },
        ],
        finalCtaTitle: "Sẵn sàng Bứt phá trong Tuyển dụng Tokutei?",
        finalCtaDescription: "Trở thành đối tác của HelloJob ngay hôm nay để tự chủ nguồn ứng viên, làm việc hiệu quả hơn và đạt được thành công lớn hơn.",
        finalCtaRegister: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner Now"
        },
        finalCtaPost: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
    },
     ja: { // Example Translation - can be refined
        heroTitle: {
            main: "特定技能採用担当者向けの包括的ソリューション",
            points: [
                "候補者プラットフォーム4.0、人材不足の悩みを解決。",
                "プロセスを最適化し、法的圧力を軽減。",
                "採用スピードを上げ、利益を最大化し、双方からの圧力を軽減。"
            ]
        },
        heroDescription: "HelloJobは包括的な技術ソリューションを提供し、特定技能の採用担当者が法的複雑性の中で効率的に業務を遂行し、質の高い候補者を確保し、ブレークスルーを達成するのを支援します。",
        ctaPostJob: {
            main: "無料で求人掲載",
            sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "パートナー登録",
            sub: "Đăng ký đối tác / Register as Partner"
        },
        painPointsTitle: "特定技能採用担当者の課題：私たちは理解しています",
        painPointsDescription: "HelloJobは、このポテンシャルに満ちた、しかし非常に挑戦的な分野であなたが日々直面している「痛み」を明確に認識しています。",
        painPoints: [
            {
                icon: Users,
                title: '質の高い候補者の不足',
                description: '候補者源が少ないだけでなく、要件を満たしていない。基準を満たさない書類はすべて、労力、コスト、信用の無駄です。',
            },
            {
                icon: FileSignature,
                title: '法的・規制上の圧力',
                description: '在留資格認定証明書（COE）や職種に関する規制は絶えず変化し、書類は複雑です。小さなミスがプロセス全体に影響を与える可能性があります。',
            },
            {
                icon: Handshake,
                title: '双方からの圧力',
                description: '候補者の期待と日本のパートナーからの厳しい要求の間に挟まれ、仕事は常にストレスが多く、燃え尽きやすい。',
            },
        ],
        solutionsTitle: "あなたのためのHelloJobの技術ソリューション",
        solutionsDescription: "私たちは強力で自動化されたツールによって、あなたの各課題を成長の機会に変えます。",
        solutions: [
            {
                icon: Users,
                title: '特定技能候補者プラットフォーム4.0：主体的で基準を満たす',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'スキルと日本語レベルについて事前にスクリーニングされた候補者源にアクセス。',
                    'AIシステムが求人要件に最適な候補者を自動的に提案します。',
                    '独自の質の高い候補者ファネルを構築し、自主性を高めます。',
                ],
            },
            {
                icon: TrendingUp,
                title: 'プロセスの自動化と最適化',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    '機会を最大化するための無制限の無料求人掲載。',
                    '候補者、面接スケジュール、書類進捗を管理するためのデジタルツールセットを提供。',
                    'ベトナムと日本の法律、規制、および送り出し機関の変更点を継続的に更新し、規制を遵守しながら持続可能な利益を生み出します。',
                ],
            },
            {
                icon: ShieldCheck,
                title: '信頼性の向上、圧力の軽減、利益の増加',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    '標準化された候補者プロフィールにより、日本のパートナーとの処理が迅速かつ正確になり、双方からの圧力が軽減されます。',
                    '信頼性と成功率を高め、より良い交渉の基盤を築き、利益を増加させます。',
                    '私たちのプラットフォーム上の専用プロフィールページで、あなたのプロフェッショナルなイメージを高めます。',
                ],
            },
        ],
        finalCtaTitle: "特定技能採用で飛躍する準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、候補者源を自律的に管理し、より効率的に働き、より大きな成功を収めましょう。",
        finalCtaRegister: {
            main: "パートナー登録",
            sub: "Đăng ký đối tác / Register as Partner Now"
        },
        finalCtaPost: {
            main: "無料で求人掲載",
            sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free"
        },
    },
    en: {
        heroTitle: {
            main: "Comprehensive Solution for Specified Skilled Worker Recruiters",
            points: [
                "Candidate Platform 4.0, solving sourcing issues.",
                "Optimize processes, reduce legal pressure.",
                "Increase hiring speed, maximize profit, reduce pressure from both sides."
            ]
        },
        heroDescription: "HelloJob provides a comprehensive technology solution, helping Specified Skilled Worker recruiters overcome all barriers, gain control over quality candidate sources, and operate effectively in a complex legal environment.",
        ctaPostJob: {
            main: "Post Jobs for Free",
            sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載"
        },
        ctaRegisterPartner: {
            main: "Register as a Partner",
            sub: "Đăng ký đối tác / パートナー登録"
        },
        painPointsTitle: "Challenges of a Tokutei Recruiter: We Understand",
        painPointsDescription: "HelloJob recognizes the \"pain points\" you face daily in a field full of potential but also immense challenges.",
        painPoints: [
            {
                icon: Users,
                title: 'Scarcity of Quality Candidates',
                description: 'Candidate sources are not only scarce but also unqualified. Every failed application is a waste of effort, cost, and credibility.',
            },
            {
                icon: FileSignature,
                title: 'Legal & Regulatory Pressure',
                description: 'Regulations on COE and occupations change constantly, and paperwork is complex. A small mistake can affect the entire process.',
            },
            {
                icon: Handshake,
                title: 'Pressure from Both Sides',
                description: 'Caught between candidate expectations and strict demands from Japanese partners, the job is always stressful and leads to burnout and frustration.',
            },
        ],
        solutionsTitle: "HelloJob's Tech Solutions for You",
        solutionsDescription: "We turn your challenges into growth opportunities with powerful, automated tools.",
        solutions: [
            {
                icon: Users,
                title: 'Candidate Platform 4.0: Proactive & Standard-Compliant',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Access a pre-screened candidate pool for skills and Japanese language proficiency.',
                    'Our AI system automatically suggests the most suitable candidates for your job orders.',
                    'Build your own quality candidate funnel, enhancing autonomy in sourcing.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Process Automation & Optimization',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Post unlimited jobs for free to maximize sourcing opportunities.',
                    'Provides a digital toolkit to manage candidates, interview schedules, and document progress.',
                    'Continuously updated on legal and regulatory changes in both Vietnam and Japan, as well as from sending companies, to ensure compliance while creating sustainable profits.',
                ],
            },
            {
                icon: ShieldCheck,
                title: 'Enhance Credibility, Reduce Pressure, Increase Profit',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Standardized candidate profiles make processing with Japanese partners faster and more accurate, reducing pressure from both sides.',
                    'Increase credibility and success rates, creating a basis for better negotiations and increased profits.',
                    'Enhance your professional image with a dedicated profile page on our platform.',
                ],
            },
        ],
        finalCtaTitle: "Ready to Level Up Your Tokutei Recruitment?",
        finalCtaDescription: "Partner with HelloJob today to take control of your candidate source, work more effectively, and achieve greater success.",
        finalCtaRegister: {
            main: "Register as a Partner Now",
            sub: "Đăng ký đối tác / パートナー登録"
        },
        finalCtaPost: {
            main: "Post Jobs for Free",
            sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載"
        },
    }
};

export default function TuyenDungTokuteiLandingPage() {
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
                  <ul id="ND_HERO_POINTS_LIST" className="space-y-2 mb-6 text-center md:text-left">
                      {t.heroTitle.points.map((point, index) => (
                          <li key={index} className="flex items-center justify-center md:justify-start">
                              <span className="text-2xl text-white/90 mr-2">・</span>
                              <span className="text-lg md:text-xl text-white/90">{point}</span>
                          </li>
                      ))}
                  </ul>
                <p id="ND_HERO_DESCRIPTION" className="text-lg text-primary-foreground/80 mb-8 text-center md:text-left">
                  {t.heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
                          src="/img/NTD/CTBV_HERO.jpg"
                          alt="Hợp tác cùng phát triển với HelloJob"
                          fill
                          className="object-cover rounded-lg shadow-2xl"
                          data-ai-hint="business people shaking hands"
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
                   <div className={cn("flex flex-col space-y-4", index % 2 !== 0 ? 'md:col-start-2' : '')}>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="inline-block bg-primary/10 p-3 rounded-full w-fit">
                            <solution.icon className="h-8 w-8 text-primary"/>
                        </div>
                    </div>
                     <div className={cn("relative aspect-video h-60 w-full md:h-80 rounded-lg shadow-xl overflow-hidden")}>
                        <Image src={solution.image} alt={solution.title} fill className="object-cover" data-ai-hint="solution illustration"/>
                    </div>
                  </div>
                  <div className={cn("space-y-4", index % 2 !== 0 ? 'md:col-start-1 md:row-start-1' : '')}>
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

        <CtaHienThiViec08 lang={lang} prioritizedVisaType="Kỹ năng đặc định" />
        
        <ActivityPhotos id="HINHANHHOATDONG02" lang={lang} />

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
