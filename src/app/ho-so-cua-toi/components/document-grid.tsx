import { PdfIcon } from "@/components/custom-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, PlusCircle, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const DocumentGrid = ({
    documents,
    docType,
    handleMediaChange,
    onAddClick,
    onRemoveClick,
    isExpanded,
    setIsExpanded,
}: {
    documents: DocumentItem[];
    docType: 'vietnam' | 'japan' | 'other';
    handleMediaChange: (type: 'document', e: React.ChangeEvent<HTMLInputElement>, index: number, docType: 'vietnam' | 'japan' | 'other') => void;
    onAddClick: (docType: 'vietnam' | 'japan' | 'other') => void;
    onRemoveClick: (section: 'documents', index: number, docType: 'vietnam' | 'japan' | 'other') => void;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}) => {
    const visibleCount = isExpanded ? documents.length : 8;
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {documents.slice(0, visibleCount).map((doc, index) => (
                    <Card key={index} className="group relative">
                        <CardContent className="p-2 flex flex-col items-center justify-center aspect-square">
                            {doc.url ? (
                                <Link href={doc.url} target="_blank" className="w-full h-full flex items-center justify-center">
                                    {doc.fileType === 'pdf' ? (
                                        <PdfIcon className="w-12 h-12" />
                                    ) : (
                                        <Image src={doc.url} alt={doc.name.vi} fill className="object-contain p-2" />
                                    )}
                                </Link>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <UploadCloud className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-xs">Tải lên</p>
                                </div>
                            )}
                            <Label htmlFor={`doc-upload-${docType}-${index}`} className="absolute inset-0 cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                <Camera className="h-8 w-8 text-white" />
                            </Label>
                            <Input id={`doc-upload-${docType}-${index}`} type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleMediaChange('document', e, index, docType)} />
                            {!doc.isDefault && (
                                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemoveClick('documents', index, docType)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </CardContent>
                        <p className="text-center text-xs font-semibold text-muted-foreground p-2 truncate">{doc.name.vi}</p>
                    </Card>
                ))}
                <Card className="border-dashed flex items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors" onClick={() => onAddClick(docType)}>
                    <div className="text-center text-muted-foreground">
                        <PlusCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs font-semibold">Thêm giấy tờ</p>
                    </div>
                </Card>
            </div>
            {documents.length > 8 && (
                <div className="text-center mt-4">
                    <Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                </div>
            )}
        </div>
    )
};