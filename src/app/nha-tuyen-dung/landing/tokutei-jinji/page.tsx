
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, DollarSign, Users, FileSignature, CheckCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from '@/components/custom-icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XL01Dialog } from '@/components/X-L01-dialog';
import { YL01Dialog } from '@/components/Y-L01-dialog';
import { useRouter } from 'next/navigation';
import { CtaHienThiViec08 } from '@/components/cta-hien-thi-viec-08';


type Language = 'vi' | 'ja' | 'en';

const pageContent = {
    vi: {
        heroTitle: {
            main: "Giải Pháp Toàn Diện Cho Tuyển Dụng Kỹ Năng Đặc Định",
            points: [
                "Nền tảng ứng viên 4.0 - Giải quyết bài toán nguồn ứng viên.",
                "Tự động hóa quy trình, giảm áp lực pháp lý.",
                "Giảm gánh nặng hỗ trợ, tập trung vào nghiệp vụ cốt lõi, gia tăng lợi nhuận cho Shien."
            ]
        },
        heroDescription: "HelloJob mang đến giải pháp công nghệ toàn diện, giúp các chuyên viên tại Shien Kikan vượt qua mọi rào cản, tối ưu hiệu suất tuyển dụng, và giảm tải áp lực hỗ trợ sau khi ứng viên sang Nhật.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "Thách Thức của Nhân sự Shien Kikan: Chúng Tôi Thấu Hiểu",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà bạn đang đối mặt hàng ngày trong vai trò cầu nối giữa ứng viên Việt Nam và doanh nghiệp Nhật Bản.",
        painPoints: [
            {
                icon: Users,
                title: 'Khan hiếm Ứng viên & Lợi nhuận thấp',
                description: 'Nguồn ứng viên chất lượng (đủ tay nghề, tiếng Nhật, hồ sơ hợp lệ) ngày càng ít. Cạnh tranh cao, chi phí lớn nhưng lợi nhuận cho Shien lại không tương xứng.',
            },
            {
                icon: FileSignature,
                title: 'Áp lực Pháp lý & Thủ tục phức tạp',
                description: 'Quy định về COE, visa, skill test từ Cục Xuất nhập cảnh (Nyukan) thay đổi nhanh chóng, hồ sơ giấy tờ phức tạp, tốn thời gian và dễ xảy ra sai sót.',
            },
            {
                icon: Handshake,
                title: 'Gánh nặng Hỗ trợ sau Tuyển dụng',
                description: 'Nhân sự Shien phải kiêm nhiệm quá nhiều việc: từ xử lý tranh chấp, hỗ trợ đời sống cho đến việc ứng viên bỏ việc giữa chừng, gây ảnh hưởng uy tín.',
            },
        ],
        solutionsTitle: "Giải pháp Công nghệ của HelloJob cho Tổ chức Hỗ trợ",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng các công cụ mạnh mẽ và tự động.",
        solutions: [
            {
                icon: Users,
                title: 'Nguồn Ứng viên Dồi dào, Chất lượng, Gia tăng lợi nhuận',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Tiếp cận nguồn ứng viên đã được sàng lọc ban đầu về kỹ năng và trình độ từ HelloJob hoặc các Công ty phái cử tham gia hệ thống.',
                    'Hệ thống AI tự động gợi ý ứng viên phù hợp nhất với yêu cầu từ doanh nghiệp tiếp nhận.',
                    'Tăng uy tín với doanh nghiệp Nhật nhờ nguồn cung ứng viên ổn định và chất lượng, đem lại lợi nhuận lâu dài.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Tối ưu hóa Quy trình & Giảm tải Thủ tục',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Cung cấp bộ công cụ số hóa để quản lý hồ sơ ứng viên, lịch phỏng vấn và theo dõi tiến độ.',
                    'Giảm thiểu sai sót giấy tờ, đẩy nhanh tốc độ xử lý hồ sơ COE và visa.',
                    'Giải phóng nhân sự khỏi các công việc hành chính lặp đi lặp lại để tập trung vào nghiệp vụ quan trọng.',
                ],
            },
            {
                icon: ShieldCheck,
                title: 'Giảm gánh nặng Hỗ trợ & Nâng cao Hiệu quả',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Cung cấp các bài viết, khóa học online về văn hóa, pháp luật Nhật Bản giúp ứng viên hòa nhập tốt hơn, giảm thiểu các vấn đề phát sinh.',
                    'Xây dựng cộng đồng người Việt tại Nhật để hỗ trợ lẫn nhau, giảm áp lực trực tiếp lên nhân sự Shien.',
                    'Giúp bạn tập trung vào việc phát triển quan hệ với doanh nghiệp và mở rộng kinh doanh.',
                ],
            },
        ],
        finalCtaTitle: "Nâng cao hiệu suất cho Tổ chức của bạn ngay hôm nay",
        finalCtaDescription: "Trở thành đối tác của HelloJob để bắt đầu tối ưu hóa quy trình, giảm chi phí và tiếp cận nguồn ứng viên chất lượng cao cho các doanh nghiệp tiếp nhận.",
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
            main: "特定技能採用担当者向けの包括的ソリューション",
            points: [
                "候補者プラットフォーム4.0、人材不足の悩みを解決。",
                "プロセスを最適化し、法的圧力を軽減。",
                "採用後のサポート負担を軽減し、中核業務に集中し、支援機関の利益を増加。"
            ]
        },
        heroDescription: "HelloJobは包括的な技術ソリューションを提供し、支援機関の専門家が障壁を乗り越え、採用効率を最適化し、候補者の来日後のサポート負担を軽減するのを支援します。",
        ctaPostJob: { main: "無料で求人掲載", sub: "Post Jobs for Free" },
        ctaRegisterPartner: { main: "パートナー登録", sub: "Register as Partner" },
        painPointsTitle: "支援機関の皆様の課題：私たちは理解しています",
        painPointsDescription: "HelloJobは、ベトナム人候補者と日本の受け入れ企業との架け橋として、皆様が日々直面している「痛み」を明確に認識しています。",
        painPoints: [
            { icon: Users, title: '質の高い候補者の不足と低利益', description: 'スキル、日本語能力、有効な書類を持つ質の高い候補者がますます少なくなっています。高い競争とコストにもかかわらず、支援機関の利益は見合っていません。' },
            { icon: FileSignature, title: '複雑で絶えず変化する法的手続き', description: '在留資格認定証明書（COE）、ビザ、技能試験に関する出入国在留管理庁（入管）の規制は頻繁に変更され、書類は複雑で時間がかかり、ミスが発生しやすいです。' },
            { icon: Handshake, title: '採用後のサポートの負担', description: '支援機関のスタッフは、紛争処理から生活支援（住居、銀行）まで、多くの業務を兼務し、候補者が途中で仕事を辞めるリスクも抱え、信頼に影響を与えます。' }
        ],
        solutionsTitle: "支援機関のためのHelloJobの技術ソリューション",
        solutionsDescription: "私たちは強力で自動化されたツールによって、あなたの各課題を成長の機会に変えます。",
        solutions: [
            {
                icon: Users,
                title: '豊富で質の高い候補者源、利益の増加',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'HelloJobまたはシステムに参加している送り出し機関から、スキルと日本語能力について事前にスクリーニングされた候補者源にアクセス。',
                    'AIシステムが受け入れ企業の要件に最適な候補者を自動的に提案します。',
                    '安定した質の高い候補者供給により、日本の受け入れ企業との信頼を高め、長期的な利益をもたらします。'
                ]
            },
            {
                icon: TrendingUp,
                title: 'プロセスの最適化と手続きの負担軽減',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    '候補者プロフィール、面接スケジュール、書類進捗を管理するためのデジタルツールセットを提供。',
                    '書類のミスを最小限に抑え、COEおよびビザ申請プロセスの処理速度を向上させます。',
                    '反復的な管理業務からスタッフを解放し、より重要な業務に集中させます。'
                ]
            },
            {
                icon: ShieldCheck,
                title: 'サポート負担の軽減と効率の向上',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    '日本の文化、法律に関する記事やオンラインコースを提供し、候補者の適応を助け、発生する問題を最小限に抑えます。',
                    '在日ベトナム人コミュニティを構築し、相互支援を促し、支援機関スタッフへの直接的な圧力を軽減します。',
                    '企業との関係構築やビジネス拡大に集中できるよう支援します。'
                ]
            }
        ],
        finalCtaTitle: "組織のパフォーマンスを向上させる準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、プロセスの最適化、コストの削減、受け入れ企業向けの質の高い候補者へのアクセスを開始しましょう。",
        finalCtaRegister: { main: "パートナー登録", sub: "Register as Partner Now" },
        finalCtaPost: { main: "無料で求人掲載", sub: "Post Jobs for Free" },
    },
    en: {
        heroTitle: {
            main: "Comprehensive Solution for Specified Skilled Worker Recruiters",
            points: [
                "Candidate Platform 4.0 - Solving the candidate sourcing problem.",
                "Automate processes, reduce legal pressure.",
                "Reduce support burden, focus on core tasks, and increase profit for Shien organizations."
            ]
        },
        heroDescription: "HelloJob provides a comprehensive technology solution, helping specialists at Shien Kikan overcome all barriers, optimize recruitment efficiency, and reduce the support burden after candidates arrive in Japan.",
        ctaPostJob: { main: "Post Jobs for Free", sub: "無料で求人掲載" },
        ctaRegisterPartner: { main: "Register as a Partner", sub: "パートナー登録" },
        painPointsTitle: "Challenges for Shien Kikan Staff: We Understand",
        painPointsDescription: "HelloJob recognizes the \"pain points\" you face daily in your role as a bridge between Vietnamese candidates and Japanese companies.",
        painPoints: [
            { icon: Users, title: 'Scarcity of Quality Candidates & Low Profit', description: 'The pool of quality candidates (with adequate skills, Japanese level, and valid documents) is shrinking. High competition and costs do not translate to commensurate profits for Shien organizations.' },
            { icon: FileSignature, title: 'Complex & Ever-Changing Legal Procedures', description: 'Regulations regarding COE, visas, and skill tests from the Immigration Services Agency (Nyukan) change frequently. Paperwork is complex, time-consuming, and prone to errors.' },
            { icon: Handshake, title: 'Post-Recruitment Support Burden', description: 'Shien staff are often overwhelmed, handling everything from disputes and life support (housing, banking) to candidates quitting mid-term, which affects the organization\'s reputation.' }
        ],
        solutionsTitle: "HelloJob\'s Tech Solutions for Support Organizations",
        solutionsDescription: "We turn your challenges into growth opportunities with powerful, automated tools.",
        solutions: [
            {
                icon: Users,
                title: 'Abundant, Quality Candidate Pool, Increased Profit',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Access a pre-screened candidate pool from HelloJob or participating Sending Companies for skills and language proficiency.',
                    'Our AI system automatically suggests the most suitable candidates for your receiving company\'s requirements.',
                    'Increase credibility with Japanese companies through a stable, high-quality candidate supply, leading to long-term profitability.'
                ]
            },
            {
                icon: TrendingUp,
                title: 'Process Optimization & Reduced Paperwork',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Provides a digital toolkit to manage candidate profiles, interview schedules, and document progress.',
                    'Minimize paperwork errors and speed up the COE and visa application process.',
                    'Free up your staff from repetitive administrative tasks to focus on more critical duties.'
                ]
            },
            {
                icon: ShieldCheck,
                title: 'Reduce Support Burden & Increase Efficiency',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Provides articles and online courses on Japanese culture and laws to help candidates integrate better, minimizing potential issues.',
                    'Builds a community for Vietnamese people in Japan for mutual support, reducing the direct pressure on Shien staff.',
                    'Helps you focus on developing relationships with companies and expanding your business.'
                ]
            }
        ],
        finalCtaTitle: "Ready to Elevate Your Organization's Performance?",
        finalCtaDescription: "Partner with HelloJob today to start optimizing processes, reducing costs, and accessing a high-quality candidate pool for your receiving companies.",
        finalCtaRegister: { main: "Register as a Partner Now", sub: "パートナー登録" },
        finalCtaPost: { main: "Post Jobs for Free", sub: "無料で求人掲載" },
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
        <section className="w-full bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 md:py-28">
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
                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-4 text-center md:text-left">
                      {t.heroTitle.main}
                  </h1>
                  <ul className="space-y-2 mb-6 text-center md:text-left">
                      {t.heroTitle.points.map((point, index) => (
                          <li key={index} className="flex items-center justify-center md:justify-start">
                              <span className="text-2xl text-white/90 mr-2">・</span>
                              <span className="text-lg md:text-xl text-white/90">{point}</span>
                          </li>
                      ))}
                  </ul>
                <p className="text-lg text-primary-foreground/80 mb-8 text-center md:text-left">
                  {t.heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => setIsXL01DialogOpen(true)}>
                        <div className="text-center">
                            <span className="font-semibold">{t.ctaPostJob.main}</span>
                            <div className="text-xs opacity-80">{t.ctaPostJob.sub}</div>
                        </div>
                    </Button>
                    <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" onClick={() => setIsYL01DialogOpen(true)}>
                        <div className="text-center">
                            <span className="font-semibold">{t.ctaRegisterPartner.main}</span>
                            <div className="text-xs opacity-80">{t.ctaRegisterPartner.sub}</div>
                        </div>
                    </Button>
                </div>
              </div>
               <div className="relative hidden md:block">
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

        <section className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">{t.painPointsTitle}</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t.painPointsDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.painPoints.map((point, index) => (
                <Card key={point.title} className="text-center p-8 shadow-lg bg-background">
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
        
         <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">{t.solutionsTitle}</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t.solutionsDescription}
              </p>
            </div>
            <div className="space-y-16">
              {t.solutions.map((solution, index) => (
                <div key={index} className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-row-dense' : ''}`}>
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

        <section className="bg-accent text-white py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">{t.finalCtaTitle}</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
              {t.finalCtaDescription}
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => setIsXL01DialogOpen(true)}>
                    <div className="text-center">
                        <span className="font-semibold">{t.finalCtaPost.main}</span>
                        <div className="text-xs opacity-80">{t.finalCtaPost.sub}</div>
                    </div>
                </Button>
                <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" onClick={() => setIsYL01DialogOpen(true)}>
                    <div className="text-center">
                        <span className="font-semibold">{t.finalCtaRegister.main}</span>
                        <div className="text-xs opacity-80">{t.finalCtaRegister.sub}</div>
                    </div>
                </Button>
            </div>
          </div>
        </section>

        <CtaHienThiViec08 lang={lang} prioritizedVisaType="Kỹ năng đặc định" />
      </div>
       <XL01Dialog 
        isOpen={isXL01DialogOpen} 
        onOpenChange={setIsXL01DialogOpen}
        onLanguageChange={setLang}
        initialLang={lang}
        initialStep={1}
        onComplete={handleXL01Complete}
        onBack={() => setIsXL01DialogOpen(false)}
      />
       <YL01Dialog 
        isOpen={isYL01DialogOpen} 
        onOpenChange={setIsYL01DialogOpen}
        onLanguageChange={setLang}
        initialLang={lang}
        initialStep={1}
        onComplete={navigateToEmployerPage}
        onBack={() => setIsYL01DialogOpen(false)}
      />
    </>
  );
}
