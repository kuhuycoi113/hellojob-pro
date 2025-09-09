
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { hollandDataThcs, hollandDataPtthSv, hollandDataDiLam, type HollandGroup } from '@/lib/holland-data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Answers = {
  [key: string]: number; // key is "groupCode-questionId", value is the score
};

const interestLevels = [
  { value: 2, label: 'Thích' },
  { value: 1, label: 'Không rõ' },
  { value: 0, label: 'Không thích' },
];

const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#AF19FF', '#FF19A6'];

const getHollandDataByAgeGroup = (ageGroup: string | null): HollandGroup[] => {
    switch (ageGroup) {
        case 'thcs':
            return hollandDataThcs;
        case 'ptth-sv':
            return hollandDataPtthSv;
        case 'di-lam':
            return hollandDataDiLam;
        default:
            return hollandDataDiLam; // Default to working adults
    }
}


export default function HollandTestClient() {
  const searchParams = useSearchParams();
  const ageGroup = searchParams.get('ageGroup');

  const [hollandData, setHollandData] = useState<HollandGroup[] | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = getHollandDataByAgeGroup(ageGroup);
    setHollandData(data);
  }, [ageGroup]);

   useEffect(() => {
    const currentHeader = headerRef.current;
    if (!currentHeader) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { rootMargin: "-1px 0px 0px 0px", threshold: 1.0 } 
    );

    observer.observe(currentHeader);

    return () => {
      if (currentHeader) {
        observer.unobserve(currentHeader);
      }
    };
  }, [hollandData]);

  if (!hollandData) {
      return (
        <div className="bg-secondary py-12 flex items-center justify-center min-h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      )
  }

  const totalQuestions = hollandData.reduce((sum, group) => sum + group.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  const currentGroup = hollandData[currentGroupIndex];
  
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentGroup.code}-${questionId}`]: parseInt(value, 10),
    }));
  };

  const handleNext = () => {
    if (currentGroupIndex < hollandData.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
      window.scrollTo(0, 0); // Scroll to top on next group
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const scores = hollandData.map(group => ({
      name: group.name,
      code: group.code,
      score: group.questions.reduce((total, q) => total + (answers[`${group.code}-${q.id}`] || 0), 0),
    }));
    scores.sort((a, b) => b.score - a.score);

    // Save top result to localStorage
    if (scores.length > 0) {
      localStorage.setItem('hollandResultCode', scores[0].code);
    }
    
    return scores;
  };

  if (showResults) {
    const results = calculateResults();
    const topGroup = results[0];
    const topGroupData = hollandData.find(g => g.code === topGroup.code);

    return (
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Kết quả trắc nghiệm Holland</CardTitle>
              <CardDescription>Đây là nhóm sở thích nghề nghiệp nổi trội nhất của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <h3 className="text-2xl font-bold font-headline">{topGroup.name}</h3>
                <p className="mt-2 text-muted-foreground">{topGroupData?.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-center">Biểu đồ điểm các nhóm</h4>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={results} layout="vertical" margin={{ left: 120 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{fill: 'hsla(var(--muted), 0.5)'}}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Bar dataKey="score" fill="#8884d8" barSize={30}>
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}\
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2 text-center">Gợi ý nghề nghiệp cho nhóm {topGroup.code}</h4>
                <p className="text-center text-muted-foreground">Dựa trên kết quả, bạn có thể phù hợp với các công việc liên quan đến kỹ thuật, máy móc, và các hoạt động thực tế. Hãy tìm kiếm các việc làm trong ngành cơ khí, xây dựng, nông nghiệp tại Nhật Bản.</p>
                 <div className="text-center mt-6">
                    <Button asChild size="lg">
                        <Link href="/career-orientation/onet">
                            Xem gợi ý nghề nghiệp chi tiết <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const groupNameShort = currentGroup.name.split(' - ')[1];

  return (
    <div className="bg-secondary py-12">
      <div className="relative max-w-4xl mx-auto">
        <div className="relative max-w-4xl mx-auto">
          {/* Sticky Header - This is shown only when scrolled */}
          <div
            className={cn(
              'sticky top-0 z-20 w-full transition-opacity max-w-4xl mx-auto',
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg border-b border-x -mb-px">
              <div className="p-4">
                <h2 className="font-bold text-lg">{`Holland - ${groupNameShort} (${currentGroupIndex + 1}/${
                  hollandData.length
                })`}</h2>
              </div>
              <div className="grid grid-cols-5 p-2 font-semibold border-t bg-secondary/50">
                <div className="col-span-2 text-left pl-3">Hoạt động</div>
                {interestLevels.map((level) => (
                  <div key={level.value} className="text-center text-xs md:text-sm whitespace-nowrap">
                    {level.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card
            className={cn(
              'shadow-xl overflow-visible',
              isScrolled ? 'rounded-t-none border-t-0' : ''
            )}
          >
            <CardHeader ref={headerRef}>
              <Progress value={progress} className="mb-4 h-2" />
              <h2 className="text-3xl font-headline font-bold">
                {`Trắc nghiệm Holland - ${currentGroup.name} (${currentGroupIndex + 1}/${hollandData.length})`}
              </h2>
              <CardDescription className="text-base mt-2">{currentGroup.description}</CardDescription>
              <p className="text-sm text-muted-foreground pt-4">
                Với mỗi hoạt động dưới đây, hãy chọn mức độ bạn yêu thích khi thực hiện nó.
              </p>
            </CardHeader>

            {/* Static Header - visible on desktop before scroll, and on mobile when not scrolled */}
             <div className={cn(
                "grid-cols-5 p-2 font-semibold border-t border-b bg-secondary/50",
                 isScrolled ? "hidden md:grid" : "grid",
                 !isScrolled ? "grid" : "hidden md:grid"
             )}>
              <div className="col-span-2 text-left pl-3">Hoạt động</div>
              {interestLevels.map((level) => (
                <div key={level.value} className="text-center text-xs md:text-sm whitespace-nowrap">
                  {level.label}
                </div>
              ))}
            </div>

            <CardContent className="p-0">
              <div className="min-w-full">
                {currentGroup.questions.map((q, index) => (
                  <div
                    key={`${currentGroup.code}-${q.id}`}
                    className={cn(
                      'grid grid-cols-5 items-center border-b',
                      index % 2 === 1 ? 'bg-secondary/50' : 'bg-background'
                    )}
                  >
                    <div className="col-span-2 p-3 text-sm">{q.text}</div>
                    <div className="col-span-3">
                      <RadioGroup
                        value={answers[`${currentGroup.code}-${q.id}`]?.toString()}
                        onValueChange={(value) => handleAnswerChange(q.id, value)}
                        className="flex justify-around items-center w-full"
                      >
                        {interestLevels.map((level) => (
                          <div
                            key={`${currentGroup.code}-q${q.id}-l${level.value}`}
                            className="flex items-center justify-center py-3 w-full"
                          >
                            <RadioGroupItem
                              value={level.value.toString()}
                              id={`${currentGroup.code}-q${q.id}-l${level.value}`}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end mt-4 p-4">
              <Button
                onClick={handleNext}
                disabled={currentGroup.questions.some((q) => answers[`${currentGroup.code}-${q.id}`] === undefined)}
              >
                {currentGroupIndex < hollandData.length - 1 ? 'Tiếp theo' : 'Xem kết quả'}
                {currentGroupIndex < hollandData.length - 1 ? (
                  <ArrowRight className="ml-2" />
                ) : (
                  <Check className="ml-2" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
