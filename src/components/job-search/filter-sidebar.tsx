
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { industriesByJobType } from "@/lib/industry-data";
import { Briefcase, Check, DollarSign, Dna, MapPin, SlidersHorizontal, Star, UserSearch, Weight, Building, FileText, Calendar, Camera, Ruler } from "lucide-react";
import { locations } from "@/lib/location-data";

const japanJobTypes = [
    'Thực tập sinh kỹ năng',
    'Kỹ năng đặc định',
    'Kỹ sư, tri thức'
];

const specialConditions = [
    'Hỗ trợ Ginou 2', 'Hỗ trợ chỗ ở', 'Cặp đôi', 'Lương tốt', 'Tăng ca', 'Có thưởng', 'Nợ phí', 'Bay nhanh', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Không yêu cầu kinh nghiệm', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Nhận visa katsudo'
];
const languageLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'Không yêu cầu'];
const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon", "Không yêu cầu"];
const experienceYears = [
    'Không yêu cầu',
    'Dưới 0,5 năm',
    '0,5 - 1 năm',
    '1 - 1,5 năm',
    '1,5 - 2 năm',
    '2 - 2,5 năm',
    '2,5 - 3 năm',
    '3 - 3,5 năm',
    '3,5 - 4 năm',
    '4 - 4,5 năm',
    '4,5 - 5 năm',
    'Trên 5 năm'
];
const allIndustries = Object.values(industriesByJobType).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
const interviewFormats = ["Phỏng vấn trực tiếp", "Phỏng vấn Online", "Phỏng vấn trực tiếp và Online"];

export const FilterSidebar = () => {
    return (
        <div className="md:col-span-1 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><SlidersHorizontal/> Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={['salary', 'jobType', 'location', 'requirements', 'specialConditions', 'industry']} className="w-full">
                        
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
                                {Object.keys(industriesByJobType).filter(k => k !== 'Default').map(item => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <Checkbox id={`type-${item}`} />
                                        <Label htmlFor={`type-${item}`} className="font-normal cursor-pointer">{item}</Label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="industry">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><Building className="h-5 w-5"/>Ngành nghề</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-4">
                               <Select><SelectTrigger><SelectValue placeholder="Chọn ngành nghề"/></SelectTrigger><SelectContent className="max-h-60"><SelectItem value="all">Tất cả ngành nghề</SelectItem>{allIndustries.map(ind => <SelectItem key={ind.slug} value={ind.slug}>{ind.name}</SelectItem>)}</SelectContent></Select>
                            </AccordionContent>
                        </AccordionItem>


                         <AccordionItem value="location">
                            <AccordionTrigger className="text-base font-semibold">
                                <span className="flex items-center gap-2"><MapPin className="h-5 w-5"/>Địa điểm</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Nơi làm việc (Nhật Bản)</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger><SelectContent className="max-h-60"><SelectItem value="all">Tất cả Nhật Bản</SelectItem>{Object.entries(locations['Nhật Bản']).map(([region, prefectures]) => (<SelectGroup key={region}><SelectLabel>{region}</SelectLabel>{(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectGroup>))}</SelectContent></Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Nơi phỏng vấn (Việt Nam)</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Chọn tỉnh/thành phố"/></SelectTrigger><SelectContent className="max-h-60"><SelectItem value="all">Tất cả Việt Nam</SelectItem>{locations['Việt Nam'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label htmlFor="age-from">Tuổi từ</Label><Input id="age-from" type="number" placeholder="18" /></div>
                                    <div><Label htmlFor="age-to">đến</Label><Input id="age-to" type="number" placeholder="40" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label htmlFor="height-from">Chiều cao từ (cm)</Label><Input id="height-from" type="number" placeholder="150" /></div>
                                    <div><Label htmlFor="weight-from">Cân nặng từ (kg)</Label><Input id="weight-from" type="number" placeholder="45" /></div>
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
                                    <Label>Hình thức phỏng vấn</Label>
                                    <Select><SelectTrigger className="mt-2"><SelectValue placeholder="Chọn hình thức"/></SelectTrigger><SelectContent>{interviewFormats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
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
                                         <div className="flex items-center space-x-2">
                                            <Checkbox id="cond-vision" />
                                            <Label htmlFor="cond-vision" className="font-normal cursor-pointer text-sm flex items-center gap-1.5"><Camera className="h-4 w-4 text-blue-500"/>Không cận thị</Label>
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
