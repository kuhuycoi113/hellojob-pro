
import { z } from 'zod';

export const CandidateProfileSchema = z.object({
  name: z.string().describe('The full name of the candidate.'),
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
    birthYear: z.number().describe('The birth year of the candidate.'),
    gender: z.string().describe('The gender of the candidate.'),
    phone: z.string().describe('The phone number of the candidate.'),
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
      vietnam: z.array(z.string()).optional().describe('List of Vietnamese documents.'),
      japan: z.array(z.string()).optional().describe('List of Japanese documents.'),
      other: z.array(z.string()).optional().describe('List of other/foreign documents.'),
  }).optional().describe('A collection of the candidate\'s legal documents.'),
  desiredIndustry: z.string().describe('The desired industry for future roles.'),
  aspirations: z.object({
    desiredLocation: z.string().optional().describe('The desired work location (e.g., "Osaka").'),
    desiredSalary: z.string().optional().describe('The desired basic salary (e.g., "180,000 yên").'),
    desiredNetSalary: z.string().optional().describe('The desired net salary (e.g., "160,000 yên").'),
    desiredVisaType: z.string().optional().describe('The desired visa type (e.g., "Kỹ năng đặc định").'),
    desiredVisaDetail: z.string().optional().describe('The detailed desired visa type (e.g., "Đặc định đầu Nhật").'),
    desiredJobDetail: z.string().optional().describe('A more specific job role or task the candidate wants (e.g., "Vận hành máy CNC", "Làm cơm hộp").'),
    financialAbility: z.string().optional().describe('Financial ability (e.g., "90 triệu").'),
    interviewLocation: z.string().optional().describe('The location for job interviews (e.g., "Hà Nội").'),
    specialAspirations: z.string().optional().describe('Special requests or aspirations (e.g., "Tăng ca, hỗ trợ...").'),
  }).optional(),
  notes: z.string().optional().describe('Additional notes or descriptions.'),
});

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;

    
