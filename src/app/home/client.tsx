
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen, Search, ChevronsUpDown, Check, GraduationCap, Briefcase, TrendingUp, BookCopy, ArrowRight, MapPin, MapIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from '@/lib/utils';
import { industriesByJobType, type Industry } from '@/lib/industry-data';
import { FilterSidebar } from '@/components/job-search/filter-sidebar';
import { SearchResults } from '@/components/job-search/search-results';


const featuredEmployers = [
  { id: 'samsung', name: 'Samsung', logo: '/img/taitro1.jpg', dataAiHint: 'samsung logo' },
  { id: 'lg', name: 'LG', logo: '/img/taitro2.jpg', dataAiHint: 'lg logo' },
  { id: 'hyundai', name: 'Hyundai', logo: '/img/taitro3.jpg', dataAiHint: 'hyundai logo' },
  { id: 'honda', name: 'Honda', logo: '/img/taitro4.jpg', dataAiHint: 'honda logo' },
  { id: 'canon', name: 'Canon', logo: '/img/taitro5.jpg', dataAiHint: 'canon logo' },
];

const featuredCourses = [
   {
    id: 'tieng-nhat-giao-tiep',
    title: 'Tiếng Nhật giao tiếp cho người đi làm',
    category: 'Ngoại ngữ',
    image: '/img/giao_tiep.jpg?v=1',
    dataAiHint: 'Japanese language',
  },
  {
    id: 'ky-nang-lam-viec-nhom',
    title: 'Kỹ năng làm việc nhóm hiệu quả',
    category: 'Kỹ năng mềm',
    image: '/img/teamwork.jpg?v=1',
    dataAiHint: 'teamwork collaboration',
  },
  {
    id: 'an-toan-lao-dong',
    title: 'An toàn lao động trong sản xuất',
    category: 'Kỹ thuật',
    image: '/img/an_toan_lao_dong.jpg?v=1',
    dataAiHint: 'factory safety',
  },
]

const japanJobTypes = [
    'Thực tập sinh 3 năm',
    'Thực tập sinh 1 năm',
    'Thực tập sinh 3 Go',
    'Đặc định đầu Việt',
    'Đặc định đầu Nhật',
    'Đặc định đi mới',
    'Kỹ sư, tri thức đầu Việt',
    'Kỹ sư, tri thức đầu Nhật'
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

const MainContent = () => (
    <>
      {/* Why Choose Us for Candidates */}
      <section className="w-full pt-20 md:pt-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-16">
            Con đường phát triển của bạn tại Nhật Bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
                  <MapIcon className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="font-headline mt-4">Lộ trình rõ ràng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Xem lộ trình phát triển sự nghiệp (SWR) để định hướng con đường từ Thực tập sinh đến chuyên gia tại Nhật.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
                  <GraduationCap className="h-10 w-10 text-orange-500" />
                </div>
                <CardTitle className="font-headline mt-4">Nâng cao kỹ năng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tham gia các khóa học E-learning miễn phí về tiếng Nhật, văn hóa và kỹ năng làm việc để chuẩn bị tốt nhất.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-sky-100 rounded-full p-4 w-fit">
                  <Briefcase className="h-10 w-10 text-sky-500" />
                </div>
                <CardTitle className="font-headline mt-4">Việc làm chất lượng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tiếp cận hàng ngàn công việc chất lượng cao từ các nhà tuyển dụng hàng đầu trên khắp nước Nhật.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skilled Labor CTA Section */}
      <section className="w-full py-20 md:py-28 bg-accent/20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="relative h-64 md:h-full order-last md:order-first">
                <Image 
                  src="/img/bao_duong_oto.jpg"
                  alt="Lao động lành nghề tại Nhật"
                  fill
                  className="object-cover"
                  data-ai-hint="happy factory worker japan"
                />
              </div>
              <div className="p-8 md:p-12 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">
                  Ginou 2 - Lao động lành nghề tại Nhật{' '}
                  <span className="text-foreground">thu nhập bao nhiêu?</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                  Khám phá lộ trình phát triển sự nghiệp để trở thành lao động tay nghề cao và đạt được mức thu nhập mơ ước.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Button asChild size="lg" className="bg-accent-green hover:bg-accent-green/90 text-white">
                      <Link href="/roadmap">
                        <TrendingUp /> Xem ngay lộ trình
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                        <Link href="/handbook/ginou-2-lao-dong-lanh-nghe">
                           <BookCopy /> Xem ngay bài viết
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Employers */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Các đối tác tuyển dụng hàng đầu</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Những công ty và nghiệp đoàn lớn uy tín tại Nhật Bản đang tìm kiếm những ứng viên như bạn.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-stretch">
            {featuredEmployers.map(emp => (
              <Link href={`/employers/${emp.id}`} key={emp.id} className="flex justify-center items-center bg-white">
                <Image src={emp.logo} alt={emp.name} width={150} height={50} className="grayscale hover:grayscale-0 transition-all duration-300" data-ai-hint={emp.dataAiHint}/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured E-Learning Courses */}
      <section className="w-full py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Nâng cao kỹ năng với E-Learning</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Đầu tư vào bản thân với các khóa học được thiết kế riêng, giúp bạn thăng tiến trong sự nghiệp tại Nhật.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <CardHeader className="p-0">
                   <Link href={`/learn/${course.id}`} className="block">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                        data-ai-hint={course.dataAiHint}
                      />
                   </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <p className="text-sm font-bold mb-2 text-primary">{course.category}</p>
                  <Link href={`/learn/${course.id}`}>
                      <CardTitle className="font-headline text-xl mb-2 h-14 group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  </Link>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                   <Link href={`/learn/${course.id}`} className="font-bold text-primary hover:underline flex items-center">
                    Tìm hiểu thêm <ArrowRight className="ml-2" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
           <div className="text-center mt-16">
            <Button asChild size="lg">
              <Link href="/learn">Khám phá tất cả khóa học <BookOpen /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Employers & Franchise */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 rounded-lg bg-accent text-primary-foreground p-12 lg:p-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Giải pháp cho các đối tác tuyển Tokutei đầu Nhật</h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Hợp tác cùng HelloJob để tiếp cận nguồn ứng viên dồi dào, chất lượng cao và tối ưu hóa quy trình tuyển dụng Kỹ năng Đặc định.
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/franchise">Tìm hiểu về Mô hình Đối tác</Link>
              </Button>
            </div>
             <div className="md:w-1/2 flex justify-center">
              <Image
                src="/img/giai_phap_phai_cu.jpg"
                alt="Hợp tác tuyển dụng tại Nhật"
                width={500}
                height={350}
                className="rounded-lg shadow-xl"
                data-ai-hint="recruitment partnership japan"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );

  type SearchModuleProps = {
      onSearch: () => void;
  }
  
const SearchModule = ({ onSearch }: SearchModuleProps) => {
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedVisaGroup, setSelectedVisaGroup] = useState<string | null>('all');
  const [selectedIndustry2, setSelectedIndustry2] = useState<Industry | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const [isIndustryPopoverOpen2, setIsIndustryPopoverOpen2] = useState(false);
  const [industrySearch2, setIndustrySearch2] = useState('');
  const [selectedTest, setSelectedTest] = useState('');


  useEffect(() => {
    // Initially, load all unique industries
    const allUniqueIndustries = Object.values(industriesByJobType)
      .flat()
      .filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
    setAvailableIndustries(allUniqueIndustries);
  }, []);

  const handleJobTypeChange = (value: string) => {
    setSelectedJobType(value);
    setSelectedIndustry2(null);
    setIndustrySearch2('');
    setSelectedTest(''); // Reset test filter as well

    let visaTypeKey: keyof typeof industriesByJobType | null = null;
    if (value === 'all') {
      const allUniqueIndustries = Object.values(industriesByJobType)
        .flat()
        .filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
      setAvailableIndustries(allUniqueIndustries);
      setSelectedVisaGroup('all');
      return;
    } else if (value.includes('Thực tập sinh')) {
      visaTypeKey = 'Thực tập sinh kỹ năng';
    } else if (value.includes('Đặc định')) {
      visaTypeKey = 'Kỹ năng đặc định';
    } else if (value.includes('Kỹ sư')) {
      visaTypeKey = 'Kỹ sư, tri thức';
    }
    
    setSelectedVisaGroup(visaTypeKey);
    setAvailableIndustries(visaTypeKey ? industriesByJobType[visaTypeKey] : []);
  };
  
  const handleIndustrySelect2 = (industry: Industry | null) => {
    setSelectedIndustry2(industry);
    setIndustrySearch2('');
    setIsIndustryPopoverOpen2(false);
  }

  const filteredIndustries2 = industrySearch2
    ? availableIndustries.filter(industry =>
        industry.name.toLowerCase().includes(industrySearch2.toLowerCase()) ||
        industry.keywords.some(k => k.toLowerCase().includes(industrySearch2.toLowerCase()))
      )
    : availableIndustries;


  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white pt-20 md:pt-28 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
              Tìm việc làm tại Nhật Bản
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/80">
             Chúng tôi không chỉ cung cấp việc làm, mà còn đào tạo tư duy và xây dựng lộ trình phát triển sự nghiệp (SWR) rõ ràng, giúp bạn từ lao động phổ thông trở thành chuyên gia lành nghề.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-[-6rem] md:mt-4 relative z-10">
            <Card className="max-w-6xl mx-auto shadow-2xl">
                <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="search-type" className="text-foreground">Chi tiết loại hình visa</Label>
                        <Select onValueChange={handleJobTypeChange} defaultValue="all">
                            <SelectTrigger id="search-type">
                            <SelectValue placeholder="Tất cả loại hình" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">Tất cả loại hình</SelectItem>
                            {japanJobTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="search-test" className="text-foreground">Ngành nghề 2</Label>
                        <Popover open={isIndustryPopoverOpen2} onOpenChange={setIsIndustryPopoverOpen2}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isIndustryPopoverOpen2}
                              className="w-full justify-between h-10 font-normal text-muted-foreground"
                              disabled={selectedJobType === 'all'}
                            >
                              {selectedIndustry2?.name || "Tất cả ngành nghề"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput 
                                placeholder="Tìm ngành nghề hoặc công việc..." 
                                value={industrySearch2}
                                onValueChange={setIndustrySearch2}
                              />
                              <CommandList>
                                <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                    onSelect={() => handleIndustrySelect2(null)}
                                    >
                                    <Check className={cn("mr-2 h-4 w-4", !selectedIndustry2 ? "opacity-100" : "opacity-0")}/>
                                    Tất cả ngành nghề
                                    </CommandItem>
                                    {filteredIndustries2.map((industry) => (
                                        <React.Fragment key={industry.slug}>
                                        <CommandItem
                                            onSelect={() => handleIndustrySelect2(industry)}
                                            className="font-semibold"
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", selectedIndustry2?.slug === industry.slug && !industrySearch2 ? "opacity-100" : "opacity-0")} />
                                            {industry.name}
                                        </CommandItem>
                                        {industrySearch2 && industry.keywords.filter(k => k.toLowerCase().includes(industrySearch2.toLowerCase())).map(keyword => (
                                            <CommandItem
                                                key={`${industry.slug}-${keyword}`}
                                                onSelect={() => handleIndustrySelect2(industry)}
                                                className="pl-8"
                                            >
                                                {keyword}
                                            </CommandItem>
                                        ))}
                                        </React.Fragment>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="search-location" className="text-foreground">Địa điểm làm việc</Label>
                        <Select onValueChange={setSelectedLocation}>
                            <SelectTrigger id="search-location">
                            <SelectValue placeholder="Tất cả địa điểm" />
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
                    <div className="md:col-span-3">
                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white text-lg" onClick={onSearch}>
                            <Search className="mr-2 h-5 w-5" /> Tìm kiếm
                        </Button>
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>
    </section>
  );
}


export default function HomeClient() {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full">
        {!isSearching && <SearchModule onSearch={() => setIsSearching(true)} />}
      </div>
      
      <div className="w-full flex-grow">
        {isSearching ? <SearchResults onBack={() => setIsSearching(false)} /> : <MainContent />}
      </div>
    </div>
  );
}

    