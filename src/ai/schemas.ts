
import { z } from 'zod';

const DocumentItemSchema = z.object({
  name: z.object({
    vi: z.string(),
    ja: z.string().optional(),
    en: z.string().optional(),
  }),
  url: z.string().optional(),
});
export type DocumentItem = z.infer<typeof DocumentItemSchema>;


export const CandidateProfileSchema = z.object({
  headline: z.string().describe('A professional headline for the candidate (e.g., "Software Engineer at Google").'),
  location: z.string().describe('The city and country where the candidate is located.'),
  about: z.string().describe('A brief summary or about section from the CV.'),
  education: z.array(z.object({
    school: z.string().describe('The name of the university or institution.'),
    degree: z.string().describe('The degree obtained (e.g., "Bachelor of Science in Computer Science").'),
    gradYear: z.number().describe('The year of graduation.'),
  })).describe('A list of educational qualifications.'),
  experience: z.array(z.object({
    company: z.string().describe('The name of the company.'),
    role: z.string().describe('The job title or role.'),
    period: z.string().describe('The employment period (e.g., "06/2023 - 09/2023").'),
    description: z.string().describe('A description of the responsibilities and achievements in the role.'),
  })).describe('A list of work experiences.'),
  personalInfo: z.object({
    fullName: z.string().optional().describe('The full name of the candidate.'),
    birthYear: z.number().optional().describe('The birth year of the candidate.'),
    gender: z.string().optional().describe('The gender of the candidate.'),
    phone: z.string().optional().describe('The phone number of the candidate.'),
    japaneseProficiency: z.string().optional().describe('Japanese language proficiency (e.g., "N3").'),
    englishProficiency: z.string().optional().describe('English language proficiency (e.g., "TOEIC 700").'),
    dateOfBirth: z.string().optional().describe('The full date of birth (e.g., "12/12/2006").'),
    height: z.string().optional().describe('The height of the candidate (e.g., "165 cm").'),
    weight: z.string().optional().describe('The weight of the candidate (e.g., "55 kg").'),
    tattooStatus: z.string().optional().describe('Tattoo status (e.g., "Xăm nhỏ", "Không có").'),
    hepatitisBStatus: z.string().optional().describe('Hepatitis B status (e.g., "Không viêm gan B").'),
    messenger: z.string().optional().describe('The Messenger ID or link for the candidate.'),
    zalo: z.string().optional().describe('The Zalo phone number for the candidate.'),
    line: z.string().optional().describe('The Line ID or link for the candidate.'),
  }),
  interests: z.array(z.string()).describe('A list of professional interests or industries.'),
  skills: z.array(z.string()).describe('A list of key skills.'),
  certifications: z.array(z.string()).describe('A list of certifications or awards.'),
  documents: z.object({
    vietnam: z.array(DocumentItemSchema).optional().describe('List of Vietnamese documents.'),
    japan: z.array(DocumentItemSchema).optional().describe('List of Japanese documents.'),
    other: z.array(DocumentItemSchema).optional().describe('List of other/foreign documents.'),
  }).optional().describe('A collection of the candidate\'s legal documents.'),
  desiredIndustry: z.string().describe('The desired industry for future roles.'),
  aspirations: z.object({
    suggestionType: z.string().optional().describe('The type of job suggestion (e.g., "accurate", "related").'),
    workLocation: z.array(z.string()).optional().describe('The desired work location (e.g., "Osaka").'),
    career: z.string().optional().describe('The desired work location (e.g., "Osaka").'),
    job: z.string().optional().describe('The desired work location (e.g., "Osaka").'),
    basicSalary: z.number().min(0).max(1000000).optional().describe('The desired basic salary (e.g., "180,000 yên").'),
    realSalary: z.number().min(0).max(1000000).optional().describe('The desired net salary (e.g., "160,000 yên").'),
    visa: z.string().optional().describe('The detailed desired visa type (e.g., "Đặc định đầu Nhật").'),
    visaDetail: z.string().optional().describe('The detailed desired visa type (e.g., "Đặc định đầu Nhật").'),
    fee: z.number().min(0).max(3800).optional().describe('Financial ability (e.g., "90 triệu").'),
    interviewLocation: z.string().optional().describe('The location for job interviews (e.g., "Hà Nội").'),
    interviewDate: z.date().optional().describe('Thời gian phỏng vấn mong muốn'),
    interviewDateType: z.string().optional().describe('A list of special requests or aspirations (e.g., ["Tăng ca", "Hỗ trợ nhà ở"]).'),
    gender: z.string().optional().describe('Giới tính'),
    haveTattoo: z.string().optional().describe('Hình xăm'),
  }).optional(),
  notes: z.string().optional().describe('Additional notes or descriptions.'),
});

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;


