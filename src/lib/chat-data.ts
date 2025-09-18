
'use client';

import { JobRecommendationResponse } from "@/ai/schemas/recommend-jobs-schema";

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  dataAiHint?: string;
  isBot?: boolean;
  mainExpertise?: string;
  experience?: string;
  successfulCandidates?: number;
  strengths?: string[];
};

export type Attachment = {
  type: 'image' | 'video' | 'file';
  url: string;
  fileName?: string;
}

export type Message = {
  id: string;
  sender: User;
  text: string;
  timestamp: string;
  isLoading?: boolean;
  recommendations?: JobRecommendationResponse['recommendations'];
  suggestedReplies?: string[];
  attachment?: Attachment;
};

export type Conversation = {
  id: string;
  participants: User[];
  messages: Message[];
};

export const currentUser: User = {
  id: 'user-0',
  name: 'Lê Ngọc Hân',
  avatarUrl: 'https://placehold.co/100x100.png?text=Me',
};

// Real consultants
export const consultants: User[] = [
    {
    id: 'le-xuan-long',
    name: 'Lê Xuân Long',
    avatarUrl: '/img/long.jpg',
    dataAiHint: 'professional man portrait',
    experience: '5 năm',
    mainExpertise: 'Tư vấn việc làm Kỹ năng đặc định (Tokutei)',
    successfulCandidates: 412,
    strengths: ['Tận tình', 'Nhiều đơn', 'Hiểu rõ ngành'],
  },
  {
    id: 'nguyen-thi-phuong-loan',
    name: 'Nguyễn Thị Phương Loan',
    avatarUrl: '/img/TVV002.jpg',
    dataAiHint: 'professional woman portrait',
    experience: '4 năm',
    mainExpertise: 'Tư vấn Đặc định và Kỹ sư, tri thức',
    successfulCandidates: 350,
    strengths: ['Nhiệt tình', 'Hỗ trợ 24/7', 'Quan hệ rộng'],
  },
   {
    id: 'nguyen-thi-ngoc-oanh',
    name: 'Nguyễn Thị Ngọc Oanh',
    avatarUrl: '/img/TVV003.png',
    dataAiHint: 'professional woman portrait',
    experience: '3 năm',
    mainExpertise: 'Tư vấn Tokutei Vận tải, Xây dựng, Thực phẩm',
    successfulCandidates: 310,
    strengths: ['Nhiều đơn gấp', 'Hỗ trợ nhiệt tình', 'Kinh nghiệm'],
  },
  {
    id: 'pham-thi-ha',
    name: 'Phạm Thị Hà',
    avatarUrl: '/img/TVV004.png',
    dataAiHint: 'professional woman portrait',
    experience: '2 năm',
    mainExpertise: 'Tư vấn Nhà hàng, Cơ khí, Điều dưỡng, Nông nghiệp',
    successfulCandidates: 220,
    strengths: ['Tận tâm', 'Am hiểu thủ tục', 'Hỗ trợ chi tiết'],
  },
  {
    id: 'nguyen-van-minh',
    name: 'Đào Quang Minh',
    avatarUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'male consultant portrait',
    experience: '6 năm',
    mainExpertise: 'Tư vấn Công xưởng và Ngoài trời',
    successfulCandidates: 500,
    strengths: ['Kinh nghiệm', 'Quan hệ rộng', 'Tỷ lệ đỗ cao'],
  },
  {
    id: 'nguyen-thi-thu-trang',
    name: 'Nguyễn Thị Thu Trang',
    avatarUrl: '/img/TVV006.jpg',
    dataAiHint: 'female consultant smiling',
    experience: '3 năm',
    mainExpertise: 'Tư vấn Thực tập sinh kỹ năng và Đặc định',
    successfulCandidates: 290,
    strengths: ['Nhiệt tình', 'Am hiểu ngành', 'Hỗ trợ nhanh'],
  },
];

// AI Bot persona
export const helloJobBot: User = {
    id: 'bot-hellojob',
    name: 'HelloJob AI',
    avatarUrl: '/img/favi2.png',
    dataAiHint: 'friendly robot mascot',
    isBot: true,
};


// Initial conversations data
export const conversations: Conversation[] = [
  {
    id: 'convo-bot-hellojob',
    participants: [currentUser, helloJobBot],
    messages: [
      { 
        id: 'msg-bot-1', 
        sender: helloJobBot, 
        text: 'Chào bạn, tôi là trợ lý AI của HelloJob. Bạn đang tìm kiếm loại công việc nào? Hãy mô tả mong muốn của bạn nhé!', 
        timestamp: '2024-07-29T10:00:00Z' 
      },
    ],
  },
];

// Legacy users array for other parts of the app if needed
export const users: User[] = [ ...consultants ];
