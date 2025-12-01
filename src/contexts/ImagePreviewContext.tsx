import { ImageViewer } from "@/lib/image-viewer";
import { createContext, useContext, useState } from "react";

type ImagePreviewContextType = {
    imagePreview: string | null;
    setImagePreview: (imagePreview: string | null) => void
};

const ImagePreviewContext = createContext<ImagePreviewContextType | null>(null);

export const ImagePreviewProvider = ({ children }: any) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    return <ImagePreviewContext.Provider value={{ imagePreview, setImagePreview }}>
        {children}
        <ImageViewer
            isOpen={!!imagePreview}
            onOpenChange={setImagePreview}
            imageUrl={imagePreview}
            alt="Xem ảnh chi tiết"
        />
    </ImagePreviewContext.Provider>
}
export const useImagePreview=()=>{
    const context = useContext(ImagePreviewContext);
    if (!context) throw new Error("ImagePreviewContext must be init");
    return context;
}