'use client';
import { JobCard } from '@/components/job-card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Loader2, Pencil, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { EditAspirationsDialog } from './edit-aspirations-dialog';
import { CandidateProfile } from '@/ai/schemas';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EmptyProfileView } from "./empty-profile-view";
import { visaDetailsByVisaType } from "@/lib/visa-data";
import { industriesByJobType } from "@/lib/industry-data";
import { useAuth } from '@/contexts/AuthContext';
import { notFound } from 'next/navigation';
import { updateProfile } from '@/actions/user-action';

export const SuggestedJobs: React.FC<{ highlight: string | null }> = ({ highlight }) => {
    const { role, user } = useAuth();
    if (!user) {
        return notFound();
    }
    const [suggestedJobs, setSuggestedJobs] = React.useState<any[]>([]);
    const [visibleJobsCount, setVisibleJobsCount] = useState(8);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [feeButtonText, setFeeButtonText] = useState('Phí thấp');
    const [companyButtonText, setCompanyButtonText] = useState('Công ty uy tín');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [isLoadingBehavioral, setIsLoadingBehavioral] = useState(true); // CANHANHOA01
    const [isAspirationsDialogOpen, setIsAspirationsDialogOpen] = useState(false);
    const [tempAspirations, setTempAspirations] = useState<Partial<CandidateProfile['aspirations'] & { educationRequirement?: string, languageRequirement?: string, yearsOfExperience?: string, specialConditions?: string[] }>>({});
    const [suggestionPrinciple, setSuggestionPrinciple] = useState<'basicSalary' | 'fee' | 'realSalary' | null>(null);
    const [tempFee, setTempFee] = useState('');
    const JPY_VND_RATE = 180;
    const USD_VND_RATE = 26300;
    const getFeePlaceholder = () => {
        switch (suggestionPrinciple) {
            case 'basicSalary':
                return '200,000'
            case 'realSalary':
                return '150,000'
            default: {
                const visaDetail = tempAspirations.visaDetail;
                if (visaDetail === 'Thực tập sinh 1 năm') return "1000";
                if (visaDetail === 'Đặc định đầu Việt') return "1600";
                return "3000";
            }

        }
    };

    const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let num = parseInt(rawValue.replace(/[,.]/g, ''), 10);

        if (isNaN(num)) {
            setTempFee('');
            return;
        }

        const visaDetail = tempAspirations.visaDetail;
        let limit = 3800; // Default limit
        switch (suggestionPrinciple) {
            case 'basicSalary':
            case 'realSalary': {
                limit = 1000000;
                break;
            }
            default: {
                if (visaDetail === 'Thực tập sinh 1 năm') limit = 1400;
                if (visaDetail === 'Đặc định đầu Việt') limit = 2500;
                break;
            }
        }
        if (num > limit) {
            num = limit;
        }

        setTempFee(String(num));
    };

    const getFeeDisplayValue = () => {
        if (tempFee?.length) {
            const num = Number(tempFee.replace(/[^0-9]/g, ''));
            if (isNaN(num)) return '';
            return num.toLocaleString('en-US');
        }
        let value = null;
        switch (suggestionPrinciple) {
            case 'basicSalary':
                value = tempAspirations.basicSalary || 0;
                break;
            case 'realSalary':
                value = tempAspirations.realSalary || 0;
                break;
            case 'fee':
                value = tempAspirations.fee || 0;
                break;
        }
        if (!value) return '';
        if (isNaN(value)) return '';
        return value.toLocaleString('en-US');
    };

    const getConvertedFeeValue = (value: string) => {
        const num = Number(value);
        if (isNaN(num) || num === 0) return '≈ 0 triệu VNĐ';
        const rate = suggestionPrinciple === 'fee' ? USD_VND_RATE : JPY_VND_RATE;
        const vndValue = num * rate;
        const valueInMillions = vndValue / 1000000;
        const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        return `≈ ${formattedVnd.replace('.', ',')} triệu VNĐ`;
    };


    if (role === 'candidate-empty-profile') {
        return <EmptyProfileView />;
    }


    const openEditAspirationsDialog = () => {
        const aspirations = user.aspirations;
        if (aspirations) {
            setTempAspirations({ ...aspirations });
        }
        setIsAspirationsDialogOpen(true);
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prev => prev + 8);
            setIsLoadingMore(false);
        }, 500); // Simulate network delay
    };



    const handleSaveAspirations = async () => {
        try {
            console.log(tempAspirations);
            await updateProfile(user.uid, { aspirations: { ...tempAspirations } });
            setIsAspirationsDialogOpen(false);
            toast({
                title: 'Cập nhật nguyện vọng thành công!',
                description: 'Thông tin nguyện vọng của bạn đã được lưu. Nội dung việc làm sẽ được hiển thị theo nguyện vọng của bạn.',
                className: 'bg-green-500 text-white'
            });
        }catch (error) {
            toast({
                title: 'Cập nhật nguyện vọng thất bại!',
                description: 'Đã xảy ra lỗi khi lưu thông tin nguyện vọng của bạn. Vui lòng thử lại.',
                className: 'bg-red-500 text-white'
            });
        }
        // const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
        // let profile = storedProfileRaw ? JSON.parse(storedProfileRaw) : {};
        // profile = {
        //     ...profile,
        //     aspirations: tempAspirations
        // };
        // localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
        // if (suggestionPrinciple) {
        //     localStorage.setItem('suggestionPrinciple', suggestionPrinciple);
        // } else {
        //     localStorage.removeItem('suggestionPrinciple');
        // }
        // localStorage.setItem('suggestionType', suggestionType);
        // console.log("Suggestion principle saved:", suggestionPrinciple);
        // console.log("Suggestion type saved:", suggestionType);
        // setIsAspirationsDialogOpen(false);
        // setForceUpdate(prev => prev + 1); // Trigger a re-fetch
    };
    const handleSaveFee = () => {
        let num = null;
        if (tempFee) {
            num = parseInt(tempFee.replace(/[,.]/g, ''), 10)
        }
        setTempAspirations(prev => ({ ...prev, [suggestionPrinciple || '']: num }));
        setTempFee('');
        setSuggestionPrinciple(null);
        toast({
            title: `Đã cập nhật ${suggestionPrinciple === 'fee' ? 'phí' : suggestionPrinciple === 'basicSalary' ? 'lương cơ bản' : suggestionPrinciple === 'realSalary' ? 'lương thực nhận' : ''} mong muốn`,
            description: `Mức ${suggestionPrinciple === 'fee' ? 'phí tối đa' : suggestionPrinciple === 'basicSalary' ? 'lương cơ bản tối thiểu' : suggestionPrinciple === 'realSalary' ? 'lương thực nhận tối thiểu' : ''} mới là ${parseInt(tempFee || '0').toLocaleString('en-US')} USD.`,
        });
    };
    // Logic for the Fee Dialog (MPMM01)

    const visaDetailsOptions: { [key: string]: { name: string, slug: string }[] } = visaDetailsByVisaType;
    const visaTypes = Object.keys(visaDetailsByVisaType);
    const availableIndustries = tempAspirations.visa ? (industriesByJobType[tempAspirations.visa as keyof typeof industriesByJobType] || []) : Object.values(industriesByJobType).flat();

    const educationLevels = ["Không yêu cầu", "Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon"];
    const languageLevels = ["Không yêu cầu", "N5", "N4", "N3", "N2", "N1"];
    const experienceYears = ['Không yêu cầu', 'Dưới 1 năm', '1-2 năm', '2-3 năm', 'Trên 3 năm'];
    const allSpecialConditions = ['Lương tốt', 'Tăng ca', 'Công ty uy tín', 'Hỗ trợ nhà ở', 'Bay nhanh'];
    return (<>
        <AccordionItem value="item-1" className={cn(
            "border-b-0 transition-all duration-500 ease-in-out",
            highlight === 'suggested' ? "ring-2 ring-accent-orange ring-offset-2 shadow-2xl rounded-lg bg-accent-orange/10" : "border rounded-lg"
        )}>
            <div className="flex items-center bg-background px-6 rounded-t-lg hover:no-underline">
                <AccordionTrigger className="flex-grow py-4 font-semibold text-base">
                    <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Gợi ý cho bạn</span>
                        <Badge>{isLoadingSuggestions ? '...' : suggestedJobs?.length}</Badge>
                    </div>
                </AccordionTrigger>
                <Button
                    id="highlight-target-button"
                    variant="default"
                    size="sm"
                    className="ml-auto flex-shrink-0"
                    onClick={(e) => { e.stopPropagation(); openEditAspirationsDialog(); }}
                >
                    <span className="hidden sm:inline">Sửa gợi ý</span>
                    <Pencil className="h-4 w-4 sm:ml-2" />
                </Button>
            </div>
            <AccordionContent className="bg-background p-6 rounded-b-lg">
                {isLoadingSuggestions ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-28 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : suggestedJobs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {suggestedJobs.slice(0, visibleJobsCount).map((job) => (<JobCard key={job.id} job={job} showRecruiterName={false} showPostedTime={true} />))}
                        </div>
                        {visibleJobsCount < suggestedJobs.length && (
                            <div className="text-center mt-8">
                                <Button onClick={handleLoadMore} disabled={isLoadingMore}>
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang tải...
                                        </>
                                    ) : (
                                        'Xem thêm'
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Không tìm thấy công việc nào phù hợp với hồ sơ của bạn.</p>
                        <p className="text-sm mt-2">
                            Hãy thử cập nhật{' '}
                            <button onClick={openEditAspirationsDialog} className="text-primary underline">
                                hồ sơ và nguyện vọng
                            </button>{' '}
                            của bạn.
                        </p>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>

        <EditAspirationsDialog
            isOpen={isAspirationsDialogOpen}
            onOpenChange={setIsAspirationsDialogOpen}
            tempAspirations={tempAspirations}
            setTempAspirations={setTempAspirations}
            suggestionPrinciple={suggestionPrinciple}
            setSuggestionPrinciple={setSuggestionPrinciple}
            feeButtonText={feeButtonText}
            // companyButtonText={companyButtonText}
            handleSaveAspirations={handleSaveAspirations}
        />

        <Dialog open={!!suggestionPrinciple} onOpenChange={() => setSuggestionPrinciple(null)}>
            <DialogContent className="sm:max-w-md">
                {/* MPMM01 */}
                <DialogHeader>
                    <DialogTitle>Mức {suggestionPrinciple === 'fee' ? 'phí' : suggestionPrinciple === 'basicSalary' ? 'lương cơ bản' : 'lương thực lĩnh'} mong muốn</DialogTitle>
                    <DialogDescription>Nhập {suggestionPrinciple === 'fee' ? 'mức phí tối đa bạn sẵn sàng chi trả (USD).' : suggestionPrinciple === 'basicSalary' ? 'mức lương cơ bản tối thiểu mong muốn (JPY).' : 'mức lương thực lĩnh tối thiểu mong muốn (JPY).'}</DialogDescription>
                </DialogHeader>
                <div className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fee-usd">{suggestionPrinciple === 'fee' ? 'Phí tối đa (USD)' : suggestionPrinciple === 'basicSalary' ? 'Lương cơ bản (JPY)' : 'Lương thực lĩnh (JPY)'}</Label>
                        <Input
                            id="fee-usd"
                            type="text"
                            placeholder={getFeePlaceholder()}
                            value={getFeeDisplayValue()}
                            onChange={handleFeeInputChange}
                        />
                        <p className="text-xs text-muted-foreground">{getConvertedFeeValue(tempFee)}</p>
                    </div>
                </div>
                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => setSuggestionPrinciple(null)}>Hủy</Button>
                    <Button onClick={handleSaveFee}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default SuggestedJobs;