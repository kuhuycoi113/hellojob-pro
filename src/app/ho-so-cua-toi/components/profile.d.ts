type Language = 'vi' | 'ja' | 'en';

type ProfilesByLang = {
    vi: EnrichedCandidateProfile | null;
    ja: Partial<EnrichedCandidateProfile> | null;
    en: Partial<EnrichedCandidateProfile> | null;
}

type MediaItem = {
    src: string;
    thumbnail?: string;
    alt: string;
    "data-ai-hint": string;
};

type DocumentName = {
    vi: string;
    ja?: string;
    en?: string;
};

type DocumentItem = {
    name: DocumentName;
    url?: string; // Data URL of the uploaded file
    isDefault?: boolean; // Flag to identify default documents
    fileType?: 'pdf' | 'image'; // Track the file type
};

type EnrichedCandidateProfile = Omit<CandidateProfile, 'documents'> & {
    avatarUrl?: string;
    videos: MediaItem[];
    images: MediaItem[];
    documents?: { vietnam: DocumentItem[]; japan: DocumentItem[]; other: DocumentItem[] }
};