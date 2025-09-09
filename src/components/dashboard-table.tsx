
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const candidates = [
  { id: 1, name: 'Lê Thị An', school: 'ĐH Bách Khoa', skills: ['Lập trình', 'Tiếng Anh'], industry: 'IT' },
  { id: 2, name: 'Trần Văn Bình', school: 'CĐ Kỹ thuật Cao Thắng', skills: ['Vận hành máy', 'Sửa chữa'], industry: 'Cơ khí' },
  { id: 3, name: 'Phạm Thị Cúc', school: 'ĐH Công nghiệp', skills: ['Kiểm tra chất lượng'], industry: 'Dệt may' },
  { id: 4, name: 'Nguyễn Hùng Dũng', school: 'THPT', skills: ['Lắp ráp'], industry: 'Điện tử' },
  { id: 5, name: 'Võ Thị Em', school: 'ĐH Kinh tế', skills: ['Tiếng Nhật', 'Logistics'], industry: 'Logistics' },
  { id: 6, name: 'Đặng Văn Giang', school: 'CĐ Nghề', skills: ['Vận hành máy'], industry: 'Cơ khí' },
  { id: 7, name: 'Hoàng Thị Hoa', school: 'ĐH Sư phạm Kỹ thuật', skills: ['Kiểm tra chất lượng', 'Tiếng Hàn'], industry: 'Điện tử' },
  { id: 8, name: 'Lý Văn Ích', school: 'THPT', skills: ['Lắp ráp'], industry: 'Dệt may' },
  { id: 9, name: 'Bùi Thị Kim', school: 'ĐH Khoa học Tự nhiên', skills: ['Lập trình', 'Phân tích dữ liệu'], industry: 'IT' },
  { id: 10, name: 'Dương Văn Long', school: 'CĐ Giao thông Vận tải', skills: ['Vận hành xe nâng'], industry: 'Logistics' },
];

const industryColors: { [key: string]: string } = {
  IT: 'bg-sky-100 text-sky-700',
  'Cơ khí': 'bg-orange-100 text-orange-700',
  'Dệt may': 'bg-indigo-100 text-indigo-700',
  'Điện tử': 'bg-blue-100 text-blue-700',
  'Logistics': 'bg-green-100 text-green-700',
};

export function CandidatesTable() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead className="w-[200px]">Tên ứng viên</TableHead>
            <TableHead>Trường/Trình độ</TableHead>
            <TableHead>Kỹ năng</TableHead>
            <TableHead>Ngành mong muốn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id} className="hover:bg-secondary/50">
              <TableCell className="font-medium">
                <Link href="/candidate-profile" className="hover:underline text-primary">
                    {candidate.name}
                </Link>
              </TableCell>
              <TableCell>{candidate.school}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-normal">{skill}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`font-semibold ${industryColors[candidate.industry] || 'bg-gray-100 text-gray-700'}`}>{candidate.industry}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
