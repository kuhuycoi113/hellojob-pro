

'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen, Search, ChevronsUpDown, Check, GraduationCap, Briefcase, TrendingUp, BookCopy, ArrowRight, MapPin, MapIcon, SlidersHorizontal, ChevronLeft } from 'lucide-react';
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
import { industriesByJobType, type Industry } from "@/lib/industry-data";
import { FilterSidebar } from '@/components/job-search/filter-sidebar';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { locations } from '@/lib/location-data';
import { isWithinInterval, startOfTomorrow, parse } from 'date-fns';


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
    'Thực tập sinh kỹ năng',
    'Kỹ năng đặc định',
    'Kỹ sư, tri thức',
];

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};

const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

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
              <Link href={`/employers/${'emp.id'}`} key={emp.id} className="flex justify-center items-center bg-white">
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
      onSearch: (filters: SearchFilters) => void;
      showHero: boolean;
      filters: SearchFilters;
      onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  }
  
const SearchModule = ({ onSearch, showHero, filters, onFilterChange }: SearchModuleProps) => {
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);

  useEffect(() => {
    // When the hero is hidden (after a search), collapse the search bar by default on mobile.
    if (!showHero) {
      setIsSearchExpanded(false);
    }
  }, [showHero]);

  useEffect(() => {
    const industries = filters.visa ? (industriesByJobType[filters.visa as keyof typeof industriesByJobType] || allIndustries) : allIndustries;
    const uniqueIndustries = Array.from(new Map(industries.map(item => [item.name, item])).values());
    setAvailableIndustries(uniqueIndustries);
    
    if (filters.industry) {
      const selectedIndustryData = allIndustries.find(ind => ind.name === filters.industry);
      setAvailableJobDetails(selectedIndustryData?.keywords || []);
    } else {
      setAvailableJobDetails([]);
    }

  }, [filters.visa, filters.industry]);

  
  const handleVisaDetailChange = (value: string) => {
    const newFilters: Partial<SearchFilters> = { visaDetail: value };
    const parentType = Object.keys(visaDetailsByVisaType).find(key => visaDetailsByVisaType[key].includes(value));
    if (parentType && filters.visa !== parentType) {
        newFilters.visa = parentType;
        newFilters.industry = ''; // Also reset industry if visa type changes
    }
    onFilterChange(newFilters);
  }
  
  const handleSearchClick = () => {
    onSearch(filters);
     if (window.innerWidth < 768) { // md breakpoint
      setIsSearchExpanded(false);
    }
  }

  const searchSummary = [
    filters.visaDetail || filters.visa,
    filters.industry,
    filters.location
  ].filter(Boolean).join(' / ');


  return (
    <section className={cn(
        "w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white transition-all duration-500",
        showHero ? "pt-20 md:pt-28 pb-10" : "pt-8 pb-8 md:pt-12 md:pb-12"
    )}>
        {showHero && (
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
                  <span className="md:hidden whitespace-nowrap">Việc làm Nhật Bản</span>
                  <span className="hidden md:inline">Tìm việc làm tại Nhật Bản</span>
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/80">
                  <span className="md:hidden">Thế giới việc làm Thực tập sinh, Kỹ năng đặc định, Kỹ sư tri thức... cho các bạn Shopping</span>
                  <span className="hidden md:inline">Khám phá trải nghiệm Shopping công việc từ Thực tập sinh, Kỹ năng đặc định đến Kỹ sư tri thức trong Thế giới việc làm tại Nhật Bản cùng HelloJob</span>
                </p>
              </div>
            </div>
        )}
        <div className={cn(
            "container mx-auto px-4 md:px-6 relative z-10",
        )}>
            <Card className="max-w-6xl mx-auto shadow-2xl">
                 {/* Mobile Collapsed View */}
                {!showHero && (
                    <div className="md:hidden p-2">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start text-left h-auto"
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        >
                            <SlidersHorizontal className="h-5 w-5 mr-3 text-muted-foreground"/>
                            <div className="flex-grow">
                                <p className="text-xs text-muted-foreground">Đang lọc theo</p>
                                <p className="font-semibold text-foreground truncate">{searchSummary || 'Tất cả'}</p>
                            </div>
                        </Button>
                    </div>
                )}
                
                {/* Full Search View (Desktop always, Mobile when expanded) */}
                <div className={cn(
                    "p-4 md:p-6",
                    !showHero && !isSearchExpanded ? "hidden md:block" : "block"
                )}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="search-type" className="text-foreground">Chi tiết loại hình visa</Label>
                            <Select onValueChange={handleVisaDetailChange} value={filters.visaDetail}>
                                <SelectTrigger id="search-type">
                                <SelectValue placeholder="Tất cả loại hình" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="all-details">Tất cả loại hình</SelectItem>
                                {japanJobTypes.map(type => (
                                    <SelectGroup key={type}>
                                        <SelectLabel>{type}</SelectLabel>
                                        {(visaDetailsByVisaType[type] || []).map(detail => (
                                            <SelectItem key={detail} value={detail}>{detail}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="search-industry" className="text-foreground">Ngành nghề</Label>
                            <Select onValueChange={(value) => onFilterChange({ industry: value, jobDetail: '' })} value={filters.industry}>
                                <SelectTrigger id="search-industry">
                                    <SelectValue placeholder="Tất cả ngành nghề" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                                    {availableIndustries.map((industry) => (
                                        <SelectItem key={industry.slug} value={industry.name}>
                                            {industry.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="search-location" className="text-foreground">Địa điểm làm việc</Label>
                            <Select onValueChange={(value) => onFilterChange({ location: value })} value={filters.location}>
                                <SelectTrigger id="search-location">
                                <SelectValue placeholder="Tất cả địa điểm" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="all">Tất cả Nhật Bản</SelectItem>
                                    {Object.entries(locations["Nhật Bản"]).map(([region, prefectures]) => (
                                        <SelectGroup key={region}>
                                            <SelectLabel>{region}</SelectLabel>
                                            {region !== 'Hokkaido' && region !== 'Okinawa' && (
                                              <SelectItem value={region}>Toàn bộ vùng {region}</SelectItem>
                                            )}
                                            {(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2 md:col-span-3">
                            <Label className="text-transparent hidden md:block">Tìm kiếm</Label>
                            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white text-lg" onClick={handleSearchClick}>
                                <Search className="mr-2 h-5 w-5" /> Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </section>
  );
}

const initialSearchFilters: SearchFilters = {
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: '', 
    interviewLocation: '', 
    jobDetail: '',
    height: [135, 210],
    weight: [35, 120],
    age: [18, 70],
    basicSalary: '',
    netSalary: '',
    hourlySalary: '',
    annualIncome: '',
    annualBonus: '',
    specialConditions: [],
    languageRequirement: '',
    educationRequirement: '',
    yearsOfExperience: '',
    tattooRequirement: '',
    hepatitisBRequirement: '',
};

export default function HomeClient() {
  const [isSearching, setIsSearching] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);

  const handleSearch = (filters: SearchFilters) => {
    applyFilters(filters);
    setIsSearching(true);
  };
  
  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      const updatedFilters = {...searchFilters, ...newFilters};
      setSearchFilters(updatedFilters);
      if (isSearching) {
        applyFilters(updatedFilters);
      }
  }, [searchFilters, isSearching]);

  const handleResetFilters = useCallback(() => {
    setSearchFilters(initialSearchFilters);
    if(isSearching) {
        applyFilters(initialSearchFilters);
    }
  }, [isSearching]);

  const applyFilters = useCallback((currentFilters: SearchFilters) => {
     const { 
         visa, visaDetail, industry, location, jobDetail, interviewLocation, 
         interviewDate, height, weight, age, basicSalary, netSalary, 
         hourlySalary, annualIncome, annualBonus, specialConditions,
         languageRequirement, educationRequirement, yearsOfExperience, 
         tattooRequirement, hepatitisBRequirement 
    } = currentFilters;
     
    const results = jobData.filter(job => {
        
        let visaMatch = true;
        if (visaDetail && visaDetail !== 'all-details') {
            visaMatch = job.visaDetail === visaDetail;
        } else if (visa && visa !== 'all') {
            visaMatch = job.visaType === visa;
        }

        const industryMatch = !industry || industry === 'all' || (job.industry && job.industry.toLowerCase().includes(industry.toLowerCase()));
        
        const jobDetailMatch = !jobDetail || jobDetail === 'all-details' || (job.title && job.title.toLowerCase().includes(jobDetail.toLowerCase())) || (job.details.description && job.details.description.toLowerCase().includes(jobDetail.toLowerCase()));
        
        let locationMatch = false;
        if (!location || location === 'all') {
            locationMatch = true;
        } else {
            const isRegion = Object.keys(locations['Nhật Bản']).includes(location);
            if (isRegion) {
                const regionPrefectures = locations['Nhật Bản'][location as keyof typeof locations['Nhật Bản']];
                locationMatch = regionPrefectures.some(prefecture => job.workLocation.toLowerCase().includes(prefecture.toLowerCase()));
            } else {
                locationMatch = job.workLocation && job.workLocation.toLowerCase().includes(location.toLowerCase());
            }
        }
        
        const interviewLocationMatch = !interviewLocation || interviewLocation === 'all' || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocation.toLowerCase()));
        
        const interviewDateMatch = (() => {
            if (!interviewDate || interviewDate === 'flexible') return true;
            if (!job.interviewDate) return false;
            
            try {
                const tomorrow = startOfTomorrow();
                const selectedDate = new Date(interviewDate);
                const jobDate = parse(job.interviewDate, 'yyyy-MM-dd', new Date());

                return isWithinInterval(jobDate, { start: tomorrow, end: selectedDate });
            } catch (error) {
                console.error("Error parsing date:", error);
                return false;
            }
        })();

        // Salary filters
        const parseSalary = (salaryStr?: string) => salaryStr ? parseInt(salaryStr.replace(/[^0-9]/g, ''), 10) : 0;
        const basicSalaryMatch = !basicSalary || parseSalary(job.salary.basic) >= parseSalary(basicSalary);
        const netSalaryMatch = !netSalary || parseSalary(job.salary.actual) >= parseSalary(netSalary);
        
        // Age filter
        const ageMatch = (() => {
            if (!age || !job.ageRequirement) return true;
            const [minFilterAge, maxFilterAge] = age;
            const [minJobAge, maxJobAge] = job.ageRequirement.split('-').map(Number);
            return minFilterAge <= maxJobAge && maxFilterAge >= minJobAge;
        })();

        // Special conditions
        const specialConditionsMatch = !specialConditions || specialConditions.length === 0 || specialConditions.every(cond => job.tags.includes(cond));
        
        // Other requirements
        const educationMatch = !educationRequirement || !job.educationRequirement || job.educationRequirement === educationRequirement;
        const languageMatch = !languageRequirement || !job.languageRequirement || job.languageRequirement === languageRequirement;
        const tattooMatch = !tattooRequirement || !job.tattooRequirement || job.tattooRequirement === tattooRequirement;
        const hepatitisBMatch = !hepatitisBRequirement || !job.hepatitisBRequirement || job.hepatitisBRequirement === hepatitisBRequirement;

        return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && interviewDateMatch && basicSalaryMatch && netSalaryMatch && ageMatch && specialConditionsMatch && educationMatch && languageMatch && tattooMatch && hepatitisBMatch;
    });

    setFilteredJobs(results);
  }, []);

  const handleBackToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === '/') {
        e.preventDefault();
        if (isSearching) {
            setIsSearching(false);
            setSearchFilters(initialSearchFilters);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
             window.location.reload();
        }
      }
  }

  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center min-h-screen">
        <SearchModule onSearch={handleSearch} showHero={!isSearching} filters={searchFilters} onFilterChange={handleFilterChange} />
      
      <div className="w-full flex-grow">
        {isSearching ? <SearchResults jobs={filteredJobs} filters={searchFilters} onFilterChange={handleFilterChange} applyFilters={() => applyFilters(searchFilters)} resetFilters={handleResetFilters}/> : <MainContent />}
      </div>
    </div>
  );
}
