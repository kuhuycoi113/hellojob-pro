

'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters, experienceYears } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { allJapanLocations, japanRegions, interviewLocations } from '@/lib/location-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';
import { industriesByJobType, type Industry, allIndustries } from '@/lib/industry-data';
import { visaDetailsByVisaType, japanJobTypes, allSpecialConditions, workShifts, otherSkills, dominantHands, educationLevels, languageLevels, englishLevels, tattooRequirements, visionRequirements } from '@/lib/visa-data';
import { recommendJobs } from '@/ai/flows/recommend-jobs-flow';
import { JsonLdScript } from '@/components/json-ld-script';


const initialSearchFilters: SearchFilters = {
    q: '',
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: [], 
    interviewLocation: '', 
    jobDetail: '',
    experienceRequirement: '',
    gender: '',
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
    englishRequirement: '',
    educationRequirement: '',
    yearsOfExperience: '',
    tattooRequirement: '',
    netFee: '',
    netFeeNoTicket: '',
    quantity: '',
    interviewRounds: '',
    interviewDate: '',
    interviewDateType: 'until',
    visionRequirement: 'all',
    dominantHand: '',
    otherSkillRequirement: [],
    companyArrivalTime: '',
    workShift: '',
};

const keyMap: { [key: string]: string } = {
  q: 'q',
  visa: 'loai-visa',
  visaDetail: 'chi-tiet-loai-hinh-visa',
  industry: 'nganh-nghe',
  location: 'dia-diem',
  interviewLocation: 'dia-diem-phong-van',
  jobDetail: 'chi-tiet-cong-viec',
  gender: 'gioi-tinh',
  age: 'do-tuoi',
  height: 'chieu-cao',
  weight: 'can-nang',
  basicSalary: 'luong-co-ban',
  netSalary: 'luong-thuc-linh',
  hourlySalary: 'luong-gio',
  annualIncome: 'thu-nhap-nam',
  annualBonus: 'thuong-nam',
  specialConditions: 'dieu-kien-dac-biet',
  languageRequirement: 'yeu-cau-tieng-nhat',
  englishRequirement: 'yeu-cau-tieng-anh',
  educationRequirement: 'hoc-van',
  experienceRequirement: 'yeu-cau-kinh-nghiem',
  yearsOfExperience: 'so-nam-kinh-nghiem',
  tattooRequirement: 'hinh-xam',
  netFee: 'muc-phi',
  netFeeNoTicket: 'muc-phi-khong-ve',
  quantity: 'so-luong',
  interviewRounds: 'so-vong-phong-van',
  interviewDate: 'ngay-phong-van',
  interviewDateType: 'loai-ngay-phong-van',
  visionRequirement: 'yeu-cau-thi-luc',
  dominantHand: 'tay-thuan',
  otherSkillRequirement: 'yeu-cau-ky-nang-khac',
  companyArrivalTime: 'thoi-diem-ve-cong-ty',
  workShift: 'ca-lam-viec',
  sortBy: 'sap-xep',
};

const reverseKeyMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(keyMap).map(([key, value]) => [value, key])
);

const sortOptionMap: { [key: string]: string } = {
  newest: 'moi-nhat',
  salary_desc: 'luong-co-ban-cao-den-thap',
  salary_asc: 'luong-co-ban-thap-den-cao',
  net_salary_desc: 'thuc-linh-cao-den-thap',
  net_salary_asc: 'thuc-linh-thap-den-cao',
  fee_asc: 'phi-thap-den-cao',
  fee_desc: 'phi-cao-den-thap',
  interview_date_asc: 'phong-van-gan-nhat',
  interview_date_desc: 'phong-van-xa-nhat',
  has_image: 'uu-tien-co-anh',
  has_video: 'uu-tien-co-video',
  hot: 'hot-nhat',
  most_applicants: 'nhieu-nguoi-ung-tuyen',
};

const reverseSortOptionMap: { [key: string]: string } = Object.fromEntries(
    Object.entries(sortOptionMap).map(([key, value]) => [value, key])
);


// Helper function to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const createSlug = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
};


const parseSalary = (salaryStr?: string): number | null => {
    if (!salaryStr) return null;
    const numericStr = String(salaryStr).replace(/[^0-9]/g, '');
    const value = parseInt(numericStr, 10);
    return isNaN(value) ? null : value;
};

const parseExperienceToRange = (expStr?: string): [number, number] => {
    if (!expStr || expStr === 'Không yêu cầu') return [0, Infinity];
    
    const cleanedStr = expStr.toLowerCase().replace(',', '.');
    
    if (cleanedStr.startsWith('dưới')) {
        const val = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
        return [0, val];
    }
    if (cleanedStr.startsWith('trên')) {
        const val = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
        return [val, Infinity];
    }
    const parts = cleanedStr.split('-').map(p => parseFloat(p.trim().replace(/[^0-9.]/g, '')));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
    }
    return [0, Infinity]; // Default fallback
};

const parseAgeRequirement = (ageStr?: string): [number, number] | null => {
    if (!ageStr) return null;
    const parts = ageStr.split('-').map(p => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
    }
    return null;
};

const parsePhysicalRequirement = (reqStr?: string): [number, number] => {
    if (!reqStr) return [0, Infinity];
    const cleanedStr = reqStr.toLowerCase();
    const numbers = cleanedStr.match(/\d+/g)?.map(Number) || [];

    if (cleanedStr.includes('trên')) {
        return [numbers[0] || 0, Infinity];
    }
    if (cleanedStr.includes('dưới')) {
        return [0, numbers[0] || Infinity];
    }
    if (numbers.length === 2) {
        return [numbers[0], numbers[1]];
    }
    if (numbers.length === 1) {
        return [numbers[0], numbers[0]]; // Exact match
    }

    return [0, Infinity];
};

export default function JobSearchPageContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const router = useRouter();
    const readOnlySearchParams = useSearchParams();

    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [sortBy, setSortBy] = useState('newest');
    
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [stagedResultCount, setStagedResultCount] = useState<number>(0);
    const [pageTitle, setPageTitle] = useState("Tìm kiếm việc làm tại Nhật Bản");
    const [pageDescription, setPageDescription] = useState("Tìm kiếm hàng ngàn cơ hội việc làm tại Nhật Bản.");
    
    // This effect will run only once on the client to fetch data from Elasticsearch
    // It will replace the mock data logic.
    useEffect(() => {
        async function fetchData() {
            try {
                // In a real application, you would build a query based on `searchParams`
                const response = await fetch('/api/search/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: { match_all: {} } }) // Example: get all jobs
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const results = await response.json();
                
                // Assuming the API returns data in the format { hits: { hits: [...] } }
                // and each hit has a _source property with the job data.
                const jobsFromEs = results.hits.hits.map((hit: any) => hit._source as Job);

                // Here you would run your filtering logic on `jobsFromEs`
                // For now, let's just set the state.
                setFilteredJobs(jobsFromEs);
                setStagedResultCount(jobsFromEs.length);

            } catch (error) {
                console.error("Failed to fetch jobs from Elasticsearch:", error);
                // Fallback to mock data or show an error message
                setFilteredJobs([]);
                setStagedResultCount(0);
            }
        }

        // We don't have an API route yet, so we'll comment this out and keep using mock data for now.
        // fetchData();
    }, []);


    const runFilter = useCallback((filtersToApply: SearchFilters, sortOption: string) => {
        // This entire function's logic will be replaced by an Elasticsearch query
        // For now, it will continue to filter mock data
        
        let results = jobData; // Start with all data
        // ... existing filtering logic on `results` ...
        
        setFilteredJobs(results);
    }, []);

    const countStagedResults = useCallback((filtersToCount: SearchFilters) => {
        // This will also be replaced by an Elasticsearch count query
        const count = jobData.length; // Placeholder
        setStagedResultCount(count);
    }, []);

    useEffect(() => {
        const newFilters: SearchFilters = { ...initialSearchFilters, location: [], specialConditions: [], otherSkillRequirement: [] };
        let sortOption = 'newest';

        for (const [key, value] of readOnlySearchParams.entries()) {
            const internalKey = reverseKeyMap[key] || key;
            if (internalKey === 'sortBy') {
                sortOption = reverseSortOptionMap[value] || 'newest';
            } else if (internalKey === 'location' || internalKey === 'otherSkillRequirement') {
                const currentValues = newFilters[internalKey as 'location' | 'otherSkillRequirement'] || [];
                 // @ts-ignore
                newFilters[internalKey as 'location' | 'otherSkillRequirement'] = [...currentValues, value];
            } else if (internalKey === 'age' || internalKey === 'height' || internalKey === 'weight') {
                const values = readOnlySearchParams.getAll(key);
                if (values.length === 2) {
                     // @ts-ignore
                    newFilters[internalKey] = [parseInt(values[0], 10), parseInt(values[1], 10)];
                }
            } else if (internalKey === 'specialConditions') {
                const currentConditions = newFilters.specialConditions || [];
                const conditionName = allSpecialConditions.find(c => c.slug === value)?.name;
                if (conditionName) {
                    newFilters.specialConditions = [...currentConditions, conditionName];
                }
            } else if (key === 'yoe') { // Legacy key support
                newFilters['yearsOfExperience'] = value;
            } else {
                 if (internalKey in newFilters) {
                    // @ts-ignore
                    newFilters[internalKey] = value;
                 }
            }
        }
        
        setSortBy(sortOption);
        setAppliedFilters(newFilters);
        setStagedFilters(newFilters);
        runFilter(newFilters, sortOption);
        countStagedResults(newFilters);
        
    }, [readOnlySearchParams, runFilter, countStagedResults]);
    
    const handleStagedFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      setStagedFilters(prev => {
          const updated = {...prev, ...newFilters};
          countStagedResults(updated);
          return updated;
      });
    }, [countStagedResults]);

    const handleApplyFilters = useCallback(() => {
        const query = new URLSearchParams();
        Object.entries(stagedFilters).forEach(([key, value]) => {
             const urlKey = keyMap[key] || key;
            if (value && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
                if (key !== 'visa' && !(Array.isArray(value) && value.includes('all'))) {
                    if (Array.isArray(value)) {
                        if (key === 'specialConditions') {
                            value.forEach(item => {
                                const conditionSlug = allSpecialConditions.find(c => c.name === item)?.slug;
                                if (conditionSlug) {
                                    query.append(urlKey, conditionSlug);
                                }
                            });
                        } else {
                            value.forEach(item => query.append(urlKey, String(item)));
                        }
                    } else {
                        query.set(urlKey, String(value));
                    }
                }
            }
        });

        if (sortBy !== 'newest') {
            query.set(keyMap['sortBy'], sortOptionMap[sortBy]);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
    }, [stagedFilters, sortBy, router]);

    const handleSortChange = (value: string) => {
        setSortBy(value);
        const query = new URLSearchParams(readOnlySearchParams.toString());
        if (value === 'newest') {
            query.delete(keyMap['sortBy']);
        } else {
            query.set(keyMap['sortBy'], sortOptionMap[value]);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
    };
  
    const handleResetFilters = useCallback(() => {
        setStagedFilters(initialSearchFilters);
        setSortBy('newest');
        countStagedResults(initialSearchFilters);
        if (readOnlySearchParams.toString() !== '') {
            router.push('/tim-viec-lam');
        } else {
             runFilter(initialSearchFilters, 'newest');
        }
    }, [router, runFilter, countStagedResults, readOnlySearchParams]);
    
    const handleNewSearch = async (filters: SearchFilters) => {
        const query = new URLSearchParams();
        
        if (filters.q) {
            const criteria = await recommendJobs(filters.q);
            if (criteria?.industry) query.set(keyMap['industry'], allIndustries.find(i => i.name === criteria.industry)?.slug || '');
            if (criteria?.workLocation) query.set(keyMap['location'], allJapanLocations.find(l => l.name === criteria.workLocation)?.slug || '');
            if (criteria?.visaType) {
                 const visaSlug = japanJobTypes.find(v => v.name === criteria.visaType)?.slug;
                 if(visaSlug) query.set(keyMap['visa'], visaSlug);
            }
             if (criteria?.gender) {
                query.set('gioi-tinh', criteria.gender.toLowerCase() === 'nam' ? 'nam' : 'nu');
            }
            if (criteria?.sortBy) {
                query.set('sap-xep', sortOptionMap['salary_desc']);
            }
            if (!criteria?.industry && !criteria?.workLocation && !criteria?.visaType && !criteria.gender && !criteria.sortBy) {
                query.set('q', filters.q);
            }
        } else {
            if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set(keyMap['visaDetail'], filters.visaDetail);
            if (filters.industry && filters.industry !== 'all') query.set(keyMap['industry'], filters.industry);
            if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
                filters.location.forEach(loc => query.append(keyMap['location'], loc));
            } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
                query.append(keyMap['location'], filters.location);
            }
        }
        
        router.push(`/tim-viec-lam?${query.toString()}`);
    }

    // This effect runs once when the component mounts to set the initial document title
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.title = pageTitle;
            const descEl = document.querySelector('meta[name="description"]');
            if(descEl) {
                descEl.setAttribute('content', pageDescription);
            }
        }
    }, [pageTitle, pageDescription]);


    return (
        <div className="flex flex-col">
            <JsonLdScript 
                jobList={filteredJobs} 
                pageMetadata={{ title: pageTitle, description: pageDescription }} 
                appliedFilters={appliedFilters}
            />
            <SearchModule 
                onSearch={handleNewSearch} 
                filters={stagedFilters}
                onFilterChange={handleStagedFilterChange} 
            />
            <SearchResults 
                jobs={filteredJobs} 
                filters={stagedFilters}
                appliedFilters={appliedFilters}
                onFilterChange={handleStagedFilterChange} 
                applyFilters={handleApplyFilters} 
                resetFilters={handleResetFilters}
                resultCount={stagedResultCount}
                sortBy={sortBy}
                onSortChange={handleSortChange}
            />
        </div>
    );
}
