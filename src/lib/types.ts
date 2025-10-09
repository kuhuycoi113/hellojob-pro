
export type CandidateStatus = 'NEW' | 'PENDING' | 'APPROACHED' | 'CUSTOMERREPLIED' | 'BASICINFO' | 'ORDERCONFIRMED' | 'WAITINGRESULT' | 'PASSEDINTERVIEW' | 'FAILEDINTERVIEW' | 'CANCEL';

export type Candidate = {
  id: string;
  fullName: string;
  sender?: string | null;
  avatarUrl?: string | null;
  avatar?: string | null; // Added back to prevent breaking other pages
  email?: string | null;
  phone?: string | null;
  baseContent?: string | null;
  aiContent?: string | null;
  status: CandidateStatus;
  statusJourney?: CandidateStatus;
  postedDate: number;
  createdDate: number;
  source: string;
  gender: 'MALE' | 'FEMALE' | null;
  dateOfBirth?: number | null;
  age?: number | null;
  experience?: string | null;
  languageLevel?: string | null;
  languageProficiency?: string | null;
  visa?: string;
  job?: string;
  career?: string;
  country?: string;
  postLink?: string | null;
};


export type Job = {
  id: string;
  avatar?: string | null;
  career: string;
  job: string;
  visa: 'Thực tập sinh kỹ năng' | 'Kỹ năng đặc định' | 'Kỹ sư, tri thức';
  workLocation?: string | null;
  statusJob: 'Đang mở' | 'Đã đóng' | 'Tạm dừng';
  createdDate: number;
  source: 'direct' | 'crawled';
  [key: string]: any
};

export type Partner = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'Hoạt động' | 'Không hoạt động';
};

export type Role = {
  id: string;
  name: string;
  status: 'Hiển thị' | 'Ẩn';
  routes?: string[];
  createdAt: string;
};

export type FirestoreUser = {
  id: string;
  fullName: string;
  phoneNumberUser: string | null;
  phoneNumber: string | null;
  email: string | null;
  createdDate: string;
  role: string | null;
}

export type PaginatedResponse<T> = {
  docs: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
