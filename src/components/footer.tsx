import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground hidden md:block">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Giải pháp nhân lực toàn diện cho các khu công nghiệp tại Việt Nam.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dành cho ứng viên</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-primary">Đăng ký hồ sơ</Link></li>
              <li><Link href="/candidate-profile" className="hover:text-primary">Hồ sơ của tôi</Link></li>
              <li><Link href="/roadmap" className="hover:text-primary">Lộ trình sự nghiệp</Link></li>
              <li><Link href="/learn" className="hover:text-primary">Khóa học online</Link></li>
              <li><Link href="/consultant-profile" className="hover:text-primary">Tư vấn viên</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dành cho nhà tuyển dụng</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/post-job" className="hover:text-primary">Đăng tin tuyển dụng</Link></li>
              <li><Link href="/employers" className="hover:text-primary">Danh sách công ty</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Báo cáo dữ liệu</Link></li>
              <li><Link href="/franchise" className="hover:text-primary">Đối tác tại Nhật</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <p className="text-sm text-muted-foreground">
              HelloJob JSC<br />
              Email: contact@hellojob.vn<br />
              Hotline: 1900 1234
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HelloJob. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
