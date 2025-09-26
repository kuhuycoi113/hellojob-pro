
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { HardHat, UserCheck, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisaTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (visaType: string) => void;
  onBack: () => void;
}

const visaTypes = [
  { 
    id: 'tts', 
    icon: HardHat, 
    title: 'Thực tập sinh kỹ năng', 
    desc: 'Chương trình dành cho lao động phổ thông, đào tạo kỹ năng tại Nhật Bản.',
    color: 'blue'
  },
  { 
    id: 'tokutei', 
    icon: UserCheck, 
    title: 'Kỹ năng đặc định', 
    desc: 'Lao động có kinh nghiệm làm việc dài hạn.',
    color: 'yellow'
  },
  { 
    id: 'engineer', 
    icon: Briefcase, 
    title: 'Kỹ sư, tri thức', 
    desc: 'Chuyên gia có trình độ cao, bằng cấp chuyên ngành.',
    color: 'green'
  },
];

const iconColors = {
    blue: 'bg-blue-100 text-blue-500',
    yellow: 'bg-yellow-100 text-yellow-500',
    green: 'bg-green-100 text-green-500',
}

export function VisaTypeDialog({ isOpen, onOpenChange, onSelect, onBack }: VisaTypeDialogProps) {
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);

  const handleSelect = (visaId: string) => {
    setSelectedVisa(visaId);
    // In a real scenario, you'd likely go to the next step
    onSelect(visaId); 
    onOpenChange(false); // Close dialog on selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" id="NTD003">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Bạn muốn tuyển loại Visa nào?</DialogTitle>
          <DialogDescription className="text-center">
            Hãy chọn loại visa phù hợp với nhu cầu tuyển dụng của bạn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {visaTypes.map((visa) => (
                <Card 
                    key={visa.id} 
                    onClick={() => handleSelect(visa.id)}
                    className={cn(
                        "text-center p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center",
                        selectedVisa === visa.id && "ring-2 ring-primary border-primary"
                    )}
                >
                    <div className={cn("rounded-full p-3 w-fit mb-4", iconColors[visa.color as keyof typeof iconColors])}>
                        <visa.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{visa.title}</h3>
                    <p className="text-muted-foreground text-sm flex-grow">{visa.desc}</p>
                </Card>
            ))}
        </div>

        <div className="mt-6 text-center">
            <Button variant="ghost" onClick={onBack}>Quay lại</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
