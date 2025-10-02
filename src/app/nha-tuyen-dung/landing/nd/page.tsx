
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
import { CtaNhaTuyenDung } from '@/components/cta-nha-tuyen-dung';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth-dialog';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import type { CandidateProfile } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { jobData, type Job } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';


type Language = 'vi' | 'ja' | 'en';

const pageContent = {
    vi: {
        heroTitle: {
            main: "協同組合向けソリューション",
            points: [
                "Có nguồn cung ứng viên phong phú",
                "Tối ưu chi phí, lợi nhuận",
                "Phát triển khách hàng"
            ]
        },
        heroDescription: "Nền tảng HelloJob cung cấp giải pháp công nghệ toàn diện, giúp Nghiệp đoàn của bạn giải quyết các bài toán cốt lõi và phát triển mạnh mẽ.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng ngay",
            sub: "求人を掲載 / Post Job Now"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "Chúng tôi thấu hiểu những thách thức của bạn",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà các Nghiệp đoàn đang đối mặt hàng ngày.",
        painPoints: [
            {
                icon: Users,
                title: 'Thiếu nguồn TTS chất lượng',
                description: 'Khó tìm ứng viên đạt chuẩn, không đáp ứng chỉ tiêu, rủi ro ứng viên bỏ trốn/nghỉ việc, tăng chi phí.',
            },
            {
                icon: DollarSign,
                title: 'Chi phí cao, lợi nhuận giảm',
                description: 'Phí từ doanh nghiệp tiếp nhận bị ép xuống, trong khi chi phí quản lý (nhà ở, hỗ trợ, nhân sự, pháp lý) ngày càng tăng.',
            },
            {
                icon: Search,
                title: 'Khó phát triển khách hàng',
                description: 'Cạnh tranh gay gắt trong việc tìm doanh nghiệp mới và giữ chân khách hàng cũ với nguồn cung không ổn định.',
            },
        ],
        solutionsTitle: "Giải pháp của HelloJob dành cho Nghiệp đoàn",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng công nghệ.",
        solutions: [
            {
                icon: Users,
                title: 'Nguồn ứng viên dồi dào và chất lượng',
                details: [
                    'Danh sách hàng trăm công ty phái cử với dịch vụ nguồn ứng viên đa dạng.',
                    'Nguồn ứng viên trực tiếp từ hệ thống công nghệ của HelloJob, chủ động tìm đến nền tảng.',
                    'Ứng viên được trang bị kiến thức thông qua hệ thống cẩm nang, nâng cao chất lượng cung cấp đến khách hàng.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Tối ưu hóa chi phí & Quản lý hiệu quả',
                details: [
                    'Được tự do đấu giá mức phí giới thiệu thấp nhất.',
                    'Được đề xuất lựa chọn các dịch vụ quản lý, đối ứng phù hợp nhất để bảo đảm hiệu quả kinh doanh.',
                    'Nền tảng số hóa quản lý ứng viên, công việc, phỏng vấn, giảm thiểu giấy tờ và quy trình thủ công.',
                ],
            },
            {
                icon: Handshake,
                title: 'Mở rộng & Giữ chân khách hàng',
                details: [
                    'Được xây dựng profile doanh nghiệp chuyên nghiệp, hiện đại để quảng bá đến khách hàng những dịch vụ tốt nhất của mình.',
                    'Được tự do xây dựng các bài viết, nội dung để thu hút khách hàng vào gian hàng của mình.',
                    'Được tiếp cận với những khách hàng tiềm năng trong khu vực của mình trong tương lai.',
                ],
            },
        ],
        finalCtaTitle: "Sẵn sàng nâng tầm hoạt động của Nghiệp đoàn?",
        finalCtaDescription: "Trở thành đối tác của HelloJob ngay hôm nay để bắt đầu tối ưu hóa quy trình, giảm chi phí và tiếp cận nguồn ứng viên chất lượng cao.",
        finalCtaRegister: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner Now"
        },
        finalCtaPost: {
            main: "Đăng tin tuyển dụng ngay",
            sub: "求人を掲載 / Post a Job"
        },
    },
    ja: {
        heroTitle: {
            main: "協同組合向けソリューション",
            points: [
                "豊富な候補者供給源",
                "コストと利益の最適化",
                "顧客基盤の育成"
            ]
        },
        heroDescription: "HelloJobプラットフォームは包括的な技術ソリューションを提供し、組合が中心的な課題を解決し、力強く成長するのを支援します。",
        ctaPostJob: {
            main: "求人を掲載",
            sub: "Đăng tin tuyển dụng ngay / Post Job Now"
        },
        ctaRegisterPartner: {
            main: "パートナー登録",
            sub: "Đăng ký đối tác / Register as Partner"
        },
        painPointsTitle: "私たちはあなたの課題を理解しています",
        painPointsDescription: "HelloJobは、組合が日常的に直面している「痛み」を明確に認識しています。",
        painPoints: [
            {
                icon: Users,
                title: '質の高い実習生の不足',
                description: '基準を満たす候補者を見つけるのが難しく、目標を達成できず、候補者の失踪/離職のリスク、研修費用が増加します。',
            },
            {
                icon: DollarSign,
                title: '高コスト、低利益',
                description: '受け入れ企業からの費用は圧迫され、管理費用（住居、サポート、人事、法務）は増加しています。',
            },
            {
                icon: Search,
                title: '顧客開拓の難しさ',
                description: '不安定な供給源では、新規の受け入れ企業を見つけ、既存の顧客を維持することは困難です。',
            },
        ],
        solutionsTitle: "組合向けのHelloJobソリューション",
        solutionsDescription: "私たちはテクノロジーによってあなたの各課題を成長の機会に変えます。",
        solutions: [
            {
                icon: Users,
                title: '豊富で質の高い候補者源',
                details: [
                    '多様な候補者源を持つ数百の送り出し機関のリスト。',
                    'HelloJobの技術システムからの直接の候補者源、積極的にプラットフォームにアクセス。',
                    '候補者はハンドブックシステムを通じて知識を身につけ、顧客への提供品質を向上させます。',
                ],
            },
            {
                icon: TrendingUp,
                title: 'コスト最適化と効率的な管理',
                details: [
                    '最低の紹介料を自由にオークションにかけることができます。',
                    'ビジネス効率を確保するために、最適な管理および対応サービスを提案されます。',
                    '候補者、仕事、面接を管理するためのデジタルプラットフォーム、紙や手動プロセスを削減します。',
                ],
            },
            {
                icon: Handshake,
                title: '顧客の拡大と維持',
                details: [
                    'プロフェッショナルで現代的な企業プロフィールを構築し、最高のサービスを顧客に宣伝します。',
                    '自由に記事やコンテンツを作成し、顧客を自分のブースに引き付けます。',
                    '将来的には、あなたの地域の潜在的な顧客にアクセスできるようになります。',
                ],
            },
        ],
        finalCtaTitle: "組合の活動を向上させる準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、プロセスの最適化、コストの削減、質の高い候補者へのアクセスを開始しましょう。",
        finalCtaRegister: {
            main: "パートナー登録",
            sub: "Đăng ký đối tác / Register as Partner Now"
        },
        finalCtaPost: {
            main: "求人を掲載",
            sub: "Đăng tin tuyển dụng ngay / Post a Job"
        },
    },
    en: {
        heroTitle: {
            main: "Solutions for Unions",
            points: [
                "Abundant, quality candidate sources",
                "Optimize costs and profits",
                "Sustainable client development"
            ]
        },
        heroDescription: "The HelloJob platform provides comprehensive technology solutions, helping your Union solve core problems and grow strongly.",
        ctaPostJob: {
            main: "Post a Job Now",
            sub: "Đăng tin tuyển dụng ngay / 求人を掲載"
        },
        ctaRegisterPartner: {
            main: "Register as a Partner",
            sub: "Đăng ký đối tác / パートナー登録"
        },
        painPointsTitle: "We Understand Your Challenges",
        painPointsDescription: "HelloJob clearly identifies the \"pain points\" that Unions face daily.",
        painPoints: [
            {
                icon: Users,
                title: 'Lack of Quality Trainees',
                description: 'Difficulty finding candidates who meet standards, failing to meet quotas, risk of candidates absconding/quitting, increased training costs.',
            },
            {
                icon: DollarSign,
                title: 'High Costs, Reduced Profits',
                description: 'Fees from receiving companies are squeezed, while management costs (housing, support, HR, legal) are increasing.',
            },
            {
                icon: Search,
                title: 'Difficulty Developing Customers',
                description: 'Intense competition in finding new receiving companies and retaining old ones with an unstable supply.',
            },
        ],
        solutionsTitle: "HelloJob's Solutions for Unions",
        solutionsDescription: "We turn each of your challenges into a growth opportunity with technology.",
        solutions: [
            {
                icon: Users,
                title: 'Abundant and Quality Candidate Pool',
                details: [
                    'A list of hundreds of sending agencies with diverse candidate sourcing services.',
                    'Direct candidate sources from HelloJob\'s technology system, proactively coming to the platform.',
                    'Candidates are equipped with knowledge through the handbook system, enhancing the quality provided to customers.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Cost Optimization & Efficient Management',
                details: [
                    'Freedom to bid for the lowest referral fees.',
                    'Recommendations for the most suitable management and support services to ensure business efficiency.',
                    'A digital platform to manage candidates, jobs, and interviews, reducing paperwork and manual processes.',
                ],
            },
            {
                icon: Handshake,
                title: 'Customer Expansion & Retention',
                details: [
                    'Build a professional, modern company profile to promote your best services to customers.',
                    'Freedom to create articles and content to attract customers to your booth.',
                    'Gain access to potential customers in your area in the future.',
                ],
            },
        ],
        finalCtaTitle: "Ready to Elevate Your Union's Operations?",
        finalCtaDescription: "Become a HelloJob partner today to start optimizing processes, reducing costs, and accessing a high-quality candidate pool.",
        finalCtaRegister: {
            main: "Register as a Partner Now",
            sub: "Đăng ký đối tác / パートナー登録"
        },
        finalCtaPost: {
            main: "Post a Job",
            sub: "Đăng tin tuyển dụng ngay / 求人を掲載"
        },
    }
};

const CtaViecLamPhuHopCustom = () => {
    const { role, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
    const fetchSuggestions = useCallback(async () => {
      setIsLoading(true);
      try {
          const storedProfile = localStorage.getItem('generatedCandidateProfile');
          const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
          const profile: Partial<CandidateProfile> | null = storedProfile ? JSON.parse(storedProfile) : null;
          const matchResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
          setSuggestions(matchResults.slice(0, 4));
      } catch (error) {
          console.error("Failed to fetch behavioral suggestions for CTA:", error);
          setSuggestions(jobData.slice(4, 8).map(job => ({ job })));
      } finally {
          setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchSuggestions();
      const handleStorageChange = (event: StorageEvent) => {
          if (event.key === 'behavioralSignals' || event.key === 'generatedCandidateProfile' || event.key === null) {
              fetchSuggestions();
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, [fetchSuggestions]);
    
    const handleLoginClick = () => {
        setIsAuthDialogOpen(true);
    }
  
    const renderContent = () => {
      if (isLoading) {
        return (
           Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)
        );
      }
      
      if (suggestions.length === 0) {
        return null;
      }
  
      return (
          suggestions.map((item) => (
              <JobCard key={item.job.id} job={item.job} />
          ))
      );
    };
    
    return (
      <section id="HIENTHIVIEC08" className="w-full">
          <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-2xl font-headline font-bold text-left mb-8 flex items-center gap-3">
                  <Briefcase className="h-7 w-7 text-primary" />
                  Hiển thị việc làm/求人表示/Jobs display
              </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderContent()}
              </div>
              <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
          </div>
      </section>
    )
}

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
    
    router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
    setIsYL01DialogOpen(false);
  };

  return (
    <>
      <div className="bg-background">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <div className="text-center md:text-left">
                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-4">
                      {t.heroTitle.main}
                  </h1>
                  <ul className="space-y-2 mb-6">
                      {t.heroTitle.points.map((point, index) => (
                          <li key={index} className="flex items-center justify-center md:justify-start">
                              <span className="text-2xl text-white/90 mr-2">・</span>
                              <span className="text-lg md:text-xl text-white/90">{point}</span>
                          </li>
                      ))}
                  </ul>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  {t.heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01" onClick={() => setIsXL01DialogOpen(true)}>
                        <div className="text-center">
                            <span className="font-semibold">{t.ctaPostJob.main}</span>
                            <div className="text-xs opacity-80">{t.ctaPostJob.sub}</div>
                        </div>
                    </Button>
                    <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01" onClick={() => setIsYL01DialogOpen(true)}>
                        <div className="text-center">
                            <span className="font-semibold">{t.ctaRegisterPartner.main}</span>
                            <div className="text-xs opacity-80">{t.ctaRegisterPartner.sub}</div>
                        </div>
                    </Button>
                </div>
              </div>
               <div className="relative flex flex-col">
                  <div className="md:hidden flex justify-center mb-4">
                        <Tabs defaultValue={lang} onValueChange={(value) => setLang(value as Language)} className="inline-block">
                            <TabsList className="bg-black/30 backdrop-blur-sm border border-white/20">
                                <TabsTrigger value="vi" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><VnFlagIcon className="h-4 w-4" /></TabsTrigger>
                                <TabsTrigger value="ja" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><JpFlagIcon className="h-4 w-4" /></TabsTrigger>
                                <TabsTrigger value="en" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><EnFlagIcon className="h-4 w-4" /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                     <div className="hidden md:flex justify-end mb-4">
                      <Tabs defaultValue={lang} onValueChange={(value) => setLang(value as Language)} className="inline-block">
                          <TabsList className="bg-black/30 backdrop-blur-sm border border-white/20">
                              <TabsTrigger value="vi" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><VnFlagIcon className="h-4 w-4" /> Tiếng Việt</TabsTrigger>
                              <TabsTrigger value="ja" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><JpFlagIcon className="h-4 w-4" /> 日本語</TabsTrigger>
                              <TabsTrigger value="en" className="text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary px-3 flex items-center gap-2"><EnFlagIcon className="h-4 w-4" /> English</TabsTrigger>
                          </TabsList>
                      </Tabs>
                  </div>
                  <div className="relative aspect-[4/3] max-h-[350px]">
                      <Image
                          src="/img/NTD/ND.jpg"
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
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">{t.painPointsTitle}</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t.painPointsDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.painPoints.map((point) => (
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
        
        {/* Solutions Section */}
         <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">{t.solutionsTitle}</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t.solutionsDescription}
              </p>
            </div>
            <div className="space-y-12">
              {t.solutions.map((solution, index) => (
                <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-row-dense' : ''}`}>
                  <div className={`relative h-80 rounded-lg shadow-xl overflow-hidden ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                      <Image src="https://placehold.co/600x400.png" alt={solution.title} fill className="object-cover" data-ai-hint="solution illustration"/>
                  </div>
                  <div className="space-y-4">
                      <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                          <solution.icon className="h-8 w-8 text-primary"/>
                      </div>
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
        <section className="bg-accent text-white py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">{t.finalCtaTitle}</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
              {t.finalCtaDescription}
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01-footer" onClick={() => setIsYL01DialogOpen(true)}>
                    <div className="text-center">
                        <span className="font-semibold">{t.finalCtaRegister.main}</span>
                        <div className="text-xs opacity-80">{t.finalCtaRegister.sub}</div>
                    </div>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01-footer" onClick={() => setIsXL01DialogOpen(true)}>
                    <div className="text-center">
                        <span className="font-semibold">{t.finalCtaPost.main}</span>
                        <div className="text-xs opacity-80">{t.finalCtaPost.sub}</div>
                    </div>
                </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="space-y-20 md:space-y-28 py-20 md:py-28 bg-secondary">
          <CtaViecLamPhuHopCustom />
        </div>
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

    