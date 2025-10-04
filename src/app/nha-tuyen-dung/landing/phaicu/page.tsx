
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
import { ActivityPhotos } from '@/components/activity-photos';


type Language = 'vi' | 'ja' | 'en';

const pageContent = {
    vi: {
        heroTitle: {
            main: "Giải pháp Công nghệ cho Công ty Phái cử Việt Nam",
            points: [
                "Mở rộng nguồn ứng viên dồi dào từ hệ sinh thái HelloJob và các đối tác.",
                "Kết nối trực tiếp & xây dựng thương hiệu với đối tác Nhật Bản, gia tăng lợi nhuận.",
                "Tối ưu hóa quy trình vận hành, giảm chi phí & rủi ro.",
                "Cập nhật liên tục tri thức ngành và luật pháp."
            ]
        },
        heroDescription: "HelloJob mang đến giải pháp công nghệ toàn diện, giúp các công ty phái cử (xuất khẩu lao động) vượt qua mọi thách thức, chủ động kết nối đối tác, tự chủ nguồn ứng viên và đột phá trong kỷ nguyên số.",
        ctaPostJob: {
            main: "Đăng tin tuyển dụng miễn phí",
            sub: "無料で求人掲載 / Post Jobs for Free"
        },
        ctaRegisterPartner: {
            main: "Đăng ký đối tác",
            sub: "パートナー登録 / Register as Partner"
        },
        painPointsTitle: "4 Thách thức lớn nhất của Công ty Phái cử",
        painPointsDescription: "HelloJob nhận diện rõ những \"nỗi đau\" mà bạn đang đối mặt hàng ngày trong cuộc cạnh tranh khốc liệt.",
        painPoints: [
            {
                icon: Users,
                title: 'Khó khăn trong Tuyển dụng & Tìm kiếm Nguồn ứng viên',
                description: 'Thị trường cạnh tranh khốc liệt, chi phí marketing cao nhưng nguồn ứng viên khan hiếm, không chất lượng. Lao động thiếu tay nghề và ngoại ngữ dẫn đến tỷ lệ trượt đơn hàng cao, lãng phí chi phí đào tạo.',
            },
            {
                icon: Handshake,
                title: 'Khó khăn trong Phát triển Khách hàng & Đối tác',
                description: 'Gặp trở ngại khi tiếp cận và thuyết phục các nghiệp đoàn, xí nghiệp tiếp nhận mới do thiếu công cụ marketing chuyên nghiệp và thương hiệu chưa được biết đến rộng rãi tại Nhật.',
            },
            {
                icon: FileSignature,
                title: 'Quy trình thủ công & Chi phí vận hành cao',
                description: 'Quản lý hồ sơ, lịch phỏng vấn, theo dõi tiến độ bằng các công cụ rời rạc (Excel, Zalo) gây tốn thời gian, dễ sai sót, tăng chi phí nhân sự và vận hành.',
            },
             {
                icon: ShieldCheck,
                title: 'Rủi ro Pháp lý & Thiếu thông tin',
                description: 'Quy định pháp luật trong và ngoài nước thay đổi liên tục, thiếu nguồn thông tin chính thống và cập nhật, dẫn đến rủi ro trong việc tuân thủ và tư vấn cho người lao động.',
            },
        ],
        solutionsTitle: "Giải pháp Công nghệ từ HelloJob dành cho bạn",
        solutionsDescription: "Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng các công cụ mạnh mẽ và tự động.",
        solutions: [
            {
                icon: Users,
                title: 'Kênh Đối tác & Nguồn ứng viên 4.0',
                image: '/img/NTD/CTBV01.jpg',
                details: [
                    'Hiển thị việc làm của bạn đến hàng chục ngàn ứng viên trên HelloJob và mạng lưới đối tác tuyển dụng rộng khắp.',
                    'Hệ thống AI tự động sàng lọc, gợi ý ứng viên phù hợp nhất, giúp bạn tập trung vào các hồ sơ tiềm năng.',
                    'Xây dựng "phễu" ứng viên chất lượng cao của riêng bạn, nâng cao tính tự chủ và giảm sự phụ thuộc vào các kênh truyền thống.',
                ],
            },
            {
                icon: Handshake,
                title: 'Xây dựng Thương hiệu & Kết nối Đối tác',
                image: '/img/NTD/phaicu03.jpg',
                details: [
                    'Xây dựng profile doanh nghiệp chuyên nghiệp trên HelloJob để quảng bá năng lực và uy tín tới các đối tác Nhật Bản.',
                    'Sử dụng nền tảng để đăng tải các bài viết, hoạt động, tạo niềm tin và trực tiếp thu hút sự quan tâm từ các đối tác Nhật Bản.',
                    'Cơ hội tiếp cận các đơn hàng độc quyền và tham gia vào một hệ sinh thái đối tác minh bạch, hiệu quả.',
                ],
            },
            {
                icon: TrendingUp,
                title: 'Tối ưu hóa Vận hành & Gia tăng Lợi nhuận',
                image: '/img/NTD/CTBV02.jpg',
                details: [
                    'Cung cấp bộ công cụ số hóa để quản lý ứng viên, lịch phỏng vấn và theo dõi tiến độ, giảm thiểu giấy tờ và quy trình thủ công.',
                    'Hệ thống báo cáo tự động giúp theo dõi hiệu quả, tối ưu chi phí và lợi nhuận trên từng đơn hàng.',
                    'Đăng tin miễn phí để giảm chi phí marketing, tối đa hóa lợi nhuận.',
                ],
            },
            {
                icon: ShieldCheck,
                title: 'Công cụ & Tri thức đồng hành',
                image: '/img/NTD/CTBV03.jpg',
                details: [
                    'Nền tảng cập nhật liên tục các thay đổi về luật pháp, giúp bạn luôn tuân thủ và giảm rủi ro.',
                    'Cung cấp hệ thống cẩm nang và E-learning để bạn nâng cao chất lượng đào tạo và tư vấn cho người lao động.',
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
            points: ["HelloJobエコシステムとパートナーから豊富な候補者源を拡大。", "日本のパートナーと直接連携し、ブランドを構築し、利益を増加させる。", "運用プロセスを最適化し、コストとリスクを削減。", "業界知識と法律を継続的に更新。"],
            description: "HelloJobは、送り出し機関（ベトナムの労働者派遣会社）があらゆる課題を克服し、主体的にパートナーと連携し、デジタル時代に飛躍するための包括的な技術ソリューションを提供します。"
        },
        ctaPostJob: { main: "無料で求人掲載", sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free" },
        ctaRegisterPartner: { main: "パートナー登録", sub: "Đăng ký đối tác / Register as Partner" },
        painPointsTitle: "送り出し機関の4大課題",
        painPointsDescription: "HelloJobは、あなたが熾烈な競争の中で日々直面している「痛み」を明確に認識しています。",
        painPoints: [
            { icon: Users, title: '採用と候補者ソースの確保の難しさ', description: '市場は競争が激しく、マーケティング費用は高いが、候補者源は希少で質が低い。労働者のスキルと語学力が不足しているため、不合格率が高く、研修費用が無駄になります。' },
            { icon: Handshake, title: '顧客とパートナー開拓の難しさ', description: '専門的なマーケティングツールや日本での知名度不足のため、新しい組合や受け入れ企業へのアプローチと説得に障壁があります。' },
            { icon: FileSignature, title: '手動プロセスと高い運営コスト', description: '書類管理、面接スケジュール、進捗追跡を別々のツール（Excel、Zalo）で行うことは、時間がかかり、ミスが発生しやすく、人件費と運営コストを増加させます。' },
            { icon: ShieldCheck, title: '法的リスクと情報不足', description: '国内外の法規制が絶えず変化し、公式で最新の情報源が不足しているため、コンプライアンスや労働者への助言にリスクが生じます。' }
        ],
        solutionsTitle: "あなたのためのHelloJobの技術ソリューション",
        solutionsDescription: "私たちは強力で自動化されたツールによって、あなたの各課題を成長の機会に変えます。",
        solutions: [
            { icon: Users, title: 'パートナーチャネルと候補者プラットフォーム4.0', image: '/img/NTD/CTBV01.jpg', details: ['あなたの求人をHelloJob上の何万人もの候補者と幅広い採用パートナーネットワークに表示します。', 'AIシステムが自動的にスクリーニングし、最適な候補者を提案するため、最も可能性の高いプロフィールに集中できます。', '独自の質の高い候補者ファネルを構築し、自主性を高め、従来のチャネルへの依存を減らします。'] },
            { icon: Handshake, title: 'ブランド構築とパートナー連携', image: '/img/NTD/phaicu03.jpg', details: ['HelloJobでプロフェッショナルな企業プロフィールを構築し、日本のパートナーに能力と信頼性をアピールします。', 'プラットフォームを利用して活動を投稿し、信頼を築き、日本のパートナーから直接関心を引き付けます。', '独占的な求人案件にアクセスし、透明で効率的なパートナーエコシステムに参加する機会。'] },
            { icon: TrendingUp, title: '運用の最適化と利益の向上', image: '/img/NTD/CTBV02.jpg', details: ['候補者管理、面接スケジュール、進捗追跡のためのデジタルツールセットを提供し、書類作業と手動プロセスを削減します。', '自動報告システムで各求人の効果を追跡し、コストと利益を最適化します。', 'プラットフォーム上の既存の候補者源のおかげで、マーケティングコストを削減し、利益を最大化します。'] },
            { icon: ShieldCheck, title: 'ツールと知識のパートナーシップ', image: '/img/NTD/CTBV03.jpg', details: ['法改正を継続的に更新し、常にコンプライアンスを遵守し、リスクを低減します。', 'ハンドブックとEラーニングシステムを提供し、研修の質を高め、労働者への助言を改善します。', '採用プロセスにおける情報の透明性を高め、労働者とパートナーの双方から信頼を築きます。'] }
        ],
        finalCtaTitle: "派遣業界でデジタル変革と飛躍を遂げる準備はできましたか？",
        finalCtaDescription: "今すぐHelloJobのパートナーになり、グローバルに連携し、プロセスを最適化し、信頼できる持続可能な派遣ブランドを構築しましょう。",
        finalCtaRegister: { main: "パートナー登録", sub: "Đăng ký đối tác / Register as Partner Now" },
        finalCtaPost: { main: "無料で求人掲載", sub: "Đăng tin tuyển dụng miễn phí / Post Jobs for Free" }
    },
    en: {
        heroTitle: {
            main: "Tech Solution for Vietnamese Sending Companies",
            points: ["Expand abundant candidate sources from the HelloJob ecosystem and its partners.", "Directly connect & build your brand with Japanese partners, increasing profits.", "Optimize operational processes, reducing costs & risks.", "Continuously update industry knowledge and legal regulations."],
            description: "HelloJob delivers a comprehensive technology solution, helping sending companies (labor export agencies) overcome all challenges, proactively connect with partners, take control of their candidate sources, and achieve breakthroughs in the digital era."
        },
        ctaPostJob: { main: "Post Jobs for Free", sub: "Đăng tin tuyển dụng miễn phí / 無料で求人掲載" },
        ctaRegisterPartner: { main: "Register as a Partner", sub: "Đăng ký đối tác / パートナー登録" },
        painPointsTitle: "4 Biggest Challenges for Sending Companies",
        painPointsDescription: "HelloJob recognizes the \"pain points\" you face daily in a fierce market.",
        painPoints: [
            { icon: Users, title: 'Difficulty in Recruitment & Sourcing Candidates', description: 'Fierce market competition and high marketing costs, yet candidate sources are scarce and low-quality. Unskilled workers with poor language proficiency lead to high rejection rates and wasted training costs.' },
            { icon: Handshake, title: 'Difficulty in Developing Clients & Partners', description: 'Struggling to approach and convince new unions and accepting companies due to a lack of professional marketing tools and brand recognition in Japan.' },
            { icon: FileSignature, title: 'Manual Processes & High Operating Costs', description: 'Managing profiles, interview schedules, and tracking progress with disparate tools (Excel, Zalo) is time-consuming, prone to errors, and increases personnel and operational costs.' },
            { icon: ShieldCheck, title: 'Legal Risks & Lack of Information', description: 'Constantly changing domestic and international regulations, coupled with a lack of official, updated information sources, leads to compliance risks and challenges in advising workers.' }
        ],
        solutionsTitle: "HelloJob's Tech Solutions for You",
        solutionsDescription: "We turn your challenges into growth opportunities with powerful, automated tools.",
        solutions: [
            { icon: Users, title: 'Partner Channel & Candidate Pool 4.0', image: '/img/NTD/CTBV01.jpg', details: ['Display your job listings to tens of thousands of candidates on HelloJob and across a wide network of recruitment partners.', 'Our AI system automatically screens and suggests the most suitable candidates, helping you focus on the most promising profiles.', 'Build your own high-quality candidate funnel, increasing autonomy and reducing dependency on traditional channels.'] },
            { icon: Handshake, title: 'Brand Building & Partner Connection', image: '/img/NTD/phaicu03.jpg', details: ['Build a professional company profile on HelloJob to promote your capabilities and credibility to Japanese partners.', 'Use the platform to post activities and build trust, directly attracting interest from Japanese partners.', 'Access exclusive job orders and participate in a transparent, efficient partner ecosystem.'] },
            { icon: TrendingUp, title: 'Optimize Operations & Increase Profitability', image: '/img/NTD/CTBV02.jpg', details: ['Provides a digital toolkit to manage candidates, interview schedules, and track progress, reducing paperwork and manual processes.', 'Automatic reporting system helps track effectiveness, optimizing costs and profits for each order.', 'Reduce marketing and recruitment costs thanks to the existing candidate pool on the platform.'] },
            { icon: ShieldCheck, title: 'Accompanying Tools & Knowledge', image: '/img/NTD/CTBV03.jpg', details: ['The platform continuously updates on legal changes, helping you stay compliant and reduce risks.', 'Provides a handbook and E-learning system for you to enhance training quality and worker consultation.', 'Enhance information transparency in the recruitment process to build trust with both workers and partners.'] }
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
