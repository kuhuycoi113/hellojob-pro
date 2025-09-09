

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Send, Upload, FileText, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { industriesByJobType } from '@/lib/industry-data';

// Represents all possible fields
type JobData = {
  title: string;
  visaType: string;
  visaDetail: string;
  industry: string;
  workLocation: string;
  interviewLocation: string;
  gender: string;
  quantity: string;
  ageRequirement: string;
  languageRequirement: string;
  languageProficiency: string;
  netFee: string;
  basicSalary: string;
  netSalary: string;
  interviewDate: string;
  description: string;
  requirements: string;
  benefits: string;
  notes: string;
  specialConditions: string[];
  tattooRequirement: string;
  hepatitisBRequirement: string;
  educationRequirement: string;
  experienceRequirement: string;
  yearsOfExperience: string;
  companyArrivalTime: string;
  ginouExpiryRequirement: string;
  otherSkillRequirement: string[];
  workShift: string;
  visionRequirement: string;
  interviewFormat: string;
  interviewRounds: string;
  heightRequirement: string;
  weightRequirement: string;
  dominantHand: string;
  hourlySalary: string;
  annualIncome: string;
  annualBonus: string;
  financialAbility: string;
};

// Maps visa detail to the fields that are NOT applicable based on the image
const hiddenFieldsByVisa: { [key: string]: (keyof JobData)[] } = {
  'Thực tập sinh 3 năm': ['languageRequirement', 'languageProficiency', 'companyArrivalTime', 'ginouExpiryRequirement', 'hourlySalary', 'annualIncome', 'annualBonus'],
  'Thực tập sinh 1 năm': ['languageRequirement', 'languageProficiency', 'companyArrivalTime', 'ginouExpiryRequirement', 'hourlySalary', 'annualIncome', 'annualBonus'],
  'Thực tập sinh 3 Go': ['educationRequirement', 'ginouExpiryRequirement'],
  'Đặc định đầu Việt': ['educationRequirement', 'companyArrivalTime', 'ginouExpiryRequirement'],
  'Đặc định đầu Nhật': ['educationRequirement', 'financialAbility'],
  'Đặc định đi mới': ['educationRequirement', 'companyArrivalTime', 'ginouExpiryRequirement'],
  'Kỹ sư, tri thức đầu Việt': ['companyArrivalTime', 'ginouExpiryRequirement'],
  'Kỹ sư, tri thức đầu Nhật': ['financialAbility'],
};

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};


const allSpecialConditions = [
  'Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi',
  'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng',
  'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo', 'Không nhận visa katsudo',
  'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình',
  'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng',
  'Nhận bằng Senmon', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền',
  'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé',
  'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'
];

const conditionsByVisaType: { [key: string]: string[] } = {
  'Thực tập sinh kỹ năng': [
    'Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao',
    'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhận nhiều loại bằng', 'Lương tốt',
    'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín',
    'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'
  ],
  'Kỹ năng đặc định': [
    'Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi',
    'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng',
    'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo',
    'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken',
    'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy',
    'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng',
    'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín',
    'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'
  ],
  'Kỹ sư, tri thức': [
    'Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao',
    'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa',
    'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm',
    'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành',
    'Nhận thiếu giấy', 'Nhận bằng Senmon', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền',
    'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé',
    'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'
  ],
};

const otherSkills = [
    "Có bằng lái xe AT", "Có bằng lái xe MT", "Có bằng lái xe tải cỡ nhỏ", "Có bằng lái xe tải cỡ trung", "Có bằng lái xe tải cỡ lớn", "Có bằng lái xe buýt cỡ trung", "Có bằng lái xe buýt cỡ lớn", "Lái được máy xúc, máy đào", "Lái được xe nâng", "Có bằng cầu", "Vận hành máy CNC", "Có bằng tiện, mài", "Có bằng hàn", "Có bằng cắt", "Có bằng gia công kim loại", "Làm được giàn giáo", "Thi công nội thất", "Quản lý thi công xây dựng", "Quản lý khối lượng xây dựng", "Thiết kế BIM xây dựng", "Đọc được bản vẽ kỹ thuật"
];

const locations = {
    "Việt Nam": [
        "An Giang", "Bắc Ninh", "Cao Bằng", "Cà Mau", "Cần Thơ", "Đà Nẵng", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Đắk Lắk", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Hưng Yên", "Thừa Thiên Huế", "Khánh Hòa", "Lai Châu", "Lào Cai", "Lạng Sơn", "Lâm Đồng", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thanh Hóa", "Thành phố Hồ Chí Minh", "Thái Nguyên", "Tuyên Quang", "Vĩnh Long"
    ],
    "Nhật Bản": {
        "Hokkaido": ["Hokkaido"],
        "Tohoku": ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
        "Kanto": ["Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa"],
        "Chubu": ["Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi"],
        "Kansai": ["Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama"],
        "Chugoku": ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
        "Shikoku": ["Tokushima", "Kagawa", "Ehime", "Kochi"],
        "Kyushu": ["Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima"],
        "Okinawa": ["Okinawa"]
    }
};

const getVisaCategory = (visaDetail: string): keyof typeof conditionsByVisaType | null => {
  if (visaDetail.includes('Thực tập sinh')) return 'Thực tập sinh kỹ năng';
  if (visaDetail.includes('Đặc định')) return 'Kỹ năng đặc định';
  if (visaDetail.includes('Kỹ sư, tri thức')) return 'Kỹ sư, tri thức';
  return null;
}


export default function PartnerPostJobPage() {
  const [activeTab, setActiveTab] = useState('manual');
  const { toast } = useToast();
  const router = useRouter();
  const [jobData, setJobData] = useState<Partial<JobData>>({
    title: '',
    visaType: '',
    visaDetail: '',
    industry: '',
    workLocation: '',
    interviewLocation: '',
    gender: 'Cả nam và nữ',
    quantity: '1',
    ageRequirement: '18-69',
    languageRequirement: '',
    languageProficiency: '',
    netFee: '',
    basicSalary: '',
    netSalary: '',
    interviewDate: '',
    description: '',
    requirements: '',
    benefits: '',
    notes: '',
    specialConditions: [],
    tattooRequirement: '',
    hepatitisBRequirement: '',
    educationRequirement: '',
    experienceRequirement: '',
    yearsOfExperience: '',
    companyArrivalTime: '',
    ginouExpiryRequirement: '',
    otherSkillRequirement: [],
    workShift: '',
    visionRequirement: '',
    interviewFormat: '',
    interviewRounds: '',
    heightRequirement: '',
    weightRequirement: '',
    dominantHand: '',
    hourlySalary: '',
    annualIncome: '',
    annualBonus: '',
    financialAbility: '',
  });

  const [visibleFields, setVisibleFields] = useState<Set<keyof JobData>>(new Set(Object.keys(jobData) as (keyof JobData)[]));

  const handleInputChange = (field: keyof JobData, value: string | string[]) => {
    const newData = { ...jobData, [field]: value };

    if (field === 'visaType') {
        newData.visaDetail = ''; // Reset dependent dropdown
    }

    if (field === 'visaDetail') {
      const hidden = hiddenFieldsByVisa[value as string] || [];
      const allFields = Object.keys(jobData) as (keyof JobData)[];
      const newVisibleFields = new Set(allFields.filter(f => !hidden.includes(f)));
      setVisibleFields(newVisibleFields);
      // Reset special conditions when visa type changes
      newData.specialConditions = [];
    }

    // Reset proficiency when language changes, or hide it if not required
    if (field === 'languageRequirement') {
      newData.languageProficiency = '';
      if (value === 'Không yêu cầu tiếng') {
          setVisibleFields(prev => {
              const newSet = new Set(prev);
              newSet.delete('languageProficiency');
              return newSet;
          });
      } else {
           setVisibleFields(prev => {
              const newSet = new Set(prev);
              newSet.add('languageProficiency');
              return newSet;
          });
      }
    }

    setJobData(newData);
  };

  const handleCheckboxChange = (field: keyof JobData, value: string) => {
    const currentValues = (jobData[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    handleInputChange(field, newValues);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // Simulate AI processing and pre-filling the form
      const mockData: Partial<JobData> = {
        title: "Kỹ sư Vận hành Dây chuyền Tự động",
        visaType: "Kỹ sư, tri thức",
        visaDetail: "Kỹ sư, tri thức đầu Việt",
        industry: "Điện tử",
        workLocation: "Khu công nghệ cao Hòa Lạc, Hà Nội",
        gender: "Cả nam và nữ",
        quantity: "5",
        ageRequirement: "22-35",
        languageRequirement: "Tiếng Nhật",
        languageProficiency: "N4",
        basicSalary: '200,000 yên/tháng',
        netSalary: '160,000 yên/tháng',
        description: "- Chịu trách nhiệm vận hành, giám sát và bảo trì các dây chuyền sản xuất tự động.\\n- Đảm bảo các máy móc hoạt động ổn định, đạt năng suất và chất lượng theo yêu cầu.\\n- Phối hợp với các bộ phận khác để xử lý sự cố và cải tiến quy trình.",
        requirements: "- Tốt nghiệp Cao đẳng/Đại học chuyên ngành Cơ điện tử, Tự động hóa hoặc các ngành liên quan.\\n- Có ít nhất 1 năm kinh nghiệm ở vị trí tương đương.\\n- Có khả năng đọc hiểu bản vẽ kỹ thuật.",
        benefits: "- Mức lương cạnh tranh, thỏa thuận theo năng lực.\\n- Môi trường làm việc chuyên nghiệp, năng động.\\n- Được hưởng đầy đủ các chế độ phúc lợi theo quy định của pháp luật.",
        notes: "Ứng viên có thể phải làm việc theo ca. Chi tiết sẽ được trao đổi trong buổi phỏng vấn."
      };
      
      const hidden = hiddenFieldsByVisa[mockData.visaDetail!] || [];
      const allFields = Object.keys(jobData) as (keyof JobData)[];
      setVisibleFields(new Set(allFields.filter(f => !hidden.includes(f))));

      setJobData(prev => ({...prev, ...mockData}));
      
      setActiveTab('manual');
      toast({
        title: "Phân tích thành công!",
        description: "Thông tin từ tệp của bạn đã được điền vào biểu mẫu.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting job data:", jobData);
    toast({
      title: "Đăng tin thành công!",
      description: "Tin tuyển dụng của bạn đã được đăng và sẽ được chuyển hướng đến bảng điều khiển.",
      className: "bg-green-500 text-white"
    });
    setTimeout(() => {
      router.push('/partner/dashboard');
    }, 1500);
  }

  const visaTypes = Object.keys(visaDetailsByVisaType);
  const japaneseLevels = ["JLPT N5", "JLPT N4", "JLPT N3", "JLPT N2", "JLPT N1", "Kaiwa N5", "Kaiwa N4", "Kaiwa N3", "Kaiwa N2", "Kaiwa N1", "Trình độ tương đương N5", "Trình độ tương đương N4", "Trình độ tương đương N3", "Trình độ tương đương N2", "Trình độ tương đương N1"];
  const englishLevels = [
    "TOEIC 900", "TOEIC 800", "TOEIC 700", "TOEIC 600", "TOEIC 500", "TOEIC 400",
    "IELTS 9.0", "IELTS 8.0", "IELTS 7.0", "IELTS 6.0", "IELTS 5.0", "IELTS 4.0",
    "Giao tiếp IELTS 9.0", "Giao tiếp IELTS 8.0", "Giao tiếp IELTS 7.0", "Giao tiếp IELTS 6.0", "Giao tiếp IELTS 5.0", "Giao tiếp IELTS 4.0",
    "Trình độ tương đương 9.0", "Trình độ tương đương 8.0", "Trình độ tương đương 7.0", "Trình độ tương đương 6.0", "Trình độ tương đương 5.0", "Trình độ tương đương 4.0"
  ];
  const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Thạc sĩ", "Tốt nghiệp Tiến sĩ", "Tốt nghiệp Senmon", "Tốt nghiệp Tanki-dai"];
  const experienceYears = ["Không yêu cầu", "Trên 0,5 năm", "Trên 1 năm", "Trên 1,5 năm", "Trên 2 năm", "Trên 2,5 năm", "Trên 3 năm", "Trên 3,5 năm", "Trên 4 năm", "Trên 4,5 năm"];
  const workShifts = [
    "Ca ngày (thường 08:00-17:00 hoặc 09:00-18:00)",
    "Ca chiều/tối (thường 16:00-24:00 hoặc 17:00-01:00)",
    "Ca đêm (thường 24:00-08:00)",
    "Ca luân phiên (chia ca sáng, chiều và đêm; luân phiên tuần tháng)",
    "Ca 2-2-3 (làm 2 ngày, nghỉ 2 ngày, làm 3 ngày và lặp lại)",
    "Ca 4-3-3 (làm 4 ngày, nghỉ 3 ngày và tiếp tục 3 ngày nghỉ)",
    "Nghỉ thứ 7, Chủ Nhật",
    "Nghỉ định kỳ trong tuần",
    "Khác"
  ];
  const visionRequirements = ["20/10", "15/10", "10/10", "9/10", "8/10", "7/10", "6/10", "5/10", "4/10", "3/10", "2/10", "1/10", "Cận thị", "Viễn thị", "Loạn thị", "Mù màu"];
  const interviewFormats = ["Phỏng vấn trực tiếp", "Phỏng vấn Online", "Phỏng vấn trực tiếp và Online"];
  const interviewRoundsOptions = ["1 vòng", "2 vòng", "3 vòng", "4 vòng", "5 vòng"];

  const getMinInterviewDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const getMaxInterviewDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 60);
    return today.toISOString().split('T')[0];
  };

  const getFutureMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 1; i <= 12; i++) { // next 12 months
        const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const month = futureDate.getMonth() + 1;
        const year = futureDate.getFullYear();
        months.push(`Tháng ${month}/${year}`);
    }
    return months;
  };

  const ginouExpiryOptions = [
    "Trên 4,5 năm",
    "Trên 4 năm",
    "Trên 3,5 năm",
    "Trên 3 năm",
    "Trên 2,5 năm",
    "Trên 2 năm",
    "Trên 1,5 năm",
    "Trên 1 năm",
    "Trên 0,5 năm"
  ];

  const currentVisaCategory = jobData.visaDetail ? getVisaCategory(jobData.visaDetail) : null;
  const availableConditions = currentVisaCategory ? conditionsByVisaType[currentVisaCategory] : [];

  const basicSalaryPlaceholder = (() => {
    const visaDetail = jobData.visaDetail;
    if (visaDetail?.includes('Thực tập sinh')) return "120,000 - 500,000 yên/tháng";
    if (visaDetail?.includes('Đặc định')) return "150,000 - 1,500,000 yên/tháng";
    if (visaDetail?.includes('Kỹ sư, tri thức')) return "160,000 - 10,000,000 yên/tháng";
    return "Nhập mức lương cơ bản";
  })();

  const netSalaryPlaceholder = (() => {
      const visaDetail = jobData.visaDetail;
      if (visaDetail?.includes('Thực tập sinh')) return "100,000 - 400,000 yên/tháng";
      if (visaDetail?.includes('Đặc định')) return "120,000 - 1,300,000 yên/tháng";
      if (visaDetail?.includes('Kỹ sư, tri thức')) return "120,000 - 9,000,000 yên/tháng";
      return "Nhập thực lĩnh (ước tính)";
  })();

  const financialAbilityPlaceholder = (() => {
      switch (jobData.visaDetail) {
          case 'Thực tập sinh 3 năm':
              return '0 đến 4000$';
          case 'Thực tập sinh 1 năm':
          case 'Thực tập sinh 3 Go':
          case 'Đặc định đầu Việt':
          case 'Đặc định đi mới':
          case 'Kỹ sư, tri thức đầu Việt':
              return '0 đến 2000$';
          case 'Kỹ năng đặc định đầu Nhật':
          case 'Kỹ sư, tri thức đầu Nhật':
              return '0';
          default:
              return 'Nhập khả năng tài chính';
      }
  })();

  const allIndustries = Object.values(industriesByJobType).flat().filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);


  return <div className="container mx-auto px-4 md:px-6 py-8">
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
              <TabsTrigger value="ai">Đăng bằng AI</TabsTrigger>
              <TabsTrigger value="manual">Đăng thủ công</TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <div className="text-center p-6 border rounded-lg border-dashed">
                <h3 className="text-xl font-bold font-headline mb-2">Tải lên tin tuyển dụng có sẵn</h3>
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
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Job Information */}
                <div className="space-y-4 p-6 border rounded-lg">
                  <h3 className="text-xl font-bold font-headline">Thông tin việc làm</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="job-title">Chức danh</Label>
                      <Input id="job-title" placeholder="VD: Kỹ sư vận hành máy CNC" value={jobData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="visa-type">Loại visa</Label>
                        <Select value={jobData.visaType} onValueChange={(value) => handleInputChange('visaType', value)} required>
                            <SelectTrigger id="visa-type"><SelectValue placeholder="Chọn loại visa" /></SelectTrigger>
                            <SelectContent>
                            {visaTypes.map(vt => <SelectItem key={vt} value={vt}>{vt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visa-detail">Chi tiết loại hình visa</Label>
                      <Select value={jobData.visaDetail} onValueChange={(value) => handleInputChange('visaDetail', value)} required disabled={!jobData.visaType}>
                        <SelectTrigger id="visa-detail"><SelectValue placeholder="Chọn loại hình visa chi tiết" /></SelectTrigger>
                        <SelectContent>
                          {(visaDetailsByVisaType[jobData.visaType || ''] || []).map(vd => <SelectItem key={vd} value={vd}>{vd}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="job-industry">Ngành nghề</Label>
                       <Select value={jobData.industry} onValueChange={(value) => handleInputChange('industry', value)} required>
                        <SelectTrigger id="job-industry"><SelectValue placeholder="Chọn ngành nghề" /></SelectTrigger>
                        <SelectContent>
                          {allIndustries.map(industry => (
                            <SelectItem key={industry.slug} value={industry.name}>{industry.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="job-location">Địa điểm làm việc</Label>
                        <Select value={jobData.workLocation} onValueChange={(value) => handleInputChange('workLocation', value)}>
                            <SelectTrigger id="job-location">
                                <SelectValue placeholder="Chọn địa điểm làm việc" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(locations["Nhật Bản"]).map(([region, prefectures]) => (
                                    <SelectGroup key={region}>
                                        <SelectLabel>{region}</SelectLabel>
                                        {(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    {visibleFields.has('interviewLocation') && (
                      <div className="space-y-2">
                          <Label htmlFor="interview-location">Phỏng vấn, tuyển tại</Label>
                          <Select value={jobData.interviewLocation} onValueChange={(value) => handleInputChange('interviewLocation', value)}>
                              <SelectTrigger id="interview-location">
                                  <SelectValue placeholder="Chọn địa điểm phỏng vấn" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectGroup>
                                      <SelectLabel>Việt Nam</SelectLabel>
                                      {locations["Việt Nam"].map(province => <SelectItem key={province} value={province}>{province}</SelectItem>)}
                                  </SelectGroup>
                                  <SelectGroup>
                                      <SelectLabel>Nhật Bản</SelectLabel>
                                      {Object.values(locations["Nhật Bản"]).flat().map(prefecture => <SelectItem key={prefecture} value={prefecture}>{prefecture}</SelectItem>)}
                                  </SelectGroup>
                              </SelectContent>
                          </Select>
                      </div>
                    )}
                     <div className="space-y-2">
                      <Label htmlFor="interview-date">Ngày phỏng vấn</Label>
                      <Input
                        id="interview-date"
                        type="date"
                        value={jobData.interviewDate}
                        onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                        min={getMinInterviewDate()}
                        max={getMaxInterviewDate()}
                      />
                    </div>
                     {visibleFields.has('interviewRounds') && (
                        <div className="space-y-2">
                          <Label htmlFor="interview-rounds">Số vòng phỏng vấn</Label>
                          <Select value={jobData.interviewRounds} onValueChange={(value) => handleInputChange('interviewRounds', value)}>
                                <SelectTrigger id="interview-rounds">
                                    <SelectValue placeholder="Chọn số vòng phỏng vấn" />
                                </SelectTrigger>
                                <SelectContent>
                                    {interviewRoundsOptions.map(req => <SelectItem key={req} value={req}>{req}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                     )}
                      {visibleFields.has('interviewFormat') && (
                        <div className="space-y-2">
                          <Label htmlFor="interview-format">Hình thức phỏng vấn</Label>
                          <Select value={jobData.interviewFormat} onValueChange={(value) => handleInputChange('interviewFormat', value)}>
                                <SelectTrigger id="interview-format">
                                    <SelectValue placeholder="Chọn hình thức phỏng vấn" />
                                </SelectTrigger>
                                <SelectContent>
                                    {interviewFormats.map(req => <SelectItem key={req} value={req}>{req}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                     )}
                  </div>
                </div>
                 {/* Salary Information */}
                <div className="space-y-4 p-6 border rounded-lg">
                  <h3 className="text-xl font-bold font-headline">Lương và Phí</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="basic-salary">Lương cơ bản</Label>
                        <Input id="basic-salary" placeholder={basicSalaryPlaceholder} value={jobData.basicSalary} onChange={(e) => handleInputChange('basicSalary', e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="net-salary">Thực lĩnh (ước tính)</Label>
                        <Input id="net-salary" placeholder={netSalaryPlaceholder} value={jobData.netSalary} onChange={(e) => handleInputChange('netSalary', e.target.value)} />
                    </div>
                    {visibleFields.has('hourlySalary') && (
                        <div className="space-y-2">
                            <Label htmlFor="hourly-salary">Lương cơ bản (giờ)</Label>
                            <Input id="hourly-salary" placeholder="VD: 1000 yên/giờ" value={jobData.hourlySalary} onChange={(e) => handleInputChange('hourlySalary', e.target.value)} />
                        </div>
                    )}
                    {visibleFields.has('annualIncome') && (
                        <div className="space-y-2">
                            <Label htmlFor="annual-income">Thu nhập (năm)</Label>
                            <Input id="annual-income" placeholder="VD: 300 vạn yên" value={jobData.annualIncome} onChange={(e) => handleInputChange('annualIncome', e.target.value)} />
                        </div>
                    )}
                    {visibleFields.has('annualBonus') && (
                        <div className="space-y-2">
                            <Label htmlFor="annual-bonus">Thưởng (năm)</Label>
                            <Input id="annual-bonus" placeholder="VD: 2 lần/năm" value={jobData.annualBonus} onChange={(e) => handleInputChange('annualBonus', e.target.value)} />
                        </div>
                    )}
                    {visibleFields.has('netFee') && (
                        <div className="space-y-2">
                        <Label htmlFor="net-fee">Mức phí (nếu có)</Label>
                        <Input id="net-fee" placeholder="VD: 100tr hoặc 4000$" value={jobData.netFee} onChange={(e) => handleInputChange('netFee', e.target.value)} />
                        </div>
                    )}
                    {visibleFields.has('financialAbility') && (
                        <div className="space-y-2">
                            <Label htmlFor="financial-ability">Khả năng tài chính</Label>
                            <Input id="financial-ability" placeholder={financialAbilityPlaceholder} value={jobData.financialAbility} onChange={(e) => handleInputChange('financialAbility', e.target.value)} />
                        </div>
                    )}
                   </div>
                </div>

                {/* Candidate Requirements */}
                <div className="space-y-4 p-6 border rounded-lg">
                  <h3 className="text-xl font-bold font-headline">Yêu cầu ứng viên</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                      <Label htmlFor="gender">Giới tính</Label>
                      <Select value={jobData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger id="gender"><SelectValue placeholder="Chọn yêu cầu giới tính" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Cả nam và nữ">Cả nam và nữ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Số lượng tuyển (1-100)</Label>
                      <Input id="quantity" type="number" min="1" max="100" placeholder="VD: 5" value={jobData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age-requirement">Yêu cầu độ tuổi</Label>
                      <Input id="age-requirement" placeholder="18-69" value={jobData.ageRequirement} onChange={(e) => handleInputChange('ageRequirement', e.target.value)} />
                    </div>
                     {visibleFields.has('educationRequirement') && (
                        <div className="space-y-2">
                            <Label htmlFor="education-requirement">Yêu cầu học vấn</Label>
                            <Select value={jobData.educationRequirement} onValueChange={(value) => handleInputChange('educationRequirement', value)}>
                                <SelectTrigger id="education-requirement">
                                    <SelectValue placeholder="Chọn yêu cầu học vấn" />
                                </SelectTrigger>
                                <SelectContent>
                                    {educationLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                     )}
                      {visibleFields.has('experienceRequirement') && (
                        <div className="space-y-2">
                          <Label htmlFor="experience-requirement">Yêu cầu kinh nghiệm</Label>
                           <Select value={jobData.experienceRequirement} onValueChange={(value) => handleInputChange('experienceRequirement', value)}>
                            <SelectTrigger id="experience-requirement"><SelectValue placeholder="Chọn ngành nghề yêu cầu kinh nghiệm" /></SelectTrigger>
                            <SelectContent>
                              {allIndustries.map(industry => (
                                <SelectItem key={industry.slug} value={industry.name}>{industry.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                     )}
                     {visibleFields.has('yearsOfExperience') && (
                        <div className="space-y-2">
                          <Label htmlFor="years-experience">Yêu cầu số năm kinh nghiệm</Label>
                          <Select value={jobData.yearsOfExperience} onValueChange={(value) => handleInputChange('yearsOfExperience', value)}>
                            <SelectTrigger id="years-experience"><SelectValue placeholder="Chọn số năm kinh nghiệm" /></SelectTrigger>
                            <SelectContent>
                                {experienceYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                            </SelectContent>
                           </Select>
                        </div>
                     )}
                      {visibleFields.has('heightRequirement') && (
                        <div className="space-y-2">
                          <Label htmlFor="height-requirement">Yêu cầu chiều cao (cm)</Label>
                          <Input id="height-requirement" placeholder="140 - 205" value={jobData.heightRequirement} onChange={(e) => handleInputChange('heightRequirement', e.target.value)} />
                        </div>
                     )}
                      {visibleFields.has('weightRequirement') && (
                        <div className="space-y-2">
                          <Label htmlFor="weight-requirement">Yêu cầu cân nặng (kg)</Label>
                          <Input id="weight-requirement" placeholder="40 - 105" value={jobData.weightRequirement} onChange={(e) => handleInputChange('weightRequirement', e.target.value)} />
                        </div>
                     )}
                      {visibleFields.has('dominantHand') && (
                        <div className="space-y-2">
                          <Label htmlFor="dominant-hand">Tay thuận</Label>
                          <Select value={jobData.dominantHand} onValueChange={(value) => handleInputChange('dominantHand', value)}>
                            <SelectTrigger id="dominant-hand">
                                <SelectValue placeholder="Chọn tay thuận" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tay phải">Tay phải</SelectItem>
                                <SelectItem value="Tay trái">Tay trái</SelectItem>
                                <SelectItem value="Cả hai tay">Cả hai tay</SelectItem>
                            </SelectContent>
                           </Select>
                        </div>
                     )}
                     {visibleFields.has('visionRequirement') && (
                        <div className="space-y-2">
                          <Label htmlFor="vision-requirement">Yêu cầu thị lực</Label>
                          <Select value={jobData.visionRequirement} onValueChange={(value) => handleInputChange('visionRequirement', value)}>
                                <SelectTrigger id="vision-requirement">
                                    <SelectValue placeholder="Chọn yêu cầu về thị lực" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visionRequirements.map(req => <SelectItem key={req} value={req}>{req}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                     )}
                     {visibleFields.has('tattooRequirement') && (
                        <div className="space-y-2">
                            <Label htmlFor="tattoo-requirement">Hình xăm</Label>
                            <Select value={jobData.tattooRequirement} onValueChange={(value) => handleInputChange('tattooRequirement', value)}>
                                <SelectTrigger id="tattoo-requirement">
                                    <SelectValue placeholder="Chọn yêu cầu về hình xăm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Không nhận hình xăm">Không nhận hình xăm</SelectItem>
                                    <SelectItem value="Nhận xăm nhỏ (kín)">Nhận xăm nhỏ (kín)</SelectItem>
                                    <SelectItem value="Nhận cả xăm to (lộ)">Nhận cả xăm to (lộ)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     )}
                      {visibleFields.has('hepatitisBRequirement') && (
                        <div className="space-y-2">
                          <Label htmlFor="hepatitis-b-requirement">Viêm gan B</Label>
                           <Select value={jobData.hepatitisBRequirement} onValueChange={(value) => handleInputChange('hepatitisBRequirement', value)}>
                                <SelectTrigger id="hepatitis-b-requirement">
                                    <SelectValue placeholder="Chọn yêu cầu về viêm gan B" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Không nhận viêm gan B">Không nhận viêm gan B</SelectItem>
                                    <SelectItem value="Nhận viêm gan B (thể tĩnh)">Nhận viêm gan B (thể tĩnh)</SelectItem>
                                    <SelectItem value="Nhận viêm gan B (thể động)">Nhận viêm gan B (thể động)</SelectItem>
                                    <SelectItem value="Không yêu cầu">Không yêu cầu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     )}
                     {visibleFields.has('languageRequirement') && (
                      <div className="space-y-2">
                        <Label htmlFor="language-requirement">Yêu cầu ngoại ngữ</Label>
                        <Select value={jobData.languageRequirement} onValueChange={(value) => handleInputChange('languageRequirement', value)}>
                          <SelectTrigger id="language-requirement">
                            <SelectValue placeholder="Chọn yêu cầu ngoại ngữ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tiếng Nhật">Tiếng Nhật</SelectItem>
                            <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                            <SelectItem value="Không yêu cầu tiếng">Không yêu cầu tiếng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {visibleFields.has('languageProficiency') && jobData.languageRequirement === 'Tiếng Nhật' && (
                      <div className="space-y-2">
                        <Label htmlFor="language-proficiency-jp">Trình độ tiếng Nhật</Label>
                        <Select value={jobData.languageProficiency} onValueChange={(value) => handleInputChange('languageProficiency', value)}>
                          <SelectTrigger id="language-proficiency-jp">
                            <SelectValue placeholder="Chọn trình độ tiếng Nhật" />
                          </SelectTrigger>
                          <SelectContent>
                            {japaneseLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {visibleFields.has('languageProficiency') && jobData.languageRequirement === 'Tiếng Anh' && (
                      <div className="space-y-2">
                        <Label htmlFor="language-proficiency-en">Trình độ tiếng Anh</Label>
                        <Select value={jobData.languageProficiency} onValueChange={(value) => handleInputChange('languageProficiency', value)}>
                          <SelectTrigger id="language-proficiency-en">
                            <SelectValue placeholder="Chọn trình độ tiếng Anh" />
                          </SelectTrigger>
                          <SelectContent>
                            {englishLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {visibleFields.has('ginouExpiryRequirement') && (
                        <div className="space-y-2">
                          <Label htmlFor="ginou-expiry">Yêu cầu hạn Ginou/Visa TTS còn</Label>
                          <Select value={jobData.ginouExpiryRequirement} onValueChange={(value) => handleInputChange('ginouExpiryRequirement', value)}>
                            <SelectTrigger id="ginou-expiry"><SelectValue placeholder="Chọn yêu cầu hạn visa" /></SelectTrigger>
                            <SelectContent>
                                {ginouExpiryOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                           </Select>
                        </div>
                    )}
                    {visibleFields.has('companyArrivalTime') && (
                      <div className="space-y-2">
                        <Label htmlFor="arrival-time">Yêu cầu thời điểm về công ty</Label>
                        <Select value={jobData.companyArrivalTime} onValueChange={(value) => handleInputChange('companyArrivalTime', value)}>
                          <SelectTrigger id="arrival-time">
                            <SelectValue placeholder="Chọn thời điểm" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFutureMonths().map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                     {visibleFields.has('workShift') && (
                      <div className="space-y-2">
                        <Label htmlFor="work-shift">Ca làm việc</Label>
                        <Select value={jobData.workShift} onValueChange={(value) => handleInputChange('workShift', value)}>
                          <SelectTrigger id="work-shift">
                            <SelectValue placeholder="Chọn ca làm việc" />
                          </SelectTrigger>
                          <SelectContent>
                            {workShifts.map(shift => <SelectItem key={shift} value={shift}>{shift}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  {visibleFields.has('otherSkillRequirement') && (
                        <div className="space-y-4 pt-4">
                            <Label className="font-semibold">Yêu cầu kỹ năng khác</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {otherSkills.map(skill => (
                                    <div key={skill} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`skill-${skill}`} 
                                            onCheckedChange={() => handleCheckboxChange('otherSkillRequirement', skill)} 
                                            checked={jobData.otherSkillRequirement?.includes(skill)}
                                        />
                                        <Label htmlFor={`skill-${skill}`} className="font-normal text-sm cursor-pointer">{skill}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Special Conditions */}
                {jobData.visaDetail && availableConditions.length > 0 && (
                  <div className="space-y-4 p-6 border rounded-lg">
                    <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                      <Star className="text-yellow-500" />
                      Điều kiện đặc biệt
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                      {availableConditions.map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={jobData.specialConditions?.includes(condition)}
                            onCheckedChange={() => handleCheckboxChange('specialConditions', condition)}
                          />
                          <Label htmlFor={`condition-${condition}`} className="font-normal cursor-pointer">{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* Job Description */}
                <div className="space-y-4 p-6 border rounded-lg">
                  <h3 className="text-xl font-bold font-headline">Mô tả chi tiết</h3>
                  <div className="space-y-2">
                    <Label htmlFor="job-description">Mô tả công việc</Label>
                    <Textarea id="job-description" placeholder="Mô tả công việc, trách nhiệm..." rows={5} value={jobData.description} onChange={(e) => handleInputChange('description', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-requirements">Yêu cầu ứng viên</Label>
                    <Textarea id="job-requirements" placeholder="Yêu cầu về kỹ năng, kinh nghiệm, học vấn..." rows={5} value={jobData.requirements} onChange={(e) => handleInputChange('requirements', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-benefits">Quyền lợi</Label>
                    <Textarea id="job-benefits" placeholder="Phúc lợi, lương thưởng, cơ hội phát triển..." rows={3} value={jobData.benefits} onChange={(e) => handleInputChange('benefits', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-notes">Mô tả/Ghi chú thêm</Label>
                    <Textarea id="job-notes" placeholder="Các thông tin khác không có trong các mục trên..." rows={3} value={jobData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">Tôi đồng ý với các <a href="#" className="underline text-primary">điều khoản dịch vụ</a> của HelloJob.</Label>
                </div>

                <div className="text-center pt-4">
                  <Button size="lg" type="submit" className="bg-primary text-white w-full md:w-auto">
                    <Send className="mr-2" /> Đăng tin ngay
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
