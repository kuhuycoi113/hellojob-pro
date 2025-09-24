import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CandidateProfile } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateProfileForApplication = (profile: CandidateProfile): boolean => {
    if (!profile || !profile.personalInfo) return false;

    const { name, personalInfo } = profile;
    const { gender, height, weight, tattooStatus, hepatitisBStatus, phone, zalo, messenger, line } = personalInfo;

    const hasRequiredPersonalInfo = name && gender && height && weight && tattooStatus && hepatitisBStatus;
    const hasContactInfo = phone || zalo || messenger || line;

    return !!hasRequiredPersonalInfo && !!hasContactInfo;
};
