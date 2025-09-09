
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
import { barrettValues, barrettLevels, type BarrettValue } from '@/lib/barrett-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const MAX_SELECTIONS = 10;

export default function BarrettTestPage() {
  const [selectedValues, setSelectedValues] = useState<BarrettValue[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleValueClick = (value: BarrettValue) => {
    setSelectedValues((prev) => {
      if (prev.some(v => v.id === value.id)) {
        return prev.filter((v) => v.id !== value.id);
      }
      if (prev.length < MAX_SELECTIONS) {
        return [...prev, value];
      }
      return prev;
    });
  };
  
  const handleSubmit = () => {
      setShowResults(true);
  }

  const getLevelCounts = () => {
      const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
      selectedValues.forEach(v => {
          counts[v.level]++;
      });
      return counts;
  }

  if (showResults) {
      const levelCounts = getLevelCounts();
      const topLevel = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0];
      const topLevelInfo = barrettLevels[parseInt(topLevel[0])];
      
    return (
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Kết quả Phân tích Giá trị</CardTitle>
              <CardDescription>Dưới đây là những giá trị cốt lõi bạn đã chọn và phân tích về các cấp độ ý thức của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
               <div>
                  <h3 className="font-bold text-lg mb-4 text-center">10 Giá trị cá nhân của bạn</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedValues.map(value => (
                       <Badge key={value.id} className={cn("text-base", barrettLevels[value.level].twColor)}>{value.name}</Badge>
                    ))}
                  </div>
               </div>
               
               <div className="text-center p-6 bg-primary/10 rounded-lg">
                <h3 className="text-xl font-bold font-headline mb-2">Cấp độ ý thức nổi bật của bạn:</h3>
                <h4 className={cn("text-2xl font-bold font-headline", topLevelInfo.twColor)}>{topLevelInfo.name}</h4>
                <p className="mt-2 text-muted-foreground">{topLevelInfo.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2 text-center">Gợi ý môi trường làm việc</h4>
                <p className="text-center text-muted-foreground">{topLevelInfo.workplaceFit}</p>
              </div>

            </CardContent>
             <CardFooter className="flex justify-center">
                <Button onClick={() => setShowResults(false)}>Làm lại bài test</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary py-12 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
           <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl md:text-3xl">
                Điều gì quan trọng nhất đối với bạn?
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Hãy chọn ra <strong>{MAX_SELECTIONS}</strong> giá trị mô tả đúng nhất về con người bạn, về những điều bạn tin tưởng và mong muốn.
              </CardDescription>
              <div className="pt-4 font-bold text-lg">
                Đã chọn: {selectedValues.length} / {MAX_SELECTIONS}
              </div>
            </CardHeader>
             <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                    {barrettValues.map(value => (
                        <button 
                            key={value.id}
                            onClick={() => handleValueClick(value)}
                            className={cn(
                                "px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-semibold",
                                selectedValues.some(v => v.id === value.id) 
                                    ? cn('text-white scale-105 shadow-lg', barrettLevels[value.level].twColor)
                                    : "bg-background hover:border-primary"
                            )}
                        >
                            {value.name}
                        </button>
                    ))}
                </div>
             </CardContent>
             <CardFooter className="flex justify-end mt-4">
               <Button onClick={handleSubmit} disabled={selectedValues.length !== MAX_SELECTIONS}>
                Xem kết quả <Check className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
