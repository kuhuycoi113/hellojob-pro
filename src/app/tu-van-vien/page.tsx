
'use client';

import { ConsultantList } from '@/components/consultant-list';

export default function ConsultantListPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold text-accent">Đội ngũ tư vấn viên chuyên nghiệp</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                Những chuyên gia tận tâm sẽ đồng hành cùng bạn trên con đường chinh phục sự nghiệp tại Nhật Bản.
            </p>
        </div>
        <ConsultantList />
      </div>
    </div>
  );
}
