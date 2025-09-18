

'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { allJapanLocations, japanRegions, interviewLocations } from '@/lib/location-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';
import { industriesByJobType } from '@/lib/industry-data';
import { visaDetailsByVisaType, japanJobTypes } from '@/lib/visa-data';


const initialSearchFilters: SearchFilters = {
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: [], 
    interviewLocation: '', 
    jobDetail: '',
    experienceRequirement: '', // Ensure this is part of the initial state
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
    educationRequirement: '',
    yearsOfExperience: '',
    tattooRequirement: '',
    hepatitisBRequirement: '',
    quantity: '',
    interviewRounds: '',
    interviewDate: '',
    netFee: '',
};

// Helper function to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const createSlug = (str: string) => {
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


function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(initialSearchFilters);
    
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [stagedResultCount, setStagedResultCount] = useState<number>(jobData.length);
    
    const runFilter = useCallback((filtersToApply: SearchFilters) => {
        const { 
            visa, visaDetail, industry, location, jobDetail, interviewLocation, quantity, netFee, interviewRounds, interviewDate,
            basicSalary, netSalary, hourlySalary, annualIncome, annualBonus, gender, experienceRequirement
        } = filtersToApply;
        
        const visaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name || visaDetail;
        const industryObject = allIndustries.find(i => i.slug === industry);
        const industryName = industryObject?.name || industry;
        
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === interviewLocation)?.name;

        const feeLimit = parseSalary(netFee);
        const roundsSlug = interviewRounds;
        const roundsToMatch = roundsSlug ? parseInt(roundsSlug.split('-')[0], 10) : null;
        
        const basicSalaryMin = parseSalary(basicSalary);
        const netSalaryMin = parseSalary(netSalary);
        const hourlySalaryMin = parseSalary(hourlySalary);
        const annualIncomeMin = parseSalary(annualIncome);
        const annualBonusMin = parseSalary(annualBonus);

        let results = jobData.filter(job => {
            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (visa && visa !== 'all') {
                const targetVisaTypeObject = japanJobTypes.find(v => v.slug === visa);
                visaMatch = job.visaType === targetVisaTypeObject?.name;
            }

            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry === industryName);

            const jobDetailMatch = !jobDetail || (job.title && createSlug(job.title).includes(jobDetail)) || (job.details.description && createSlug(job.details.description).includes(jobDetail));
            
            const experienceMatch = !experienceRequirement || (job.experienceRequirement && createSlug(job.experienceRequirement).includes(experienceRequirement));
            
            let locationMatch = true;
            if (Array.isArray(location) && location.length > 0 && !location.includes('all')) {
                locationMatch = location.some(locSlug => {
                    const region = japanRegions.find(r => r.slug === locSlug);
                    if (region) {
                        return region.prefectures.some(p => job.workLocation.toLowerCase().includes(p.name.toLowerCase()));
                    }
                    const locationName = allJapanLocations.find(l => l.slug === locSlug)?.name;
                    return locationName ? job.workLocation && job.workLocation.toLowerCase().includes(locationName.toLowerCase()) : false;
                });
            }
            
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));

            const quantityMatch = !quantity || job.quantity >= parseInt(quantity, 10);

            const feeMatch = feeLimit === null || !job.netFee || (parseSalary(job.netFee) || 0) <= feeLimit;

            const roundsMatch = !roundsToMatch || job.interviewRounds === roundsToMatch;

            const interviewDateMatch = !interviewDate || interviewDate === 'flexible' || (job.interviewDate && job.interviewDate <= interviewDate);
            
            const jobBasicSalary = parseSalary(job.salary.basic);
            const basicSalaryMatch = basicSalaryMin === null || (jobBasicSalary !== null && jobBasicSalary >= basicSalaryMin);

            const jobNetSalary = parseSalary(job.salary.actual);
            const netSalaryMatch = netSalaryMin === null || (jobNetSalary !== null && jobNetSalary >= netSalaryMin);

            const hourlySalaryMatch = hourlySalaryMin === null;

            const jobAnnualIncome = parseSalary(job.salary.annualIncome);
            const annualIncomeMatch = annualIncomeMin === null || (jobAnnualIncome !== null && jobAnnualIncome >= annualIncomeMin);

            const jobAnnualBonus = parseSalary(job.salary.annualBonus);
            const annualBonusMatch = annualBonusMin === null || (jobAnnualBonus !== null && jobAnnualBonus >= annualBonusMin);
            
            let genderMatch = true;
            if (gender) {
                const targetGender = gender === 'nam' ? 'Nam' : 'Nữ';
                genderMatch = job.gender === targetGender || job.gender === 'Cả nam và nữ';
            }

            return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && quantityMatch && feeMatch && roundsMatch && interviewDateMatch && basicSalaryMatch && netSalaryMatch && hourlySalaryMatch && annualIncomeMatch && annualBonusMatch && genderMatch && experienceMatch;
        });

        setFilteredJobs(results);
    }, []);

    const countStagedResults = useCallback((filtersToCount: SearchFilters) => {
        const { 
            visa, visaDetail, industry, location, jobDetail, interviewLocation, quantity, netFee, interviewRounds, interviewDate,
            basicSalary, netSalary, hourlySalary, annualIncome, annualBonus, gender, experienceRequirement
        } = filtersToCount;
        
        const industryObject = allIndustries.find(i => i.slug === industry);
        const industryName = industryObject?.name || industry;
        
        const feeLimit = parseSalary(netFee);
        
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === interviewLocation)?.name;
        
        const roundsSlug = interviewRounds;
        const roundsToMatch = roundsSlug ? parseInt(roundsSlug.split('-')[0], 10) : null;
        
        const basicSalaryMin = parseSalary(basicSalary);
        const netSalaryMin = parseSalary(netSalary);
        const hourlySalaryMin = parseSalary(hourlySalary);
        const annualIncomeMin = parseSalary(annualIncome);
        const annualBonusMin = parseSalary(annualBonus);
        
        const count = jobData.filter(job => {
            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (visa && visa !== 'all') {
                 const targetVisaTypeObject = japanJobTypes.find(v => v.slug === visa);
                 visaMatch = job.visaType === targetVisaTypeObject?.name;
            }
            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry === industryName);

            const jobDetailMatch = !jobDetail || (job.title && createSlug(job.title).includes(jobDetail)) || (job.details.description && createSlug(job.details.description).includes(jobDetail));

            const experienceMatch = !experienceRequirement || (job.experienceRequirement && createSlug(job.experienceRequirement).includes(experienceRequirement));
            
             let locationMatch = true;
            if (Array.isArray(location) && location.length > 0 && !location.includes('all')) {
                 locationMatch = location.some(locSlug => {
                    const region = japanRegions.find(r => r.slug === locSlug);
                    if (region) {
                        return region.prefectures.some(p => job.workLocation.toLowerCase().includes(p.name.toLowerCase()));
                    }
                    const locationName = allJapanLocations.find(l => l.slug === locSlug)?.name;
                    return locationName ? job.workLocation && job.workLocation.toLowerCase().includes(locationName.toLowerCase()) : false;
                });
            }
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));
            const quantityMatch = !quantity || job.quantity >= parseInt(quantity, 10);
            const feeMatch = feeLimit === null || !job.netFee || (parseSalary(job.netFee) || 0) <= feeLimit;
            const roundsMatch = !roundsToMatch || job.interviewRounds === roundsToMatch;
            const interviewDateMatch = !interviewDate || interviewDate === 'flexible' || (job.interviewDate && job.interviewDate <= interviewDate);

            const jobBasicSalary = parseSalary(job.salary.basic);
            const basicSalaryMatch = basicSalaryMin === null || (jobBasicSalary !== null && jobBasicSalary >= basicSalaryMin);

            const jobNetSalary = parseSalary(job.salary.actual);
            const netSalaryMatch = netSalaryMin === null || (jobNetSalary !== null && jobNetSalary >= netSalaryMin);

            const hourlySalaryMatch = hourlySalaryMin === null;

            const jobAnnualIncome = parseSalary(job.salary.annualIncome);
            const annualIncomeMatch = annualIncomeMin === null || (jobAnnualIncome !== null && jobAnnualIncome >= annualIncomeMin);

            const jobAnnualBonus = parseSalary(job.salary.annualBonus);
            const annualBonusMatch = annualBonusMin === null || (jobAnnualBonus !== null && jobAnnualBonus >= annualBonusMin);
            
            let genderMatch = true;
            if (gender) {
                const targetGender = gender === 'nam' ? 'Nam' : 'Nữ';
                genderMatch = job.gender === targetGender || job.gender === 'Cả nam và nữ';
            }

            return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && quantityMatch && feeMatch && roundsMatch && interviewDateMatch && basicSalaryMatch && netSalaryMatch && hourlySalaryMatch && annualIncomeMatch && annualBonusMatch && genderMatch && experienceMatch;
        }).length;
        setStagedResultCount(count);
    }, []);

    useEffect(() => {
        const newFilters: SearchFilters = { ...initialSearchFilters };
        for (const [key, value] of searchParams.entries()) {
            if (key === 'location' || key === 'specialConditions') {
                const currentValues = newFilters[key as 'location' | 'specialConditions'] || [];
                // @ts-ignore
                newFilters[key] = [...currentValues, value];
            } else if (key === 'age' || key === 'height' || key === 'weight') {
                const values = searchParams.getAll(key);
                if (values.length === 2) {
                     // @ts-ignore
                    newFilters[key] = [parseInt(values[0], 10), parseInt(values[1], 10)];
                }
            } else {
                 // @ts-ignore
                newFilters[key] = value;
            }
        }
        setAppliedFilters(newFilters);
        setStagedFilters(newFilters);
        runFilter(newFilters);
        countStagedResults(newFilters);
        
    }, [searchParams, runFilter, countStagedResults]);
    
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
            if (value && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
                 if (key !== 'visa' && !(Array.isArray(value) && value.includes('all'))) {
                    if (Array.isArray(value)) {
                        value.forEach(item => query.append(key, String(item)));
                    } else {
                        query.set(key, String(value));
                    }
                 }
            }
        });
        router.push(`/jobs?${query.toString()}`);
    }, [stagedFilters, router]);
  
    const handleResetFilters = useCallback(() => {
        setStagedFilters(initialSearchFilters);
        countStagedResults(initialSearchFilters);
        if (searchParams.toString() !== '') {
            router.push('/jobs');
        } else {
             runFilter(initialSearchFilters);
        }
    }, [router, runFilter, countStagedResults, searchParams]);
    
    const handleNewSearch = (filters: SearchFilters) => {
        const query = new URLSearchParams();
        if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
        if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
        if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
            filters.location.forEach(loc => query.append('location', loc));
        } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
            query.append('location', filters.location);
        }
        router.push(`/jobs?${query.toString()}`);
    }

    return (
        <div className="flex flex-col">
            <SearchModule 
                onSearch={handleNewSearch} 
                filters={stagedFilters}
                onFilterChange={handleStagedFilterChange} 
            />
            <SearchResults 
                jobs={filteredJobs} 
                filters={stagedFilters}
                onFilterChange={handleStagedFilterChange} 
                applyFilters={handleApplyFilters} 
                resetFilters={handleResetFilters}
                resultCount={stagedResultCount}
            />
        </div>
    );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary"/>
        </div>
    }>
        <JobsPageContent />
    </Suspense>
  );
}
