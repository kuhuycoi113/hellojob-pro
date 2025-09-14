

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
  PopoverAnchor,
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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [test6Value, setTest6Value] = useState("");
  const [openTest6Popover, setOpenTest6Popover] = useState(false);

  const test6Suggestions = ['A', 'B', 'C'];

  const filteredTest6Suggestions = React.useMemo(() => {
    if (!test6Value) {
        return test6Suggestions;
    }
    const lowercasedValue = test6Value.toLowerCase();
    return test6Suggestions.filter(item => item.toLowerCase().includes(lowercasedValue));
  }, [test6Value, test6Suggestions]);
  

  const handleSelectTest6Suggestion = (suggestion: string) => {
    setTest6Value(suggestion);
    setOpenTest6Popover(false);
  }

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
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="search-type" className="text-foreground">Chi tiết loại hình visa</Label>
                        <Select onValueChange={setSelectedJobType} defaultValue="all">
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
                        <Label htmlFor="search-test6" className="text-foreground">Test 6</Label>
                        <Popover open={openTest6Popover} onOpenChange={setOpenTest6Popover}>
                            <PopoverAnchor>
                                <Command>
                                    <CommandInput 
                                        id="search-test6"
                                        placeholder="Gõ tìm kiếm" 
                                        className="h-10"
                                        value={test6Value}
                                        onValueChange={setTest6Value}
                                        onFocus={() => setOpenTest6Popover(true)}
                                    />
                                    <PopoverContent 
                                        className="p-0 w-[--radix-popover-trigger-width]" 
                                        onOpenAutoFocus={(e) => e.preventDefault()}
                                    >
                                        <CommandList>
                                            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                                            <CommandGroup heading="Gợi ý">
                                                {filteredTest6Suggestions.map((suggestion) => (
                                                    <CommandItem
                                                        key={suggestion}
                                                        onSelect={() => handleSelectTest6Suggestion(suggestion)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                test6Value === suggestion ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {suggestion}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </PopoverContent>
                                </Command>
                            </PopoverAnchor>
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
                    <div className="md:col-span-2">
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
