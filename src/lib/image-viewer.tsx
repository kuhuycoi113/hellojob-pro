'use client';

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, Download, X, FileImageIcon, FileIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AutoHeightIframe } from '@/components/ui/auto-height-iframe';
import { toast } from '@/hooks/use-toast';

interface ImageViewerProps {
  isOpen: boolean;
  onOpenChange: (open: any) => void;
  imageUrl?: string | null;
  previewType?: 'image' | 'iframe';
  previewData?: any;
  alt?: string;
}

export function ImageViewer({ isOpen, onOpenChange, imageUrl, alt, previewType = 'image', previewData }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  useEffect(()=>{
    console.log(previewType)
  },[previewType])
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

  const handleConvertToPDF = async () => {
    if (!previewData.html) {
      toast({
        variant: "destructive",
        title: "Không có dữ liệu HTML"
      });
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const response = await fetch('/api/public/getJobPDF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent: previewData.htnl, responseType: 'application/pdf' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi từ server: ${response.status} ${errorText}`);
      }

      const pdfBlob = await response.blob();

      // Create a link to download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${previewData.fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Tạo PDF thành công",
        description: "File PDF đã được tải xuống.",
        className: 'bg-green-500 text-white'
      });

    } catch (e) {
      console.error("PDF Generation Error:", e);
      let errorMessage = "Không thể tạo file PDF. Vui lòng thử lại.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      toast({
        variant: "destructive",
        title: "Lỗi khi tải PDF về.",
        description: errorMessage
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }
  const handleConvertToImage = async () => {
    if (!previewData.html) {
      toast({
        variant: "destructive",
        title: "Không có dữ liệu HTML."
      });
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const response = await fetch('/api/public/getJobPDF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent: previewData.html, responseType: 'image/jpeg' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi từ server: ${response.status} ${errorText}`);
      }

      const pdfBlob = await response.blob();

      // Create a link to download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${previewData.fileName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Tạo Ảnh thành công",
        description: "File Ảnh đã được tải xuống.",
        className: 'bg-green-500 text-white'
      });

    } catch (e) {
      console.error("Image Generation Error:", e);
      let errorMessage = "Không thể tạo file Ảnh. Vui lòng thử lại.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      toast({
        variant: "destructive",
        title: "Lỗi khi tải Ảnh về.",
        description: errorMessage
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setTimeout(() => setScale(1), 300); // Reset scale after closing
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-4xl max-h-[100vh] h-[80vh]  p-0 bg-background flex flex-col border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{alt || 'Image Viewer'}</DialogTitle>
        </DialogHeader>
        {(() => {
          switch (previewType) {
            case 'image': {
              return <>
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
              </>
            }

            case 'iframe': {
              return <>
                <div className="relative flex-grow h-full w-full overflow-auto" id='preview-iframe'>
                  <AutoHeightIframe htmlContent={previewData.html} title={previewData.fileName} />
                  <div className='flex justify-between items-center mt-2'>
                    <Button onClick={handleConvertToImage} disabled={isGeneratingPdf} className="bg-accent-orange text-white hover:bg-accent-orange/90">
                      <>
                        <FileImageIcon className="mr-2 h-4 w-4" />
                        Tải xuống ảnh
                      </>
                    </Button>
                    <Button onClick={handleConvertToPDF} disabled={isGeneratingPdf}>
                      {isGeneratingPdf ? 'Đang tạo PDF...' : (
                        <>
                          <FileIcon className="mr-2 h-4 w-4" />
                          Tải xuống PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            }
          }
        })()}
        <DialogClose className="absolute right-2 top-2 rounded-full p-2 bg-background/50 hover:bg-background/80 transition-colors">
          {/* <X className="h-5 w-5" /> */}
          {/* <span className="sr-only">Đóng</span> */}
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
