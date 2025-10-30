import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ImageIcon, PlusCircle } from "lucide-react";
import Image from "next/image";
export const BodyPhotosCarousel = ({ items, translation, onImageChange }: { items: MediaItem[], translation: any, onImageChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center"><ImageIcon className="mr-3 text-primary" /> {translation.bodyPhotos}</CardTitle>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5" /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật ảnh hình thể</DialogTitle>
                        <DialogDescription>Tải lên các ảnh theo yêu cầu để hoàn thiện hồ sơ.</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                    {items.map((item, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <div className="space-y-2">
                                <div className="relative group aspect-[3/4] rounded-lg overflow-hidden border">
                                    <Image src={item.src} alt={item.alt} fill className="object-cover" data-ai-hint={item['data-ai-hint']} />
                                    <Label htmlFor={`image-upload-${index}`} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="h-8 w-8 text-white" />
                                    </Label>
                                    <Input id={`image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => onImageChange(e, index)} />
                                </div>
                                <p className="text-center text-sm font-semibold text-muted-foreground">{item.alt}</p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </CardContent>
    </Card>
)