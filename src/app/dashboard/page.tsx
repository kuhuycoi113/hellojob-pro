
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DashboardCharts } from '@/components/dashboard-charts';
import { CandidatesTable } from '@/components/dashboard-table';

export default function DashboardPage() {
  return (
    <div className="bg-secondary flex-1">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">Bảng điều khiển dữ liệu</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Phân tích tổng quan về nguồn nhân lực tiềm năng.</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6 flex flex-wrap items-center gap-4">
            <h3 className="font-semibold text-lg mr-4">Bộ lọc:</h3>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tỉnh/Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                  <SelectItem value="hanoi">Hà Nội</SelectItem>
                  <SelectItem value="danang">Đà Nẵng</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Trình độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thpt">THPT</SelectItem>
                  <SelectItem value="cd">Cao đẳng</SelectItem>
                  <SelectItem value="dh">Đại học</SelectItem>
                </SelectContent>
              </Select>
               <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ngành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Công nghệ thông tin</SelectItem>
                  <SelectItem value="cokhi">Cơ khí</SelectItem>
                  <SelectItem value="detmay">Dệt may</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full bg-accent-orange text-white hover:bg-accent-orange/90">Áp dụng</Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <DashboardCharts />
        </div>

        {/* Table */}
        <Card className="shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">10 Ứng viên nổi bật</CardTitle>
            <CardDescription>Danh sách các ứng viên tiềm năng nhất dựa trên bộ lọc.</CardDescription>
          </CardHeader>
          <CardContent>
            <CandidatesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
