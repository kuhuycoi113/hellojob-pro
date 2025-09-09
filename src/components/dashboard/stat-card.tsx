
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
}

export function StatCard({ title, value, change }: StatCardProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                 {title.includes("Lượt xem") && <Eye className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-4 w-4 text-green-500"/> {change} so với tuần trước</p>}
            </CardContent>
        </Card>
    );
}
