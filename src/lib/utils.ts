import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CandidateProfile } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateProfileForApplication = (profile: CandidateProfile): string[] => {
    const missingFields: string[] = [];
    if (!profile) {
        return ['Hồ sơ'];
    }

    if (!profile.name) {
        missingFields.push('Họ và tên');
    }

    if (!profile.personalInfo) {
        missingFields.push('Thông tin cá nhân');
        return missingFields;
    }

    const { gender, height, weight, tattooStatus, hepatitisBStatus, phone, zalo, messenger, line } = profile.personalInfo;

    if (!gender) missingFields.push('Giới tính');
    if (!height || parseInt(height) === 0) missingFields.push('Chiều cao');
    if (!weight || parseInt(weight) === 0) missingFields.push('Cân nặng');
    if (!tattooStatus) missingFields.push('Tình trạng hình xăm');
    if (!hepatitisBStatus) missingFields.push('Tình trạng viêm gan B');

    const hasContactInfo = phone || zalo || messenger || line;
    if (!hasContactInfo) {
        missingFields.push('ít nhất một phương thức liên lạc (SĐT, Zalo...)');
    }

    return missingFields;
};
