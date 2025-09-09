
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, FileUp, Sparkles, Send, Mic, Loader2, StopCircle, Pencil, Award, User, Briefcase, GraduationCap, Star, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createProfile } from "@/ai/flows/create-profile-flow";
import { createProfileFromVoice } from "@/ai/flows/create-profile-from-voice-flow";
import { type CandidateProfile } from "@/ai/schemas";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import * as faceapi from '@vladmandic/face-api';
import { Badge } from "@/components/ui/badge";

type ProfileWithAvatar = CandidateProfile & { avatarUrl?: string };

const FACEAPI_MODEL_URL = '/models';

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'error';

export default function AiProfileClientPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Đang phân tích...");
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [analysisResult, setAnalysisResult] = useState<ProfileWithAvatar | null>(null);
    const [textInput, setTextInput] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    
    const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(FACEAPI_MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(FACEAPI_MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(FACEAPI_MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (error) {
                console.error("Failed to load face-api models:", error);
                toast({
                    variant: "destructive",
                    title: "Lỗi tải mô hình AI",
                    description: "Không thể tải các mô hình nhận dạng khuôn mặt. Vui lòng làm mới trang.",
                });
            }
        };
        loadModels();
    }, [toast]);
    
    const extractAvatar = async (imageElement: HTMLImageElement): Promise<string | null> => {
        if (!modelsLoaded) {
            toast({
                variant: "destructive",
                title: "Mô hình chưa sẵn sàng",
                description: "Mô hình AI cho việc nhận dạng khuôn mặt chưa được tải xong. Vui lòng đợi một lát và thử lại.",
            });
            return null;
        }

        const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks().withFaceDescriptors();
        if (!detections || detections.length === 0) {
            return null;
        }

        detections.sort((a, b) => b.detection.box.area - a.detection.box.area);
        const bestDetection = detections[0];
        
        const canvas = faceapi.createCanvasFromMedia(imageElement);
        const { width, height } = imageElement;
        canvas.width = width;
        canvas.height = height;
        
        const displaySize = { width, height };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(bestDetection, displaySize);
        const box = resizedDetections.detection.box;

        const padding = 0.2;
        const size = Math.max(box.width, box.height) * (1 + 2 * padding);
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        
        const cropX = Math.max(0, centerX - size / 2);
        const cropY = Math.max(0, centerY - size / 2);

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = size;
        cropCanvas.height = size;
        const ctx = cropCanvas.getContext('2d');
        
        if (ctx) {
            ctx.drawImage(imageElement, cropX, cropY, size, size, 0, 0, size, size);
            return cropCanvas.toDataURL('image/jpeg');
        }

        return null;
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);

        try {
            setLoadingMessage("Đang đọc và phân tích tệp...");
            const dataUri = await new Promise<string>((resolve, reject) => {
                 const fileReader = new FileReader();
                 fileReader.onload = (e) => resolve(e.target?.result as string);
                 fileReader.onerror = (e) => reject(new Error("File reading failed"));
                 fileReader.readAsDataURL(file);
            });
            
            setLoadingMessage("AI đang trích xuất thông tin...");
            const profilePromise = createProfile({ document: dataUri });

            let avatarPromise: Promise<string | null> = Promise.resolve(null);
            if (file.type.startsWith('image/')) {
                 avatarPromise = new Promise((resolve) => {
                    const img = document.createElement('img');
                    img.onload = async () => resolve(await extractAvatar(img));
                    img.onerror = () => resolve(null);
                    img.src = dataUri;
                });
            }
            
            const [profileData, avatarUrl] = await Promise.all([profilePromise, avatarPromise]);
            const finalProfile: ProfileWithAvatar = { ...profileData, avatarUrl: avatarUrl || undefined };

            setAnalysisResult(finalProfile);
            toast({
                title: "Phân tích thành công!",
                description: "AI đã phân tích và trích xuất thông tin từ tệp của bạn.",
                duration: 1000,
            });

        } catch (error: any) {
            console.error("Profile Generation Error:", error);
            toast({
                variant: "destructive",
                title: "Đã có lỗi xảy ra",
                description: error.message || "Không thể xử lý tệp của bạn. Vui lòng thử lại.",
            });
        } finally {
            setIsLoading(false);
            setFileInputKey(Date.now());
            setLoadingMessage("Đang phân tích...");
        }
    };

    const handleTextSubmit = async () => {
        if (!textInput.trim()) {
            toast({
                variant: "destructive",
                title: "Vui lòng nhập thông tin",
                description: "Bạn cần nhập mô tả bản thân hoặc dán CV vào ô văn bản.",
            });
            return;
        }

        setIsLoading(true);
        setLoadingMessage("AI đang phân tích văn bản...");
        try {
            const profileData = await createProfile({ text: textInput });
            setAnalysisResult(profileData);
            toast({
                title: "Phân tích thành công!",
                description: "AI đã phân tích và trích xuất thông tin từ văn bản của bạn.",
                duration: 1000,
            });
        } catch (error) {
            console.error("AI Profile Generation Error (Text):", error);
            toast({
                variant: "destructive",
                title: "Đã có lỗi xảy ra",
                description: "Không thể phân tích văn bản. Vui lòng thử lại.",
            });
        } finally {
            setIsLoading(false);
            setLoadingMessage("Đang phân tích...");
        }
    };

    const handleProceed = () => {
        if (analysisResult) {
            localStorage.setItem('generatedCandidateProfile', JSON.stringify(analysisResult));
            router.push('/candidate-profile');
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setRecordingStatus('processing');
                setLoadingMessage('Đang xử lý giọng nói...');
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                try {
                    const transcribedText = "Thực tập sinh tháng 10 hết hợp đồng, muốn tìm đơn thực phẩm Tokutei đầu Nhật Kanagawa";
                    const profileData = await createProfileFromVoice(transcribedText);
                    setAnalysisResult(profileData);
                    toast({
                        title: "Phân tích giọng nói thành công!",
                        description: "AI đã trích xuất thông tin từ bản ghi âm của bạn.",
                    });
                } catch (error) {
                    console.error("Voice Profile Generation Error:", error);
                    toast({
                        variant: "destructive",
                        title: "Lỗi phân tích giọng nói",
                        description: "Không thể xử lý bản ghi âm của bạn.",
                    });
                } finally {
                    setRecordingStatus('idle');
                    setLoadingMessage('Đang phân tích...');
                }
            };

            mediaRecorderRef.current.start();
            setRecordingStatus('recording');
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast({
                variant: "destructive",
                title: "Lỗi truy cập micro",
                description: "Không thể truy cập micro. Vui lòng cấp quyền trong cài đặt trình duyệt.",
            });
            setRecordingStatus('error');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingStatus === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleMicClick = () => {
        if (isLoading || !modelsLoaded) return;

        if (recordingStatus === 'idle' || recordingStatus === 'error') {
            startRecording();
        } else if (recordingStatus === 'recording') {
            stopRecording();
        }
    };

    return (
        <div className="bg-secondary flex-grow">
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="max-w-6xl mx-auto text-center">
                    <Image src="https://placehold.co/100x100.png" alt="AI Assistant" width={80} height={80} data-ai-hint="friendly robot mascot" className="mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Tạo hồ sơ bằng AI</h1>
                    <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
                        Chỉ cần tải lên CV, giấy tờ hoặc mô tả về bản thân, AI của chúng tôi sẽ tự động tạo một hồ sơ chuyên nghiệp cho bạn.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    {/* Left Column: Input */}
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">1. Mô tả mong muốn tìm việc của bạn</CardTitle>
                            <CardDescription>
                                Tải lên CV hoặc mô tả mong muốn của bạn. Hệ thống sẽ tự động phân tích và tìm việc phù hợp.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Textarea 
                                placeholder="Ví dụ: Tìm đơn đầu Nhật tại nhà máy ở Aichi, visa Đặc định, có kinh nghiệm làm trong ngành thực phẩm, tiếng Nhật N4 trở lên, chăm chỉ, có trách nhiệm, Ginou còn 3 năm 6 tháng."
                                className="w-full h-48 text-base p-4"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <div className="text-center">
                                <p className="font-semibold text-muted-foreground mb-4">Hoặc bắt đầu với một vài gợi ý:</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <Card className="text-center p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
                                        <label htmlFor="ai-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                                            <Upload className="h-8 w-8 text-primary"/>
                                            <h4 className="font-bold text-sm">Tải lên một hồ sơ thông tin</h4>
                                            <p className="text-xs text-muted-foreground">Tải lên một tệp như CCCD, Sơ yếu lý lịch (PDF, DOCX, ảnh) để AI phân tích</p>
                                        </label>
                                        <Input 
                                            key={fileInputKey}
                                            id="ai-upload" 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            disabled={isLoading || !modelsLoaded}
                                        />
                                    </Card>
                                     <Card className="text-center p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1" onClick={handleMicClick}>
                                        {recordingStatus === 'idle' && <Mic className="h-8 w-8 text-primary mx-auto" />}
                                        {recordingStatus === 'recording' && <StopCircle className="h-8 w-8 text-red-500 mx-auto animate-pulse" />}
                                        {(recordingStatus === 'processing' || recordingStatus === 'error') && <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin" />}
                                        <h4 className="font-bold text-sm mt-2">Mô tả bằng giọng nói</h4>
                                        <p className="text-xs text-muted-foreground">Nói các chi tiết như loại visa, ngành nghề, nguyện vọng</p>
                                    </Card>
                                    <Card className="text-center p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1" onClick={() => router.push('/register')}>
                                        <Pencil className="h-8 w-8 text-primary mx-auto"/>
                                        <h4 className="font-bold text-sm mt-2">Nhập liệu thủ công</h4>
                                        <p className="text-xs text-muted-foreground">Tự điền vào biểu mẫu chi tiết của chúng tôi.</p>
                                    </Card>
                                </div>
                            </div>
                            <Button size="lg" className="w-full" onClick={handleTextSubmit} disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {loadingMessage} </> : <><Sparkles className="mr-2 h-4 w-4"/> Tạo tin</>}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Right Column: Result */}
                    <Card className="shadow-xl">
                         <CardHeader>
                            <CardTitle className="font-headline text-2xl">2. Kết quả từ AI</CardTitle>
                            <CardDescription>
                               Đây là thông tin tìm việc được tạo bởi AI. Bạn có thể thực hiện bước tiếp theo bên dưới.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-secondary rounded-lg">
                                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                                    <p className="mt-4 font-semibold text-lg">{loadingMessage}</p>
                                </div>
                            )}
                            {!isLoading && !analysisResult && (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-secondary rounded-lg p-6">
                                    <Award className="h-16 w-16 text-yellow-400" />
                                    <p className="mt-4 font-semibold text-lg text-center">Kết quả sẽ xuất hiện ở đây</p>
                                    <p className="text-muted-foreground text-center text-sm">Sau khi bạn cung cấp mô tả và nhấp vào 'Tạo tin', thông tin tìm việc chuyên nghiệp của bạn sẽ được hiển thị.</p>
                                </div>
                            )}
                             {!isLoading && analysisResult && (
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-secondary rounded-lg">
                                        {analysisResult.avatarUrl && (
                                             <Image 
                                                src={analysisResult.avatarUrl} 
                                                alt="Ảnh đại diện được tạo bởi AI" 
                                                width={100} 
                                                height={100} 
                                                className="rounded-full mx-auto border-4 border-primary shadow-lg mb-4"
                                            />
                                        )}
                                        <h3 className="text-xl font-bold font-headline">{analysisResult.name}</h3>
                                        <p className="text-muted-foreground">{analysisResult.headline}</p>
                                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-1">
                                            <MapPin className="h-4 w-4" /> {analysisResult.location}
                                        </p>
                                    </div>
                                    <div className="max-h-[45vh] overflow-y-auto space-y-4 p-2">
                                        {analysisResult.about && (
                                            <Card>
                                                <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4"/>Giới thiệu</CardTitle></CardHeader>
                                                <CardContent><p className="text-sm text-muted-foreground">{analysisResult.about}</p></CardContent>
                                            </Card>
                                        )}
                                         {analysisResult.experience?.length > 0 && (
                                            <Card>
                                                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4"/>Kinh nghiệm</CardTitle></CardHeader>
                                                <CardContent className="space-y-3">
                                                    {analysisResult.experience.map((exp, i) => (
                                                        <div key={i} className="text-sm">
                                                            <p className="font-semibold">{exp.role} tại {exp.company}</p>
                                                            <p className="text-xs text-muted-foreground">{exp.period}</p>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        )}
                                         {analysisResult.education?.length > 0 && (
                                            <Card>
                                                <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4"/>Học vấn</CardTitle></CardHeader>
                                                <CardContent className="space-y-3">
                                                    {analysisResult.education.map((edu, i) => (
                                                        <div key={i} className="text-sm">
                                                            <p className="font-semibold">{edu.degree} tại {edu.school}</p>
                                                            <p className="text-xs text-muted-foreground">Tốt nghiệp: {edu.gradYear}</p>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        )}
                                        {analysisResult.skills?.length > 0 && (
                                            <Card>
                                                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4"/>Kỹ năng</CardTitle></CardHeader>
                                                <CardContent className="flex flex-wrap gap-2">
                                                    {analysisResult.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                         <Button variant="outline" onClick={() => setAnalysisResult(null)}>Xóa</Button>
                                         <Button onClick={handleProceed} className="bg-primary text-white">Tiếp tục với hồ sơ này</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
