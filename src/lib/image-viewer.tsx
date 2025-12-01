'use client';

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, Download, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  isOpen: boolean;
  onOpenChange: (open: any) => void;
  imageUrl?: string | null;
  alt?: string;
}

export function ImageViewer({ isOpen, onOpenChange, imageUrl, alt }: ImageViewerProps) {
  const [scale, setScale] = useState(1);

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setTimeout(() => setScale(1), 300); // Reset scale after closing
        onOpenChange(null);
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[100vh] h-[80vh]  p-0 bg-background flex flex-col border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{alt || 'Image Viewer'}</DialogTitle>
        </DialogHeader>
        <div className="relative flex-grow h-full w-full overflow-auto">
          <Image
            src={imageUrl}
            alt={alt || 'Image'}
            fill
            objectFit='contain'
            className="object-contain transition-transform duration-300"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
        <div className="flex items-center justify-center gap-2 p-4 bg-background/80 backdrop-blur-sm border-t">
          <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
            <ZoomOut />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.2))}>
            <ZoomIn />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download />
          </Button>
        </div>
        <DialogClose className="absolute right-2 top-2 rounded-full p-2 bg-background/50 hover:bg-background/80 transition-colors">
          {/* <X className="h-5 w-5" /> */}
          {/* <span className="sr-only">Đóng</span> */}
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
