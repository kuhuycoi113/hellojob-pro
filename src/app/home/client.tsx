
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
import { MainContent } from '@/components/home/main-content';


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

  type SearchModuleProps = {
      onSearch: (filters: SearchFilters) => void;
      filters: SearchFilters;
      onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  }
  
const SearchModule = ({ onSearch, filters, onFilterChange }: SearchModuleProps) => {
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
  const [availableJobDetails, setAvailableJobDetails] = useState<string[]>([]);

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
  }


  return (
    <section className={cn(
        "w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white transition-all duration-500 pt-20 md:pt-28 pb-10"
    )}>
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
                  <span className="md:hidden whitespace-nowrap">Việc làm Nhật Bản</span>
                  <span className="hidden md:inline">Tìm việc làm tại Nhật Bản</span>
                </h1>
                 <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/80">
                  <span className="md:hidden max-w-xs mx-auto block text-base/relaxed">Trải nghiệm Shopping công việc Thực tập sinh, Kỹ năng đặc định, Kỹ sư tri thức trong Thế giới việc làm HelloJob</span>
                  <span className="hidden md:inline">Nhanh tay khám phá trải nghiệm Shopping công việc từ Thực tập sinh, Kỹ năng đặc định đến Kỹ sư tri thức trong Thế giới việc làm tại Nhật Bản cùng HelloJob ngay thôi nào.</span>
                </p>
            </div>
        </div>
        <div className={cn(
            "container mx-auto px-4 md:px-6 relative z-10",
        )}>
            <Card className="max-w-6xl mx-auto shadow-2xl">
                <div className="p-4 md:p-6">
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
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);

  const handleSearch = (filters: SearchFilters) => {
    const query = new URLSearchParams();
    if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
    if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
    if (filters.location && filters.location !== 'all') query.set('location', filters.location);
    
    // If no filters are selected, navigate to /jobs to show all jobs
    router.push(`/jobs?${query.toString()}`);
  };
  
  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      const updatedFilters = {...searchFilters, ...newFilters};
      setSearchFilters(updatedFilters);
  }, [searchFilters]);


  return (
    <div className="flex flex-col items-center min-h-screen">
        <SearchModule onSearch={handleSearch} filters={searchFilters} onFilterChange={handleFilterChange} />
        <div className="w-full flex-grow">
          <MainContent />
        </div>
    </div>
  );
}
