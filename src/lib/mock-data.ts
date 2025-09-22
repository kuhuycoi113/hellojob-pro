

import { consultants } from './consultant-data';
import type { User } from './chat-data';
import { industriesByJobType } from './industry-data';
import { japanJobTypes, visaDetailsByVisaType, allSpecialConditions, conditionsByVisaDetail } from './visa-data';
import { allJapanLocations } from './location-data';


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
      avatarUrl: string; // Changed from avatar
      company: string;
      mainExpertise?: string;
    };
    status: 'Đang tuyển' | 'Tạm dừng';
    interviewDate: string;
    interviewRounds: number;
    netFee?: string; // This will now represent "Phí có vé"
    netFeeNoTicket?: string; // New field for "Phí không vé"
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
    interviewFormat?: string;
    specialConditions?: string;
    otherSkillRequirement?: string[]; // Added this for filtering
    companyArrivalTime?: string;
    details: {
        description: string;
        requirements: string;
        benefits: string;
        videoUrl?: string;
        images?: { src: string; alt: string; dataAiHint: string }[];
    }
}


const locations = ['Tokyo', 'Osaka', 'Aichi', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo', 'Hiroshima', 'Kyoto', 'Nagano', 'Gifu', 'Ibaraki', 'Miyagi', 'Shizuoka', 'Gunma', 'Tochigi', 'Mie'];
const interviewLocations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Online', 'Tại công ty (Nhật Bản)'];
const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon", "Không yêu cầu"];
const languageLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'Không yêu cầu'];
const tattooOptions = ["Không nhận hình xăm", "Nhận xăm nhỏ (kín)", "Nhận cả xăm to (lộ)"];

const otherSkills = [
    { name: "Có bằng lái xe AT", slug: "co-bang-lai-xe-at" },
    { name: "Có bằng lái xe MT", slug: "co-bang-lai-xe-mt" },
    { name: "Có bằng lái xe tải cỡ nhỏ", slug: "co-bang-lai-xe-tai-co-nho" },
    { name: "Có bằng lái xe tải cỡ trung", slug: "co-bang-lai-xe-tai-co-trung" },
    { name: "Có bằng lái xe tải cỡ lớn", slug: "co-bang-lai-xe-tai-co-lon" },
    { name: "Có bằng lái xe buýt cỡ trung", slug: "co-bang-lai-xe-buyt-co-trung" },
    { name: "Có bằng lái xe buýt cỡ lớn", slug: "co-bang-lai-xe-buyt-co-lon" },
    { name: "Lái được máy xúc, máy đào", slug: "lai-duoc-may-xuc-may-dao" },
    { name: "Lái được xe nâng", slug: "lai-duoc-xe-nang" },
    { name: "Có bằng cầu", slug: "co-bang-cau" },
    { name: "Vận hành máy CNC", slug: "van-hanh-may-cnc" },
    { name: "Có bằng tiện, mài", slug: "co-bang-tien-mai" },
    { name: "Có bằng hàn", slug: "co-bang-han" },
    { name: "Có bằng cắt", slug: "co-bang-cat" },
    { name: "Có bằng gia công kim loại", slug: "co-bang-gia-cong-kim-loai" },
    { name: "Làm được giàn giáo", slug: "lam-duoc-gian-giao" },
    { name: "Thi công nội thất", slug: "thi-cong-noi-that" },
    { name: "Quản lý thi công xây dựng", slug: "quan-ly-thi-cong-xay-dung" },
    { name: "Quản lý khối lượng xây dựng", slug: "quan-ly-khoi-luong-xay-dung" },
    { name: "Thiết kế BIM xây dựng", slug: "thiet-ke-bim-xay-dung" },
    { name: "Đọc được bản vẽ kỹ thuật", slug: "doc-duoc-ban-ve-ky-thuat" },
    { name: "Có bằng thi công nội thất", slug: "co-bang-thi-cong-noi-that" }
];


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

const jobOrderImages = [
    "/img/donhang1.jpg",
    "/img/donhang2.jpg"
];

const generateUniqueJobId = (index: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let deterministicPart = '';
    let num = index;

    // Increase the length of the deterministic part to 6 characters for more uniqueness
    for (let i = 0; i < 6; i++) {
        deterministicPart += chars[num % chars.length];
        num = Math.floor(num / chars.length);
    }

    const prefix = "2408"; // Static prefix

    // The function is now fully deterministic based on the index
    return prefix + deterministicPart;
};


const getRandomItem = <T>(arr: T[], index: number): T => {
    if (!arr || arr.length === 0) {
        return null as any; 
    }
    return arr[index % arr.length];
};

const createJobList = (): Job[] => {
    const jobs: Job[] = [];
    let jobIndex = 0;

    for (const visaType of japanJobTypes) {
        const details = visaDetailsByVisaType[visaType.slug];
        if (!details) continue;

        for (const detail of details) {
            const industries = industriesByJobType[visaType.slug];
            if (!industries) continue;
            
            for (const industry of industries) {
                const keywords = industry.keywords && industry.keywords.length > 0 ? [...industry.keywords] : [industry.name];
                
                for (const keyword of keywords) {
                    const location = getRandomItem(locations, jobIndex);
                    const gender = getRandomItem(['Nam', 'Nữ', 'Cả nam và nữ'], jobIndex) as 'Nam' | 'Nữ' | 'Cả nam và nữ';
                    const quantity = (jobIndex % 10) + 1;
                    const languageRequirement = getRandomItem(languageLevels, jobIndex);
                    
                    const title = `${keyword}, ${location}, tuyển ${quantity} ${gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender}`;
                    
                    const findMatchingConsultant = () => {
                        const lowerCaseIndustry = industry.name.toLowerCase();
                        const lowerCaseVisaType = visaType.name.toLowerCase();
                        const expertConsultants = consultants.filter(c => {
                            const expertise = c.mainExpertise?.toLowerCase() || '';
                            return expertise.includes(lowerCaseIndustry) || expertise.includes(lowerCaseVisaType);
                        });
                        return expertConsultants.length > 0 ? getRandomItem(expertConsultants, jobIndex) : getRandomItem(consultants, jobIndex);
                    };
                    
                    const assignedConsultant = findMatchingConsultant();
                    
                    const postedDate = new Date(2024, 7, 1); // A fixed start date
                    postedDate.setDate(postedDate.getDate() - (jobIndex % 30));
                    const interviewDate = new Date(postedDate);
                    interviewDate.setDate(interviewDate.getDate() + (jobIndex % 60) + 1);

                    const imageCase = jobIndex % 5;
                    let jobImages = [];
                    if (imageCase === 0) {
                        jobImages.push({ src: getRandomItem(jobOrderImages, jobIndex), alt: 'Ảnh đơn hàng', dataAiHint: 'job order form' });
                        jobImages.push({ src: getRandomItem(workImagePlaceholders, jobIndex), alt: 'Ảnh công việc', dataAiHint: 'workplace action' });
                        jobImages.push({ src: getRandomItem(dormitoryImages, jobIndex), alt: 'Ảnh ký túc xá', dataAiHint: 'dormitory room' });
                    } else if (imageCase === 1) {
                        jobImages.push({ src: getRandomItem(workImagePlaceholders, jobIndex), alt: 'Ảnh công việc', dataAiHint: 'workplace action' });
                        jobImages.push({ src: getRandomItem(dormitoryImages, jobIndex), alt: 'Ảnh ký túc xá', dataAiHint: 'dormitory room' });
                    } else if (imageCase === 2) {
                        jobImages.push({ src: getRandomItem(workImagePlaceholders, jobIndex), alt: 'Ảnh công việc', dataAiHint: 'workplace action' });
                    } else if (imageCase === 3) {
                         jobImages.push({ src: getRandomItem(jobOrderImages, jobIndex), alt: 'Ảnh đơn hàng', dataAiHint: 'job order form' });
                    }

                    
                    const detailSlug = detail.slug;
                    const applicableConditions = allSpecialConditions.filter(cond => {
                        const conditionList = conditionsByVisaDetail[detailSlug as keyof typeof conditionsByVisaDetail];
                        return conditionList ? conditionList.includes(cond.name) : false;
                    });

                    const selectedConditionsCount = 2 + (jobIndex % 2);
                    const startIndex = jobIndex % (applicableConditions.length > 0 ? applicableConditions.length : 1);
                    const selectedConditions = [];
                    if (applicableConditions.length > 0) {
                        for (let i = 0; i < selectedConditionsCount; i++) {
                            selectedConditions.push(applicableConditions[(startIndex + i) % applicableConditions.length]);
                        }
                    }
                    const specialConditions = selectedConditions.map(c => c.name).join(', ');

                    const selectedOtherSkillsCount = 1 + (jobIndex % 2);
                    const otherSkillsStartIndex = jobIndex % (otherSkills.length > 0 ? otherSkills.length : 1);
                    const selectedOtherSkills = [];
                    if (otherSkills.length > 0) {
                        for (let j = 0; j < selectedOtherSkillsCount; j++) {
                            selectedOtherSkills.push(otherSkills[(otherSkillsStartIndex + j) % otherSkills.length]);
                        }
                    }
                    
                    const otherSkillsText = selectedOtherSkills.map(s => `<li>${s.name}</li>`).join('');
                    const isEngineer = visaType.name.includes('Kỹ sư');
                    const requirementsBase = `<ul><li>Yêu cầu: ${isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : 'Tốt nghiệp THPT trở lên'}.</li><li>Sức khỏe tốt, không mắc các bệnh truyền nhiễm theo quy định.</li><li>Chăm chỉ, chịu khó, có tinh thần học hỏi.</li><li>${languageRequirement !== 'Không yêu cầu' ? `Trình độ tiếng Nhật tương đương ${languageRequirement}.` : 'Không yêu cầu tiếng Nhật.'}</li><li>${jobIndex % 3 !== 0 ? `Có kinh nghiệm tối thiểu 1 năm trong lĩnh vực ${industry.name}.` : 'Không yêu cầu kinh nghiệm, sẽ được đào tạo.'}</li></ul>`;
                    
                    let netFee;
                    let netFeeNoTicket;
                    
                    const feeVisas = ['thuc-tap-sinh-3-nam', 'thuc-tap-sinh-1-nam', 'dac-dinh-dau-viet', 'dac-dinh-di-moi', 'ky-su-tri-thuc-dau-viet'];
                    if (feeVisas.includes(detail.slug) && (jobIndex % 5 < 4)) { // 80% have fees
                        if (detail.slug === 'dac-dinh-dau-viet') {
                            netFee = String(1500 + ((jobIndex * 101) % 1000)); // 1500-2500
                            netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) ))); // 80-90% of netFee
                        } else if (detail.slug === 'dac-dinh-di-moi' || detail.slug === 'ky-su-tri-thuc-dau-viet') {
                            netFee = String(2500 + ((jobIndex * 101) % 1300)); // 2500-3800
                            netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                        } else if (detail.slug === 'thuc-tap-sinh-1-nam') {
                            netFee = String(1000 + ((jobIndex * 101) % 400)); // 1000-1400
                            netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                        } else { // TTS 3 năm
                            netFee = String(3000 + ((jobIndex * 101) % 600)); // 3000-3600
                             netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                        }
                    }

                    const isTTS = visaType.name.includes('Thực tập sinh');

                    const job: Job = {
                        id: generateUniqueJobId(jobIndex),
                        isRecording: jobIndex % 5 === 0,
                        image: { src: getRandomItem(workImagePlaceholders, jobIndex), type: 'thucte' },
                        likes: `${(jobIndex * 7) % 10}k${(jobIndex * 3) % 10}`,
                        salary: {
                            actual: `${(12 + (jobIndex % 10)) * 10000}`,
                            basic: `${(18 + (jobIndex % 12)) * 10000}`,
                            annualIncome: !isTTS ? `Khoảng ${(250 + jobIndex % 100)} vạn Yên` : undefined,
                            annualBonus: !isTTS ? (jobIndex % 3 === 0 ? 'Có (1-2 lần/năm)' : 'Không có') : undefined
                        },
                        title: title,
                        recruiter: {
                            id: assignedConsultant.id,
                            name: assignedConsultant.name,
                            avatarUrl: assignedConsultant.avatarUrl,
                            company: 'HelloJob'
                        },
                        status: jobIndex % 10 === 0 ? 'Tạm dừng' : 'Đang tuyển',
                        interviewDate: interviewDate.toISOString().split('T')[0],
                        interviewRounds: (jobIndex % 3) + 1,
                        netFee: netFee,
                        netFeeNoTicket: netFeeNoTicket,
                        target: `${(jobIndex % 5) + 1}tr`,
                        backFee: `${(jobIndex % 5) + 1}tr`,
                        tags: [industry.name, visaType.name.split(' ')[0], gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender],
                        postedTime: `10:00 ${postedDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}`,
                        visaType: visaType.name,
                        visaDetail: detail.name,
                        industry: industry.name,
                        workLocation: location,
                        interviewLocation: getRandomItem(interviewLocations, jobIndex),
                        gender: gender,
                        quantity: quantity,
                        ageRequirement: `${18 + (jobIndex % 5)}-${35 + (jobIndex % 15)}`,
                        languageRequirement: languageRequirement,
                        educationRequirement: isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : getRandomItem(educationLevels, jobIndex),
                        experienceRequirement: jobIndex % 3 === 0 ? 'Không yêu cầu kinh nghiệm' : `Kinh nghiệm ngành ${industry.name} là một lợi thế`,
                        yearsOfExperience: jobIndex % 3 === 0 ? 'Không yêu cầu' : '1-2 năm',
                        heightRequirement: `Trên ${150 + (jobIndex % 15)} cm`,
                        weightRequirement: `Trên ${40 + (jobIndex % 10)} kg`,
                        visionRequirement: 'Thị lực tốt, không mù màu',
                        tattooRequirement: getRandomItem(tattooOptions, jobIndex),
                        interviewFormat: 'Phỏng vấn Online',
                        specialConditions: specialConditions,
                        otherSkillRequirement: selectedOtherSkills.map(s => s.slug),
                        details: {
                            description: `<p>Mô tả chi tiết cho công việc <strong>${title}</strong>. Đây là cơ hội tuyệt vời để làm việc trong một môi trường chuyên nghiệp tại Nhật Bản. Công việc đòi hỏi sự cẩn thận, tỉ mỉ và trách nhiệm cao để đảm bảo chất lượng sản phẩm tốt nhất.</p><ul><li>Chi tiết công việc: ${keyword}.</li><li>Môi trường làm việc sạch sẽ, hiện đại.</li></ul>`,
                            requirements: `${requirementsBase}<ul>${otherSkillsText}</ul>`,
                            benefits: `<ul><li>Hưởng đầy đủ chế độ bảo hiểm (y tế, hưu trí, thất nghiệp) theo quy định của pháp luật Nhật Bản.</li><li>Hỗ trợ chi phí nhà ở và đi lại.</li><li>Có nhiều cơ hội làm thêm giờ để tăng thu nhập.</li><li>Được đào tạo bài bản và có cơ hội phát triển, gia hạn hợp đồng lâu dài.</li><li>Thưởng 1-2 lần/năm tùy theo kết quả kinh doanh.</li></ul>`,
                            videoUrl: (jobIndex % 5 === 0 && imageCase > 1) ? getRandomItem(jobVideos, jobIndex) : undefined,
                            images: jobImages,
                        }
                    };
                    jobs.push(job);
                    jobIndex++;
                }
            }
        }
    }
    return jobs;
};

const createJobsForLocations = (locationsToPopulate: string[], countPerLocation: number, startIndex: number): Job[] => {
    const jobs: Job[] = [];
    let jobIndex = startIndex;
    for (const location of locationsToPopulate) {
        for (let i = 0; i < countPerLocation; i++) {
            const visaType = getRandomItem(japanJobTypes, jobIndex);
            const details = visaDetailsByVisaType[visaType.slug];
            if (!details) continue;
            const detail = getRandomItem(details, jobIndex);
    
            const industries = industriesByJobType[visaType.slug];
            if (!industries) continue;
            const industry = getRandomItem(industries, jobIndex);
    
            const keywords = industry.keywords && industry.keywords.length > 0 ? [...industry.keywords] : [industry.name];
            const keyword = getRandomItem(keywords, jobIndex);
    
            const gender = getRandomItem(['Nam', 'Nữ', 'Cả nam và nữ'], jobIndex) as 'Nam' | 'Nữ' | 'Cả nam và nữ';
            const quantity = (jobIndex % 10) + 1;
            const languageRequirement = getRandomItem(languageLevels, jobIndex);
            
            const title = `${keyword}, ${location}, tuyển ${quantity} ${gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender}`;
            
            const findMatchingConsultant = () => {
                const lowerCaseIndustry = industry.name.toLowerCase();
                const lowerCaseVisaType = visaType.name.toLowerCase();
                const expertConsultants = consultants.filter(c => {
                    const expertise = c.mainExpertise?.toLowerCase() || '';
                    return expertise.includes(lowerCaseIndustry) || expertise.includes(lowerCaseVisaType);
                });
                return expertConsultants.length > 0 ? getRandomItem(expertConsultants, jobIndex) : getRandomItem(consultants, jobIndex);
            };
            
            const assignedConsultant = findMatchingConsultant();
            
            const isTTS = visaType.name.includes('Thực tập sinh');
            const isEngineer = visaType.name.includes('Kỹ sư');
    
            const postedDate = new Date(2024, 7, 1);
            postedDate.setDate(postedDate.getDate() - (jobIndex % 30));
            const interviewDate = new Date(postedDate);
            interviewDate.setDate(interviewDate.getDate() + (jobIndex % 60) + 1);
    
            const imageCase = jobIndex % 5;
            let jobImages = [];
            if (imageCase === 0) {
                jobImages.push({ src: getRandomItem(jobOrderImages, jobIndex), alt: 'Ảnh đơn hàng', dataAiHint: 'job order form' });
                jobImages.push({ src: getRandomItem(workImagePlaceholders, jobIndex), alt: 'Ảnh công việc', dataAiHint: 'workplace action' });
                jobImages.push({ src: getRandomItem(dormitoryImages, jobIndex), alt: 'Ảnh ký túc xá', dataAiHint: 'dormitory room' });
            } else if (imageCase === 1) {
                jobImages.push({ src: getRandomItem(workImagePlaceholders, jobIndex), alt: 'Ảnh công việc', dataAiHint: 'workplace action' });
                jobImages.push({ src: getRandomItem(dormitoryImages, jobIndex), alt: 'Ảnh ký túc xá', dataAiHint: 'dormitory room' });
            } else if (imageCase === 2) {
                jobImages.push({ src: getRandomItem(workImagePlaceholders, jobIndex), alt: 'Ảnh công việc', dataAiHint: 'workplace action' });
            } else if (imageCase === 3) {
                jobImages.push({ src: getRandomItem(jobOrderImages, jobIndex), alt: 'Ảnh đơn hàng', dataAiHint: 'job order form' });
            }
    
            const detailSlug = detail.slug;
            const applicableConditions = allSpecialConditions.filter(cond => {
                const conditionList = conditionsByVisaDetail[detailSlug as keyof typeof conditionsByVisaDetail];
                return conditionList ? conditionList.includes(cond.name) : false;
            });
    
            const selectedConditionsCount = 2 + (jobIndex % 2);
            const startIndexCond = jobIndex % (applicableConditions.length > 0 ? applicableConditions.length : 1);
            const selectedConditions = [];
            if (applicableConditions.length > 0) {
                for (let j = 0; j < selectedConditionsCount; j++) {
                    selectedConditions.push(applicableConditions[(startIndexCond + j) % applicableConditions.length]);
                }
            }
            const specialConditions = selectedConditions.map(c => c.name).join(', ');
    
            const selectedOtherSkillsCount = 1 + (jobIndex % 2);
            const otherSkillsStartIndex = jobIndex % (otherSkills.length > 0 ? otherSkills.length : 1);
            const selectedOtherSkills = [];
            if (otherSkills.length > 0) {
                for (let j = 0; j < selectedOtherSkillsCount; j++) {
                    selectedOtherSkills.push(otherSkills[(otherSkillsStartIndex + j) % otherSkills.length]);
                }
            }
            
            const otherSkillsText = selectedOtherSkills.map(s => `<li>${s.name}</li>`).join('');
            const requirementsBase = `<ul><li>Yêu cầu: ${isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : 'Tốt nghiệp THPT trở lên'}.</li><li>Sức khỏe tốt, không mắc các bệnh truyền nhiễm theo quy định.</li><li>Chăm chỉ, chịu khó, có tinh thần học hỏi.</li><li>${languageRequirement !== 'Không yêu cầu' ? `Trình độ tiếng Nhật tương đương ${languageRequirement}.` : 'Không yêu cầu tiếng Nhật.'}</li><li>${jobIndex % 3 !== 0 ? `Có kinh nghiệm tối thiểu 1 năm trong lĩnh vực ${industry.name}.` : 'Không yêu cầu kinh nghiệm, sẽ được đào tạo.'}</li></ul>`;
    
            let netFee;
            let netFeeNoTicket;

            const feeVisas = ['thuc-tap-sinh-3-nam', 'thuc-tap-sinh-1-nam', 'dac-dinh-dau-viet', 'dac-dinh-di-moi', 'ky-su-tri-thuc-dau-viet'];
            if (feeVisas.includes(detail.slug) && (jobIndex % 5 < 4)) { // 80% have fees
                if (detail.slug === 'dac-dinh-dau-viet') {
                    netFee = String(1500 + ((jobIndex * 101) % 1000));
                    netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                } else if (detail.slug === 'dac-dinh-di-moi' || detail.slug === 'ky-su-tri-thuc-dau-viet') {
                    netFee = String(2500 + ((jobIndex * 101) % 1300));
                    netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                } else if (detail.slug === 'thuc-tap-sinh-1-nam') {
                    netFee = String(1000 + ((jobIndex * 101) % 400));
                    netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                } else if (detail.slug === 'thuc-tap-sinh-3-nam') { // TTS 3 năm
                    netFee = String(3000 + ((jobIndex * 101) % 600));
                    netFeeNoTicket = String(Math.floor(Number(netFee) * (0.8 + ((jobIndex % 10)/100) )));
                }
            }


            const job: Job = {
                id: generateUniqueJobId(jobIndex),
                isRecording: jobIndex % 5 === 0,
                image: { src: getRandomItem(workImagePlaceholders, jobIndex), type: 'thucte' },
                likes: `${(jobIndex * 7) % 10}k${(jobIndex * 3) % 10}`,
                salary: {
                    actual: `${(12 + (jobIndex % 10)) * 10000}`,
                    basic: `${(18 + (jobIndex % 12)) * 10000}`,
                    annualIncome: isTTS ? undefined : `Khoảng ${(250 + jobIndex % 100)} vạn Yên`,
                    annualBonus: isTTS ? undefined : (jobIndex % 3 === 0 ? 'Có (1-2 lần/năm)' : 'Không có')
                },
                title: title,
                recruiter: {
                    id: assignedConsultant.id,
                    name: assignedConsultant.name,
                    avatarUrl: assignedConsultant.avatarUrl,
                    company: 'HelloJob'
                },
                status: jobIndex % 10 === 0 ? 'Tạm dừng' : 'Đang tuyển',
                interviewDate: interviewDate.toISOString().split('T')[0],
                interviewRounds: (jobIndex % 3) + 1,
                netFee: netFee,
                netFeeNoTicket: netFeeNoTicket,
                target: `${(jobIndex % 5) + 1}tr`,
                backFee: `${(jobIndex % 5) + 1}tr`,
                tags: [industry.name, visaType.name.split(' ')[0], gender === 'Cả nam và nữ' ? 'Nam/Nữ' : gender],
                postedTime: `10:00 ${postedDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}`,
                visaType: visaType.name,
                visaDetail: detail.name,
                industry: industry.name,
                workLocation: location,
                interviewLocation: getRandomItem(interviewLocations, jobIndex),
                gender: gender,
                quantity: quantity,
                ageRequirement: `${18 + (jobIndex % 5)}-${35 + (jobIndex % 15)}`,
                languageRequirement: languageRequirement,
                educationRequirement: isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : getRandomItem(educationLevels, jobIndex),
                experienceRequirement: jobIndex % 3 === 0 ? 'Không yêu cầu kinh nghiệm' : `Kinh nghiệm ngành ${industry.name} là một lợi thế`,
                yearsOfExperience: jobIndex % 3 === 0 ? 'Không yêu cầu' : '1-2 năm',
                heightRequirement: `Trên ${150 + (jobIndex % 15)} cm`,
                weightRequirement: `Trên ${40 + (jobIndex % 10)} kg`,
                visionRequirement: 'Thị lực tốt, không mù màu',
                tattooRequirement: getRandomItem(tattooOptions, jobIndex),
                interviewFormat: 'Phỏng vấn Online',
                specialConditions: specialConditions,
                otherSkillRequirement: selectedOtherSkills.map(s => s.slug),
                details: {
                    description: `<p>Mô tả chi tiết cho công việc <strong>${title}</strong>. Đây là cơ hội tuyệt vời để làm việc trong một môi trường chuyên nghiệp tại Nhật Bản. Công việc đòi hỏi sự cẩn thận, tỉ mỉ và trách nhiệm cao để đảm bảo chất lượng sản phẩm tốt nhất.</p><ul><li>Chi tiết công việc: ${keyword}.</li><li>Môi trường làm việc sạch sẽ, hiện đại.</li></ul>`,
                    requirements: `${requirementsBase}<ul>${otherSkillsText}</ul>`,
                    benefits: `<ul><li>Hưởng đầy đủ chế độ bảo hiểm (y tế, hưu trí, thất nghiệp) theo quy định của pháp luật Nhật Bản.</li><li>Hỗ trợ chi phí nhà ở và đi lại.</li><li>Có nhiều cơ hội làm thêm giờ để tăng thu nhập.</li><li>Được đào tạo bài bản và có cơ hội phát triển, gia hạn hợp đồng lâu dài.</li><li>Thưởng 1-2 lần/năm tùy theo kết quả kinh doanh.</li></ul>`,
                    videoUrl: (jobIndex % 5 === 0 && imageCase > 1) ? getRandomItem(jobVideos, jobIndex) : undefined,
                    images: jobImages,
                }
            };
            jobs.push(job);
            jobIndex++;
        }
    }
    return jobs;
}

const initialJobs = createJobList();

const allPrefectureNames = allJapanLocations.map(p => p.name);
const prefecturesWithJobs = new Set(initialJobs.map(j => j.workLocation));

const missingPrefectures = allPrefectureNames.filter(p => !prefecturesWithJobs.has(p));
let newlyAddedJobs: Job[] = [];
let currentIndex = initialJobs.length;

missingPrefectures.forEach((prefecture, i) => {
    const numJobsToCreate = 5 + ((currentIndex + i) % 8); 
    const jobsForPrefecture = createJobsForLocations([prefecture], numJobsToCreate, currentIndex);
    newlyAddedJobs.push(...jobsForPrefecture);
    currentIndex += numJobsToCreate;
});

export const jobData: Job[] = [...initialJobs, ...newlyAddedJobs];
    





  