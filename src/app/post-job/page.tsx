
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Send, Upload, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type JobData = {
    title: string;
    industry: string;
    type: string;
    location: string;
    description: string;
    requirements: string;
    benefits: string;
};

export default function PostJobPage() {
  const [activeTab, setActiveTab] = useState('ai');
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    industry: '',
    type: '',
    location: '',
    description: '',
    requirements: '',
    benefits: '',
  });

  const handleInputChange = (field: keyof JobData, value: string) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // Simulate AI processing and pre-filling the form
      const mockData: JobData = {
        title: "Kỹ sư Vận hành Dây chuyền Tự động",
        industry: "dientu",
        type: "full-time",
        location: "Khu công nghệ cao Hòa Lạc, Hà Nội",
        description: "- Chịu trách nhiệm vận hành, giám sát và bảo trì các dây chuyền sản xuất tự động.\n- Đảm bảo các máy móc hoạt động ổn định, đạt năng suất và chất lượng theo yêu cầu.\n- Phối hợp với các bộ phận khác để xử lý sự cố và cải tiến quy trình.",
        requirements: "- Tốt nghiệp Cao đẳng/Đại học chuyên ngành Cơ điện tử, Tự động hóa hoặc các ngành liên quan.\n- Có ít nhất 1 năm kinh nghiệm ở vị trí tương đương.\n- Có khả năng đọc hiểu bản vẽ kỹ thuật.",
        benefits: "- Mức lương cạnh tranh, thỏa thuận theo năng lực.\n- Môi trường làm việc chuyên nghiệp, năng động.\n- Được hưởng đầy đủ các chế độ phúc lợi theo quy định của pháp luật."
      };
      setJobData(mockData);
      
      // Switch to the manual tab to show the pre-filled data
      setActiveTab('manual');
    }
  };

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-4xl">Đăng tin tuyển dụng</CardTitle>
              <CardDescription className="!mt-3 text-lg">
                Tiếp cận hàng ngàn ứng viên tiềm năng trên hệ thống HelloJob.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="ai">Đăng tin bằng AI</TabsTrigger>
                  <TabsTrigger value="manual">Đăng tin thủ công</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai">
                   <div className="text-center p-6 border rounded-lg border-dashed">
                      <h3 className="text-xl font-bold font-headline mb-2">Tải lên tin tuyển dụng</h3>
                      <p className="text-muted-foreground mb-6">Hệ thống sẽ tự động phân tích và điền thông tin giúp bạn.</p>
                      <div className="relative border-2 border-dashed border-border rounded-lg p-10 flex flex-col items-center justify-center hover:border-primary transition-colors">
                          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="mb-2 text-foreground">Kéo thả tệp hoặc <span className="font-bold text-primary">chọn tệp</span></p>
                          <p className="text-xs text-muted-foreground">Hỗ trợ PDF, DOCX, PNG, JPG</p>
                          <Input id="ai-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                      </div>
                   </div>
                </TabsContent>

                <TabsContent value="manual">
                  <form className="space-y-8">
                    {/* Job Information */}
                    <div className="space-y-4 p-6 border rounded-lg">
                      <h3 className="text-xl font-bold font-headline">Thông tin việc làm</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="job-title">Chức danh</Label>
                          <Input id="job-title" placeholder="VD: Kỹ sư vận hành máy CNC" value={jobData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-industry">Ngành</Label>
                          <Select value={jobData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                            <SelectTrigger id="job-industry"><SelectValue placeholder="Chọn ngành nghề" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="it">Công nghệ thông tin</SelectItem>
                              <SelectItem value="co-khi">Cơ khí</SelectItem>
                              <SelectItem value="det-may">Dệt may</SelectItem>
                              <SelectItem value="dien-tu">Điện tử</SelectItem>
                              <SelectItem value="logistics">Logistics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-type">Loại hình công việc</Label>
                          <Select value={jobData.type} onValueChange={(value) => handleInputChange('type', value)}>
                            <SelectTrigger id="job-type"><SelectValue placeholder="Chọn loại hình" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Toàn thời gian</SelectItem>
                              <SelectItem value="part-time">Bán thời gian</SelectItem>
                              <SelectItem value="internship">Thực tập</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-location">Địa điểm làm việc</Label>
                          <Input id="job-location" placeholder="VD: Khu công nghệ cao, Q.9, TP.HCM" value={jobData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="space-y-4 p-6 border rounded-lg">
                      <h3 className="text-xl font-bold font-headline">Mô tả chi tiết</h3>
                      <div className="space-y-2">
                          <Label htmlFor="job-description">Mô tả công việc</Label>
                          <Textarea id="job-description" placeholder="Mô tả công việc, trách nhiệm..." rows={5} value={jobData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-requirements">Yêu cầu ứng viên</Label>
                          <Textarea id="job-requirements" placeholder="Yêu cầu về kỹ năng, kinh nghiệm, học vấn..." rows={5} value={jobData.requirements} onChange={(e) => handleInputChange('requirements', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-benefits">Quyền lợi</Label>
                          <Textarea id="job-benefits" placeholder="Phúc lợi, lương thưởng, cơ hội phát triển..." rows={3} value={jobData.benefits} onChange={(e) => handleInputChange('benefits', e.target.value)} />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 p-6 border rounded-lg">
                      <h3 className="text-xl font-bold font-headline">Thông tin liên hệ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="contact-name">Người liên hệ</Label>
                              <Input id="contact-name" placeholder="Nguyễn Văn B" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact-email">Email liên hệ</Label>
                              <Input id="contact-email" type="email" placeholder="hr@congty.com" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground">Tôi đồng ý với các <a href="#" className="underline text-primary">điều khoản dịch vụ</a> của HelloJob.</Label>
                    </div>

                    <div className="text-center pt-4">
                        <Button size="lg" className="bg-primary text-white w-full md:w-auto">
                            <Send className="mr-2"/> Đăng tin ngay
                        </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
