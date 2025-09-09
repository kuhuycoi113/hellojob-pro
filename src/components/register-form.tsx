
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Eye, X, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type CandidateProfile } from '@/ai/schemas';
import { industriesByJobType } from '@/lib/industry-data';
import { Textarea } from './ui/textarea';

const TOTAL_STEPS = 5;

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};
const visaTypes = Object.keys(visaDetailsByVisaType);
const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon"];

type FormData = Partial<CandidateProfile>;

export function RegisterForm({ initialStep = 1 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    headline: '',
    location: '',
    about: '',
    education: [{ school: '', degree: '', gradYear: new Date().getFullYear() }],
    experience: [{ company: '', role: '', period: '', description: '' }],
    personalInfo: { birthYear: 2000, gender: 'Nữ', phone: '', language: ''},
    skills: [],
    interests: [],
    certifications: [],
    desiredIndustry: '',
    aspirations: {},
    notes: '',
  });

  const handleNext = () => setStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
  const handleBack = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));
  
  const handleChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
        ...prev,
        [section]: {
            // @ts-ignore
            ...prev[section],
            [field]: value
        }
    }));
  };
  
  const handleArrayChange = (section: 'education' | 'experience', index: number, field: string, value: any) => {
    setFormData(prev => {
        const newArray = [...(prev[section] as any[])];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section: 'education' | 'experience') => {
      setFormData(prev => ({
          ...prev,
          [section]: [
              // @ts-ignore
              ...prev[section],
              section === 'education' 
                ? { school: '', degree: '', gradYear: new Date().getFullYear() }
                : { company: '', role: '', period: '', description: '' }
          ]
      }));
  };

  const removeArrayItem = (section: 'education' | 'experience', index: number) => {
      setFormData(prev => ({
          ...prev,
          // @ts-ignore
          [section]: prev[section].filter((_: any, i: number) => i !== index)
      }));
  };

  const handleSubmit = () => {
      console.log('Final Form Data:', formData);
      localStorage.setItem('generatedCandidateProfile', JSON.stringify(formData));
      toast({
          title: "Đăng ký thành công!",
          description: "Hồ sơ của bạn đã được tạo. Chuyển hướng đến trang hồ sơ...",
          className: "bg-green-500 text-white"
      });
      setTimeout(() => {
          router.push('/candidate-profile');
      }, 1500);
  }

  const progressValue = (step / TOTAL_STEPS) * 100;

  return (
    <Card className="shadow-xl border-t-4 border-accent-orange">
      <CardHeader>
        <Progress value={progressValue} className="mb-4 h-2 [&>div]:bg-accent-orange" />
        <CardTitle className="font-headline text-2xl">Bước {step}/{TOTAL_STEPS}</CardTitle>
        <CardDescription className="!mt-2">
          {step === 1 && 'Thông tin cá nhân cơ bản của bạn.'}
          {step === 2 && 'Trình độ học vấn và kinh nghiệm làm việc.'}
          {step === 3 && 'Các kỹ năng, chứng chỉ và lĩnh vực bạn quan tâm.'}
          {step === 4 && 'Nguyện vọng về công việc và địa điểm làm việc.'}
          {step === 5 && 'Hãy kiểm tra lại thông tin và gửi hồ sơ!'}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="Nguyễn Văn A" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="headline">Chức danh / Giới thiệu ngắn</Label>
                    <Input id="headline" placeholder="VD: Kỹ sư cơ khí có 2 năm kinh nghiệm" value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="birthYear">Năm sinh</Label>
                    <Input id="birthYear" type="number" placeholder="1999" value={formData.personalInfo?.birthYear} onChange={(e) => handleChange('personalInfo', 'birthYear', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select onValueChange={(value) => handleChange('personalInfo', 'gender', value)} value={formData.personalInfo?.gender}>
                        <SelectTrigger id="gender"><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="0987654321" value={formData.personalInfo?.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Địa chỉ hiện tại</Label>
                    <Input id="location" placeholder="VD: Cầu Giấy, Hà Nội" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="about">Giới thiệu về bản thân</Label>
                    <Textarea id="about" placeholder="Viết một vài dòng về kinh nghiệm, điểm mạnh và mục tiêu của bạn..." value={formData.about} onChange={(e) => setFormData({...formData, about: e.target.value})} />
                </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4">Quá trình học vấn</h3>
              {formData.education?.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 p-4 border rounded-lg relative">
                   <div className="md:col-span-3 space-y-2">
                     <Label htmlFor={`school-${index}`}>Trường</Label>
                     <Input id={`school-${index}`} placeholder="ĐH Bách Khoa Hà Nội" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                     <Label htmlFor={`degree-${index}`}>Bằng cấp / Chuyên ngành</Label>
                     <Input id={`degree-${index}`} placeholder="Kỹ sư Cơ khí" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                   </div>
                    <div className="md:col-span-1 space-y-2">
                     <Label htmlFor={`gradYear-${index}`}>Năm TN</Label>
                     <Input id={`gradYear-${index}`} type="number" placeholder="2022" value={edu.gradYear} onChange={(e) => handleArrayChange('education', index, 'gradYear', parseInt(e.target.value))} />
                   </div>
                   <div className="flex items-end">
                     <Button variant="ghost" size="icon" onClick={() => removeArrayItem('education', index)}><Trash2 className="h-5 w-5 text-destructive"/></Button>
                   </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => addArrayItem('education')}><PlusCircle className="mr-2"/>Thêm học vấn</Button>
            </div>
             <div>
              <h3 className="font-bold text-lg mb-4">Kinh nghiệm làm việc</h3>
              {formData.experience?.map((exp, index) => (
                <div key={index} className="space-y-4 mb-4 p-4 border rounded-lg relative">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Công ty</Label>
                        <Input id={`company-${index}`} value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`role-${index}`}>Vai trò</Label>
                        <Input id={`role-${index}`} value={exp.role} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`period-${index}`}>Thời gian</Label>
                        <Input id={`period-${index}`} placeholder="VD: 08/2022 - Hiện tại" value={exp.period} onChange={(e) => handleArrayChange('experience', index, 'period', e.target.value)} />
                      </div>
                   </div>
                   <div className="space-y-2">
                        <Label htmlFor={`desc-${index}`}>Mô tả công việc</Label>
                        <Textarea id={`desc-${index}`} value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => removeArrayItem('experience', index)} className="absolute top-2 right-2"><Trash2 className="h-5 w-5 text-destructive"/></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addArrayItem('experience')}><PlusCircle className="mr-2"/>Thêm kinh nghiệm</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <Label className="font-bold text-lg">Kỹ năng</Label>
              <p className="text-sm text-muted-foreground mb-4">Chọn các kỹ năng bạn có hoặc thêm kỹ năng mới.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Vận hành máy CNC', 'Hàn xì', 'Kiểm tra chất lượng (QC)', 'Lắp ráp điện tử', 'Ngoại ngữ (Tiếng Nhật N3)', 'AutoCAD', 'Làm việc nhóm', 'Giải quyết vấn đề'].map((skill) => (
                  <div key={skill} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                    <Checkbox id={`skill-${skill}`} onCheckedChange={() => {}} />
                    <Label htmlFor={`skill-${skill}`} className="cursor-pointer font-normal">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-bold text-lg">Chứng chỉ & Giải thưởng</Label>
               <p className="text-sm text-muted-foreground mb-4">Liệt kê các chứng chỉ hoặc giải thưởng bạn đã đạt được.</p>
               <Input placeholder="VD: Chứng chỉ JLPT N3, Lao động tiên tiến..." />
            </div>
          </div>
        )}
        {step === 4 && (
             <div className="space-y-4">
                <h3 className="font-bold text-lg">Nguyện vọng công việc</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Ngành nghề mong muốn</Label>
                        <Select onValueChange={(value) => setFormData({...formData, desiredIndustry: value})} value={formData.desiredIndustry}>
                            <SelectTrigger><SelectValue placeholder="Chọn ngành nghề" /></SelectTrigger>
                            <SelectContent className="max-h-60">
                                {allIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Loại visa mong muốn</Label>
                        <Select onValueChange={(value) => handleChange('aspirations', 'desiredVisaType', value)} value={formData.aspirations?.desiredVisaType}>
                            <SelectTrigger><SelectValue placeholder="Chọn loại visa" /></SelectTrigger>
                            <SelectContent>{visaTypes.map(vt => <SelectItem key={vt} value={vt}>{vt}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Địa điểm làm việc mong muốn</Label>
                        <Input placeholder="VD: Osaka, Nhật Bản" value={formData.aspirations?.desiredLocation} onChange={(e) => handleChange('aspirations', 'desiredLocation', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Mức lương mong muốn (cơ bản/tháng)</Label>
                        <Input placeholder="VD: 200,000 JPY" value={formData.aspirations?.desiredSalary} onChange={(e) => handleChange('aspirations', 'desiredSalary', e.target.value)} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Ghi chú hoặc nguyện vọng đặc biệt khác</Label>
                        <Textarea placeholder="VD: Mong muốn công việc có nhiều cơ hội tăng ca, được hỗ trợ đào tạo thêm..." value={formData.aspirations?.specialAspirations} onChange={(e) => handleChange('aspirations', 'specialAspirations', e.target.value)}/>
                    </div>
                </div>
             </div>
        )}
        {step === 5 && (
          <div className="space-y-4 p-4 rounded-lg bg-secondary">
            <h3 className="font-bold font-headline text-xl text-primary">Kiểm tra lại thông tin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <p><strong>Họ tên:</strong> {formData.name || 'Chưa điền'}</p>
              <p><strong>Năm sinh:</strong> {formData.personalInfo?.birthYear || 'Chưa điền'}</p>
              <p><strong>Học vấn:</strong> {formData.education?.[0]?.school || 'Chưa điền'}</p>
              <p><strong>Kinh nghiệm gần nhất:</strong> {formData.experience?.[0]?.role || 'Chưa điền'}</p>
              <p className="md:col-span-2"><strong>Ngành nghề mong muốn:</strong> {formData.desiredIndustry || 'Chưa điền'}</p>
              <p className="md:col-span-2"><strong>Địa điểm mong muốn:</strong> {formData.aspirations?.desiredLocation || 'Chưa điền'}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <div>
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft /> Quay lại
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => router.push('/')}>
              <X className="mr-2 h-4 w-4" /> Hủy
            </Button>
          )}
        </div>
        {step < TOTAL_STEPS ? (
          <Button onClick={handleNext} className="bg-primary text-white hover:bg-primary/90">
            Tiếp theo <ChevronRight />
          </Button>
        ) : (
          <Button className="bg-accent-green text-white hover:bg-accent-green/90" onClick={handleSubmit}>
            Hoàn tất & Xem hồ sơ <Eye />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
