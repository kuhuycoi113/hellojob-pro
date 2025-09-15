
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, FileSignature, Mic, Users, School, FileText, Building, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';


const steps = [
  { text: 'Tìm hiểu các đơn hàng', icon: Search, href: '/jobs' },
  { text: 'Đăng ký ứng tuyển', icon: FileSignature, href: '/candidate-profile' },
  { text: 'Đào tạo phỏng vấn', icon: Mic, href: '/learn' },
  { text: 'Phỏng vấn đơn hàng', icon: Users, href: '#' },
  { text: 'Đào tạo sau trúng tuyển', icon: School, href: '/learn' },
  { text: 'Xử lý hồ sơ xin visa', icon: FileText, href: '#' },
  { text: 'Vào công ty làm việc', icon: Building, href: '#' },
  { text: 'Đào tạo & Thăng tiến', icon: TrendingUp, href: '/roadmap' },
];

export const ProgressTracker = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleStepUpdate = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    toast({
      title: "Cập nhật thành công!",
      description: `Tiến độ của bạn đã được cập nhật thành: "${steps[stepIndex].text}".`,
    });
  };

  return (
    <Card className="shadow-xl">
        <CardHeader>
             <CardTitle className="text-muted-foreground text-sm font-medium">Hãy chọn tiến độ của bạn để Tư vấn viên nắm được tình hình của bạn</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <div className="w-full overflow-x-auto pb-2">
                <div className="inline-flex items-center space-x-0.5" style={{ minWidth: '100%' }}>
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <button
                                        className={cn(
                                            "flex flex-col items-center text-center p-3 rounded-lg transition-all duration-300 w-36 h-36 justify-center",
                                            index < currentStep ? "bg-green-100/80 text-green-800" :
                                            index === currentStep ? "bg-primary/10 text-primary ring-2 ring-primary" :
                                            "bg-secondary text-muted-foreground",
                                            "hover:shadow-md hover:-translate-y-1"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2",
                                            index < currentStep ? "bg-green-200 border-green-300" :
                                            index === currentStep ? "bg-primary/20 border-primary" :
                                            "bg-gray-200 border-gray-300"
                                        )}>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-semibold leading-tight">{step.text}</p>
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận cập nhật tiến độ</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bạn có chắc muốn cập nhật tiến độ của mình thành "{step.text}"?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Không</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleStepUpdate(index)}>Có</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {index < steps.length - 1 && (
                                <ChevronRight className="h-8 w-8 text-border flex-shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
  );
};
