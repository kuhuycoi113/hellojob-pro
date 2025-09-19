
import { consultants } from './consultant-data';
import type { User } from './chat-data';

export interface Job {
    id: string;
    isRecording: boolean;
    image: {
      src: string;
      type: 'minhhoa' | 'thucte';
    };
    likes: string;
    salary: {
      actual?: string;
      basic: string;
      annualIncome?: string;
      annualBonus?: string;
    };
    title: string;
    support?: string[];
    recruiter: {
      id: string; // Add recruiter ID
      name: string;
      avatar: string;
      company: string;
      mainExpertise?: string;
    };
    status: 'Đang tuyển' | 'Tạm dừng';
    interviewDate: string;
    interviewRounds: number;
    netFee?: string; // Made optional
    target: string;
    backFee?: string;
    tags: string[];
    applicants?: {
        count: number;
        avatars: string[];
    };
    postedTime: string;
    // New detailed fields based on your schema
    visaType?: string;
    visaDetail?: string;
    industry: string;
    workLocation: string;
    interviewLocation?: string;
    gender?: 'Nam' | 'Nữ' | 'Cả nam và nữ';
    quantity: number;
    ageRequirement?: string;
    languageRequirement?: string;
    educationRequirement?: string;
    experienceRequirement?: string;
    yearsOfExperience?: string;
    heightRequirement?: string;
    weightRequirement?: string;
    visionRequirement?: string;
    tattooRequirement?: string;
    hepatitisBRequirement?: string;
    interviewFormat?: string;
    specialConditions?: string;
    details: {
        description: string;
        requirements: string;
        benefits: string;
        videoUrl?: string;
        images?: { src: string; alt: string; dataAiHint: string }[];
    }
}

const industries = ['Chế biến thực phẩm', 'Cơ khí', 'Xây dựng', 'Nông nghiệp', 'Điện tử', 'Dệt may', 'Điều dưỡng', 'Nhà hàng', 'Vận tải', 'Sản xuất, dịch vụ tổng hợp', 'Điện, điện tử', 'Chế tạo Vật liệu', 'Cơ khí, chế tạo máy', 'Ô tô', 'Hàng không', 'Vệ sinh toà nhà', 'Lưu trú, khách sạn'];
const locations = ['Tokyo', 'Osaka', 'Aichi', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo', 'Hiroshima', 'Kyoto', 'Nagano', 'Gifu', 'Ibaraki', 'Miyagi', 'Shizuoka', 'Gunma', 'Tochigi', 'Mie'];
const interviewLocations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Online', 'Tại công ty (Nhật Bản)'];
const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon", "Không yêu cầu"];
const languageLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'Không yêu cầu'];
const tattooOptions = ["Không nhận hình xăm", "Nhận xăm nhỏ (kín)", "Nhận cả xăm to (lộ)"];
const hepBOptions = ["Không nhận viêm gan B", "Nhận viêm gan B (thể tĩnh)"];
const specialConditionsList = ['Lương tốt', 'Tăng ca', 'Công ty uy tín', 'Hỗ trợ nhà ở', 'Bay nhanh', 'Không yêu cầu kinh nghiệm', 'Nhận tuổi cao', 'Hỗ trợ Ginou 2'];


const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};

const jobTitles: { [key: string]: string[] } = {
    'Chế biến thực phẩm': ['Chế biến cơm hộp', 'Đóng gói bánh kẹo', 'Làm sushi', 'Chế biến thủy sản'],
    'Cơ khí': ['Vận hành máy CNC', 'Hàn xì', 'Lắp ráp linh kiện', 'Bảo trì máy móc'],
    'Xây dựng': ['Lắp đặt giàn giáo', 'Hoàn thiện nội thất', 'Lái máy xúc', 'Thợ mộc'],
    'Nông nghiệp': ['Trồng rau nhà kính', 'Chăn nuôi gia cầm', 'Thu hoạch hoa quả', 'Làm nông nghiệp công nghệ cao'],
    'Điện tử': ['Lắp ráp bảng mạch', 'Kiểm tra chất lượng (QC)', 'Vận hành dây chuyền SMT', 'Sửa chữa thiết bị'],
    'Dệt may': ['May công nghiệp', 'Vận hành máy dệt', 'Nhuộm vải', 'Cắt vải tự động'],
    'Điều dưỡng': ['Chăm sóc người cao tuổi', 'Hộ lý tại viện dưỡng lão', 'Hỗ trợ sinh hoạt', 'Nhân viên chăm sóc'],
    'Nhà hàng': ['Phục vụ bàn', 'Phụ bếp', 'Lễ tân nhà hàng', 'Pha chế đồ uống'],
    'Vận tải': ['Lái xe tải', 'Giao nhận hàng hoá', 'Quản lý kho', 'Điều phối viên vận tải'],
    'Sản xuất, dịch vụ tổng hợp': ['Đóng gói công nghiệp', 'Vệ sinh toà nhà', 'Đóng sách', 'Bảo dưỡng ô tô'],
    'Điện, điện tử': ['Lắp ráp thiết bị điện tử', 'Bảo trì hệ thống điện', 'Thi công điện', 'Sản xuất bảng mạch in'],
    'Chế tạo Vật liệu': ['Xử lý nhiệt kim loại', 'Gia công vật liệu composite', 'Kiểm tra vật liệu', 'Vận hành lò nung'],
    'Cơ khí, chế tạo máy': ['Gia công cơ khí chính xác', 'Thiết kế máy', 'Lắp ráp máy công nghiệp', 'Rèn dập kim loại'],
    'Ô tô': ['Sửa chữa ô tô', 'Lắp ráp linh kiện ô tô', 'Sơn ô tô', 'Kiểm định chất lượng xe'],
    'Hàng không': ['Bốc xếp hành lý sân bay', 'Vệ sinh máy bay', 'Phục vụ mặt đất', 'Kiểm tra hàng hoá'],
    'Vệ sinh toà nhà': ['Vệ sinh toà nhà văn phòng', 'Làm sạch công nghiệp', 'Quản lý vệ sinh', 'Làm sạch khách sạn'],
    'Lưu trú, khách sạn': ['Lễ tân khách sạn', 'Nhân viên buồng phòng', 'Phục vụ nhà hàng khách sạn', 'Quản lý ca'],
};

const jobImagePlaceholders: {[key: string]: string} = {
    'Chế biến thực phẩm': '/img/che_bien_thuc_pham.jpg',
    'Cơ khí': '/img/bao_duong_oto.jpg',
    'Xây dựng': '/img/xay_dung.jpg',
    'Nông nghiệp': '/img/nong_nghiep.jpg',
    'Điện tử': '/img/dien_tu.jpg',
    'Dệt may': '/img/det_may.jpg',
    'Điều dưỡng': '/img/dieu_duong.jpg',
    'Nhà hàng': '/img/nha_hang.jpg',
    'Vận tải': `https://picsum.photos/seed/logistics/600/400`,
    'Sản xuất, dịch vụ tổng hợp': `https://picsum.photos/seed/manufacturing/600/400`,
    'Điện, điện tử': '/img/dien_tu.jpg',
    'Chế tạo Vật liệu': `https://picsum.photos/seed/materials/600/400`,
    'Cơ khí, chế tạo máy': '/img/bao_duong_oto.jpg',
    'Ô tô': `https://picsum.photos/seed/automotive/600/400`,
    'Hàng không': `https://picsum.photos/seed/aviation/600/400`,
    'Vệ sinh toà nhà': `https://picsum.photos/seed/cleaning/600/400`,
    'Lưu trú, khách sạn': `https://picsum.photos/seed/hotel/600/400`,
};

const workImagePlaceholders = [
    "/img/vieclam001.webp",
    "/img/vieclam002.webp",
    "/img/vieclam003.webp",
    "/img/vieclam004.webp",
    "/img/vieclam005.webp",
    "/img/vieclam006.webp",
];

const dormitoryImages = [
    "/img/ktx001.jpg",
    "/img/ktx002.jpeg",
    "/img/ktx003.jpeg",
    "/img/ktx004.jpeg",
    "/img/ktx005.jpeg",
    "/img/ktx006.jpeg",
];

const jobVideos = [
    "https://www.youtube.com/embed/Zdo4UksgTn8",
    "https://www.youtube.com/embed/LbfuxUIFmLc",
    "https://www.youtube.com/embed/jGEMuHjF6vU"
];


const existingJobIds = new Set<string>();

const generateUniqueJobId = (index: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let deterministicPart = '';
    let num = index;
    // Create a base-36 like representation of the index to ensure uniqueness and distribution
    for (let i = 0; i < 6; i++) {
        deterministicPart += chars[num % chars.length];
        num = Math.floor(num / chars.length);
    }

    const creationDate = new Date(2024, 7, 1);
    const year = creationDate.getFullYear().toString().slice(-2);
    const month = (creationDate.getMonth() + 1).toString().padStart(2, '0');
    const prefix = year + month;

    const newId = prefix + deterministicPart;
    
    if (existingJobIds.has(newId)) {
        return newId + index; // Fallback to ensure uniqueness
    }
    
    existingJobIds.add(newId);
    return newId;
};

const getRandomItem = <T>(arr: T[], index: number): T => arr[index % arr.length];

const generateRandomJob = (index: number): Job => {
    const industry = getRandomItem(industries, index);
    const visaType = getRandomItem(Object.keys(visaDetailsByVisaType), index);
    const visaDetails = visaDetailsByVisaType[visaType];
    const visaDetail = getRandomItem(visaDetails, index);
    
    const location = getRandomItem(locations, index);
    
    // --- Start of CHIAVIECLAM01 Algorithm ---
    const findMatchingConsultant = () => {
        const lowerCaseIndustry = industry.toLowerCase();
        const lowerCaseVisaType = visaType.toLowerCase();
        const lowerCaseVisaDetail = visaDetail.toLowerCase();
        
        const industryKeywords = [lowerCaseIndustry, industry];
        const visaKeywords = [...visaType.split(' '), ...visaDetail.split(' '), 'tokutei', 'tts'].map(k => k.toLowerCase());
        const allKeywords = [...new Set([...industryKeywords, ...visaKeywords])];

        const expertConsultants = consultants.filter(c => {
            const expertise = c.mainExpertise?.toLowerCase() || '';
            return allKeywords.some(keyword => expertise.includes(keyword));
        });

        if (expertConsultants.length > 0) {
            return expertConsultants[index % expertConsultants.length];
        }

        return consultants[index % consultants.length];
    };
    
    let assignedConsultant = findMatchingConsultant();
    // --- End of CHIAVIECLAM01 Algorithm ---
    
    if (index === 5 || index === 12) {
        assignedConsultant = consultants.find(c => c.id === 'dao-quang-minh') || assignedConsultant;
    }
    
    const recruiter = {
        id: assignedConsultant.id,
        name: assignedConsultant.name,
        avatar: assignedConsultant.avatarUrl,
        mainExpertise: assignedConsultant.mainExpertise,
        company: 'HelloJob'
    };

    const gender = getRandomItem(['Nam', 'Nữ', 'Cả nam và nữ'], index) as 'Nam' | 'Nữ' | 'Cả nam và nữ';
    const quantity = (index % 10) + 1;
    const languageRequirement = getRandomItem(languageLevels, index);
    
    const title = `${getRandomItem(jobTitles[industry as keyof typeof jobTitles] || ['Công việc'], index)}, ${location}, tuyển ${quantity} ${gender}, ${languageRequirement}`;

    const deterministicLikesK = (index * 7) % 10;
    const deterministicLikesHundred = (index * 3) % 10;
    
    const anhViecLamSrc = workImagePlaceholders[index % workImagePlaceholders.length];

    const newJobId = generateUniqueJobId(index);

    const isTTS = visaType.includes('Thực tập sinh');
    const isEngineer = visaType.includes('Kỹ sư');

    return {
        id: newJobId,
        isRecording: index % 5 === 0,
        image: { src: anhViecLamSrc, type: 'thucte' },
        likes: `${deterministicLikesK}k${deterministicLikesHundred}`,
        salary: {
            actual: `${(12 + (index % 10)) * 10000}`,
            basic: `${(18 + (index % 12)) * 10000}`,
            annualIncome: isTTS ? undefined : `Khoảng ${(250 + index % 100)} vạn Yên`,
            annualBonus: isTTS ? undefined : (index % 3 === 0 ? 'Có (1-2 lần/năm)' : 'Không có')
        },
        title: title,
        recruiter: recruiter,
        status: index % 10 === 0 ? 'Tạm dừng' : 'Đang tuyển',
        interviewDate: `2024-08-${(index % 28) + 1}`,
        interviewRounds: (index % 3) + 1,
        netFee: isTTS ? `${80 + (index % 30)}tr` : undefined,
        target: `${(index % 5) + 1}tr`,
        backFee: `${(index % 5) + 1}tr`,
        tags: [industry, visaType.split(' ')[0], gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender],
        postedTime: `10:00 01/08/2024`,
        visaType: visaType,
        visaDetail: visaDetail,
        industry: industry,
        workLocation: location,
        interviewLocation: getRandomItem(interviewLocations, index),
        gender: gender,
        quantity: quantity,
        ageRequirement: `${18 + (index % 5)}-${35 + (index % 15)}`,
        languageRequirement: languageRequirement,
        educationRequirement: isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : getRandomItem(educationLevels, index),
        experienceRequirement: index % 3 === 0 ? 'Không yêu cầu kinh nghiệm' : `Kinh nghiệm ngành ${industry} là một lợi thế`,
        yearsOfExperience: index % 3 === 0 ? 'Không yêu cầu' : '1-2 năm',
        heightRequirement: `Trên ${150 + (index % 15)} cm`,
        weightRequirement: `Trên ${40 + (index % 10)} kg`,
        visionRequirement: 'Thị lực tốt, không mù màu',
        tattooRequirement: getRandomItem(tattooOptions, index),
        hepatitisBRequirement: getRandomItem(hepBOptions, index),
        interviewFormat: 'Phỏng vấn Online',
        specialConditions: Array.from(new Set([
            getRandomItem(specialConditionsList, index),
            getRandomItem(specialConditionsList, index + 1),
        ])).join(', '),
        details: {
            description: `<p>Mô tả chi tiết cho công việc <strong>${title}</strong>. Đây là cơ hội tuyệt vời để làm việc trong một môi trường chuyên nghiệp tại Nhật Bản. Công việc đòi hỏi sự cẩn thận, tỉ mỉ và trách nhiệm cao để đảm bảo chất lượng sản phẩm tốt nhất.</p><ul><li>Chi tiết công việc: ${getRandomItem(jobTitles[industry as keyof typeof jobTitles] || [''], index)}.</li><li>Môi trường làm việc sạch sẽ, hiện đại.</li></ul>`,
            requirements: `<ul><li>Yêu cầu: ${isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : 'Tốt nghiệp THPT trở lên'}.</li><li>Sức khỏe tốt, không mắc các bệnh truyền nhiễm theo quy định.</li><li>Chăm chỉ, chịu khó, có tinh thần học hỏi.</li><li>${languageRequirement !== 'Không yêu cầu' ? `Trình độ tiếng Nhật tương đương ${languageRequirement}.` : 'Không yêu cầu tiếng Nhật.'}</li><li>${index % 3 !== 0 ? `Có kinh nghiệm tối thiểu 1 năm trong lĩnh vực ${industry}.` : 'Không yêu cầu kinh nghiệm, sẽ được đào tạo.'}</li></ul>`,
            benefits: `<ul><li>Hưởng đầy đủ chế độ bảo hiểm (y tế, hưu trí, thất nghiệp) theo quy định của pháp luật Nhật Bản.</li><li>Hỗ trợ chi phí nhà ở và đi lại.</li><li>Có nhiều cơ hội làm thêm giờ để tăng thu nhập.</li><li>Được đào tạo bài bản và có cơ hội phát triển, gia hạn hợp đồng lâu dài.</li><li>Thưởng 1-2 lần/năm tùy theo kết quả kinh doanh.</li></ul>`,
            videoUrl: index % 4 === 0 ? getRandomItem(jobVideos, index) : undefined,
            images: index % 3 === 0 ? [
                { src: '/img/donhang1.jpg', alt: 'Mẫu đơn hàng 1', dataAiHint: 'job order form' },
                { src: anhViecLamSrc, alt: 'Tác nghiệp việc làm', dataAiHint: 'workplace action' },
                { src: getRandomItem(dormitoryImages, index), alt: 'Ký túc xá', dataAiHint: 'dormitory room' }
            ] : []
        }
    };
};

export const jobData: Job[] = Array.from({ length: 100 }, (_, i) => generateRandomJob(i));

// Add 20 more jobs for Đào Quang Minh to ensure he has jobs to display
const minh = consultants.find(c => c.id === 'dao-quang-minh');
if (minh) {
    const minhRecruiter = {
        id: minh.id,
        name: minh.name,
        avatar: minh.avatarUrl,
        mainExpertise: minh.mainExpertise,
        company: 'HelloJob'
    };
    const minhIndustries = ['Cơ khí', 'Điện tử', 'Xây dựng', 'Nông nghiệp', 'Chế biến thực phẩm'];

    for (let i = 0; i < 20; i++) {
        const baseIndex = 100 + i;
        const industry = minhIndustries[i % minhIndustries.length];
        const location = locations[baseIndex % locations.length];
        const visaTypeKeys = Object.keys(visaDetailsByVisaType);
        const visaType = visaTypeKeys[baseIndex % visaTypeKeys.length];
        const visaDetails = visaDetailsByVisaType[visaType];
        const visaDetail = visaDetails[baseIndex % visaDetails.length];
        const gender = ['Nam', 'Nữ', 'Cả nam và nữ'][baseIndex % 3] as 'Nam' | 'Nữ' | 'Cả nam và nữ';
        const quantity = (baseIndex % 5) + 1;
        
        const title = `${jobTitles[industry as keyof typeof jobTitles][baseIndex % 4]}, ${location}, ${quantity} ${gender}`;
        const newJobId = generateUniqueJobId(baseIndex);
        const anhViecLamSrc = workImagePlaceholders[baseIndex % workImagePlaceholders.length];

        const newJob: Job = {
            id: newJobId,
            isRecording: baseIndex % 5 === 0,
            image: { src: anhViecLamSrc, type: 'thucte' },
            likes: `${(baseIndex * 2) % 10}k${(baseIndex * 4) % 10}`,
            salary: {
                actual: `${(13 + (baseIndex % 10)) * 10000}`,
                basic: `${(19 + (baseIndex % 12)) * 10000}`,
            },
            title: title,
            recruiter: minhRecruiter,
            status: 'Đang tuyển',
            interviewDate: `2024-08-${(baseIndex % 28) + 1}`,
            interviewRounds: (baseIndex % 3) + 1,
            netFee: visaType.includes('Thực tập sinh') ? `${80 + (baseIndex % 20)}tr` : undefined,
            target: `${(baseIndex % 5) + 1}tr`,
            backFee: `${(baseIndex % 5) + 1}tr`,
            tags: [industry, visaType.split(' ')[0], gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender],
            postedTime: `10:00 01/08/2024`,
            visaType: visaType,
            visaDetail: visaDetail,
            industry: industry,
            workLocation: location,
            interviewLocation: 'Hà Nội hoặc TP.HCM',
            gender: gender,
            quantity: quantity,
            ageRequirement: `${18 + (baseIndex % 5)}-${35 + (baseIndex % 10)}`,
            languageRequirement: 'Tiếng Nhật N4',
            educationRequirement: 'Tốt nghiệp THPT trở lên',
            experienceRequirement: 'Không yêu cầu kinh nghiệm',
            yearsOfExperience: 'Không yêu cầu',
            heightRequirement: `Trên ${150 + (baseIndex % 10)} cm`,
            weightRequirement: `Trên ${45 + (baseIndex % 5)} kg`,
            visionRequirement: 'Thị lực tốt',
            tattooRequirement: 'Không yêu cầu',
            hepatitisBRequirement: 'Không yêu cầu',
            interviewFormat: 'Phỏng vấn Online',
            specialConditions: 'Chăm chỉ, chịu khó.',
            details: {
                description: `<p>Mô tả chi tiết cho công việc <strong>${title}</strong>. Công việc dành cho ứng viên muốn làm việc trong ngành ${industry}.</p>`,
                requirements: `<ul><li>Yêu cầu: Tốt nghiệp THPT trở lên.</li><li>Có sức khỏe tốt.</li></ul>`,
                benefits: `<ul><li>Hưởng đầy đủ chế độ bảo hiểm theo quy định.</li><li>Hỗ trợ chi phí nhà ở.</li></ul>`,
                videoUrl: baseIndex % 4 === 0 ? jobVideos[baseIndex % jobVideos.length] : undefined,
                images: [
                     { src: '/img/donhang1.jpg', alt: 'Mẫu đơn hàng 1', dataAiHint: 'job order form' },
                    { src: anhViecLamSrc, alt: 'Tác nghiệp việc làm', dataAiHint: 'workplace action' },
                    { src: dormitoryImages[baseIndex % dormitoryImages.length], alt: 'Ký túc xá', dataAiHint: 'dormitory room' }
                ]
            }
        };
        jobData.push(newJob);
    }
}
