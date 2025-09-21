

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
  Building,
} from 'lucide-react';

export const mainNavLinks = [
  { href: '/', label: 'Trang chủ', icon: Home, mobile: true },
  { href: '/viec-lam', label: 'Việc làm' },
  { href: '/lo-trinh', label: 'Lộ trình' },
  {
    href: '/tao-ho-so-ai',
    label: 'Tạo hồ sơ AI',
    icon: Sparkles,
    mobile: true,
  },
  { href: '/cam-nang', label: 'Cẩm nang', icon: LifeBuoy, mobile: true },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
];

export const quickAccessLinks = [
  { href: '/lo-trinh', label: 'Lộ trình', icon: Compass },
  { href: '/tu-van-vien', label: 'Tư vấn viên', icon: UserSearch },
  { href: '/doi-tac/bang-dieu-khien', label: 'Nhà tuyển dụng', icon: Building },
  { href: '/bang-dieu-khien', label: 'Dữ liệu & Báo cáo', icon: FileText },
  { href: '/nhuong-quyen', label: 'Đối tác tại Nhật', icon: Handshake },
  { href: '/viec-lam-cua-toi', label: 'Việc của tôi', icon: Briefcase },
  { href: '/gop-y', label: 'Góp ý', icon: MessageSquareWarning },
  { href: '/nang-cap-premium', label: 'Nâng cấp Premium', icon: Gem },
  { href: '/gioi-thieu-ban-be', label: 'Giới thiệu bạn bè', icon: UserPlus },
];

// Re-ordered to a stable, logical order to fix hydration errors.
export const mobileFooterLinks = [
  { href: '/viec-lam', label: 'Việc làm', icon: Briefcase },
  { href: '/lo-trinh', label: 'Lộ trình', icon: Compass },
  { href: '/tao-ho-so-ai', label: 'Hồ sơ AI', icon: Sparkles },
  { href: '/cam-nang', label: 'Cẩm nang', icon: LifeBuoy },
  { href: '/tu-van-vien', label: 'Tư vấn viên', icon: UserSearch },
  { href: '/gioi-thieu', label: 'Giới thiệu', icon: Info },
];
