
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { DollarSign, Users, TrendingUp, Percent, ArrowRight, BookOpen, MousePointerClick, Eye, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';


const statsData = [
  { icon: DollarSign, title: 'Tổng doanh thu', value: '12,345,000', change: '+15.2%', currency: 'VND' },
  { icon: Users, title: 'Học viên mới (Tháng này)', value: '89', change: '+20.1%' },
  { icon: Percent, title: 'Tỷ lệ chuyển đổi', value: '4.75%', change: '-0.5%' },
  { icon: DollarSign, title: 'Doanh thu ròng (Tháng này)', value: '8,641,500', change: '+12.8%', currency: 'VND' },
];

const revenueData = [
  { month: 'T1', 'Doanh thu': 4000000 },
  { month: 'T2', 'Doanh thu': 3000000 },
  { month: 'T3', 'Doanh thu': 5000000 },
  { month: 'T4', 'Doanh thu': 4500000 },
  { month: 'T5', 'Doanh thu': 6000000 },
  { month: 'T6', 'Doanh thu': 5800000 },
];

const transactionData = [
    { id: 'TX001', student: { name: 'Lê Ngọc Hân', avatar: 'https://placehold.co/40x40.png?text=H' }, course: 'Tiếng Nhật N5', amount: '299,000 VND', status: 'Thành công' },
    { id: 'TX002', student: { name: 'Trần Văn Bình', avatar: 'https://placehold.co/40x40.png?text=B' }, course: 'Văn hoá công ty Nhật', amount: '199,000 VND', status: 'Thành công' },
    { id: 'TX003', student: { name: 'Phạm Thị Cúc', avatar: 'https://placehold.co/40x40.png?text=C' }, course: 'Tiếng Nhật N5', amount: '299,000 VND', status: 'Đang xử lý' },
];

const StatCard = ({ icon: Icon, title, value, change, currency }: typeof statsData[0]) => (
    <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value} <span className="text-lg text-muted-foreground">{currency}</span></div>
            <p className="text-xs text-muted-foreground">{change} so với tháng trước</p>
        </CardContent>
    </Card>
);

const RevenueChart = () => (
    <Card className="col-span-1 lg:col-span-2 shadow-xl">
        <CardHeader>
            <CardTitle>Tăng trưởng doanh thu</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000000}tr`} />
                        <Tooltip
                            cursor={{ fill: 'hsla(var(--muted), 0.5)' }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--border))'
                            }}
                            formatter={(value) => [`${Number(value).toLocaleString()} VND`, "Doanh thu"]}
                        />
                        <Bar dataKey="Doanh thu" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
);

const PaymentCard = () => (
    <Card className="col-span-1 shadow-xl">
        <CardHeader>
            <CardTitle>Thanh toán</CardTitle>
            <CardDescription>Kỳ thanh toán tiếp theo: 01/08/2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2 p-4 bg-secondary rounded-lg">
                <div className="flex justify-between text-sm"><span>Doanh thu tháng này:</span> <span className="font-medium">10,794,000</span></div>
                <div className="flex justify-between text-sm"><span>Phí nền tảng (30%):</span> <span className="font-medium text-red-500">- 3,238,200</span></div>
                <div className="flex justify-between text-sm"><span>Thuế TNCN (Ước tính):</span> <span className="font-medium text-red-500">- 755,580</span></div>
                <hr className="my-2"/>
                <div className="flex justify-between font-bold text-lg"><span>Thực nhận (Ước tính):</span> <span className="text-green-600">6,800,220</span></div>
            </div>
             <div className="flex items-center space-x-2 pt-4 border-t">
                <Switch id="tax-support" />
                <Label htmlFor="tax-support" className="text-sm">Ủy quyền cho HelloJob quyết toán thuế TNCN</Label>
            </div>
        </CardContent>
    </Card>
);

const FunnelStep = ({ icon: Icon, title, value, colorClass }: { icon: React.ElementType, title: string, value: string, colorClass: string }) => (
    <Card className={cn("p-4 text-center", colorClass)}>
        <div className="flex items-center gap-3">
             <div className="bg-white/50 p-2 rounded-full">
                 <Icon className="h-6 w-6" />
             </div>
            <div>
                <p className="text-sm font-semibold text-left">{title}</p>
                <p className="text-2xl font-bold text-left">{value}</p>
            </div>
        </div>
    </Card>
);

const ConversionFunnel = () => (
    <div className="col-span-1 lg:col-span-3 space-y-4">
        <div className="text-center">
             <h3 className="text-xl font-bold font-headline">Phễu chuyển đổi</h3>
             <p className="text-sm text-muted-foreground">Hành trình của người dùng từ khi truy cập đến khi thanh toán thành công.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <FunnelStep icon={MousePointerClick} title="Số lượt truy cập" value="10,250" colorClass="bg-blue-100 text-blue-800" />
            <FunnelStep icon={Eye} title="Xem bài miễn phí" value="4,870" colorClass="bg-purple-100 text-purple-800" />
            <FunnelStep icon={ShoppingCart} title="Click thanh toán" value="620" colorClass="bg-fuchsia-100 text-fuchsia-800" />
            <FunnelStep icon={CheckCircle} title="Mua hàng trả phí" value="415" colorClass="bg-green-100 text-green-800" />
            <FunnelStep icon={XCircle} title="Bỏ thanh toán" value="205" colorClass="bg-red-100 text-red-800" />
        </div>
    </div>
);


const RecentTransactions = () => (
    <Card className="col-span-1 lg:col-span-3 shadow-xl">
        <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Học viên</TableHead>
                        <TableHead>Khoá học</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactionData.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <Avatar className="h-8 w-8"><AvatarImage src={tx.student.avatar}/><AvatarFallback>{tx.student.name.charAt(0)}</AvatarFallback></Avatar>
                                {tx.student.name}
                            </TableCell>
                            <TableCell>{tx.course}</TableCell>
                            <TableCell className="text-right">{tx.amount}</TableCell>
                            <TableCell className="text-center">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.status === 'Thành công' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {tx.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


export default function InstructorDashboardPage() {
    return (
        <div className="bg-secondary min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-headline">Báo cáo & Phân tích</h1>
                        <p className="text-muted-foreground mt-2">
                            Theo dõi hiệu quả và doanh thu từ các khoá học của bạn.
                        </p>
                    </div>
                     <Button asChild>
                        <Link href="/learn/create/course"><BookOpen className="mr-2"/>Quản lý khoá học</Link>
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map(stat => <StatCard key={stat.title} {...stat} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <RevenueChart />
                    <PaymentCard />
                </div>
                
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                   <ConversionFunnel />
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
