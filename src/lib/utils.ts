import { CandidateProfile } from "@/ai/schemas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import MAPPING_IMAGES from "@/lib/mapping_images.json";
import MAPPING_EXCLUDE_IMAGES from "@/lib/mapping_exclude_images.json";
import { japanJobTypes, visaDetailsByVisaType } from "./visa-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseMessengerInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
    if (trimmedInput.startsWith('http') || trimmedInput.includes('facebook.com') || trimmedInput.includes('m.me')) {
      const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);

      if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
        const id = url.searchParams.get('id');
        if (id && /^\d+$/.test(id)) {
          return id; // Return numeric ID if found in profile.php
        }
        // For vanity URLs like facebook.com/username
        const pathParts = url.pathname.split('/').filter(part => part && part !== 'profile.php' && part !== 'people');
        if (pathParts.length > 0) {
          return pathParts[pathParts.length - 1];
        }
      }
      if (url.hostname.includes('m.me')) {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          return pathParts[pathParts.length - 1];
        }
      }
    }
  } catch (error) {
    // Not a valid URL, treat as a potential username
    console.warn("Could not parse Messenger input as URL, treating as username:", error);
  }
  // Fallback: treat as username, remove any URL-like parts
  return trimmedInput.split('/').pop() || trimmedInput;
};

export const parseZaloInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  if (trimmedInput.includes('zalo.me/')) {
    const parts = trimmedInput.split('/');
    return parts.pop()?.replace(/\D/g, '') || '';
  }
  return trimmedInput.replace(/\D/g, '');
};

export const parseLineInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
    if (trimmedInput.startsWith('http') && trimmedInput.includes('line.me/')) {
      const url = new URL(trimmedInput);
      const pathParts = url.pathname.split('/');
      let potentialId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
      if (potentialId) {
        // Remove query parameters
        potentialId = potentialId.split('?')[0];
        // Remove leading ~ or @ if present
        return potentialId.replace(/^[~@]/, '');
      }
    }
  } catch (error) {
    console.warn("Could not parse Line input as URL, treating as ID:", error);
  }
  // Fallback to treat the whole input as an ID, removing potential URL parts and special characters
  return trimmedInput.split('/').pop()?.replace(/^[~@]/, '') || trimmedInput.replace(/^[~@]/, '');
};

export const formatSpecialCondition = (specialConditions: any) => {
  if (typeof specialConditions === "string") {
    specialConditions = specialConditions.split(", ");
  }
  return specialConditions ?? [];
};

export const getGenderLabel = (gender: any) => {
  if (gender === "MALE") {
    return "Nam";
  } else if (gender === "FEMALE") {
    return "Nữ";
  } else if (gender === "BOTH") {
    return "Cả nam và nữ";
  } else {
    return "";
  }
};
export const generateBulletJobCrawl = (data: any) => {
  const { job, career, languageLevel, numberRecruits, gender, workLocation } = data;
  let specialConditions = data.specialConditions;
  specialConditions = formatSpecialCondition(specialConditions);
  const details = [
    job ?? career,
    workLocation,
    languageLevel,
    numberRecruits ? `${numberRecruits} ${getGenderLabel(gender)}` : null,
    specialConditions ? specialConditions.join(",") : null,
  ]
    .filter(Boolean)
    .join(", ");

  return details;
};


export const convertTime = (time: any) => {
  const timestamp = Number(time);

  const isSeconds = timestamp.toString().length <= 10;

  const date = isSeconds ? new Date(timestamp * 1000) : new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
  return formattedDate;
};



export const getJobImage = (job: string, career: string) => {
  let mappingImage = MAPPING_IMAGES.find((item) => item.newJobs.indexOf(job) > -1);
  if (!mappingImage) {
    mappingImage = MAPPING_IMAGES.find((item) => item.newJobs.indexOf(career) > -1);
  }
  if (!mappingImage) {
    return "/img/no-image.jpg";
  }
  if (mappingImage.images.length === 1) {
    return mappingImage.images[0];
  }
  let randomInt = Math.floor(Math.random() * mappingImage.images.length);
  while (MAPPING_EXCLUDE_IMAGES.indexOf(mappingImage.images[randomInt]) > -1) {
    randomInt = Math.floor(Math.random() * mappingImage.images.length);
  }
  return mappingImage.images[randomInt];
};
export const formatVisa = (visa: string) => {
  if (!visa) {
    return 'Không rõ';
  }
  return visa.replace('Tokutei', 'Đặc định');
};
export const findVisaByVisaDetail = (visaDetail: string) => {
  if (!visaDetail) {
    return 'Không rõ';
  }
  visaDetail = visaDetail.replace('Tokutei', 'Đặc định');
  japanJobTypes.forEach(visa => {
    const details = visaDetailsByVisaType[visa.slug];
    if (details.findIndex(detail => detail.name === visaDetail) > -1) {
      return visa.name;
    }
  });
  return visaDetail ?? 'Không rõ';
};