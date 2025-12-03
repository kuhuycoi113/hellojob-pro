import { ImageViewer } from "@/lib/image-viewer";
import { createContext, useContext, useState } from "react";

type ImagePreviewContextType = {
    imagePreview: string | null;
    setImagePreview: (imagePreview: string | null) => void;
    setPreviewData: (previewData: any) => void;
    setPreviewType: (previewType: 'image' | 'iframe') => void;
};

const ImagePreviewContext = createContext<ImagePreviewContextType | null>(null);

export const ImagePreviewProvider = ({ children }: any) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<'image' | 'iframe'>('image');
    return <ImagePreviewContext.Provider value={{ imagePreview, setImagePreview, setPreviewData, setPreviewType }}>
        {children}
        <ImageViewer
            isOpen={!!imagePreview || previewType==='iframe'}
            onOpenChange={(open) => {
                if (!open) {
                    setImagePreview(null);
                    setPreviewData(null);
                    setPreviewType('image');
                }
            }}
            imageUrl={imagePreview}
            previewData={previewData}
            previewType={previewType}
            alt="Xem ảnh chi tiết"
        />
    </ImagePreviewContext.Provider>
}
export const useImagePreview = () => {
    const context = useContext(ImagePreviewContext);
    if (!context) throw new Error("ImagePreviewContext must be init");
    return context;
}