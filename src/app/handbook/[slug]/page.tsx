

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scroll, Timer, UserCircle, Briefcase, ChevronRight, Video, FileText, PlusCircle, ChevronDown, Newspaper, Image as ImageIcon, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { articles, type HandbookArticle } from '@/lib/handbook-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { jobData } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CommentSection } from '@/components/handbook/comment-section';


const ShareDialogContent = () => (
    <>
    <DialogHeader className="text-center">
        <DialogTitle className="text-3xl font-headline">Chọn loại nội dung bạn muốn chia sẻ</DialogTitle>
        <DialogDescription className="text-base">
            Đóng góp kiến thức và kinh nghiệm của bạn cho cộng đồng HelloJob.
        </DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <Link href="/handbook/create/post">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng nội dung dạng chữ</h3>
                <p className="text-muted-foreground text-sm">Chia sẻ một câu chuyện, mẹo nhỏ, hoặc một câu hỏi.</p>
            </Card>
        </Link>
        <Link href="/handbook/create/image">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <ImageIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng bài viết dạng ảnh</h3>
                <p className="text-muted-foreground text-sm">Tạo một bài viết với hình ảnh minh hoạ trực quan.</p>
            </Card>
        </Link>
        <Link href="/handbook/create/video-short">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <Smartphone className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng video ngắn</h3>
                <p className="text-muted-foreground text-sm">Chia sẻ một khoảnh khắc hoặc hướng dẫn nhanh.</p>
            </Card>
        </Link>
        <Link href="/handbook/create/video">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <Video className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng video dài</h3>
                <p className="text-muted-foreground text-sm">Tạo một video chuyên sâu, phỏng vấn, hoặc vlog.</p>
            </Card>
        </Link>
    </div>
    </>
);


export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [activeId, setActiveId] = useState('');
  
  const resolvedParams = use(params);
  const article = articles.find((a) => a.slug === resolvedParams.slug);

  useEffect(() => {
    if (!article || article.type !== 'article' || !article.content) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    article.content.forEach((section) => {
      const el = document.getElementById(section.slug);
      if (el) observer.observe(el);
    });

    return () => {
       article.content?.forEach((section) => {
        const el = document.getElementById(section.slug);
        if (el) observer.unobserve(el);
      });
    };
  }, [article]);

  if (!article) {
    notFound();
  }
  
  const otherArticles = articles.filter(a => a.slug !== resolvedParams.slug && a.type === 'article').slice(0, 3);
  const hotJobs = jobData.slice(0, 3); // Demo with first 3 jobs

  const MainContent = () => {
    if (article.type === 'video' && article.videoUrl) {
      return (
         <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black">
            <iframe 
                className="w-full h-full" 
                src={`${article.videoUrl}?autoplay=1&rel=0`}
                title={article.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
            ></iframe>
        </div>
      );
    }

    return (
      <>
        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image src={article.image} alt={article.title} fill className="object-cover" data-ai-hint={article.dataAiHint} />
        </div>
        
        <div className="prose prose-lg max-w-none">
            <p className="lead">{article.excerpt}</p>
            {article.content && article.content.map((section, index) => (
            <div key={index} id={section.slug} className="pt-8 scroll-mt-24">
                <h2>{section.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: section.body }} />
            </div>
            ))}
        </div>
      </>
    );
  };
  
  const ShareContentCta = () => (
    <section className="w-full mt-16 py-16 bg-background rounded-lg">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-headline font-bold text-accent">Chia sẻ kinh nghiệm của bạn</h2>
                    <p className="mt-2 text-muted-foreground">Bạn có câu chuyện, mẹo hay hoặc kinh nghiệm quý báu muốn chia sẻ với cộng đồng người Việt tại Nhật? Hãy đóng góp bài viết, video cho HelloJob!</p>
                </div>
                 <div className="flex justify-center md:justify-end">
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="rounded-full h-14 text-lg px-8">
                                <PlusCircle className="mr-2"/>
                                Chia sẻ ngay
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl">
                           <ShareDialogContent />
                        </DialogContent>
                    </Dialog>
                 </div>
            </div>
        </div>
    </section>
  );

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Article Outline (Only for articles) */}
          {article.type === 'article' && article.content && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <h3 className="text-lg font-bold mb-4 flex items-center text-accent">
                  <Scroll className="mr-2" />
                  Nội dung bài viết
                </h3>
                <ul className="space-y-3">
                  {article.content.map((section) => (
                    <li key={section.slug}>
                      <a
                        href={`#${section.slug}`}
                        className={cn(
                          "block text-sm transition-colors hover:text-primary",
                          activeId === section.slug
                            ? 'text-primary font-bold border-l-2 border-primary pl-3'
                            : 'text-muted-foreground pl-3.5'
                        )}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
                 <Card className="mt-8">
                    <CardHeader>
                      <CardTitle className="text-base font-bold flex items-center"><Briefcase className="mr-2 h-4 w-4"/>Việc làm nổi bật</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {hotJobs.slice(0,2).map(job => (
                        <Link href="/jobs" key={job.id} className="group block">
                           <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{job.title}</p>
                           <p className="text-xs text-muted-foreground">{job.recruiter.company}</p>
                        </Link>
                      ))}
                       <Button asChild variant="outline" size="sm" className="w-full">
                         <Link href="/jobs">Xem thêm việc làm <ChevronRight /></Link>
                      </Button>
                    </CardContent>
                 </Card>
              </div>
            </aside>
          )}

          {/* Main Article Content */}
          <main className={cn(
            "lg:col-span-9 xl:col-span-6",
            article.type !== 'article' && "lg:col-start-4 xl:col-start-4" // Center content if not an article
            )}>
            <article>
              <header className="mb-8">
                <Badge className="mb-4 bg-accent-orange text-white">{article.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-accent">{article.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground gap-6">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    <span>{article.readTime} đọc</span>
                  </div>
                </div>
              </header>

              <MainContent />
            </article>

            {/* Comments Section */}
            <section className="mt-16 pt-8 border-t">
              <CommentSection />
            </section>

            {/* Hot Jobs Section */}
            <section className="mt-16 pt-8 border-t">
                 <h2 className="text-3xl font-headline font-bold mb-6 flex items-center text-accent">
                    <Briefcase className="mr-3 text-primary" />
                    Việc làm nổi bật liên quan
                </h2>
                <div className="space-y-4">
                    {hotJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </section>

             <ShareContentCta />
          </main>
          
          {/* Related Articles */}
          <aside className="hidden xl:block xl:col-span-3">
             <div className="sticky top-24">
              <h3 className="text-lg font-bold mb-4 text-accent flex items-center"><FileText className="mr-2"/>Bài viết liên quan</h3>
              <div className="space-y-6">
                {otherArticles.map(other => (
                  <Link href={`/handbook/${other.slug}`} key={other.slug} className="group block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video w-full">
                          <Image src={other.image} alt={other.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={other.dataAiHint} />
                        </div>
                        <div className="p-4">
                           <p className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{other.title}</p>
                           <p className="text-xs text-muted-foreground mt-1">{other.category}</p>
                        </div>
                      </Card>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
