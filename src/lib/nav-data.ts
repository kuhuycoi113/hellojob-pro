

import {
  Compass,
  BookOpen,
  LifeBuoy,
  Info,
  Handshake,
  Gem,
  UserPlus,
  PlusCircle,
  FileText,
  User,
  LayoutGrid,
  MessageSquareWarning,
  Sparkles,
  Home,
  Briefcase,
  UserSearch,
} from 'lucide-react';

export const mainNavLinks = [
  { href: '/', label: 'Trang chủ', icon: Home, mobile: true },
  { href: '/roadmap', label: 'Lộ trình' },
  {
    href: '/ai-profile',
    label: 'Tạo hồ sơ AI',
    icon: Sparkles,
    mobile: true,
  },
  { href: '/handbook', label: 'Cẩm nang', icon: LifeBuoy, mobile: true },
  { href: '/about', label: 'Giới thiệu' },
];

export const quickAccessLinks = [
  { href: '/roadmap', label: 'Lộ trình', icon: Compass },
  { href: '/consultant-profile', label: 'Tư vấn viên', icon: UserSearch },
  { href: '/post-job', label: 'Đăng tuyển dụng', icon: PlusCircle },
  { href: '/dashboard', label: 'Dữ liệu & Báo cáo', icon: FileText },
  { href: '/franchise', label: 'Đối tác tại Nhật', icon: Handshake },
  { href: '/my-jobs', label: 'Việc của tôi', icon: Briefcase },
  { href: '/feedback', label: 'Góp ý', icon: MessageSquareWarning },
  { href: '/premium', label: 'Nâng cấp Premium', icon: Gem },
  { href: '/referral', label: 'Giới thiệu bạn bè', icon: UserPlus },
];

// Re-ordered to a stable, logical order to fix hydration errors.
export const mobileFooterLinks = [
  { href: '/roadmap', label: 'Lộ trình', icon: Compass },
  { href: '/ai-profile', label: 'Hồ sơ AI', icon: Sparkles },
  { href: '/handbook', label: 'Cẩm nang', icon: LifeBuoy },
  { href: '/about', label: 'Giới thiệu', icon: Info },
  { href: '/my-jobs', label: 'Việc của tôi', icon: Briefcase },
];
