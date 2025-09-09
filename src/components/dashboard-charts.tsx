'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const pieData = [
  { name: 'Cơ khí', value: 400 },
  { name: 'Điện tử', value: 300 },
  { name: 'Dệt may', value: 300 },
  { name: 'Chế biến TP', value: 200 },
  { name: 'IT/Phần mềm', value: 278 },
  { name: 'Logistics', value: 189 },
];

const barData = [
  { name: 'Vận hành máy', value: 2400 },
  { name: 'Lắp ráp', value: 1398 },
  { name: 'Kiểm tra chất lượng', value: 9800 },
  { name: 'Sửa chữa', value: 3908 },
  { name: 'Lập trình', value: 4800 },
  { name: 'Ngoại ngữ', value: 3800 },
];

// Updated vibrant colors from globals.css
const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))',
  '#38A3A5' // Fallback
];


export function DashboardCharts() {
  return (
    <>
      <Card className="lg:col-span-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Ngành nghề quan tâm</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  cursor={{fill: 'hsla(var(--muted), 0.5)'}}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderRadius: 'var(--radius)',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Kỹ năng phổ biến</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'hsla(var(--muted), 0.5)'}}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderRadius: 'var(--radius)',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Legend />
                <Bar dataKey="value" name="Số lượng ứng viên" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
