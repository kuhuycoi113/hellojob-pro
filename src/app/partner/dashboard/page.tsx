
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Briefcase, Users, PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jobData } from '@/lib/mock-data';

const stats = [
    { title: "Tin đã đăng", value: jobData.length, icon: Briefcase },
    { title: "Lượt xem", value: "2,480", icon: Eye },
    { title: "Ứng viên", value: 45, icon: Users },
];

const postedJobs = jobData;

export default function PartnerDashboardPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">Bảng điều khiển</h1>
                <Button asChild>
                    <Link href="/doi-tac/dang-tin-tuyen-dung"><PlusCircle/> Đăng tin tuyển dụng mới</Link>
                </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map(stat => (
                    <Card key={stat.title} className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Jobs Table */}
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle>Tin tuyển dụng của bạn</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Chức danh</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-center">Lượt xem</TableHead>
                                <TableHead className="text-center">Ứng viên</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {postedJobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/doi-tac/viec-lam/${job.id}`} className="hover:text-primary">
                                            {job.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={job.status === 'Đang tuyển' ? 'default' : 'secondary'} className={job.status === 'Đang tuyển' ? 'bg-green-100 text-green-700' : ''}>
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{job.likes}</TableCell>
                                    <TableCell className="text-center">{job.applicants?.count || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                   <Link href={`/doi-tac/viec-lam/${job.id}`} className="flex items-center w-full cursor-pointer">
                                                      <Eye className="mr-2 h-4 w-4"/>Xem ứng viên
                                                   </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/>Sửa tin</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Xóa tin</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
