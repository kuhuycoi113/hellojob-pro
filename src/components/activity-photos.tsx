'use client';

import Image from 'next/image';

const activityImages = [
    "/img/anhgioithieu/congty001.webp",
    "/img/anhgioithieu/congty005.webp",
    "/img/anhgioithieu/khachhang001.webp",
    "/img/anhgioithieu/khachhang002.webp",
    "/img/anhgioithieu/khachhang007.webp",
    "/img/anhgioithieu/khachhang004.webp",
    "/img/anhgioithieu/khachhang009.webp",
    "/img/anhgioithieu/khachhang008.webp",
    "/img/anhgioithieu/laodong002.webp",
    "/img/anhgioithieu/laodong003.webp",
    "/img/anhgioithieu/laodong004.webp",
    "/img/anhgioithieu/laodong005.webp",
    "/img/anhgioithieu/laodong006.webp",
    "/img/anhgioithieu/laodong007.webp",
    "/img/anhgioithieu/nhanvien009.webp",
    "/img/anhgioithieu/laodong009.webp",
    "/img/anhgioithieu/nhanvien008.webp",
    "/img/anhgioithieu/laodong011.webp",
    "/img/anhgioithieu/laodong012.webp",
    "/img/anhgioithieu/laodong013.webp",
    "/img/anhgioithieu/laodong020.webp",
    "/img/anhgioithieu/nhanvien001.webp",
    "/img/anhgioithieu/nhanvien002.webp",
    "/img/anhgioithieu/nhanvien004.webp",
    "/img/anhgioithieu/nhanvien005.webp",
];

interface ActivityPhotosProps {
  id?: string;
  lang?: 'vi' | 'ja' | 'en';
  title_vi?: string;
  subtitle_vi?: string;
  title_ja?: string;
  subtitle_ja?: string;
  title_en?: string;
  subtitle_en?: string;
}

export function ActivityPhotos({ 
    id = 'HINHANHHOATDONG01',
    lang = 'vi',
    title_vi = 'Hình ảnh hoạt động',
    subtitle_vi = 'Những khoảnh khắc đáng nhớ trong hành trình phát triển và kết nối của HelloJob.',
    title_ja = '活動写真',
    subtitle_ja = 'HelloJobの発展と繋がりの思い出の瞬間',
    title_en = 'Activity Photos',
    subtitle_en = "Memorable moments in HelloJob's journey of development and connection.",
}: ActivityPhotosProps) {

  const content = {
    vi: { title: title_vi, subtitle: subtitle_vi, others: `${title_ja} / ${title_en}` },
    ja: { title: title_ja, subtitle: subtitle_ja, others: `${title_vi} / ${title_en}` },
    en: { title: title_en, subtitle: subtitle_en, others: `${title_vi} / ${title_ja}` },
  };

  const currentContent = content[lang];

  return (
    <section id={id} className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold text-primary">{currentContent.title}</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">
              {currentContent.subtitle}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">{currentContent.others}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activityImages.map((src, index) => (
              <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Image
                  src={src}
                  alt={`Hoạt động HelloJob ${index + 1}`}
                  fill
                  className="object-cover"
                  data-ai-hint="team building event"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}
