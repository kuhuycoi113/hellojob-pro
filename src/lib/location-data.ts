
export type Location = {
  name: string;
  slug: string;
};

export type Region = {
  name: string;
  slug: string;
  prefectures: Location[];
};

export const japanRegions: Region[] = [
    { name: 'Hokkaido', slug: 'hokkaido', prefectures: [{ name: 'Hokkaido', slug: 'hokkaido' }] },
    {
        name: 'Tohoku', slug: 'tohoku', prefectures: [
            { name: 'Aomori', slug: 'aomori' }, { name: 'Iwate', slug: 'iwate' }, { name: 'Miyagi', slug: 'miyagi' },
            { name: 'Akita', slug: 'akita' }, { name: 'Yamagata', slug: 'yamagata' }, { name: 'Fukushima', slug: 'fukushima' }
        ]
    },
    {
        name: 'Kanto', slug: 'kanto', prefectures: [
            { name: 'Ibaraki', slug: 'ibaraki' }, { name: 'Tochigi', slug: 'tochigi' }, { name: 'Gunma', slug: 'gunma' },
            { name: 'Saitama', slug: 'saitama' }, { name: 'Chiba', slug: 'chiba' }, { name: 'Tokyo', slug: 'tokyo' },
            { name: 'Kanagawa', slug: 'kanagawa' }
        ]
    },
    {
        name: 'Chubu', slug: 'chubu', prefectures: [
            { name: 'Niigata', slug: 'niigata' }, { name: 'Toyama', slug: 'toyama' }, { name: 'Ishikawa', slug: 'ishikawa' },
            { name: 'Fukui', slug: 'fukui' }, { name: 'Yamanashi', slug: 'yamanashi' }, { name: 'Nagano', slug: 'nagano' },
            { name: 'Gifu', slug: 'gifu' }, { name: 'Shizuoka', slug: 'shizuoka' }, { name: 'Aichi', slug: 'aichi' }
        ]
    },
    {
        name: 'Kansai', slug: 'kansai', prefectures: [
            { name: 'Mie', slug: 'mie' }, { name: 'Shiga', slug: 'shiga' }, { name: 'Kyoto', slug: 'kyoto' },
            { name: 'Osaka', slug: 'osaka' }, { name: 'Hyogo', slug: 'hyogo' }, { name: 'Nara', slug: 'nara' },
            { name: 'Wakayama', slug: 'wakayama' }
        ]
    },
    {
        name: 'Chugoku', slug: 'chugoku', prefectures: [
            { name: 'Tottori', slug: 'tottori' }, { name: 'Shimane', slug: 'shimane' }, { name: 'Okayama', slug: 'okayama' },
            { name: 'Hiroshima', slug: 'hiroshima' }, { name: 'Yamaguchi', slug: 'yamaguchi' }
        ]
    },
    {
        name: 'Shikoku', slug: 'shikoku', prefectures: [
            { name: 'Tokushima', slug: 'tokushima' }, { name: 'Kagawa', slug: 'kagawa' }, { name: 'Ehime', slug: 'ehime' },
            { name: 'Kochi', slug: 'kochi' }
        ]
    },
    {
        name: 'Kyushu', slug: 'kyushu', prefectures: [
            { name: 'Fukuoka', slug: 'fukuoka' }, { name: 'Saga', slug: 'saga' }, { name: 'Nagasaki', slug: 'nagasaki' },
            { name: 'Kumamoto', slug: 'kumamoto' }, { name: 'Oita', slug: 'oita' }, { name: 'Miyazaki', slug: 'miyazaki' },
            { name: 'Kagoshima', slug: 'kagoshima' }
        ]
    },
    { name: 'Okinawa', slug: 'okinawa', prefectures: [{ name: 'Okinawa', slug: 'okinawa' }] }
];


export const interviewLocations = {
    "Việt Nam": [
        { name: "Hà Nội", slug: "ha-noi" },
        { name: "Thành phố Hồ Chí Minh", slug: "thanh-pho-ho-chi-minh" },
        { name: "Đà Nẵng", slug: "da-nang" },
        { name: "Phỏng vấn Online", slug: "online" }
    ],
    "Nhật Bản": [
        { name: "Phỏng vấn tại Công ty", slug: "tai-cong-ty" },
        { name: "Phỏng vấn Online", slug: "online-jp" }
    ]
};

// Flattened list for easy lookup
export const allJapanLocations: Location[] = japanRegions.flatMap(region => region.prefectures);

// Keep old structure for compatibility where needed, though it's recommended to refactor to use the new structure.
export const locations = {
    "Việt Nam": interviewLocations['Việt Nam'].map(l => l.name),
    "Nhật Bản": japanRegions.reduce((acc, region) => {
        acc[region.name] = region.prefectures.map(p => p.name);
        return acc;
    }, {} as { [key: string]: string[] }),
    "Phỏng vấn tại Nhật Bản": interviewLocations['Nhật Bản'].map(l => l.name)
};
