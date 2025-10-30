import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PlayCircle, PlusCircle, Video } from "lucide-react";
import Image from "next/image";

export const MediaCarousel = ({ items, title }: { items: MediaItem[], title: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center"><Video className="mr-3 text-primary" /> {title}</CardTitle>
            <Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5" /></Button>
        </CardHeader>
        <CardContent>
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                    {items.slice(0, 6).map((item, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-[30%] md:basis-1/3 lg:basis-1/4">
                            <div className="relative group overflow-hidden rounded-lg aspect-[9/16] cursor-pointer">
                                <Image src={item.thumbnail || item.src} alt={item.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item['data-ai-hint']} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle className="h-12 w-12 text-white/80 drop-shadow-lg" />
                                </div>
                                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold drop-shadow-md p-1 bg-black/40 rounded">
                                    {item.alt}
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </CardContent>
    </Card>
);