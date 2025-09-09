
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from 'recharts';

const data = [
  { name: 'T2', 'Job phù hợp': 4, 'Hồ sơ của bạn': 2 },
  { name: 'T3', 'Job phù hợp': 3, 'Hồ sơ của bạn': 5 },
  { name: 'T4', 'Job phù hợp': 5, 'Hồ sơ của bạn': 3 },
  { name: 'T5', 'Job phù hợp': 2, 'Hồ sơ của bạn': 6 },
  { name: 'T6', 'Job phù hợp': 7, 'Hồ sơ của bạn': 4 },
  { name: 'T7', 'Job phù hợp': 6, 'Hồ sơ của bạn': 5 },
  { name: 'CN', 'Job phù hợp': 8, 'Hồ sơ của bạn': 7 },
];

export function JobStatsChart() {
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
              <Line type="monotone" dataKey="Job phù hợp" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Hồ sơ của bạn" stroke="hsl(var(--accent-green))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
