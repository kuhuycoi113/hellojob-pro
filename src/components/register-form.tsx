
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 4;

type FormData = {
  name: string;
  birthYear: string;
  gender: string;
  school: string;
  educationLevel: string;
  district: string;
  interests: string[];
  skills: string[];
  languageLevel: string;
  industry: string;
  jobType: string;
};

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthYear: '',
    gender: '',
    school: '',
    educationLevel: '',
    district: '',
    interests: [],
    skills: [],
    languageLevel: '',
    industry: '',
    jobType: '',
  });

  const handleNext = () => setStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
  const handleBack = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleCheckboxChange = (field: 'interests' | 'skills', value: string) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    handleChange(field, newValues);
  };
  
  const handleSubmit = () => {
      toast({
          title: "Đăng ký thành công!",
          description: "Hồ sơ của bạn đã được tạo. Chuyển hướng đến trang hồ sơ...",
          className: "bg-green-500 text-white"
      });
      // Simulate API call
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
          {step === 2 && 'Trình độ học vấn và nơi ở hiện tại.'}
          {step === 3 && 'Lĩnh vực bạn quan tâm và các kỹ năng bạn có.'}
          {step === 4 && 'Hãy kiểm tra lại thông tin và gửi hồ sơ!'}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" placeholder="Nguyễn Văn A" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthYear">Năm sinh</Label>
              <Input id="birthYear" type="number" placeholder="1999" value={formData.birthYear} onChange={(e) => handleChange('birthYear', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select onValueChange={(value) => handleChange('gender', value)} value={formData.gender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="school">Trường học</Label>
              <Input id="school" placeholder="Đại học Bách Khoa" value={formData.school} onChange={(e) => handleChange('school', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Trình độ</Label>
              <Select onValueChange={(value) => handleChange('educationLevel', value)} value={formData.educationLevel}>
                <SelectTrigger id="educationLevel">
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THPT">Tốt nghiệp THPT</SelectItem>
                  <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                  <SelectItem value="Cao đẳng">Cao đẳng</SelectItem>
                  <SelectItem value="Đại học">Đại học</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="district">Quận/Huyện đang ở</Label>
              <Input id="district" placeholder="Quận 1, TP.HCM" value={formData.district} onChange={(e) => handleChange('district', e.target.value)} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <Label className="font-bold text-lg">Lĩnh vực quan tâm</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                {['Cơ khí', 'Điện tử', 'Dệt may', 'Chế biến thực phẩm', 'IT', 'Logistics'].map((interest) => (
                  <div key={interest} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                    <Checkbox id={`interest-${interest}`} onCheckedChange={() => handleCheckboxChange('interests', interest)} checked={formData.interests.includes(interest)}/>
                    <Label htmlFor={`interest-${interest}`} className="cursor-pointer">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-bold text-lg">Kỹ năng</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                {['Vận hành máy', 'Lắp ráp', 'Kiểm tra chất lượng', 'Sửa chữa', 'Lập trình', 'Ngoại ngữ'].map((skill) => (
                  <div key={skill} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                    <Checkbox id={`skill-${skill}`} onCheckedChange={() => handleCheckboxChange('skills', skill)} checked={formData.skills.includes(skill)} />
                    <Label htmlFor={`skill-${skill}`} className="cursor-pointer">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="languageLevel" className="font-bold text-lg">Trình độ ngoại ngữ (Tiếng Anh/Nhật/Hàn)</Label>
              <Select onValueChange={(value) => handleChange('languageLevel', value)} value={formData.languageLevel}>
                <SelectTrigger id="languageLevel" className="mt-2">
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                  <SelectItem value="Giao tiếp">Giao tiếp tốt</SelectItem>
                  <SelectItem value="Thành thạo">Thành thạo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4 p-4 rounded-lg bg-secondary">
            <h3 className="font-bold font-headline text-xl text-primary">Tổng hợp thông tin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <p><strong>Họ tên:</strong> {formData.name || 'Chưa điền'}</p>
              <p><strong>Năm sinh:</strong> {formData.birthYear || 'Chưa điền'}</p>
              <p><strong>Giới tính:</strong> {formData.gender || 'Chưa điền'}</p>
              <p><strong>Trường:</strong> {formData.school || 'Chưa điền'}</p>
              <p><strong>Trình độ:</strong> {formData.educationLevel || 'Chưa điền'}</p>
              <p><strong>Ngoại ngữ:</strong> {formData.languageLevel || 'Chưa điền'}</p>
              <p className="md:col-span-2"><strong>Lĩnh vực quan tâm:</strong> {formData.interests.length > 0 ? formData.interests.join(', ') : 'Chưa chọn'}</p>
              <p className="md:col-span-2"><strong>Kỹ năng:</strong> {formData.skills.length > 0 ? formData.skills.join(', ') : 'Chưa chọn'}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft /> Quay lại
          </Button>
        ) : <div />}
        {step < TOTAL_STEPS ? (
          <Button onClick={handleNext} className="bg-accent-blue text-white hover:bg-accent-green/90">
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
