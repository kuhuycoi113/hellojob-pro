"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";

import "yet-another-react-lightbox/styles.css";

import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileIcon, ImageIcon } from "lucide-react";
import { FileMimeType } from "./file-mime-type";

interface ImageViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl?: string | null;
  previewType?: "image" | "iframe";
  previewData?: any;
  alt?: string;
}

export function ImageViewer({
  isOpen,
  onOpenChange,
  imageUrl,
  alt,
  previewData,
  previewType = "image"
}: ImageViewerProps) {
  const isMobile = useIsMobile();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


  const handleDownloadImage = async () => {
    debugger
    if (isGeneratingPdf) {
      return;
    }
    if (!imageUrl) return toast({ title: "Đã xảy ra lỗi.", variant: "destructive" });
    try {
      setIsGeneratingPdf(true);

      if (isMobile &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([], "")] })) {
        try {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const ext = FileMimeType[blob.type] ?? 'jpg';
          const file = new File([blob], `Đơn hàng.${ext}`, {
            type: blob.type,
          });
          await navigator.share({
            files: [file],
            title: 'Lưu hoặc tải về ảnh đơn hàng',
            text: `Lưu hoặc tải về ảnh đơn hàng`
          });
        } catch (error) {
          console.error("Error sharing image:", error);
        }
      } else {
        const a = document.createElement("a");
        a.href = imageUrl;
        const paths = imageUrl.split('.');
        a.download = `download.jpg`;
        a.click();
        toast({ title: "Tải Ảnh thành công", className: "bg-green-500 text-white" });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  // ---------------- Generate PDF ----------------
  const handleConvertToPDF = async () => {
    if (isGeneratingPdf) {
      return;
    }
    if (!previewData?.html) return toast({ title: "Không có dữ liệu HTML.", variant: "destructive" });

    try {
      setIsGeneratingPdf(true);
      const res = await fetch("/api/public/getJobPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: previewData.html, responseType: "application/pdf" })
      });

      const blob = await res.blob();
      if (isMobile &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([], "")] })) {
        const file = new File([blob], `${previewData.fileName}.pdf`, {
          type: "application/pdf",
        });
        try {
          await navigator.share({
            files: [file],
            title: previewData.fileName,
            text: `Lưu hoặc tải về PDF đơn hàng: ${previewData.fileName}`
          });
        } catch (error) {
          console.error("Error sharing image:", error);
        }
      } else {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${previewData.fileName}.pdf`;
        a.click();

        URL.revokeObjectURL(url);
        toast({ title: "Tải PDF thành công", className: "bg-green-500 text-white" });
      }
    } catch (e) {
      toast({ title: "Lỗi khi tạo PDF", variant: "destructive" });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ---------------- Generate IMAGE ----------------
  const handleConvertToImage = async () => {
    if (isGeneratingPdf) {
      return;
    }
    if (!previewData?.html) return toast({ title: "Không có dữ liệu HTML", variant: "destructive" });

    try {
      setIsGeneratingPdf(true);
      const res = await fetch("/api/public/getJobPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: previewData.html, responseType: "image/jpeg" })
      });

      const blob = await res.blob();
      if (isMobile &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([], "")] })) {
        const file = new File([blob], `${previewData.fileName}.jpg`, {
          type: "image/jpeg",
        });
        try {
          await navigator.share({
            files: [file],
            title: previewData.fileName,
            text: `Lưu hoặc tải về ảnh đơn hàng: ${previewData.fileName}`
          });
        } catch (error) {
          console.error("Error sharing image:", error);
        }
      } else {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${previewData.fileName}.jpg`;
        a.click();

        URL.revokeObjectURL(url);
        toast({ title: "Tạo ảnh thành công", className: "bg-green-500 text-white" });
      }
    } catch (e) {
      toast({ title: "Lỗi khi tạo ảnh", variant: "destructive" });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ---------------- Slides convert từ props ----------------
  const slides = useMemo(() => {
    if (previewType === "image" && imageUrl)
      return [{ src: imageUrl }];

    if (previewType === "iframe" && previewData?.html)
      return [{
        type: "html",
        html: previewData.html
      }];

    return [];
  }, [previewType, imageUrl, previewData, alt]);

  // ---------------- Lắng event từ iframe để gọi download thực ----------------
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data === "download-image") handleConvertToImage();
      if (e.data === "download-pdf") handleConvertToPDF();
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [previewData]);

  if (!imageUrl && previewType === "image") return null;
  if (!slides.length) return null;

  return (
    <Lightbox
      open={isOpen}
      close={() => onOpenChange(false)}
      slides={slides as any}
      carousel={{finite:false,preload:0}}
      plugins={previewType === 'image' ? [Zoom, Captions, Download, Fullscreen] : [Download, Fullscreen]}
      download={{
        download({ slide, saveAs }) {
          return;
        },
      }}
      render={{
        slide: ({ slide }: any) => slide.type === "html" ? (
          <div className="w-full h-full pt-[50px]">
            <iframe srcDoc={previewData.html}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                overflow: 'auto'
              }}>
            </iframe>
          </div>
        ) : undefined,
        buttonDownload: () => {
          switch (previewType) {
            case 'image': {
              return <>
                <button onClick={handleDownloadImage} type="button" title="Download" aria-label="Download" className="yarl__button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" className="yarl__icon"><g fill="currentColor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z"></path></g></svg></button>
              </>
            }
            case 'iframe': {
              return <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" title="Download" aria-label="Download" className="yarl__button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" className="yarl__icon"><g fill="currentColor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z"></path></g></svg></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="hover:text-white cursor-pointer" onClick={handleConvertToImage}>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Tải Ảnh
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:text-white cursor-pointer" onClick={handleConvertToPDF}>
                      <FileIcon className="mr-2 h-4 w-4" />
                      Tải PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            }
          }
        }

        // toolbar: ({ close }) => (
        //   <div className="flex items-center gap-2 px-4 py-2 text-white">
        //     {previewType === "image" && <>
        //       <Button variant="secondary" size="icon" onClick={handleDownload}><Download/></Button>
        //     </>}

        //     {previewType === "iframe" && <>
        //       <Button onClick={handleConvertToImage} disabled={isGeneratingPdf}>
        //         <FileImageIcon className="mr-1"/>Ảnh
        //       </Button>
        //       <Button onClick={handleConvertToPDF} disabled={isGeneratingPdf}>
        //         <FileIcon className="mr-1"/>{isGeneratingPdf?"Đang tạo...":"PDF"}
        //       </Button>
        //     </>}

        //     <Button variant="secondary" size="icon" onClick={close}>✕</Button>
        //   </div>
        // )
      }}
    />
  );
}
