
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, PlusCircle, Trash2, Upload, FileText, DollarSign, BookCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Lesson = {
  id: number;
  title: string;
};

type Section = {
  id: number;
  title: string;
  lessons: Lesson[];
};

export default function BuildCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: 'Chương 1: Giới thiệu', lessons: [{ id: 1, title: 'Bài 1: Tổng quan khóa học' }] }
  ]);
  const [price, setPrice] = useState('free');
  const [coursePrice, setCoursePrice] = useState('');
  const [taxObligation, setTaxObligation] = useState('self-pay');

  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: `Chương ${sections.length + 1}: Tiêu đề mới`,
      lessons: [],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: number) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: number, newTitle: string) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s));
  };

  const addLesson = (sectionId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const newLesson: Lesson = {
          id: Date.now(),
          title: `Bài ${s.lessons.length + 1}: Tiêu đề bài học`
        };
        return { ...s, lessons: [...s.lessons, newLesson] };
      }
      return s;
    }));
  };

  const removeLesson = (sectionId: number, lessonId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) };
      }
      return s;
    }));
  };

  const updateLessonTitle = (sectionId: number, lessonId: number, newTitle: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const updatedLessons = s.lessons.map(l => l.id === lessonId ? { ...l, title: newTitle } : l);
        return { ...s, lessons: updatedLessons };
      }
      return s;
    }));
  };

  const handlePreview = () => {
    const previewData = {
      title,
      description,
      sections,
      price,
      coursePrice,
    };
    localStorage.setItem('coursePreviewData', JSON.stringify(previewData));
    window.open('/learn/preview', '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || sections.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Vui lòng điền thông tin bắt buộc',
        description: 'Tên khóa học và ít nhất một chương trình học không được để trống.',
      });
      return;
    }

    console.log({ title, description, sections, price, coursePrice, taxObligation });

    toast({
      title: 'Đã lưu bản nháp!',
      description: 'Khóa học của bạn đã được lưu lại. Bạn có thể tiếp tục chỉnh sửa sau.',
      className: 'bg-green-500 text-white',
    });
  };

  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-orange-100 p-4 rounded-full mb-4">
              <BookCopy className="h-10 w-10 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Xây dựng khoá học của bạn</h1>
            <p className="text-muted-foreground mt-2">
              Điền thông tin chi tiết và chương trình học để tạo ra một khóa học hấp dẫn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><Info className="text-primary"/>Thông tin khoá học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course-title">Tên khoá học</Label>
                  <Input id="course-title" placeholder="VD: Tiếng Nhật giao tiếp cho người đi làm" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-description">Mô tả khoá học</Label>
                  <Textarea id="course-description" placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học..." rows={5} value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Chương trình học</CardTitle>
                <CardDescription>Xây dựng nội dung cho khóa học của bạn. Thêm các chương và bài học.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="multiple" className="w-full space-y-4" defaultValue={['section-1']}>
                  {sections.map((section, sectionIndex) => (
                    <AccordionItem key={section.id} value={`section-${section.id}`} className="bg-secondary/50 rounded-lg border px-4">
                      <div className="flex items-center w-full">
                        <AccordionTrigger className="hover:no-underline py-0 flex-grow">
                           <div className="flex items-center gap-2 w-full">
                             <span className="font-bold">Chương {sectionIndex + 1}:</span>
                             <Input value={section.title} onChange={e => updateSectionTitle(section.id, e.target.value)} className="bg-transparent border-0 focus-visible:ring-1 h-auto py-3" onClick={(e) => e.stopPropagation()} />
                           </div>
                        </AccordionTrigger>
                        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeSection(section.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                      <AccordionContent className="border-t pt-4">
                        <div className="space-y-2 pl-4">
                           {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center gap-2">
                              <span className="text-muted-foreground">{lessonIndex + 1}.</span>
                              <Input value={lesson.title} onChange={e => updateLessonTitle(section.id, lesson.id, e.target.value)} placeholder="Nhập tiêu đề bài học" />
                              <Button type="button" variant="outline" size="sm" className="shrink-0"><Upload className="h-4 w-4 mr-2"/>Tải video</Button>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeLesson(section.id, lesson.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                           ))}
                           <Button type="button" variant="outline" size="sm" onClick={() => addLesson(section.id)}><PlusCircle className="h-4 w-4 mr-2" />Thêm bài học</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button type="button" onClick={addSection}><PlusCircle className="mr-2" />Thêm chương</Button>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2"><DollarSign className="text-primary"/>Giá & Thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <RadioGroup value={price} onValueChange={setPrice}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free">Miễn phí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="paid" />
                        <Label htmlFor="paid">Trả phí</Label>
                      </div>
                    </RadioGroup>
                    {price === 'paid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end animate-in fade-in-0">
                             <div className="space-y-2">
                                <Label htmlFor="course-price">Giá khoá học (VND)</Label>
                                <Input id="course-price" type="number" placeholder="VD: 500000" value={coursePrice} onChange={e => setCoursePrice(e.target.value)} />
                             </div>
                             <p className="text-sm text-muted-foreground">HelloJob sẽ giữ lại 30% phí trên mỗi lượt thanh toán để duy trì và phát triển nền tảng.</p>
                        </div>
                    )}
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Thông tin nhận thanh toán</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngân hàng</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Chọn ngân hàng" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vietcombank">Vietcombank</SelectItem>
                                        <SelectItem value="techcombank">Techcombank</SelectItem>
                                        <SelectItem value="acb">ACB</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>Số tài khoản</Label>
                                <Input placeholder="Nhập số tài khoản" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Tên chủ tài khoản</Label>
                                <Input placeholder="Nhập tên chủ tài khoản" />
                            </div>
                         </div>
                    </div>
                     <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Nghĩa vụ thuế</h4>
                        <RadioGroup value={taxObligation} onValueChange={setTaxObligation} className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="self-pay" id="self-pay" />
                                <Label htmlFor="self-pay" className="font-normal">Tôi sẽ tự đóng thuế thu nhập cá nhân.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hellojob-support" id="hellojob-support" />
                                <Label htmlFor="hellojob-support" className="font-normal">Nhờ HelloJob hỗ trợ đóng thuế và khấu trừ tại nguồn.</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handlePreview}>Xem trước</Button>
                <Button type="submit">Lưu và Xuất bản</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
