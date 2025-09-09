
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
      name: string;
      avatar: string;
      company: string;
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

const recruiters = [
    { name: 'Nguyễn Thị Ngân', avatar: 'https://placehold.co/32x32.png', company: 'Hoàng Long CMS' },
    { name: 'Trần Văn Mạnh', avatar: 'https://placehold.co/32x32.png', company: 'Vinamex' },
    { name: 'Lê Thuỳ Trang', avatar: 'https://placehold.co/32x32.png', company: 'Esuhai' },
    { name: 'Hoàng An', avatar: 'https://placehold.co/32x32.png', company: 'JapanWorks' },
    { name: 'Phạm Minh Tuấn', avatar: 'https://placehold.co/32x32.png', company: 'Kaizen Yoshida' },
    { name: 'Vũ Thị Lan', avatar: 'https://placehold.co/32x32.png', company: 'TTC Việt Nam' },
];

const industries = ['Chế biến thực phẩm', 'Cơ khí', 'Xây dựng', 'Nông nghiệp', 'Điện tử', 'Dệt may', 'Điều dưỡng', 'Nhà hàng'];
const locations = ['Tokyo', 'Osaka', 'Aichi', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo', 'Hiroshima'];

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
    'Nhà hàng': ['Phục vụ bàn', 'Phụ bếp', 'Lễ tân nhà hàng', 'Pha chế đồ uống']
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
};


const generateRandomJob = (index: number): Job => {
    const industry = industries[index % industries.length];
    const visaTypeKeys = Object.keys(visaDetailsByVisaType);
    const visaType = visaTypeKeys[index % visaTypeKeys.length];
    const visaDetails = visaDetailsByVisaType[visaType];
    const visaDetail = visaDetails[index % visaDetails.length];
    
    const location = locations[index % locations.length];
    const recruiter = recruiters[index % recruiters.length];
    const gender = ['Nam', 'Nữ', 'Cả nam và nữ'][index % 3] as 'Nam' | 'Nữ' | 'Cả nam và nữ';
    const quantity = (index % 10) + 1;
    const title = `${jobTitles[industry as keyof typeof jobTitles][index % 4]}, ${location}, ${quantity} ${gender}`;

    // Deterministic generation of likes to avoid hydration errors
    const deterministicLikesK = (index * 7) % 10;
    const deterministicLikesHundred = (index * 3) % 10;
    const imageSrc = jobImagePlaceholders[industry] || `https://placehold.co/600x400.png?text=${encodeURIComponent(industry)}`;

    return {
        id: `JP-DEMO${1000 + index}`,
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
        languageRequirement: index % 4 === 0 ? 'Không yêu cầu' : 'Tiếng Nhật N4',
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
                { src: 'https://placehold.co/600x400.png?text=Workplace', alt: 'Nơi làm việc', dataAiHint: 'factory workplace' },
                { src: 'https://placehold.co/600x400.png?text=Dormitory', alt: 'Ký túc xá', dataAiHint: 'company dormitory' }
            ] : []
        }
    };
};

export const jobData: Job[] = Array.from({ length: 100 }, (_, i) => generateRandomJob(i));
