
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

const industries = ['Chế biến thực phẩm', 'Cơ khí', 'Xây dựng', 'Nông nghiệp', 'Điện tử', 'Dệt may', 'Điều dưỡng', 'Nhà hàng', 'Vận tải'];
const locations = ['Tokyo', 'Osaka', 'Aichi', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo', 'Hiroshima', 'Kyoto', 'Nagano', 'Gifu', 'Ibaraki', 'Miyagi'];

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};

const jobTitles = {
    'Chế biến thực phẩm': ['Chế biến cơm hộp', 'Đóng gói bánh kẹo', 'Làm sushi', 'Chế biến thủy sản'],
    'Cơ khí': ['Vận hành máy CNC', 'Hàn xì', 'Lắp ráp linh kiện', 'Bảo trì máy móc'],
    'Xây dựng': ['Lắp đặt giàn giáo', 'Hoàn thiện nội thất', 'Lái máy xúc', 'Thợ mộc'],
    'Nông nghiệp': ['Trồng rau nhà kính', 'Chăn nuôi gia cầm', 'Thu hoạch hoa quả', 'Làm nông nghiệp công nghệ cao'],
    'Điện tử': ['Lắp ráp bảng mạch', 'Kiểm tra chất lượng (QC)', 'Vận hành dây chuyền SMT', 'Sửa chữa thiết bị'],
    'Dệt may': ['May công nghiệp', 'Vận hành máy dệt', 'Nhuộm vải', 'Cắt vải tự động'],
    'Điều dưỡng': ['Chăm sóc người cao tuổi', 'Hộ lý tại viện dưỡng lão', 'Hỗ trợ sinh hoạt', 'Nhân viên chăm sóc'],
    'Nhà hàng': ['Phục vụ bàn', 'Phụ bếp', 'Lễ tân nhà hàng', 'Pha chế đồ uống'],
    'Vận tải': ['Lái xe tải', 'Giao nhận hàng hoá', 'Quản lý kho', 'Điều phối viên vận tải']
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
};

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
        // This should not happen with this logic if index is unique
        return newId + index; // Fallback to ensure uniqueness
    }
    
    existingJobIds.add(newId);
    return newId;
};


const generateRandomJob = (index: number): Job => {
    const industry = industries[index % industries.length];
    const visaTypeKeys = Object.keys(visaDetailsByVisaType);
    const visaType = visaTypeKeys[index % visaTypeKeys.length];
    const visaDetails = visaDetailsByVisaType[visaType];
    const visaDetail = visaDetails[index % visaDetails.length];
    
    const location = locations[index % locations.length];
    
    // --- Start of CHIAVIECLAM01 Algorithm ---
    const findMatchingConsultant = () => {
        const lowerCaseIndustry = industry.toLowerCase();
        const lowerCaseVisaType = visaType.toLowerCase();
        const lowerCaseVisaDetail = visaDetail.toLowerCase();
        
        // Keywords to search for in mainExpertise
        const industryKeywords = [lowerCaseIndustry, industry]; // e.g., 'cơ khí'
        const visaKeywords = [
            ...visaType.split(' '), // e.g., ['kỹ', 'năng', 'đặc', 'định']
            ...visaDetail.split(' '), // e.g., ['đặc', 'định', 'đầu', 'việt']
            'tokutei', 'tts', 'thực tập sinh' // common abbreviations
        ].map(k => k.toLowerCase());

        const allKeywords = [...new Set([...industryKeywords, ...visaKeywords])];

        const expertConsultants = consultants.filter(c => {
            const expertise = c.mainExpertise?.toLowerCase() || '';
            return allKeywords.some(keyword => expertise.includes(keyword));
        });

        if (expertConsultants.length > 0) {
            // If experts are found, pick one cyclically to distribute jobs among them
            return expertConsultants[index % expertConsultants.length];
        }

        // If no expert is found, fall back to random assignment
        return consultants[index % consultants.length];
    };
    
    let assignedConsultant = findMatchingConsultant();
     // --- End of CHIAVIECLAM01 Algorithm ---

    // Override for specific consultants on specific indices to ensure they have some jobs
    if (index === 5 || index === 12) { // Assign some jobs to Đào Quang Minh
        assignedConsultant = consultants.find(c => c.id === 'dao-quang-minh') || assignedConsultant;
    }
    
    const recruiter = {
        id: assignedConsultant.id,
        name: assignedConsultant.name,
        avatar: assignedConsultant.avatarUrl,
        mainExpertise: assignedConsultant.mainExpertise,
        company: 'HelloJob'
    };

    const gender = ['Nam', 'Nữ', 'Cả nam và nữ'][index % 3] as 'Nam' | 'Nữ' | 'Cả nam và nữ';
    const quantity = (index % 10) + 1;
    const languageRequirement = index % 4 === 0 ? 'Không yêu cầu' : 'Tiếng Nhật N4';
    
    let title = `${jobTitles[industry as keyof typeof jobTitles][index % 4]}, ${location}, ${quantity} ${gender}`;
    if (languageRequirement !== 'Không yêu cầu') {
        const simplifiedLanguage = languageRequirement.replace('Tiếng Nhật ', '').replace('JLPT ', '');
        title += `, ${simplifiedLanguage}`;
    }

    const deterministicLikesK = (index * 7) % 10;
    const deterministicLikesHundred = (index * 3) % 10;
    const imageSrc = jobImagePlaceholders[industry] || `https://placehold.co/600x400.png?text=${encodeURIComponent(industry)}`;

    const newJobId = generateUniqueJobId(index);


    return {
        id: newJobId,
        isRecording: index % 5 === 0,
        image: { src: imageSrc, type: 'minhhoa' },
        likes: `${deterministicLikesK}k${deterministicLikesHundred}`,
        salary: {
            actual: `${(12 + (index % 10)) * 10000}`,
            basic: `${(18 + (index % 12)) * 10000}`,
            annualIncome: visaType.includes('Thực tập sinh') ? undefined : 'Khoảng ' + (250 + index % 50) + ' vạn Yên',
            annualBonus: visaType.includes('Thực tập sinh') ? undefined : (index % 3 === 0 ? 'Có (1-2 lần/năm)' : 'Không có')
        },
        title: title,
        recruiter: recruiter,
        status: index % 10 === 0 ? 'Tạm dừng' : 'Đang tuyển',
        interviewDate: `2024-08-${(index % 28) + 1}`,
        interviewRounds: (index % 3) + 1,
        netFee: visaType.includes('Thực tập sinh') ? `${90 + (index % 20)}tr` : undefined,
        target: `${(index % 5) + 1}tr`,
        backFee: `${(index % 5) + 1}tr`,
        tags: [industry, visaType.split(' ')[0], gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender],
        postedTime: `10:00 01/08/2024`,
        visaType: visaType,
        visaDetail: visaDetail,
        industry: industry,
        workLocation: location,
        interviewLocation: 'Hà Nội hoặc TP.HCM',
        gender: gender,
        quantity: quantity,
        ageRequirement: `${18 + (index % 5)}-${35 + (index % 10)}`,
        languageRequirement: languageRequirement,
        educationRequirement: 'Tốt nghiệp THPT trở lên',
        experienceRequirement: 'Không yêu cầu kinh nghiệm',
        yearsOfExperience: 'Không yêu cầu',
        heightRequirement: `Trên ${150 + (index % 10)} cm`,
        weightRequirement: `Trên ${45 + (index % 5)} kg`,
        visionRequirement: 'Thị lực tốt, không mù màu',
        tattooRequirement: 'Không yêu cầu',
        hepatitisBRequirement: 'Không yêu cầu',
        interviewFormat: 'Phỏng vấn Online',
        specialConditions: 'Chăm chỉ, chịu khó, có khả năng làm việc nhóm tốt.',
        details: {
            description: `<p>Mô tả chi tiết cho công việc <strong>${title}</strong>. Đây là cơ hội tuyệt vời để làm việc trong một môi trường chuyên nghiệp tại Nhật Bản. Công việc đòi hỏi sự cẩn thận, tỉ mỉ và trách nhiệm cao để đảm bảo chất lượng sản phẩm tốt nhất.</p>`,
            requirements: `<ul><li>Yêu cầu: Tốt nghiệp THPT trở lên.</li><li>Có sức khỏe tốt, không mắc các bệnh truyền nhiễm.</li><li>Có khả năng làm việc nhóm và tuân thủ kỷ luật tốt.</li><li>Ưu tiên ứng viên có kinh nghiệm làm việc trong ngành ${industry}.</li></ul>`,
            benefits: `<ul><li>Hưởng đầy đủ chế độ bảo hiểm (y tế, hưu trí, thất nghiệp) theo quy định của pháp luật Nhật Bản.</li><li>Hỗ trợ chi phí nhà ở và đi lại.</li><li>Có nhiều cơ hội làm thêm giờ để tăng thu nhập.</li><li>Được đào tạo bài bản và có cơ hội phát triển, gia hạn hợp đồng lâu dài.</li></ul>`,
            videoUrl: index % 4 === 0 ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
            images: index % 3 === 0 ? [
                { src: '/img/donhang1.jpg', alt: 'Mẫu đơn hàng 1', dataAiHint: 'job order form' },
                { src: '/img/donhang2.jpg', alt: 'Mẫu đơn hàng 2', dataAiHint: 'recruitment form' },
                { src: '/img/donhang3.jpg', alt: 'Mẫu đơn hàng 3', dataAiHint: 'job details' }
            ] : []
        }
    };
};

export const jobData: Job[] = Array.from({ length: 100 }, (_, i) => generateRandomJob(i));

// Add 20 more jobs for Đào Quang Minh
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

        const newJob: Job = {
            id: newJobId,
            isRecording: baseIndex % 5 === 0,
            image: { src: jobImagePlaceholders[industry] || `https://placehold.co/600x400.png?text=${encodeURIComponent(industry)}`, type: 'minhhoa' },
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
            }
        };
        jobData.push(newJob);
    }
}
