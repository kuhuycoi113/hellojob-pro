

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LifeBuoy, Search, ArrowRight, Video, FileText, Newspaper, PlusCircle, ChevronDown, Image as ImageIcon, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { articles, HandbookArticle } from '@/lib/handbook-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export const metadata: Metadata = {
  title: 'Cẩm nang HelloJob - Thông tin việc làm & cuộc sống tại Nhật',
  description: 'Tất cả thông tin bạn cần về Kỹ năng đặc định (Tokutei Ginou), kinh nghiệm phỏng vấn, thủ tục visa, và cuộc sống tại Nhật Bản được cập nhật liên tục.',
};


const ArticleCard = ({ article, className }: { article: HandbookArticle, className?: string }) => (
  <Link href={`/cam-nang/${article.slug}`} className={cn("group block", className)}>
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 rounded-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={article.dataAiHint}
          />
           {article.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Video className="h-12 w-12 text-white/80" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow flex flex-col">
        <Badge className={cn("mb-3 w-fit", 
            article.category === 'Kỹ năng đặc định' ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' : 
            'bg-accent-green/20 text-accent-green border-accent-green/30'
        )}>{article.category}</Badge>
        <CardTitle className="font-headline text-lg mb-3 flex-grow group-hover:text-primary transition-colors leading-tight">{article.title}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
      </CardContent>
    </Card>
  </Link>
);

const PostCard = ({ article }: { article: HandbookArticle }) => (
  <Link href={`/cam-nang/${article.slug}`} className="group block">
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
       <CardContent className="p-5">
         <Badge className={cn("mb-3 w-fit", 
            article.category === 'Kinh nghiệm phỏng vấn' ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/30' : 
            'bg-accent-red/20 text-accent-red border-accent-red/30'
        )}>{article.category}</Badge>
         <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{article.title}</p>
         <p className="text-xs text-muted-foreground mt-2">{article.readTime} đọc</p>
      </CardContent>
    </Card>
  </Link>
)

const VideoCard = ({ article }: { article: HandbookArticle }) => (
  <Link href={`/cam-nang/${article.slug}`} className="group block">
      <Card className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 aspect-[9/16]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={article.dataAiHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
             <Video className="h-10 w-10 mb-4 text-white/80" />
             <h4 className="font-headline text-lg font-bold leading-tight line-clamp-3">{article.title}</h4>
             <p className="text-xs mt-2 opacity-80">{article.category}</p>
          </div>
      </Card>
  </Link>
);

const ImageStoryCard = ({ article }: { article: HandbookArticle }) => (
  <Link href={`/cam-nang/${article.slug}`} className="group block">
    <Card className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 aspect-w-1 aspect-h-1">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={article.dataAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">{article.category}</Badge>
          <h4 className="font-headline text-base font-bold leading-tight line-clamp-2">{article.title}</h4>
        </div>
    </Card>
  </Link>
);

const ShareDialogContent = () => (
    <>
    <DialogHeader className="text-center">
        <DialogTitle className="text-3xl font-headline">Chọn loại nội dung bạn muốn chia sẻ</DialogTitle>
        <DialogDescription className="text-base">
            Đóng góp kiến thức và kinh nghiệm của bạn cho cộng đồng HelloJob.
        </DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <Link href="/cam-nang/create/post">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng nội dung dạng chữ</h3>
                <p className="text-muted-foreground text-sm">Chia sẻ một câu chuyện, mẹo nhỏ, hoặc một câu hỏi.</p>
            </Card>
        </Link>
        <Link href="/cam-nang/create/image">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <ImageIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng bài viết dạng ảnh</h3>
                <p className="text-muted-foreground text-sm">Tạo một bài viết với hình ảnh minh hoạ trực quan.</p>
            </Card>
        </Link>
        <Link href="/cam-nang/create/video-short">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <Smartphone className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng video ngắn</h3>
                <p className="text-muted-foreground text-sm">Chia sẻ một khoảnh khắc hoặc hướng dẫn nhanh.</p>
            </Card>
        </Link>
        <Link href="/cam-nang/create/video">
            <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <Video className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Đăng video dài</h3>
                <p className="text-muted-foreground text-sm">Tạo một video chuyên sâu, phỏng vấn, hoặc vlog.</p>
            </Card>
        </Link>
    </div>
    </>
);


const ShareContentCta = () => (
    <section className="w-full mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-headline font-bold">Chia sẻ kinh nghiệm của bạn</h2>
                    <p className="mt-2 text-white/90">Bạn có câu chuyện, mẹo hay hoặc kinh nghiệm quý báu muốn chia sẻ với cộng đồng người Việt tại Nhật? Hãy đóng góp bài viết, video cho HelloJob!</p>
                </div>
                 <div className="flex justify-center md:justify-end">
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 rounded-full h-12 text-md px-8">
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
        </Card>
      </div>
    </section>
);


export default function HandbookPage() {

  const featuredArticle = articles.find(a => a.slug === 'tokutei-ginou-la-gi')!;
  const mainArticles = articles.filter(a => a.type === 'article' && a.slug !== featuredArticle.slug);
  const videos = articles.filter(a => a.type === 'video');
  const posts = articles.filter(a => a.type === 'post');
  const imageStories = articles.filter(a => a.type === 'image-story');


  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <LifeBuoy className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-accent">
            Cẩm nang HelloJob
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Tất cả thông tin bạn cần biết về thị trường lao động, kỹ năng và cuộc sống tại Nhật Bản.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="relative">
             <Input placeholder="Tìm kiếm bài viết (VD: Tokutei, chi phí...)" className="pl-12 h-12 text-lg rounded-full shadow-lg"/>
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <main className="lg:col-span-8 space-y-16">
                {/* Featured Article */}
                <section>
                    <Link href={`/cam-nang/${featuredArticle.slug}`} className="group">
                        <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl">
                            <div className="grid md:grid-cols-2">
                                <div className="relative min-h-[300px] md:min-h-full">
                                    <Image
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={featuredArticle.dataAiHint}
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <Badge className="mb-4 w-fit bg-accent-orange text-white">{featuredArticle.category}</Badge>
                                    <CardTitle className="font-headline text-2xl xl:text-3xl mb-4 group-hover:text-primary transition-colors">{featuredArticle.title}</CardTitle>
                                    <CardDescription className="text-base mb-6">{featuredArticle.excerpt}</CardDescription>
                                    <div className="flex items-center gap-3 font-bold text-primary">
                                        <span>Đọc bài viết</span>
                                        <ArrowRight className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </section>
                
                 {/* Latest Articles */}
                <section>
                    <h2 className="text-3xl font-headline font-bold mb-6 flex items-center text-foreground">
                        <FileText className="mr-3 text-primary"/> Bài viết mới
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {mainArticles.map((article) => (
                           <ArticleCard key={article.slug} article={article}/>
                       ))}
                    </div>
                </section>
            </main>
            
            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-16">
                {/* Short Videos */}
                <section>
                    <h2 className="text-3xl font-headline font-bold mb-6 flex items-center text-foreground">
                        <Video className="mr-3 text-primary"/> Video ngắn
                    </h2>
                     <div className="grid grid-cols-2 gap-4">
                       {videos.map((video) => (
                           <VideoCard key={video.slug} article={video} />
                       ))}
                    </div>
                </section>
                
                {/* Short Posts */}
                <section>
                    <h2 className="text-3xl font-headline font-bold mb-6 flex items-center text-foreground">
                        <Newspaper className="mr-3 text-primary"/> Tin tức & Bài đăng
                    </h2>
                    <div className="space-y-4">
                       {posts.map((post) => (
                           <PostCard key={post.slug} article={post} />
                       ))}
                    </div>
                </section>

                {/* Image Stories */}
                {imageStories.length > 0 && (
                   <section>
                        <h2 className="text-3xl font-headline font-bold mb-6 flex items-center text-foreground">
                            <ImageIcon className="mr-3 text-primary"/> Câu chuyện qua ảnh
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                           {imageStories.map((story) => (
                               <ImageStoryCard key={story.slug} article={story} />
                           ))}
                        </div>
                    </section>
                )}
            </aside>
        </div>
      </div>
      <ShareContentCta />
    </div>
  );
}
