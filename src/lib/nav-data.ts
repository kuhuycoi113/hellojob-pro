
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
} from 'lucide-react';

export const mainNavLinks = [
  { href: '/', label: 'Trang chủ', icon: Home, mobile: true },
  { href: '/roadmap', label: 'Lộ trình' },
  { href: '/career-orientation', label: 'Hướng nghiệp' },
  {
    href: '/ai-profile',
    label: 'Hồ sơ AI',
    icon: Sparkles,
    mobile: true,
  },
  { href: '/handbook', label: 'Cẩm nang', icon: LifeBuoy, mobile: true },
  { href: '/about', label: 'Giới thiệu' },
];

export const quickAccessLinks = [
  { href: '/roadmap', label: 'Lộ trình', icon: Compass },
  { href: '/career-orientation', label: 'Hướng nghiệp', icon: Compass },
  { href: '/about', label: 'Giới thiệu', icon: Info },
  { href: '/post-job', label: 'Đăng tuyển dụng', icon: PlusCircle },
  { href: '/dashboard', label: 'Dữ liệu & Báo cáo', icon: FileText },
  { href: '/franchise', label: 'Đối tác tại Nhật', icon: Handshake },
  { href: '/consultant-profile', label: 'Tư vấn viên', icon: User },
  { href: '/feedback', label: 'Góp ý', icon: MessageSquareWarning },
  { href: '/premium', label: 'Nâng cấp Premium', icon: Gem },
  { href: '/referral', label: 'Giới thiệu bạn bè', icon: UserPlus },
];

// Re-ordered to a stable, logical order to fix hydration errors.
export const mobileFooterLinks = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/ai-profile', label: 'Hồ sơ AI', icon: Sparkles },
  { href: '/handbook', label: 'Cẩm nang', icon: LifeBuoy },
  { href: '/jobs', label: 'Việc làm', icon: Briefcase },
];
