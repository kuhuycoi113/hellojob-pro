import { SearchFilters } from "@/components/job-search/search-results";
import { allSpecialConditions } from "./visa-data";


export const initialSearchFilters: SearchFilters = {
    q: '',
    visa: '',
    visaDetail: '',
    career: '',
    workLocation: [],
    interviewLocation: '',
    job: '',
    experienceRequirement: '',
    gender: '',
    height: [135, 210],
    weight: [35, 120],
    age: [18, 70],
    basicSalary: '',
    netSalary: '',
    hourlySalary: '',
    annualIncome: '',
    annualBonus: '',
    specialConditions: [],
    languageRequirement: '',
    englishRequirement: '',
    educationRequirement: '',
    yearsOfExperience: '',
    tattooRequirement: '',
    netFee: '',
    netFeeNoTicket: '',
    numberRecruits: '',
    interviewRounds: '',
    interviewDate: '',
    interviewDateType: 'until',
    visionRequirement: 'all',
    dominantHand: '',
    otherSkillRequirement: [],
    companyArrivalTime: '',
    workShift: '',
};


export const keyMap: { [key: string]: string } = {
    q: 'q',
    visa: 'loai-visa',
    visaDetail: 'chi-tiet-loai-hinh-visa',
    career: 'nganh-nghe',
    workLocation: 'dia-diem',
    interviewLocation: 'dia-diem-phong-van',
    job: 'chi-tiet-cong-viec',
    gender: 'gioi-tinh',
    age: 'do-tuoi',
    height: 'chieu-cao',
    weight: 'can-nang',
    basicSalary: 'luong-co-ban',
    netSalary: 'luong-thuc-linh',
    hourlySalary: 'luong-gio',
    annualIncome: 'thu-nhap-nam',
    annualBonus: 'thuong-nam',
    specialConditions: 'dieu-kien-dac-biet',
    languageRequirement: 'yeu-cau-tieng-nhat',
    englishRequirement: 'yeu-cau-tieng-anh',
    educationRequirement: 'hoc-van',
    experienceRequirement: 'yeu-cau-kinh-nghiem',
    yearsOfExperience: 'so-nam-kinh-nghiem',
    tattooRequirement: 'hinh-xam',
    netFee: 'muc-phi',
    netFeeNoTicket: 'muc-phi-khong-ve',
    quantity: 'so-luong',
    interviewRounds: 'so-vong-phong-van',
    interviewDate: 'ngay-phong-van',
    interviewDateType: 'loai-ngay-phong-van',
    visionRequirement: 'yeu-cau-thi-luc',
    dominantHand: 'tay-thuan',
    otherSkillRequirement: 'yeu-cau-ky-nang-khac',
    companyArrivalTime: 'thoi-diem-ve-cong-ty',
    workShift: 'ca-lam-viec',
    sortBy: 'sap-xep',
};

export const sortOptionMap: { [key: string]: string } = {
    newest: 'moi-nhat',
    salary_desc: 'luong-co-ban-cao-den-thap',
    salary_asc: 'luong-co-ban-thap-den-cao',
    net_salary_desc: 'thuc-linh-cao-den-thap',
    net_salary_asc: 'thuc-linh-thap-den-cao',
    fee_asc: 'phi-thap-den-cao',
    fee_desc: 'phi-cao-den-thap',
    interview_date_asc: 'phong-van-gan-nhat',
    interview_date_desc: 'phong-van-xa-nhat',
    has_image: 'uu-tien-co-anh',
    has_video: 'uu-tien-co-video',
    hot: 'hot-nhat',
    most_applicants: 'nhieu-nguoi-ung-tuyen',
};

const reverseKeyMap: { [key: string]: string } = Object.fromEntries(
    Object.entries(keyMap).map(([key, value]) => [value, key])
);
const reverseSortOptionMap: { [key: string]: string } = Object.fromEntries(
    Object.entries(sortOptionMap).map(([key, value]) => [value, key])
);

export const generateJobFilter = (readOnlySearchParams: any) => {
    const newFilters: SearchFilters = { ...initialSearchFilters, workLocation: [], specialConditions: [], otherSkillRequirement: [] };
    let sortOption = 'newest';
    for (const [key, value] of readOnlySearchParams.entries()) {
        const internalKey = reverseKeyMap[key] || key;
        if (internalKey === 'sortBy') {
            sortOption = reverseSortOptionMap[value] || 'newest';
        } else if (internalKey === 'workLocation' || internalKey === 'otherSkillRequirement') {
            const currentValues = newFilters[internalKey as 'workLocation' | 'otherSkillRequirement'] || [];
            // @ts-ignore
            newFilters[internalKey as 'workLocation' | 'otherSkillRequirement'] = [...currentValues, value];
        } else if (internalKey === 'age' || internalKey === 'height' || internalKey === 'weight') {
            const values = readOnlySearchParams.getAll(key);
            if (values.length === 2) {
                // @ts-ignore
                newFilters[internalKey] = [parseInt(values[0], 10), parseInt(values[1], 10)];
            }
        } else if (internalKey === 'specialConditions') {
            const values = Array.isArray(value) ? value : [value];
            const conditionNames = values.map(v => allSpecialConditions.find(c => c.slug === v)?.name).filter(Boolean) as string[];
            newFilters.specialConditions = [...(newFilters.specialConditions || []), ...conditionNames];
        } else {
            if (internalKey in newFilters) {
                // @ts-ignore
                newFilters[internalKey] = value;
            }
        }
    }
    return { sortOption, newFilters };
}