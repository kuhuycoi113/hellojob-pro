
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from 'recharts';

interface ChartData {
    name: string;
    "Việc làm phù hợp với bạn": number;
    "Người có nhu cầu tìm việc giống bạn": number;
}

interface JobStatsChartProps {
    data: ChartData[];
}

export function JobStatsChart({ data }: JobStatsChartProps) {
  return (
    <Card className="lg:col-span-2 shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Thống kê hoạt động tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderRadius: 'var(--radius)',
                    border: '1px solid hsl(var(--border))'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Việc làm phù hợp với bạn" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Người có nhu cầu tìm việc giống bạn" stroke="hsl(var(--accent-green))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
