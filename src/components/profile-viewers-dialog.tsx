
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ProfileViewersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockViewers = [
  { id: 1, name: 'Công ty TNHH Samsung Display', avatar: 'https://placehold.co/40x40.png?text=S', time: '2 giờ trước' },
  { id: 2, name: 'Nghiệp đoàn Esuhai', avatar: 'https://placehold.co/40x40.png?text=E', time: 'Hôm qua' },
  { id: 3, name: 'Công ty Cổ phần Vinfast', avatar: 'https://placehold.co/40x40.png?text=V', time: '3 ngày trước' },
  { id: 4, name: 'Công ty TNHH Hoàng Long CMS', avatar: 'https://placehold.co/40x40.png?text=H', time: '1 tuần trước' },
  { id: 5, name: 'Công ty TNHH ABC', avatar: 'https://placehold.co/40x40.png?text=A', time: '2 tuần trước' },
  { id: 6, name: 'Công ty TNHH XYZ', avatar: 'https://placehold.co/40x40.png?text=X', time: '1 tháng trước' },
];

export function ProfileViewersDialog({ isOpen, onClose }: ProfileViewersDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nhà tuyển dụng đã xem hồ sơ</DialogTitle>
          <DialogDescription>
            Đây là danh sách các công ty và nghiệp đoàn đã xem hồ sơ của bạn gần đây.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {mockViewers.map((viewer) => (
                <Link href="#" key={viewer.id} className="block">
                    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={viewer.avatar} />
                            <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold">{viewer.name}</p>
                            <p className="text-xs text-muted-foreground">{viewer.time}</p>
                        </div>
                        <Badge variant="outline">Xem hồ sơ</Badge>
                    </div>
                </Link>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
