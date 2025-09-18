
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, PieChart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { ContactButtons } from '@/components/contact-buttons';
import { consultants as consultantChatData } from '@/lib/consultant-data';


const ConsultantCard = ({ consultant }: { consultant: typeof consultantChatData[0] }) => {
    // Find the corresponding full consultant data for the chat context
    const chatConsultant = consultantChatData.find(c => c.id === consultant.id);

    return (
        <Card className="shadow-xl text-center p-6 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <Link href={`/consultant-profile/${consultant.id}`} className="block h-full flex flex-col flex-grow">
                <Avatar className="h-24 w-24 mx-auto border-4 border-primary shadow-lg">
                    <AvatarImage src={consultant.avatarUrl} alt={consultant.name} data-ai-hint={consultant.dataAiHint} />
                    <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-headline font-bold mt-4">{consultant.name}</h2>
                <p className="text-primary font-semibold text-sm flex-grow">{consultant.mainExpertise}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {consultant.strengths.map(strength => (
                        <Badge key={strength} variant="secondary" className="bg-green-100 text-green-800 border-green-200">{strength}</Badge>
                    ))}
                </div>
                <div className="mt-4 border-t pt-4 text-sm space-y-2 text-left">
                    <p className="flex items-start gap-2"><PieChart className="h-4 w-4 mt-1 text-muted-foreground"/> <strong>Kinh nghiệm:</strong> {consultant.experience}</p>
                    <p className="flex items-start gap-2"><Star className="h-4 w-4 mt-1 text-muted-foreground"/> <strong>Đã hỗ trợ:</strong> {consultant.successfulCandidates}+ ứng viên</p>
                </div>
            </Link>
            <div className="mt-4 pt-4 border-t">
                {chatConsultant && <ContactButtons contact={chatConsultant} />}
            </div>
        </Card>
    );
};

export default function ConsultantListPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold text-accent">Đội ngũ tư vấn viên chuyên nghiệp</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                Những chuyên gia tận tâm sẽ đồng hành cùng bạn trên con đường chinh phục sự nghiệp tại Nhật Bản.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
            {consultantChatData.map((consultant) => (
                <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
        </div>
      </div>
    </div>
  );
}
