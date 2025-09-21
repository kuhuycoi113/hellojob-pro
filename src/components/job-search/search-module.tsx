

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { industriesByJobType, type Industry, allIndustries } from "@/lib/industry-data";
import { japanRegions, allJapanLocations } from '@/lib/location-data';
import type { SearchFilters } from './search-results';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { recommendJobs } from '@/ai/flows/recommend-jobs-flow';
import { Loader2 } from 'lucide-react';

type SearchModuleProps = {
    onSearch: (filters: Partial<SearchFilters>) => void;
    filters: Partial<SearchFilters>;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    showHero?: boolean;
}

export const SearchModule = ({ onSearch, showHero = false, filters: initialFilters, onFilterChange: setParentFilters }: SearchModuleProps) => {
  const [filters, setInternalFilters] = useState(initialFilters);
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
  const [isSearchExpanded, setIsSearchExpanded] = useState(showHero);

  useEffect(() => {
    setInternalFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    if (!showHero && window.innerWidth < 768) {
      setIsSearchExpanded(false);
    } else {
      setIsSearchExpanded(true);
    }
  }, [showHero]);

  useEffect(() => {
    const parentVisaSlug = filters.visa || Object.keys(industriesByJobType).find(key => 
        (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === filters.visaDetail)
    );

    const industries = parentVisaSlug ? (industriesByJobType[parentVisaSlug as keyof typeof industriesByJobType] || allIndustries) : allIndustries;
    const uniqueIndustries = Array.from(new Map(industries.map(item => [item.name, item])).values());
    setAvailableIndustries(uniqueIndustries);
  }, [filters.visa, filters.visaDetail]);
  
  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    const newFilters = {...filters, [field]: value};
    setInternalFilters(newFilters);
    setParentFilters(newFilters);
  };

  const handleVisaDetailChange = (value: string) => {
    const newFilters: Partial<SearchFilters> = { visaDetail: value === 'all' ? '' : value };
    const parentTypeSlug = Object.keys(visaDetailsByVisaType).find(key => 
        (visaDetailsByVisaType[key as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === value)
    );
    
    if (parentTypeSlug && filters.visa !== parentTypeSlug) {
        newFilters.visa = parentTypeSlug;
        newFilters.industry = ''; // Also reset industry if visa type changes
    } else if (!value || value === 'all') {
        newFilters.visa = ''; // Clear visa type if no detail is selected
    }

    const updatedFilters = { ...filters, ...newFilters };
    setInternalFilters(updatedFilters);
    setParentFilters(updatedFilters);
  }
  
  const handleSearchClick = () => {
    onSearch(filters);
    if (window.innerWidth < 768) { // md breakpoint
      setIsSearchExpanded(false);
    }
  }

  const searchSummary = [
    (Object.values(visaDetailsByVisaType).flat().find(d => d.slug === filters.visaDetail))?.name,
    (allIndustries.find(i => i.slug === filters.industry))?.name,
    Array.isArray(filters.location) && filters.location.length > 0
        ? filters.location.map(locSlug => allJapanLocations.find(l => l.slug === locSlug)?.name).filter(Boolean).join(', ')
        : null,
    filters.q
  ].filter(Boolean).join(' / ');

  return (
    <section className={cn(
        "w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white transition-all duration-500",
        showHero ? "pt-20 md:pt-28 pb-10" : "py-4"
    )}>
        {showHero && (
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 whitespace-nowrap">
                    <span className="md:hidden">Việc làm Nhật Bản</span>
                    <span className="hidden md:inline">Tìm việc làm tại Nhật Bản</span>
                </h1>
                <p className="text-sm xs:text-base sm:text-lg max-w-3xl mx-auto mb-10 text-white/80 md:hidden">
                 Trải nghiệm Shopping công việc Thực tập sinh, Kỹ năng đặc định, Kỹ sư tri thức trong Thế giới việc làm HelloJob
                </p>
                 <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/80 hidden md:block">
                 Nhanh tay khám phá trải nghiệm Shopping công việc từ Thực tập sinh, Kỹ năng đặc định đến Kỹ sư tri thức trong Thế giới việc làm tại Nhật Bản cùng HelloJob ngay thôi nào.
                </p>
              </div>
            </div>
        )}
        <div className={cn(
            "container mx-auto px-4 md:px-6 relative z-10",
        )}>
            <Card className="max-w-6xl mx-auto shadow-2xl">
                 {!showHero && (
                    <div className="md:hidden p-2">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start text-left h-auto"
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        >
                            <SlidersHorizontal className="h-5 w-5 mr-3 text-muted-foreground"/>
                            <div className="flex-grow min-w-0">
                                <p className="text-xs text-muted-foreground">Đang lọc theo</p>
                                <p className="font-semibold text-foreground truncate">{searchSummary || 'Tất cả'}</p>
                            </div>
                        </Button>
                    </div>
                )}
                
                <div className={cn(
                    "p-4 md:p-6",
                    isSearchExpanded ? "block" : "hidden md:block"
                )}>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2 lg:col-span-1">
                            <Label htmlFor="search-type" className="text-foreground text-sm">Chi tiết loại hình visa</Label>
                            <Select onValueChange={(value) => handleVisaDetailChange(value)} value={filters.visaDetail || 'all'}>
                                <SelectTrigger id="search-type">
                                <SelectValue placeholder="Tất cả loại hình" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="all">Tất cả loại hình</SelectItem>
                                 {japanJobTypes.map(type => (
                                    <SelectGroup key={type.slug}>
                                        <SelectLabel>{type.name}</SelectLabel>
                                        {(visaDetailsByVisaType[type.slug] || []).map(detail => (
                                            <SelectItem key={detail.slug} value={detail.slug}>{detail.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 lg:col-span-1">
                            <Label htmlFor="search-industry" className="text-foreground text-sm">Ngành nghề</Label>
                            <Select onValueChange={(value) => handleFilterChange('industry', value === 'all' ? '' : value)} value={filters.industry || 'all'}>
                                <SelectTrigger id="search-industry">
                                    <SelectValue placeholder="Tất cả ngành nghề" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                                    {availableIndustries.map((industry) => (
                                        <SelectItem key={industry.slug} value={industry.slug}>
                                            {industry.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2 lg:col-span-1">
                            <Label htmlFor="search-location" className="text-foreground text-sm">Địa điểm làm việc</Label>
                            <Select onValueChange={(value) => handleFilterChange('location', value === 'all' ? [] : [value])} value={Array.isArray(filters.location) ? filters.location[0] || 'all' : 'all'}>
                                <SelectTrigger id="search-location">
                                <SelectValue placeholder="Tất cả địa điểm" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="all">Tất cả Nhật Bản</SelectItem>
                                    {japanRegions.map((region) => (
                                        <SelectGroup key={region.slug}>
                                            <SelectLabel>{region.name}</SelectLabel>
                                            {region.slug !== 'hokkaido' && region.slug !== 'okinawa' && (
                                              <SelectItem value={region.slug}>Toàn bộ vùng {region.name}</SelectItem>
                                            )}
                                            {region.prefectures.map(p => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2 lg:col-span-1">
                            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white text-lg h-10" onClick={handleSearchClick}>
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
