
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Briefcase, Users, ArrowRight, BookOpen, Search, MapIcon, GraduationCap, Building, MapPin, TrendingUp, Cpu, ListFilter, ChevronLeft, ChevronsUpDown, Check, SlidersHorizontal, UserSearch, DollarSign, Star, Ruler, Weight, Dna, Loader2, BookCopy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { industriesByJobType, type Industry } from '@/lib/industry-data';
import { jobData } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


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
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  
  const finalSearchTerm = selectedIndustry || searchQuery;

  useEffect(() => {
    let industries: Industry[] = [];
    if (!selectedJobType) {
        // Collect all industries from all types and remove duplicates
        const allIndustries = Object.values(industriesByJobType).flat();
        const uniqueIndustries = Array.from(new Map(allIndustries.map(item => [item['slug'], item])).values());
        industries = uniqueIndustries;
    } else {
        let jobTypeKey: keyof typeof industriesByJobType | 'Default' = 'Default';
        if (selectedJobType.includes('Thực tập sinh')) jobTypeKey = 'Thực tập sinh kỹ năng';
        else if (selectedJobType.includes('Đặc định')) jobTypeKey = 'Kỹ năng đặc định';
        else if (selectedJobType.includes('Kỹ sư, tri thức')) jobTypeKey = 'Kỹ sư, tri thức';
        industries = industriesByJobType[jobTypeKey];
    }
    
    setAvailableIndustries(industries);
    setSelectedIndustry('');
    setSearchQuery('');
  }, [selectedJobType]);


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
                    <div className="md:col-span-4 space-y-2">
                        <Label htmlFor="search-type" className="text-foreground">Loại hình, kỹ năng</Label>
                        <Select onValueChange={setSelectedJobType} value={selectedJobType}>
                            <SelectTrigger id="search-type">
                            <SelectValue placeholder="Chọn loại hình" />
                            </SelectTrigger>
                            <SelectContent>
                            {japanJobTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="search-industry" className="text-foreground">Ngành nghề</Label>
                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={comboboxOpen}
                                    className="w-full justify-between h-10 font-normal text-sm"
                                >
                                    <span className="truncate">{selectedIndustry || "Tất cả ngành nghề"}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Tìm ngành nghề..." />
                                    <CommandList>
                                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                        <CommandGroup>
                                            {availableIndustries.map((industry) => (
                                                <CommandItem
                                                    key={industry.slug}
                                                    value={industry.name}
                                                    onSelect={(currentValue) => {
                                                        setSelectedIndustry(currentValue === selectedIndustry ? "" : industry.name);
                                                        setComboboxOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedIndustry === industry.name ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {industry.name}
                                                </CommandItem>
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

const CompactSearchForm = ({ onBack, searchTerm }: { onBack: () => void, searchTerm: string }) => (
     <div className="bg-primary p-2 md:hidden sticky top-16 z-40 shadow-lg">
        <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto py-2 px-3 bg-background text-foreground hover:bg-background/90"
            onClick={onBack}
        >
            <ChevronLeft className="mr-2 text-muted-foreground"/>
            <div className="flex-grow overflow-hidden">
                <p className="font-bold text-base truncate">{searchTerm || 'Tất cả việc làm'}</p>
                <p className="text-sm text-muted-foreground truncate">Chỉnh sửa tìm kiếm của bạn</p>
            </div>
        </Button>
    </div>
);


type SearchResultsProps = {
    onBack: () => void;
}

const SearchResults = ({ onBack }: SearchResultsProps) => {
    const [visibleJobsCount, setVisibleJobsCount] = useState(24);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreJobs = useCallback(() => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prevCount => Math.min(prevCount + 24, jobData.length));
            setIsLoadingMore(false);
        }, 1000); // Simulate network delay
    }, []);

    const lastJobElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleJobsCount < jobData.length) {
                loadMoreJobs();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoadingMore, loadMoreJobs, visibleJobsCount]);
      
    return (
     <div className="w-full bg-secondary">
        <CompactSearchForm onBack={onBack} searchTerm="Kết quả tìm kiếm" />
        <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
                <div className="hidden md:block">
                  <FilterSidebar />
                </div>

                <div className="md:col-span-3 lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Kết quả ({jobData.length})</h2>
                        <Sheet>
                          <SheetTrigger asChild>
                             <Button variant="ghost" size="sm" className="flex items-center gap-1 md:hidden">
                                <ListFilter className="w-4 h-4" />
                                Lọc
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                              <SheetDescription>
                                Tinh chỉnh kết quả tìm kiếm của bạn.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 h-[calc(100vh-8rem)] overflow-y-auto">
                              <FilterSidebar />
                            </div>
                          </SheetContent>
                        </Sheet>
                        
                         <Select>
                            <SelectTrigger className="w-[180px] hidden md:flex">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Mới nhất</SelectItem>
                                <SelectItem value="salary_desc">Lương cao đến thấp</SelectItem>
                                <SelectItem value="salary_asc">Lương thấp đến cao</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {jobData.slice(0, visibleJobsCount).map((job, index) => {
                          if (index === visibleJobsCount - 1) {
                              return <div ref={lastJobElementRef} key={job.id}><JobCard job={job} /></div>
                          }
                          return <JobCard key={job.id} job={job} />
                      })}
                    </div>
                    {isLoadingMore && (
                        <div className="flex justify-center items-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            </div>
        </div>
     </div>
    )
  };

const FilterSidebar = () => {
    const specialConditions = [
        'Hỗ trợ Ginou 2', 'Hỗ trợ chỗ ở', 'Cặp đôi', 'Lương tốt', 'Tăng ca', 'Có thưởng', 'Nợ phí', 'Bay nhanh', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Không yêu cầu kinh nghiệm', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Nhận visa katsudo'
    ];
    const languageLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'Không yêu cầu'];
    const educationLevels = ["Tốt nghiệp THPT", "Trung cấp", "Cao đẳng", "Đại học", "Senmon", "Không yêu cầu"];
    const experienceYears = ["Không yêu cầu", "Dưới 1 năm", "1-2 năm", "3-5 năm", "Trên 5 năm"];

    return (
        <div className="md:col-span-1 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><SlidersHorizontal/> Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={['salary', 'jobType', 'location', 'requirements', 'specialConditions']} className="w-full">
                        
                        <AccordionItem value="salary">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><DollarSign className="h-5 w-5"/>Mức lương (JPY/tháng)</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <Slider defaultValue={[160000, 300000]} max={500000} step={10000} />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>16万</span>
                                    <span>50万</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="jobType">
                            <AccordionTrigger className="text-base font-semibold">
                                 <span className="flex items-center gap-2"><Briefcase className="h-5 w-5"/>Loại hình công việc</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-4">
                                {japanJobTypes.map(item => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <Checkbox id={`type-${item}`} />
                                        <Label htmlFor={`type-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                         <AccordionItem value="location">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><MapPin className="h-5 w-5"/>Địa điểm</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Nơi làm việc (Nhật Bản)</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger><SelectContent><SelectItem value="all">Tất cả Nhật Bản</SelectItem>{Object.entries(locations['Nhật Bản']).map(([region, prefectures]) => (<SelectGroup key={region}><SelectLabel>{region}</SelectLabel>{(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectGroup>))}</SelectContent></Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Nơi phỏng vấn (Việt Nam)</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger><SelectContent><SelectItem value="all">Tất cả Việt Nam</SelectItem>{locations['Việt Nam'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                         <AccordionItem value="requirements">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><UserSearch className="h-5 w-5"/>Yêu cầu ứng viên</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div>
                                    <Label className="font-semibold">Giới tính</Label>
                                    <div className="flex items-center space-x-4 pt-2">
                                         {['Nam', 'Nữ', 'Cả hai'].map(item => (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox id={`gender-${item}`} />
                                                <Label htmlFor={`gender-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold">Trình độ tiếng Nhật</Label>
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                        {languageLevels.map(item => (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox id={`lang-${item}`} />
                                                <Label htmlFor={`lang-${item}`} className="font-normal cursor-pointer text-xs">{item}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                 <div>
                                    <Label className="font-semibold">Học vấn</Label>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {educationLevels.map(item => (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox id={`edu-${item}`} />
                                                <Label htmlFor={`edu-${item}`} className="font-normal cursor-pointer text-sm">{item}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold">Kinh nghiệm</Label>
                                     <Select>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Chọn số năm kinh nghiệm" /></SelectTrigger>
                                        <SelectContent>
                                            {experienceYears.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="font-semibold">Yêu cầu khác</Label>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="cond-tattoo" />
                                            <Label htmlFor="cond-tattoo" className="font-normal cursor-pointer text-sm flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" />Không xăm</Label>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <Checkbox id="cond-hepatitis" />
                                            <Label htmlFor="cond-hepatitis" className="font-normal cursor-pointer text-sm flex items-center gap-1.5"><Dna className="h-4 w-4 text-red-500"/>Không VGB</Label>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="specialConditions" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">
                               <span className="flex items-center gap-2"><Check className="h-5 w-5"/>Điều kiện đặc biệt</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-4">
                                {specialConditions.map(item => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <Checkbox id={`cond-${item}`} />
                                        <Label htmlFor={`cond-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                     <Button className="w-full bg-primary text-white mt-6">Áp dụng bộ lọc</Button>
                </CardContent>
            </Card>
        </div>
    );
};

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
