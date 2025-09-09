
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { discQuestions, discProfile, type DISCGroup } from '@/lib/disc-data';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Answers = {
  most: { [key: number]: DISCGroup }; // key is questionId, value is the group of the chosen word
  least: { [key: number]: DISCGroup };
};

const COLORS = {
  D: 'hsl(var(--accent-red))',
  I: 'hsl(var(--accent-yellow))',
  S: 'hsl(var(--accent-green))',
  C: 'hsl(var(--accent-blue))',
};

export default function DiscTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ most: {}, least: {} });
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = discQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const currentQuestion = discQuestions[currentQuestionIndex];
  
  const handleAnswerChange = (type: 'most' | 'least', wordGroup: DISCGroup) => {
    setAnswers(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [currentQuestion.id]: wordGroup,
      },
    }));
  };

  const isQuestionAnswered = () => {
    return answers.most[currentQuestion.id] && answers.least[currentQuestion.id];
  }
  
  const isSelectionDisabled = (type: 'most' | 'least', wordGroup: DISCGroup) => {
    const oppositeType = type === 'most' ? 'least' : 'most';
    return answers[oppositeType][currentQuestion.id] === wordGroup;
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    for (const qId in answers.most) {
      const group = answers.most[qId];
      scores[group]++;
    }
    
    for (const qId in answers.least) {
      const group = answers.least[qId];
      scores[group]--;
    }

    const resultData = Object.entries(scores).map(([key, value]) => ({
      name: discProfile[key as DISCGroup].name,
      code: key as DISCGroup,
      score: value
    }));

    resultData.sort((a, b) => b.score - a.score);
    return resultData;
  };

  if (showResults) {
    const results = calculateResults();
    const topProfile = discProfile[results[0].code];

    return (
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Kết quả Trắc nghiệm DISC</CardTitle>
              <CardDescription>Dưới đây là phân tích về phong cách hành vi nổi trội của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <h3 className={`text-2xl font-bold font-headline text-[${COLORS[results[0].code]}]`}>{topProfile.name}</h3>
                <p className="mt-2 text-muted-foreground">{topProfile.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-center">Biểu đồ điểm các nhóm tính cách</h4>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <RechartsBarChart data={results} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <XAxis dataKey="code" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        cursor={{fill: 'hsla(var(--muted), 0.5)'}}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Bar dataKey="score">
                         {results.map((entry) => (
                           <Cell key={`cell-${entry.code}`} fill={COLORS[entry.code]} />
                         ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                 <div className="p-4 bg-secondary rounded-lg">
                    <h5 className="font-bold mb-2">Điểm mạnh của bạn:</h5>
                    <ul className="list-disc list-inside space-y-1">
                        {topProfile.strengths.map(s => <li key={s}>{s}</li>)}
                    </ul>
                 </div>
                 <div className="p-4 bg-secondary rounded-lg">
                    <h5 className="font-bold mb-2">Cần cải thiện:</h5>
                    <ul className="list-disc list-inside space-y-1">
                        {topProfile.weaknesses.map(w => <li key={w}>{w}</li>)}
                    </ul>
                 </div>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-2 text-center">Gợi ý nghề nghiệp phù hợp</h4>
                <div className="flex flex-wrap justify-center gap-2">
                    {topProfile.careers.map(job => (
                        <span key={job} className="bg-accent-green/20 text-accent-green font-medium px-3 py-1 rounded-full text-sm">{job}</span>
                    ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary py-12 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
           <Card className="shadow-xl">
            <CardHeader>
              <Progress value={progress} className="mb-4 h-2" />
              <CardTitle className="font-headline text-2xl md:text-3xl">
                Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Trong mỗi nhóm 4 từ dưới đây, hãy chọn một từ mô tả **giống bạn nhất** và một từ **ít giống bạn nhất**.
              </CardDescription>
            </CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-sm md:text-base">
                    <div className="md:col-span-1 font-bold">Mô tả</div>
                    <div className="font-bold text-center">Giống nhất</div>
                    <div className="font-bold text-center">Ít giống nhất</div>
                </div>
                <div className="space-y-2">
                   {currentQuestion.words.map(word => (
                      <div key={word.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 rounded-lg even:bg-secondary">
                          <div className="md:col-span-1">{word.word}</div>
                          <div className="flex justify-center">
                              <RadioGroup 
                                value={answers.most[currentQuestion.id] === word.group ? word.group : ''}
                                onValueChange={() => handleAnswerChange('most', word.group)}
                              >
                                  <RadioGroupItem 
                                    value={word.group} 
                                    id={`most-${word.id}`} 
                                    disabled={isSelectionDisabled('most', word.group)}
                                  />
                              </RadioGroup>
                          </div>
                          <div className="flex justify-center">
                              <RadioGroup 
                                 value={answers.least[currentQuestion.id] === word.group ? word.group : ''}
                                 onValueChange={() => handleAnswerChange('least', word.group)}
                              >
                                  <RadioGroupItem 
                                    value={word.group} 
                                    id={`least-${word.id}`}
                                    disabled={isSelectionDisabled('least', word.group)}
                                  />
                              </RadioGroup>
                          </div>
                      </div>
                   ))}
                </div>
             </CardContent>
             <CardFooter className="flex justify-end mt-4">
               <Button onClick={handleNext} disabled={!isQuestionAnswered()}>
                {currentQuestionIndex < totalQuestions - 1 ? 'Tiếp theo' : 'Xem kết quả'}
                {currentQuestionIndex < totalQuestions - 1 ? <ArrowRight className="ml-2" /> : <Check className="ml-2" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
