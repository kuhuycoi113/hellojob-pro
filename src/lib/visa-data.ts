// src/lib/visa-data.ts

export interface VisaType {
    name: string;
    slug: string;
}

export interface VisaDetail {
    name: string;
    slug: string;
}

export const japanJobTypes: VisaType[] = [
    { name: 'Thực tập sinh kỹ năng', slug: 'thuc-tap-sinh-ky-nang' },
    { name: 'Kỹ năng đặc định', slug: 'ky-nang-dac-dinh' },
    { name: 'Kỹ sư, tri thức', slug: 'ky-su-tri-thuc' }
];

export const visaDetailsByVisaType: { [key: string]: VisaDetail[] } = {
    'thuc-tap-sinh-ky-nang': [
        { name: 'Thực tập sinh 3 năm', slug: 'thuc-tap-sinh-3-nam' },
        { name: 'Thực tập sinh 1 năm', slug: 'thuc-tap-sinh-1-nam' },
        { name: 'Thực tập sinh 3 Go', slug: 'thuc-tap-sinh-3-go' }
    ],
    'ky-nang-dac-dinh': [
        { name: 'Đặc định đầu Việt', slug: 'dac-dinh-dau-viet' },
        { name: 'Đặc định đầu Nhật', slug: 'dac-dinh-dau-nhat' },
        { name: 'Đặc định đi mới', slug: 'dac-dinh-di-moi' }
    ],
    'ky-su-tri-thuc': [
        { name: 'Kỹ sư, tri thức đầu Việt', slug: 'ky-su-tri-thuc-dau-viet' },
        { name: 'Kỹ sư, tri thức đầu Nhật', slug: 'ky-su-tri-thuc-dau-nhat' }
    ]
};
