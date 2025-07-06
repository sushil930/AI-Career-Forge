import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, HelpCircle, PlayCircle, CircleDashed, AlertTriangle, ExternalLink } from "lucide-react";
import apiClient from "@/lib/api";
import { toast } from "sonner";

interface Tip {
  id: string;
  category: string;
  content: string;
}

// Video tutorial data with actual YouTube content
const videoTutorials = [
  {
    id: 1,
    title: "How To Write A Resume in 2025",
    description: "Step-by-step guide to craft a professional resume that gets noticed by recruiters",
    embedId: "y8YH0Qbu5h4",
    thumbnail: "https://img.youtube.com/vi/y8YH0Qbu5h4/hqdefault.jpg"
  },
  {
    id: 2,
    title: "Resume Tips That Get You Noticed",
    description: "Learn expert tips to make your resume stand out from the competition",
    embedId: "Tt08KmFfIYQ",
    thumbnail: "https://img.youtube.com/vi/Tt08KmFfIYQ/hqdefault.jpg"
  },
  {
    id: 3,
    title: "ATS Resume Tips for 2025",
    description: "How to make your resume pass today's Applicant Tracking Systems (ATS)",
    embedId: "UtE0wZKBgMg",
    thumbnail: "https://img.youtube.com/vi/UtE0wZKBgMg/hqdefault.jpg"
  },
  {
    id: 4,
    title: "Resume Design & Formatting in 2025",
    description: "Modern resume formatting and design tips to make your resume visually appealing",
    embedId: "vgwo0j0KoyU",
    thumbnail: "https://img.youtube.com/vi/vgwo0j0KoyU/hqdefault.jpg"
  }
];

// YouTube embed component
const YouTubeEmbed = ({ embedId }: { embedId: string }) => {
  return (
    <div className="aspect-video w-full overflow-hidden rounded">
      <iframe
        src={`https://www.youtube.com/embed/${embedId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default function HelpAndTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoadingTips(true);
      setTipsError(null);
      try {
        const response = await apiClient.get('/api/tips');
        if (response.data && Array.isArray(response.data.tips)) {
          setTips(response.data.tips);
        } else {
          console.error("Unexpected tips API response format:", response.data);
          setTipsError("Failed to load tips due to unexpected format.");
        }
      } catch (error: any) {
        console.error("Error fetching tips:", error);
        const message = error.response?.data?.message || error.message || "An unknown error occurred while fetching tips.";
        setTipsError(message);
      } finally {
        setIsLoadingTips(false);
      }
    };

    fetchTips();
  }, []);

  const faqItems = [
    {
      question: "How do I know if my resume is ATS-friendly?",
      answer: "To make your resume ATS-friendly, use a clean layout without tables or graphics, include relevant keywords from the job description, and submit in PDF format to preserve formatting."
    },
    {
      question: "Should I include a photo on my resume?",
      answer: "In most cases, it's best to avoid including a photo on your resume, especially in the US, UK, and Canada, as it can lead to unconscious bias in the hiring process."
    },
    {
      question: "How far back should my work history go?",
      answer: "Generally, include the past 10-15 years of relevant work experience. For most professionals, this means listing 3-5 positions."
    },
    {
      question: "Do I need a cover letter?",
      answer: "While not always required, a well-written cover letter can set you apart. Use it to explain your interest in the role and company, and to address potential concerns like employment gaps."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Help & Tips</h2>
        <p className="text-muted-foreground">Learn how to create an effective resume and improve your job search</p>
      </div>

      <Tabs defaultValue="tips">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="tips">Resume Tips</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="videos">Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Writing Tips</CardTitle>
              <CardDescription>
                General guidelines and best practices to create an effective resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTips ? (
                <div className="flex items-center justify-center py-12">
                  <CircleDashed className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Loading tips...</span>
                </div>
              ) : tipsError ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-600">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-medium">Failed to load tips</p>
                  <p className="text-sm text-red-500">Error: {tipsError}</p>
                </div>
              ) : tips.length > 0 ? (
                <div className="space-y-4">
                  {tips.map((tip) => (
                    <div key={tip.id} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-theme-emerald shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">{tip.category || 'General Tip'}</h3>
                        <p className="text-muted-foreground">{tip.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No tips available at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about resume writing and job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-theme-blue" />
                        {item.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-6">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>
                Watch these videos to learn more about effective resume writing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVideo ? (
                <div className="space-y-4">
                  <YouTubeEmbed embedId={selectedVideo} />
                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={() => setSelectedVideo(null)}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 transition-colors rounded-md flex items-center"
                    >
                      ← Back to videos
                    </button>
                    <a 
                      href={`https://www.youtube.com/watch?v=${selectedVideo}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors rounded-md flex items-center"
                    >
                      Watch on YouTube <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoTutorials.map((video) => (
                    <div 
                      key={video.id} 
                      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
                      onClick={() => setSelectedVideo(video.embedId)}
                    >
                      <div className="aspect-video bg-gray-100 relative group">
                        <img 
                          src={video.thumbnail} 
                          alt={`Thumbnail for ${video.title}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
                          <PlayCircle className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
