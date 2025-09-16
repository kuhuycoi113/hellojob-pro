

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { industriesByJobType, type Industry } from "@/lib/industry-data";
import { locations } from '@/lib/location-data';
import type { SearchFilters } from './search-results';

const japanJobTypes = [
    { name: 'Thực tập sinh kỹ năng', slug: 'thuc-tap-sinh-ky-nang' },
    { name: 'Kỹ năng đặc định', slug: 'ky-nang-dac-dinh' },
    { name: 'Kỹ sư, tri thức', slug: 'ky-su-tri-thuc' }
];

const visaDetailsByVisaType: { [key: string]: { name: string, slug: string }[] } = {
    'thuc-tap-sinh-ky-nang': [
        { name: 'Thực tập sinh 3 năm', slug: 'thuc-tap-sinh-3-nam' },
        { name: 'Thực tập sinh 1 năm', slug: 'thuc-tap-sinh-1-nam' },
        { name: 'Thực tập sinh 3 Go', slug: 'thuc-tap-sinh-3-go' }
    ],
    'ky-nang-dac-dinh': [
        { name: 'Đặc định đầu Việt', slug: 'dac-dinh-dau-viet' },
        { name: 'Đặc định đầu Nhật', slug: 'dac-dinh-dau-nhat' },
        { name: 'Đặc định đi mới', slug: 'dac-dinh-di-moi' }
    ],
    'ky-su-tri-thuc': [
        { name: 'Kỹ sư, tri thức đầu Việt', slug: 'ky-su-tri-thuc-dau-viet' },
        { name: 'Kỹ sư, tri thức đầu Nhật', slug: 'ky-su-tri-thuc-dau-nhat' }
    ]
};

const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

type SearchModuleProps = {
    onSearch: (filters: SearchFilters) => void;
    filters: SearchFilters;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    showHero?: boolean;
}

export const SearchModule = ({ onSearch, filters, onFilterChange, showHero = false }: SearchModuleProps) => {
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>(allIndustries);
  const [isSearchExpanded, setIsSearchExpanded] = useState(showHero);

  useEffect(() => {
    // On mobile, if we are not showing the hero (i.e., we are on the results page),
    // the search bar should be collapsed by default.
    if (!showHero && window.innerWidth < 768) {
      setIsSearchExpanded(false);
    } else {
      setIsSearchExpanded(true);
    }
  }, [showHero]);

  useEffect(() => {
    const industries = filters.visa ? (industriesByJobType[filters.visa as keyof typeof industriesByJobType] || allIndustries) : allIndustries;
    const uniqueIndustries = Array.from(new Map(industries.map(item => [item.name, item])).values());
    setAvailableIndustries(uniqueIndustries);
  }, [filters.visa]);

  const handleVisaDetailChange = (value: string) => {
    const newFilters: Partial<SearchFilters> = { visaDetail: value };
    const parentType = Object.keys(visaDetailsByVisaType).find(key => visaDetailsByVisaType[key].some(detail => detail.slug === value));
    
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

  const getFilterName = (slug: string, type: 'visa' | 'visaDetail' | 'industry' | 'location'): string => {
    if (!slug) return '';
    if (type === 'visa') {
      return japanJobTypes.find(j => j.slug === slug)?.name || slug;
    }
    if (type === 'visaDetail') {
      for (const key in visaDetailsByVisaType) {
        const detail = visaDetailsByVisaType[key].find(d => d.slug === slug);
        if (detail) return detail.name;
      }
    }
    if (type === 'industry') {
      return allIndustries.find(i => i.slug === slug)?.name || slug;
    }
    return slug;
  }

  const searchSummaryParts = [
    getFilterName(filters.visaDetail, 'visaDetail') || getFilterName(filters.visa, 'visa'),
    getFilterName(filters.industry, 'industry'),
    ...(Array.isArray(filters.location) ? filters.location.map(l => getFilterName(l, 'location')) : [getFilterName(filters.location, 'location')]),
  ].filter(Boolean);

  let searchSummary = searchSummaryParts.join(' / ');
  if (searchSummary.length > 40) {
      searchSummary = [searchSummaryParts[0], searchSummaryParts[1]].filter(Boolean).join(' / ');
      const locationCount = Array.isArray(filters.location) ? filters.location.length : (filters.location ? 1 : 0);
      if (locationCount > 0) {
          searchSummary += ` / + ${locationCount} địa điểm`;
      }
  }


  return (
    <section className={cn(
        "w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white transition-all duration-500",
        showHero ? "pt-20 md:pt-28 pb-10" : "py-8"
    )}>
      {showHero && (
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
                            <div className="flex-grow min-w-0">
                                <p className="text-xs text-muted-foreground">Đang lọc theo</p>
                                <p className="font-semibold text-foreground truncate">{searchSummary || 'Tất cả'}</p>
                            </div>
                        </Button>
                    </div>
                )}
                
                {/* Full Search View (Desktop always, Mobile when expanded) */}
                <div className={cn(
                    "p-4 md:p-6",
                    isSearchExpanded ? "block" : "hidden md:block"
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
                                {Object.values(japanJobTypes).map(type => (
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
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="search-industry" className="text-foreground">Ngành nghề</Label>
                            <Select onValueChange={(value) => onFilterChange({ industry: value, jobDetail: '' })} value={filters.industry}>
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
                         <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="search-location" className="text-foreground">Địa điểm làm việc</Label>
                            <Select onValueChange={(value) => onFilterChange({ location: value.split(',') })} value={Array.isArray(filters.location) ? filters.location.join(',') : filters.location}>
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
