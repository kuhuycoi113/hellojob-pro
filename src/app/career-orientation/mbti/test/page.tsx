
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mbtiQuestions, mbtiProfiles, type MbtiDimension } from '@/lib/mbti-data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Answers = {
  [key: number]: number; // key: questionId, value: -2, -1, 1, 2
};

const answerOptions = [
    { label: 'Hoàn toàn sai', value: -2 },
    { label: 'Hơi sai', value: -1 },
    { label: 'Hơi đúng', value: 1 },
    { label: 'Hoàn toàn đúng', value: 2 },
];

export default function MbtiTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = mbtiQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const currentQuestion = mbtiQuestions[currentQuestionIndex];
  
  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const scores: { [key in MbtiDimension]: number } = { EI: 0, SN: 0, TF: 0, JP: 0 };
    
    mbtiQuestions.forEach(q => {
        if(answers[q.id]){
            scores[q.dimension] += answers[q.id] * q.direction;
        }
    });

    const resultType = [
        scores.EI > 0 ? 'E' : 'I',
        scores.SN > 0 ? 'S' : 'N',
        scores.TF > 0 ? 'T' : 'F',
        scores.JP > 0 ? 'J' : 'P'
    ].join('');
    
    return {
        type: resultType,
        profile: mbtiProfiles[resultType],
    };
  };

  if (showResults) {
    const { type, profile } = calculateResults();

    return (
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Kết quả Trắc nghiệm MBTI</CardTitle>
              <CardDescription>Loại tính cách của bạn là:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <h2 className="text-4xl font-bold font-headline text-accent-blue">{type}</h2>
                <h3 className="text-2xl font-semibold mt-1">{profile.name}</h3>
                <p className="mt-4 text-muted-foreground">{profile.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2 text-center">Gợi ý nghề nghiệp phù hợp</h4>
                <div className="flex flex-wrap justify-center gap-2">
                    {profile.careers.map((job: string) => (
                        <span key={job} className="bg-accent-blue/20 text-accent-blue font-medium px-3 py-1 rounded-full text-sm">{job}</span>
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
              <CardTitle className="font-headline text-xl md:text-2xl">
                Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
              </CardTitle>
              <CardDescription className="text-lg mt-4 text-center font-semibold text-foreground">
                "{currentQuestion.text}"
              </CardDescription>
            </CardHeader>
             <CardContent className="flex justify-center items-center gap-2 md:gap-4 my-6">
               {answerOptions.map(option => (
                    <Button 
                        key={option.value}
                        variant={answers[currentQuestion.id] === option.value ? "default" : "outline"}
                        onClick={() => handleAnswerChange(option.value)}
                        className={cn("flex flex-col h-auto p-3 text-center transition-all duration-200", 
                            answers[currentQuestion.id] === option.value 
                                ? 'bg-primary text-white scale-110'
                                : 'hover:bg-primary/10'
                        )}
                    >
                       <span className="text-xs md:text-sm font-bold">{option.label}</span>
                    </Button>
               ))}
             </CardContent>
             <CardFooter className="flex justify-between mt-4">
                <div className="text-sm text-muted-foreground">Chọn mức độ bạn đồng ý.</div>
               <Button onClick={handleNext} disabled={answers[currentQuestion.id] === undefined}>
                {currentQuestionIndex < totalQuestions - 1 ? 'Tiếp theo' : 'Xem kết quả'}
                <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
