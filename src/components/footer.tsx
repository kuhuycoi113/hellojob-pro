

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Giải pháp dịch chuyển lao động toàn cầu
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dành cho ứng viên</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dang-ky" className="hover:text-primary">Đăng ký hồ sơ</Link></li>
              <li><Link href="/ho-so-cua-toi" className="hover:text-primary">Hồ sơ của tôi</Link></li>
              <li><Link href="/lo-trinh" className="hover:text-primary">Lộ trình sự nghiệp</Link></li>
              <li><Link href="/hoc-tap" className="hover:text-primary">Khóa học online</Link></li>
              <li><Link href="/tu-van-vien" className="hover:text-primary">Tư vấn viên</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dành cho nhà tuyển dụng</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/doi-tac/dang-tin-tuyen-dung" className="hover:text-primary">Đăng tin tuyển dụng</Link></li>
              <li><Link href="/nha-tuyen-dung" className="hover:text-primary">Danh sách công ty</Link></li>
              <li><Link href="/bang-dieu-khien" className="hover:text-primary">Báo cáo dữ liệu</Link></li>
              <li><Link href="/nhuong-quyen" className="hover:text-primary">Đối tác tại Nhật</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <p className="text-sm text-muted-foreground">
              Công ty cổ phần HelloJob<br />
              Email: chairman@hellojob.jp<br />
              Hotline: (+84) 038 666 7 999
            </p>
            <div className="mt-4 flex gap-4 items-center">
              <Link href="http://online.gov.vn/Home/WebDetails/80054" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Image 
                  src="/img/DADANGKYBCT.png"
                  alt="Đã đăng ký Bộ Công Thương"
                  width={200}
                  height={75}
                  data-ai-hint="ministry of industry and trade logo"
                  className="w-48 h-auto"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HelloJob. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

