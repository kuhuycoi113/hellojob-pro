import { CandidateProfile } from "@/ai/schemas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import MAPPING_IMAGES from "@/lib/mapping_images.json";
import MAPPING_EXCLUDE_IMAGES from "@/lib/mapping_exclude_images.json";

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
  const { job, career, languageLevel, numberRecruits, gender, aiContent, workLocation } = data;
  let specialConditions = data.specialConditions;
  specialConditions = formatSpecialCondition(specialConditions);
  const details = [
    job ?? career,
    workLocation,
    languageLevel,
    numberRecruits ? `${numberRecruits} ${getGenderLabel(gender)}` : null,
    specialConditions ? specialConditions.join(",") : null,
    aiContent,
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