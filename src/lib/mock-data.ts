
import { consultants } from './consultant-data';
import type { User } from './chat-data';
import { industriesByJobType } from './industry-data';
import { japanJobTypes, visaDetailsByVisaType, allSpecialConditions } from './visa-data';

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


const locations = ['Tokyo', 'Osaka', 'Aichi', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo', 'Hiroshima', 'Kyoto', 'Nagano', 'Gifu', 'Ibaraki', 'Miyagi', 'Shizuoka', 'Gunma', 'Tochigi', 'Mie'];
const interviewLocations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Online', 'Tại công ty (Nhật Bản)'];
const educationLevels = ["Tốt nghiệp THPT", "Tốt nghiệp Trung cấp", "Tốt nghiệp Cao đẳng", "Tốt nghiệp Đại học", "Tốt nghiệp Senmon", "Không yêu cầu"];
const languageLevels = ['N1', 'N2', 'N3', 'N4', 'N5', 'Không yêu cầu'];
const tattooOptions = ["Không nhận hình xăm", "Nhận xăm nhỏ (kín)", "Nhận cả xăm to (lộ)"];
const hepBOptions = ["Không nhận viêm gan B", "Nhận viêm gan B (thể tĩnh)"];
const specialConditionsList = ['Lương tốt', 'Tăng ca', 'Công ty uy tín', 'Hỗ trợ nhà ở', 'Bay nhanh', 'Không yêu cầu kinh nghiệm', 'Nhận tuổi cao', 'Hỗ trợ Ginou 2'];


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

const existingJobIds = new Set<string>();

const generateUniqueJobId = (index: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let deterministicPart = '';
    let num = index;
    for (let i = 0; i < 6; i++) {
        deterministicPart += chars[num % chars.length];
        num = Math.floor(num / chars.length);
    }

    const creationDate = new Date();
    creationDate.setDate(creationDate.getDate() - (index % 30)); 
    const year = creationDate.getFullYear().toString().slice(-2);
    const month = (creationDate.getMonth() + 1).toString().padStart(2, '0');
    const prefix = year + month;

    const newId = prefix + deterministicPart;
    
    if (existingJobIds.has(newId)) {
        return generateUniqueJobId(index + 2000); 
    }
    
    existingJobIds.add(newId);
    return newId;
};

const getRandomItem = <T>(arr: T[], index: number): T => {
    if (!arr || arr.length === 0) {
        // Return a default or handle the error appropriately
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
                const keywords = industry.keywords;
                if (!keywords || keywords.length === 0) {
                    // Create at least one job for the industry even if no keywords
                    keywords.push(industry.name);
                }

                // Create 2 jobs for each keyword to ensure coverage
                for (let i=0; i < 2; i++) {
                    const keyword = getRandomItem(keywords, jobIndex); // Still get random keyword to vary titles
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
                    
                    const isTTS = visaType.name.includes('Thực tập sinh');
                    const isEngineer = visaType.name.includes('Kỹ sư');

                    const postedDate = new Date();
                    postedDate.setDate(postedDate.getDate() - (jobIndex % 30));
                    const interviewDate = new Date(postedDate);
                    interviewDate.setDate(interviewDate.getDate() + (jobIndex % 60) + 1);

                    const imageCase = jobIndex % 4;
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
                    }
                    
                    // Logic to add special conditions
                    const applicableConditions = allSpecialConditions.filter(cond => {
                        const visaDetails = Object.keys(visaDetailsByVisaType).flatMap(key => visaDetailsByVisaType[key]);
                        const detailObj = visaDetails.find(d => d.name === detail.name);
                        return detailObj; // for now, let's assume all are applicable. A more complex logic can be added later.
                    }).map(c => c.name);

                    const shuffledConditions = [...applicableConditions].sort(() => 0.5 - Math.random());
                    const selectedConditionsCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 conditions
                    const specialConditions = shuffledConditions.slice(0, selectedConditionsCount).join(', ');

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
                            avatar: assignedConsultant.avatarUrl,
                            company: 'HelloJob'
                        },
                        status: jobIndex % 10 === 0 ? 'Tạm dừng' : 'Đang tuyển',
                        interviewDate: interviewDate.toISOString().split('T')[0],
                        interviewRounds: (jobIndex % 3) + 1,
                        netFee: isTTS ? `${80 + (jobIndex % 30)}tr` : undefined,
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
                        hepatitisBRequirement: getRandomItem(hepBOptions, jobIndex),
                        interviewFormat: 'Phỏng vấn Online',
                        specialConditions: specialConditions,
                        details: {
                            description: `<p>Mô tả chi tiết cho công việc <strong>${title}</strong>. Đây là cơ hội tuyệt vời để làm việc trong một môi trường chuyên nghiệp tại Nhật Bản. Công việc đòi hỏi sự cẩn thận, tỉ mỉ và trách nhiệm cao để đảm bảo chất lượng sản phẩm tốt nhất.</p><ul><li>Chi tiết công việc: ${keyword}.</li><li>Môi trường làm việc sạch sẽ, hiện đại.</li></ul>`,
                            requirements: `<ul><li>Yêu cầu: ${isEngineer ? 'Tốt nghiệp Cao đẳng trở lên' : 'Tốt nghiệp THPT trở lên'}.</li><li>Sức khỏe tốt, không mắc các bệnh truyền nhiễm theo quy định.</li><li>Chăm chỉ, chịu khó, có tinh thần học hỏi.</li><li>${languageRequirement !== 'Không yêu cầu' ? `Trình độ tiếng Nhật tương đương ${languageRequirement}.` : 'Không yêu cầu tiếng Nhật.'}</li><li>${jobIndex % 3 !== 0 ? `Có kinh nghiệm tối thiểu 1 năm trong lĩnh vực ${industry.name}.` : 'Không yêu cầu kinh nghiệm, sẽ được đào tạo.'}</li></ul>`,
                            benefits: `<ul><li>Hưởng đầy đủ chế độ bảo hiểm (y tế, hưu trí, thất nghiệp) theo quy định của pháp luật Nhật Bản.</li><li>Hỗ trợ chi phí nhà ở và đi lại.</li><li>Có nhiều cơ hội làm thêm giờ để tăng thu nhập.</li><li>Được đào tạo bài bản và có cơ hội phát triển, gia hạn hợp đồng lâu dài.</li><li>Thưởng 1-2 lần/năm tùy theo kết quả kinh doanh.</li></ul>`,
                            videoUrl: jobIndex % 5 === 0 ? getRandomItem(jobVideos, jobIndex) : undefined,
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

export const jobData: Job[] = createJobList();
