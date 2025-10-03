
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
            main: "Bứt phá Thu nhập & Nguồn ứng viên cho Cán bộ tuyển dụng",
            points: [
                "Nền tảng Ứng viên 4.0 - Không lo thiếu nguồn.",
                "Tối ưu Chi phí - Tối đa Hoa hồng.",
                "Công cụ thông minh - Tự động hóa quy trình."
            ]
        },
        heroDescription: "HelloJob mang đến giải pháp công nghệ toàn diện, giúp các cán bộ tuyển dụng (môi giới) Thực tập sinh kỹ năng vượt qua mọi thách thức, tự chủ nguồn ứng viên và đột phá thu nhập.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "Chúng tôi thấu hiểu những thách thức của Cán bộ Tuyển dụng",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà bạn đang đối mặt hàng ngày trong cuộc cạnh tranh khốc liệt.",
        painPoints: [
            {
                icon: Users,
                title: 'Thiếu nguồn ứng viên chất lượng',
                description: 'Nguồn ứng viên khan hiếm, chất lượng không đồng đều. Mỗi ứng viên trượt là một lần lãng phí công sức và chi phí.',
            },
            {
                icon: DollarSign,
                title: 'Áp lực Chi phí - Hoa hồng',
                description: 'Thị trường cạnh tranh ép giá, biên lợi nhuận mỏng, thu nhập bấp bênh. Rủi ro tự ứng chi phí quảng cáo, đào tạo là rất lớn.',
            },
            {
                icon: FileSignature,
                title: 'Sức ép từ Quy định & Đối tác',
                description: 'Các quy định pháp lý liên tục thay đổi, yêu cầu từ đối tác Nhật ngày càng khắt khe, hồ sơ thủ tục phức tạp và tốn thời gian.',
            },
        ],
        solutionsTitle: "Giải pháp Công nghệ từ HelloJob dành cho bạn",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng các công cụ mạnh mẽ và tự động.",
        solutions: [
            {
                icon: Users,
                title: 'Nền tảng Ứng viên 4.0 - Chủ động và Dồi dào',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Tiếp cận nguồn ứng viên trực tiếp từ hệ thống, chủ động tìm đến bạn.',
                    'Hệ thống AI tự động gợi ý ứng viên phù hợp nhất với yêu cầu đơn hàng.',
                    'Xây dựng "phễu" ứng viên của riêng bạn, nâng cao tính tự chủ trong khai thác ứng viên.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Tối ưu Thu nhập & Tự động hóa Chi phí',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Đăng tin miễn phí, không giới hạn số lượng để tối đa hóa cơ hội.',
                    'Hệ thống tự động theo dõi, báo cáo hiệu quả từng tin đăng, giúp tối ưu chi phí và lợi nhuận.',
                    'Tăng uy tín và tỷ lệ thành công, tạo cơ sở để đàm phán tốt hơn.',
                ],
            },
            {
                icon: Handshake,
                title: 'Công cụ & Tri thức đồng hành',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Cung cấp bộ công cụ số hóa để quản lý ứng viên, lịch phỏng vấn và theo dõi tiến độ.',
                    'Cập nhật liên tục các thay đổi về luật, quy định của cả Việt Nam và Nhật Bản cũng như của Công ty phái cử, để làm đúng quy định mà vẫn tạo được lợi nhuận bền vững.',
                    'Nâng cao hình ảnh chuyên nghiệp của bạn với trang profile riêng trên nền tảng của chúng tôi.',
                ],
            },
        ],
        finalCtaTitle: "Sẵn sàng nâng tầm sự nghiệp tuyển dụng của bạn?",
        finalCtaDescription: "Trở thành đối tác của HelloJob ngay hôm nay để tự chủ nguồn ứng viên, tối ưu hóa quy trình và bứt phá giới hạn thu nhập.",
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
            main: "採用担当者向けの収入と候補者供給源のブレークスルー",
            points: [
                "候補者プラットフォーム4.0 - 供給源の心配なし",
                "コスト最適化 - 手数料最大化",
                "スマートツール - プロセス自動化"
            ]
        },
        heroDescription: "HelloJobは包括的な技術ソリューションを提供し、技能実習生の採用担当者（ブローカー）があらゆる課題を克服し、候補者供給源を自律的に管理し、収入を飛躍的に向上させるのを支援します。",
        ctaPostJob: {
            main: "無料で求人掲載",
            sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "パートナー登録",
            sub: "Đăng ký đối tác / Register as Partner"
        },
        painPointsTitle: "私たちは採用担当者の課題を理解しています",
        painPointsDescription: "HelloJobは、あなたが熾烈な競争の中で日々直面している「痛み」を明確に認識しています。",
        painPoints: [
            {
                icon: Users,
                title: '質の高い候補者の不足',
                description: '候補者源は希少で、質が不均一で、途中で辞退しやすい。候補者が一人落ちるたびに、労力と採用コストが無駄になります。',
            },
            {
                icon: DollarSign,
                title: 'コストと手数料の圧力',
                description: '市場競争が価格を押し下げ、利益率が薄くなり、収入が不安定になります。広告や研修費用を自己負担するリスクが高いです。',
            },
            {
                icon: FileSignature,
                title: '規制とパートナーからの圧力',
                description: '法規制は絶えず変化し、日本のパートナーからの要求はますます厳しくなり、書類手続きは複雑で時間がかかります。',
            },
        ],
        solutionsTitle: "あなたのためのHelloJobの技術ソリューション",
        solutionsDescription: "私たちは強力で自動化されたツールによって、あなたの各課題を成長の機会に変えます。",
        solutions: [
            {
                icon: Users,
                title: '候補者プラットフォーム4.0 - 主体的で豊富',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'システムから直接候補者にアクセスし、主体的にアプローチ。',
                    'AIシステムが求人要件に最適な候補者を自動的に提案します。',
                    '独自の候補者ファネルを構築し、外部ソースへの依存を減らします。',
                ],
            },
            {
                icon: TrendingUp,
                title: '収入の最適化とコストの自動化',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    '無制限の無料求人掲載で機会を最大化。',
                    '各求人の効果を自動的に追跡・報告し、コストと利益を最適化します。',
                    '信頼性と成功率を高め、より良い交渉の基盤を築きます。',
                ],
            },
            {
                icon: Handshake,
                title: 'ツールと知識のパートナーシップ',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    '候補者管理、面接スケジュール、進捗追跡のためのデジタルツールセットを提供。',
                    'ベトナムと日本の法律、規制、および送り出し機関の変更点を継続的に更新し、規制を遵守しながら持続可能な利益を生み出します。',
                    '私たちのプラットフォーム上の専用プロフィールページで、あなたのプロフェッショナルなイメージを高めます。',
                ],
            },
        ],
        finalCtaTitle: "採用キャリアを次のレベルへ引き上げる準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、候補者源を自律的に管理し、プロセスを最適化し、収入の限界を突破しましょう。",
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
            main: "Breakthrough Income & Candidate Sources for Recruiters",
            points: [
                "Candidate Platform 4.0 - No More Sourcing Worries.",
                "Optimize Costs - Maximize Commissions.",
                "Smart Tools - Automate Your Processes."
            ]
        },
        heroDescription: "HelloJob provides a comprehensive technology solution to help Technical Intern Training recruiters (brokers) overcome challenges, control their candidate pipeline, and achieve breakthrough income.",
        ctaPostJob: {
            main: "Post Jobs for Free",
            sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載"
        },
        ctaRegisterPartner: {
            main: "Register as a Partner",
            sub: "Đăng ký đối tác / パートナー登録"
        },
        painPointsTitle: "We Understand Your Challenges as a Recruiter",
        painPointsDescription: "HelloJob recognizes the \"pain points\" you face daily in a fierce market.",
        painPoints: [
            {
                icon: Users,
                title: 'Lack of Quality Candidates',
                description: 'Scarce and inconsistent candidate sources. High drop-off rates. Every lost candidate wastes effort, money, and reputation.',
            },
            {
                icon: DollarSign,
                title: 'Pressure on Costs & Commissions',
                description: 'A competitive market drives down service fees, thinning profit margins and leading to unstable income. High risk of fronting advertising and training costs.',
            },
            {
                icon: FileSignature,
                title: 'Pressure from Regulations & Partners',
                description: 'Constantly changing legal regulations and increasingly strict requirements from Japanese partners make procedures complex and time-consuming.',
            },
        ],
        solutionsTitle: "HelloJob's Tech Solutions for You",
        solutionsDescription: "We turn your challenges into growth opportunities with powerful, automated tools.",
        solutions: [
            {
                icon: Users,
                title: 'Candidate Platform 4.0 - Proactive & Abundant',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Access a direct source of candidates who proactively come to you through the system.',
                    'Our AI system automatically suggests the most suitable candidates for your job orders.',
                    'Build your own candidate funnel, enhancing your autonomy in candidate sourcing.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Optimize Income & Automate Costs',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Post unlimited jobs for free to maximize opportunities.',
                    'The system automatically tracks and reports on the effectiveness of each post, helping to optimize costs and profits.',
                    'Increase your credibility and success rate, creating a basis for better negotiations.',
                ],
            },
            {
                icon: Handshake,
                title: 'Accompanying Tools & Knowledge',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Provides a digital toolkit to manage candidates, interview schedules, and track progress.',
                    'Continuously updated on legal and regulatory changes in both Vietnam and Japan, as well as from sending companies, to ensure compliance while creating sustainable profits.',
                    'Enhance your professional image with a dedicated profile page on our platform.',
                ],
            },
        ],
        finalCtaTitle: "Ready to Elevate Your Recruitment Career?",
        finalCtaDescription: "Partner with HelloJob today to take control of your candidate source, optimize your workflow, and break through your income ceiling.",
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

export default function UnionLandingPage() {
  const [lang, setLang] = useState<Language>('vi');
  const t = pageContent[lang];

  const router = useRouter();
  const searchParams = useSearchParams();
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
    
    router.push(`/nha-tuyen-dung/dang-ky?${''}${params.toString()}`);
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
               <div id="ND_HERO_IMAGE" className="relative flex flex-col">
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
                <div key={index} id={`ND_SOLUTION_${index + 1}`} className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-row-dense' : ''}`}>
                   <div className={`flex flex-col space-y-4 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="inline-block bg-primary/10 p-3 rounded-full w-fit">
                            <solution.icon className="h-8 w-8 text-primary"/>
                        </div>
                    </div>
                     <div className={`relative aspect-video h-60 w-full md:h-80 rounded-lg shadow-xl overflow-hidden`}>
                        <Image src={solution.image} alt={solution.title} fill className="object-cover" data-ai-hint="solution illustration"/>
                    </div>
                  </div>
                  <div className={`space-y-4 ${index % 2 !== 0 ? 'md:col-start-1 md:row-start-1' : ''}`}>
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

        <CtaHienThiViec08 lang={lang} prioritizedVisaType="Thực tập sinh kỹ năng" />
        
        <ActivityPhotos id="HINHANHHOATDONG02" />

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
