
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
import { useRouter, usePathname } from 'next/navigation';
import { CtaHienThiViec08 } from '@/components/cta-hien-thi-viec-08';
import { ActivityPhotos } from '@/components/activity-photos';


type Language = 'vi' | 'ja' | 'en';

const pageContent = {
    vi: {
        heroTitle: {
            main: "Giải pháp Công nghệ Toàn diện cho Cơ quan Hỗ trợ (Shien Kikan)",
            points: [
                "Nguồn cung Tokutei chất lượng, minh bạch.",
                "Tối ưu vận hành, giảm thiểu rủi ro pháp lý.",
                "Nền tảng số hóa, nâng cao hiệu quả quản lý và phát triển khách hàng, gia tăng lợi nhuận.",
                "Nền tảng công nghệ giúp xây dựng hồ sơ năng lực, thu hút khách hàng."
            ]
        },
        heroDescription: "HelloJob mang đến giải pháp công nghệ toàn diện, giúp các Cơ quan Hỗ trợ Kỹ năng đặc định vượt qua mọi rào cản, chủ động kết nối nguồn ứng viên chất lượng và vận hành hiệu quả trong môi trường pháp lý phức tạp.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "Chúng tôi thấu hiểu những thách thức của Cơ quan Hỗ trợ",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà bạn đang đối mặt hàng ngày trong một lĩnh vực đầy tiềm năng nhưng cũng vô cùng thách thức.",
        painPoints: [
            {
                icon: Users,
                title: 'Khan hiếm Nguồn cung Tokutei Chất lượng',
                description: 'Khó tìm ứng viên đạt chuẩn (tiếng Nhật, tay nghề, pháp lý). Hồ sơ sai lệch, thiếu minh bạch. Ứng viên bỏ dở giữa chừng, gây mất uy tín và tăng chi phí.',
            },
            {
                icon: Handshake,
                title: 'Khó khăn Quản lý Lao động sau Tiếp nhận',
                description: 'Tỷ lệ bỏ trốn, chuyển việc cao do mâu thuẫn văn hóa, phát sinh nhiều sự cố đời sống, làm gia tăng khối lượng công việc hỗ trợ và chi phí quản lý.',
            },
            {
                icon: DollarSign,
                title: 'Áp lực Pháp lý & Chi phí Vận hành',
                description: 'Luật pháp thay đổi liên tục, hồ sơ phức tạp, nguy cơ vi phạm cao trong khi biên lợi nhuận thấp, khiến hoạt động khó mở rộng và thiếu bền vững.',
            },
            {
                icon: Search,
                title: 'Khó khăn trong Phát triển Khách hàng Mới',
                description: 'Gặp trở ngại khi tiếp cận và thuyết phục các xí nghiệp tiếp nhận mới do thiếu công cụ marketing chuyên nghiệp và nguồn cung ứng viên không ổn định.',
            },
        ],
        solutionsTitle: "Giải Pháp Công Nghệ Của HelloJob Dành Cho Bạn",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng các công cụ mạnh mẽ và tự động.",
        solutions: [
            {
                icon: Users,
                title: 'Nguồn Cung Ứng viên Minh bạch & Dồi dào',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Tiếp cận nguồn ứng viên trực tiếp từ HelloJob hoặc mạng lưới đối tác phái cử uy tín đã được HelloJob xác thực.',
                    'Hệ thống sàng lọc và kiểm chứng hồ sơ ứng viên online, đảm bảo tính minh bạch và chính xác.',
                    'Xây dựng "phễu" ứng viên của riêng bạn, chủ động nguồn cung cho các doanh nghiệp.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Nền tảng Hỗ trợ & Quản lý Lao động Thông minh',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Cung cấp công cụ quản lý vòng đời lao động, từ lúc nhập cảnh đến khi hết hợp đồng.',
                    'Tích hợp các khóa học E-learning về văn hóa, kỹ năng sống giúp lao động hòa nhập tốt hơn.',
                    'Hệ thống cảnh báo sớm các vấn đề phát sinh, giúp Shien Kikan can thiệp kịp thời.',
                ],
            },
             {
                icon: Handshake,
                title: 'Phát triển Khách hàng & Xây dựng Thương hiệu',
                image: '/img/NTD/ND08.jpg',
                details: [
                    'Xây dựng profile doanh nghiệp chuyên nghiệp trên HelloJob để quảng bá năng lực tới các xí nghiệp tiếp nhận.',
                    'Sử dụng nền tảng để đăng tải các bài viết, hoạt động, tạo uy tín và thu hút khách hàng mới.',
                    'Tận dụng dữ liệu thị trường từ HelloJob để có chiến lược tiếp cận khách hàng hiệu quả.',
                ],
            },
            {
                icon: ShieldCheck,
                title: 'Tối ưu Vận hành & Tuân thủ Pháp lý',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Số hóa quy trình quản lý hồ sơ, báo cáo pháp lý định kỳ, giảm thiểu sai sót và nhân sự vận hành.',
                    'Cập nhật tự động các thay đổi về luật pháp, giúp bạn luôn tuân thủ và giảm rủi ro.',
                    'Đăng tin tuyển dụng miễn phí, không giới hạn để tiếp cận ứng viên mà không tốn chi phí marketing.',
                ],
            },
        ],
        finalCtaTitle: "Sẵn sàng Nâng tầm Hiệu quả cho Shien Kikan của bạn?",
        finalCtaDescription: "Trở thành đối tác của HelloJob ngay hôm nay để tự động hóa quy trình, tiếp cận nguồn ứng viên chất lượng và phát triển kinh doanh bền vững.",
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
            main: "登録支援機関向けの包括的な技術ソリューション",
            points: [
                "質の高い透明性のある特定技能人材の供給源。",
                "運用の最適化、法的リスクの最小化。",
                "管理効率の向上、顧客開拓、収益増加のためのデジタルプラットフォーム。",
                "能力プロファイルを構築し、顧客を引き付けるための技術プラットフォーム。"
            ]
        },
        heroDescription: "HelloJobは、特定技能の登録支援機関が障壁を克服し、質の高い候補者供給源と積極的に連携し、複雑な法的環境で効率的に運営できるよう支援する、包括的な技術ソリューションを提供します。",
        ctaPostJob: {
            main: "無料で求人掲載",
            sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "パートナー登録",
            sub: "Đăng ký đối tác / Register as Partner"
        },
        painPointsTitle: "私たちは登録支援機関の課題を理解しています",
        painPointsDescription: "HelloJobは、あなたがポテンシャルに満ちた、しかし非常に挑戦的な分野で日々直面している「痛み」を明確に認識しています。",
        painPoints: [
            { icon: Users, title: '質の高い特定技能人材の不足', description: '基準を満たす候補者（日本語、技能、法的書類）を見つけるのが難しい。書類の不一致、透明性の欠如。候補者が途中で辞退し、信頼を失い、コストが増加する。' },
            { icon: Handshake, title: '受け入れ後の労働者管理の難しさ', description: '文化的な対立による高い失踪・転職率、多くの生活上の問題が発生し、サポート業務の負担と管理コストが増大する。' },
            { icon: DollarSign, title: '法的圧力と高い運営コスト', description: '法律は絶えず変化し、書類は複雑で、利益率が低い中での違反リスクが高く、事業の拡大と財務の持続可能性が困難になる。' },
            { icon: Search, title: '新規顧客開拓の難しさ', description: '専門的なマーケティングツールや不安定な候補者供給源のため、新しい受け入れ企業へのアプローチと説得に障壁がある。' },
        ],
        solutionsTitle: "あなたのためのHelloJobの技術ソリューション",
        solutionsDescription: "私たちは強力で自動化されたツールによって、あなたの各課題を成長の機会に変えます。",
        solutions: [
            { icon: Users, title: '透明で豊富な候補者供給源4.0', image: '/img/NTD/CTBV01.jpg', details: ['HelloJobによって検証されたベトナムの信頼できる送り出し機関のネットワークにアクセス。', 'オンライン候補者プロファイルのスクリーニングと検証システムにより、透明性と正確性を確保。', '独自の候補者ファネルを構築し、企業への供給源を主体的に管理。'] },
            { icon: TrendingUp, title: 'スマートな労働者サポート＆管理プラットフォーム', image: '/img/NTD/CTBV02.jpg', details: ['入国から契約終了までの労働者のライフサイクルを管理するツールを提供。', '文化や生活スキルに関するEラーニングコースを統合し、労働者の適応を助け、離職率を低減。', '問題発生を早期に警告するシステムで、支援機関がタイムリーに介入可能。'] },
            { icon: Handshake, title: '顧客開拓とブランド構築', image: '/img/NTD/ND08.jpg', details: ['HelloJobでプロフェッショナルな企業プロフィールを構築し、受け入れ企業に能力をアピール。', 'プラットフォームを利用して記事や活動を投稿し、信頼を築き、新規顧客を引き付ける。', 'HelloJobの市場データを活用して、効果的な顧客アプローチ戦略を立てる。'] },
            { icon: ShieldCheck, title: '運用の最適化と法的コンプライアンス', image: '/img/NTD/CTBV03.jpg', details: ['定期的な法的報告と書類管理プロセスをデジタル化し、エラーと運営人員を削減。', '法改正を自動的に更新し、常にコンプライアンスを遵守し、リスクを低減。', 'マーケティング費用なしで候補者にアプローチするための無制限の無料求人掲載。'] },
        ],
        finalCtaTitle: "支援機関の効率を向上させる準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、プロセスを自動化し、質の高い候補者にアクセスし、持続可能なビジネス成長を実現しましょう。",
        finalCtaRegister: { main: "パートナー登録", sub: "Đăng ký đối tác / Register as Partner Now" },
        finalCtaPost: { main: "無料で求人掲載", sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free" },
    },
    en: {
        heroTitle: {
            main: "Comprehensive Tech Solution for Support Organizations (Shien Kikan)",
            points: [
                "Quality, transparent source of Specified Skilled Workers.",
                "Optimize operations, minimize legal risks.",
                "Digital platform to enhance management efficiency, customer development, and increase profits.",
                "Technology platform to build competency profiles and attract clients."
            ]
        },
        heroDescription: "HelloJob provides a comprehensive technology solution helping Specified Skilled Worker Support Organizations overcome barriers, proactively connect with quality candidate sources, and operate effectively in a complex legal environment.",
        ctaPostJob: {
            main: "Post Jobs for Free",
            sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載"
        },
        ctaRegisterPartner: {
            main: "Register as a Partner",
            sub: "Đăng ký đối tác / パートナー登録"
        },
        painPointsTitle: "We Understand Your Challenges as a Support Organization",
        painPointsDescription: "HelloJob recognizes the \"pain points\" you face daily in a field full of potential but also immense challenges.",
        painPoints: [
            { icon: Users, title: 'Scarcity of Quality Tokutei Candidates', description: 'Difficulty finding qualified candidates (language, skills, legal status). Inaccurate or non-transparent profiles. Candidates dropping out, causing loss of credibility and increased costs.' },
            { icon: Handshake, title: 'Difficulty in Post-Placement Worker Management', description: 'High rates of absconding or job-hopping due to cultural conflicts and life issues, increasing the support workload and management costs.' },
            { icon: DollarSign, title: 'Legal Pressure & High Operating Costs', description: 'Constantly changing laws, complex paperwork, and high risk of violations with low profit margins, making it difficult to scale and sustain financially.' },
            { icon: Search, title: 'Difficulty in New Client Acquisition', description: 'Struggling to approach and convince new accepting companies due to a lack of professional marketing tools and an unstable supply of candidates.' },
        ],
        solutionsTitle: "HelloJob's Tech Solutions for You",
        solutionsDescription: "We turn your challenges into growth opportunities with powerful, automated tools.",
        solutions: [
            { icon: Users, title: 'Transparent & Abundant Candidate Pool 4.0', image: '/img/NTD/CTBV01.jpg', details: ['Access HelloJob\'s direct candidate source or its network of verified, reputable sending agencies in Vietnam.', 'Online screening and verification system for candidate profiles ensures transparency and accuracy.', 'Build your own candidate funnel, giving you autonomy in sourcing for your clients.'] },
            { icon: TrendingUp, title: 'Smart Worker Support & Management Platform', image: '/img/NTD/CTBV02.jpg', details: ['Provides tools to manage the worker lifecycle, from arrival to contract completion.', 'Integrates E-learning courses on culture and life skills to help workers adapt better, reducing turnover.', 'Early warning system for potential issues, allowing for timely intervention.'] },
            { icon: Handshake, title: 'Client Development & Brand Building', image: '/img/NTD/ND08.jpg', details: ['Build a professional company profile on HelloJob to showcase your capabilities to accepting companies.', 'Use the platform to publish articles and activities, building credibility and attracting new clients.', 'Leverage market data from HelloJob to devise effective client acquisition strategies.'] },
            { icon: ShieldCheck, title: 'Optimize Operations & Ensure Legal Compliance', image: '/img/NTD/CTBV03.jpg', details: ['Digitize profile management and periodic legal reporting to reduce errors and operational staff.', 'Automatically updates on legal changes, helping you stay compliant and reduce risks.', 'Post unlimited free job listings to reach candidates without marketing costs.'] },
        ],
        finalCtaTitle: "Ready to Elevate Your Shien Kikan's Efficiency?",
        finalCtaDescription: "Partner with HelloJob today to automate processes, access a quality candidate pool, and achieve sustainable business growth.",
        finalCtaRegister: { main: "Register as a Partner Now", sub: "Đăng ký đối tác / パートナー登録" },
        finalCtaPost: { main: "Post Jobs for Free", sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載" },
    }
};


export default function ShienKikanLandingPage() {
  const [lang, setLang] = useState<Language>('vi');
  const t = pageContent[lang];

  const router = useRouter();
  const pathname = usePathname();
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
    
    if (pathname) {
      params.set('from', pathname);
    }

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
            <div id="ND_PAINPOINTS_GRID" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                   <div className={`flex flex-col space-y-4 ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="inline-block bg-primary/10 p-3 rounded-full w-fit">
                            <solution.icon className="h-8 w-8 text-primary"/>
                        </div>
                    </div>
                     <div className={`relative aspect-video h-60 w-full md:h-80 rounded-lg shadow-xl overflow-hidden`}>
                        <Image src={solution.image} alt={solution.title} fill className="object-cover" data-ai-hint="solution illustration"/>
                    </div>
                  </div>
                  <div className={`space-y-4 ${index % 2 !== 0 ? 'md:order-first' : ''}`}>
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
        fromPath={pathname}
      />
    </>
  );
}
