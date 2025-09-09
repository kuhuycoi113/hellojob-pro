
'use client';

import { useState, use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, Layers, Star, Users, PlayCircle, BookCheck, Lock } from 'lucide-react';
import { courses } from '@/lib/learn-data';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PaymentDialog } from '@/components/payment-dialog';

const categoryColors: { [key: string]: string } = {
  'Ngoại ngữ': 'bg-accent-orange text-white',
  'Văn hóa & Xã hội': 'bg-accent-green text-white',
  'Kỹ năng làm việc': 'bg-accent-blue text-white',
  'Phát triển sự nghiệp': 'bg-accent text-white',
};

export default function LearnDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const course = courses.find((c) => c.id === resolvedParams.id);
  
  if (!course) {
    notFound();
  }

  const [activeVideo, setActiveVideo] = useState(course.curriculum[0]?.videoId || '');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const freeLessonsCount = Math.ceil(course.curriculum.length / 2);

  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    setPaymentDialogOpen(false);
  };

  return (
    <>
      <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden shadow-xl">
                 <CardContent className="p-0">
                  <div className="aspect-video bg-black">
                     {activeVideo ? (
                       <iframe 
                          className="w-full h-full" 
                          src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                        ></iframe>
                     ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                          <p className="text-muted-foreground">Nội dung đang được cập nhật.</p>
                      </div>
                     )}
                  </div>
                  <div className="p-6">
                      <p className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${categoryColors[course.category] || 'bg-gray-500 text-white'}`}>{course.category}</p>
                      <CardTitle className="font-headline text-3xl mb-4">{course.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">{course.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>

               <Card className="shadow-xl">
                   <CardHeader>
                      <CardTitle className="font-headline text-xl">Giảng viên</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                          <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} data-ai-hint={course.instructor['data-ai-hint']} />
                          <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-bold">{course.instructor.name}</p>
                          <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                      </div>
                  </CardContent>
              </Card>
            </div>

            {/* Sidebar - Playlist */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Nội dung khóa học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                   {course.curriculum.length > 0 ? course.curriculum.map((lesson, index) => {
                      const isLocked = index >= freeLessonsCount && !isUnlocked;
                      return (
                        <button 
                            key={index} 
                            onClick={() => {
                                if (isLocked) {
                                    setPaymentDialogOpen(true);
                                } else {
                                    setActiveVideo(lesson.videoId)
                                }
                            }}
                            disabled={isLocked && lesson.videoId === 'placeholder'}
                            className={cn(
                                `w-full text-left p-4 rounded-lg flex items-start gap-4 transition-colors`,
                                activeVideo === lesson.videoId && !isLocked ? 'bg-primary/10' : 'hover:bg-secondary',
                                isLocked ? 'bg-secondary/50 cursor-pointer' : 'cursor-pointer'
                            )}
                        >
                            {isLocked ? (
                                <Lock className="h-6 w-6 mt-1 flex-shrink-0 text-muted-foreground"/>
                            ) : (
                                <PlayCircle className={`h-6 w-6 mt-1 flex-shrink-0 ${activeVideo === lesson.videoId ? 'text-primary' : 'text-muted-foreground'}`}/>
                            )}
                            <div>
                                <p className={`font-semibold ${activeVideo === lesson.videoId && !isLocked ? 'text-primary' : ''} ${isLocked ? 'text-muted-foreground' : ''}`}>{lesson.title}</p>
                                <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                            </div>
                        </button>
                      )
                   }) : (
                       <p className="text-sm text-muted-foreground">Nội dung bài học đang được cập nhật.</p>
                   )}
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                  <CardHeader>
                      <CardTitle className="font-headline text-xl">Thông tin</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                          <Layers className="w-5 h-5 text-muted-foreground"/>
                          <span><strong>Cấp độ:</strong> {course.stats.level}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                          <BookCheck className="w-5 h-5 text-muted-foreground"/>
                          <span><strong>Số bài học:</strong> {course.stats.lessons}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                          <Users className="w-5 h-5 text-muted-foreground"/>
                          <span><strong>Học viên:</strong> {course.stats.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/>
                          <span><strong>Đánh giá:</strong> {course.stats.rating} / 5</span>
                      </div>
                  </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
      <PaymentDialog 
        isOpen={isPaymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)} 
        onSuccess={handlePaymentSuccess} 
      />
    </>
  );
}
