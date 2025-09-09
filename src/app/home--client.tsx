import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
    title: 'HelloJob: Việc làm tại Nhật Bản - Xây dựng sự nghiệp bền vững',
    description: 'Tìm kiếm hàng ngàn cơ hội việc làm Kỹ năng đặc định (Tokutei Ginou), Thực tập sinh, Kỹ sư tại Nhật Bản. HelloJob đồng hành cùng bạn xây dựng lộ trình sự nghiệp (SWR) rõ ràng và hiệu quả.',
}

export default function HomePage() {
  return <HomeClient />;
}