
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, Layers, Star, Users, PlayCircle, BookCheck, Lock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PaymentDialog } from '@/components/payment-dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy data structure for course preview
const dummyCourse = {
  id: 'preview',
  title: 'Tiêu đề khóa học của bạn',
  category: 'Chuyên mục',
  description: 'Đây là mô tả chi tiết về khóa học của bạn. Nó sẽ xuất hiện ở đây.',
  image: 'https://placehold.co/1280x720.png',
  'data-ai-hint': 'course placeholder image',
  instructor: {
    name: 'Tên của bạn',
    avatar: 'https://placehold.co/100x100.png',
    'data-ai-hint': 'instructor avatar',
    title: 'Người hướng dẫn',
  },
  stats: {
    students: 0,
    rating: 0,
    lessons: 0,
    level: 'Mọi cấp độ',
  },
  curriculum: [],
};

export default function LearnPreviewPage() {
  const [course, setCourse] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState('');
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('coursePreviewData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        const curriculum = parsedData.sections.flatMap((section: any, sectionIndex: number) => 
            section.lessons.map((lesson: any, lessonIndex: number) => ({
                ...lesson,
                title: `[${section.title}] Bài ${lessonIndex + 1}: ${lesson.title}`,
                duration: '00:00', // Placeholder
                videoId: 'placeholder' // Placeholder
            }))
        );

        const previewCourse = {
            ...dummyCourse,
            title: parsedData.title || dummyCourse.title,
            description: parsedData.description || dummyCourse.description,
            curriculum: curriculum,
            stats: {
                ...dummyCourse.stats,
                lessons: curriculum.length,
            }
        };
        setCourse(previewCourse);
        if (curriculum.length > 0) {
            setActiveVideo(curriculum[0].videoId);
        }
      } else {
        setCourse(dummyCourse); // Use dummy if nothing in storage
      }
    } catch (error) {
      console.error("Failed to load course preview data:", error);
      setCourse(dummyCourse);
    }
  }, []);

  if (!course) {
    return (
        <div className="bg-secondary p-12">
            <Skeleton className="h-[500px] w-full" />
        </div>
    );
  }
  
  const freeLessonsCount = Math.ceil(course.curriculum.length / 2);

  return (
    <>
      <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="text-center mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
            <p className="font-bold">Đây là trang xem trước</p>
            <p className="text-sm">Học viên của bạn sẽ thấy khóa học như thế này. Không có dữ liệu nào được lưu lại.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden shadow-xl">
                 <CardContent className="p-0">
                  <div className="aspect-video bg-black flex items-center justify-center">
                     <p className="text-white text-lg">Video sẽ được hiển thị ở đây</p>
                  </div>
                  <div className="p-6">
                      <CardTitle className="font-headline text-3xl mb-4">{course.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">{course.description}</CardDescription>
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
                   {course.curriculum.length > 0 ? course.curriculum.map((lesson: any, index: number) => {
                      const isLocked = index >= freeLessonsCount;
                      return (
                        <div 
                            key={index} 
                            className={cn(
                                `w-full text-left p-4 rounded-lg flex items-start gap-4`,
                                activeVideo === lesson.videoId && !isLocked ? 'bg-primary/10' : 'hover:bg-secondary',
                                isLocked ? 'bg-secondary/50' : ''
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
                        </div>
                      )
                   }) : (
                       <p className="text-sm text-muted-foreground">Chưa có bài học nào được thêm vào.</p>
                   )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
      <PaymentDialog 
        isOpen={isPaymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)} 
        onSuccess={() => {}}
      />
    </>
  );
}
