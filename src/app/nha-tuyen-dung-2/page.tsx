

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, FileSignature, BarChart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const partnerBenefits = [
  { 
    icon: Users,
    title_vi: 'Nguồn ứng viên dồi dào',
    title_ja: '豊富な候補者源',
    title_en: 'Abundant Candidate Pool',
    description_vi: 'Tiếp cận hệ thống dữ liệu ứng viên Kỹ năng Đặc định (Tokutei) đã được sàng lọc và xác thực thông tin ban đầu.',
    description_ja: '事前にスクリーニング・検証された特定技能候補者のデータベースにアクセスできます。',
    description_en: 'Access a database of Special Skilled Worker (Tokutei) candidates that has been pre-screened and verified.'
  },
  { 
    icon: FileSignature,
    title_vi: 'Công cụ quản lý hiệu quả',
    title_ja: '効率的な管理ツール',
    title_en: 'Effective Management Tools',
    description_vi: 'Sử dụng nền tảng để quản lý tin tuyển dụng, theo dõi trạng thái ứng viên và tương tác một cách chuyên nghiệp.',
    description_ja: 'プラットフォームを使用して、求人情報を管理し、候補者の状況を追跡し、専門的に対話します。',
    description_en: 'Use the platform to manage job postings, track candidate status, and interact professionally.'
  },
  { 
    icon: BarChart,
    title_vi: 'Hỗ trợ Marketing & Vận hành',
    title_ja: 'マーケティング・運営支援',
    title_en: 'Marketing & Operations Support',
    description_vi: 'Được hỗ trợ quảng bá tin tuyển dụng trên các kênh của HelloJob, tiếp cận đúng đối tượng mục tiêu và tối ưu hóa hiệu quả.',
    description_ja: 'HelloJobのチャネルで求人広告を宣伝し、適切なターゲット層にリーチし、効果を最適化するためのサポートを受けられます。',
    description_en: 'Receive support to promote job postings on HelloJob\'s channels, reaching the right target audience and optimizing effectiveness.'
  },
  {
    icon: ShieldCheck,
    title_vi: 'Hợp tác minh bạch',
    title_ja: '透明性の高い協力体制',
    title_en: 'Transparent Partnership',
    description_vi: 'Quy trình hợp tác rõ ràng, cơ chế chia sẻ doanh thu hấp dẫn và minh bạch, đảm bảo quyền lợi cho đối tác.',
    description_ja: '明確な協力プロセス、魅力的で透明な収益分配メカニズムにより、パートナーの利益を保証します。',
    description_en: 'A clear cooperation process, along with an attractive and transparent revenue-sharing mechanism, ensures benefits for partners.'
  }
];

export default function NhaTuyenDung2Page() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-accent text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
                Nền tảng Đối tác Tuyển dụng Kỹ năng Đặc định
                <span className="block text-xl text-primary-foreground/80 mt-2">特定技能パートナーシップ基盤</span>
                 <span className="block text-xl text-primary-foreground/80 mt-1">Platform for Tokutei Ginou Partners</span>
              </h1>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01">
                  <Link href="/doi-tac/dang-tin-tuyen-dung">
                    <div className="text-center">
                        <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                        <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01">
                  <Link href="/nhuong-quyen">
                    <div className="text-center">
                        <span className="font-semibold">Đăng ký đối tác</span>
                        <div className="text-xs opacity-80">パートナー登録 / Register as Partner</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
             <div className="relative hidden md:block">
                <Image 
                  src="https://placehold.co/600x400.png"
                  alt="Sơ đồ hợp tác đối tác"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  data-ai-hint="partnership model diagram"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Benefits */}
      <section className="w-full py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
                Lợi ích dành cho Đối tác
                <span className="block text-lg text-muted-foreground mt-2">パートナーのメリット / Benefits for Partners</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {partnerBenefits.map(feature => (
              <Card key={feature.title_vi} className="text-center p-6 border-t-4 border-primary shadow-lg hover:shadow-xl transition-shadow h-full">
                 <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h3 className="text-xl font-bold font-headline mb-2">{feature.title_vi}</h3>
                 <p className="text-sm text-muted-foreground">{feature.description_vi}</p>
                 <div className="mt-2 text-xs text-muted-foreground/70">
                    <p>{feature.title_ja}</p>
                    <p>{feature.title_en}</p>
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
                        Chào mừng các Đối tác Tuyển dụng
                        <span className="block text-lg text-muted-foreground mt-2">採用パートナー様へようこそ / Welcome, Recruiting Partners</span>
                    </h2>
                    <p className="text-muted-foreground max-w-4xl mx-auto">
                        HelloJob là hệ thống giúp các đối tác đăng tải thông tin việc làm miễn phí để tuyển dụng ứng viên Việt Nam. Chúng tôi chào mừng các đối tác là Cá nhân (làm việc cho các tổ chức nhân lực) hoặc Pháp nhân tại Việt Nam và Nhật Bản.
                        <span className="block text-sm opacity-80 mt-2">HelloJobはベトナム人候補者を採用するための無料求人投稿プラットフォームです... / HelloJob is a free job posting platform to recruit Vietnamese candidates...</span>
                    </p>
                    <div className="mt-6 bg-background p-6 rounded-lg inline-block text-left">
                        <h3 className="font-semibold mb-3">Các loại hình tuyển dụng chính:</h3>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>- Kỹ năng đặc định (特定技能)</li>
                            <li>- Thực tập sinh kỹ năng (技能実習)</li>
                            <li>- Kỹ sư, tri thức (技術・人文知識・国際業務 - 技人国)</li>
                        </ul>
                    </div>
                     <p className="mt-6 text-muted-foreground max-w-4xl mx-auto">
                        Bạn có thể đăng việc làm ngay hoặc để lại thông tin liên hệ để tìm hiểu về cơ chế hợp tác.
                        <span className="block text-sm opacity-80 mt-2">すぐに求人を掲載するか、連絡先を残して協力体制についてご相談ください。/ You can post a job now or leave your contact information to learn about our partnership.</span>
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90" id="DANGTINTUYENDUNG01">
                           <Link href="/doi-tac/dang-tin-tuyen-dung">
                                <div className="text-center">
                                    <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                                    <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                                </div>
                            </Link>
                        </Button>
                         <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01">
                          <Link href="/nhuong-quyen">
                            <div className="text-center">
                                <span className="font-semibold">Đăng ký đối tác</span>
                                <div className="text-xs opacity-80">パートナー登録 / Register as Partner</div>
                            </div>
                          </Link>
                        </Button>
                    </div>
                 </div>
            </Card>
        </div>
      </section>
    </div>
  );
}
