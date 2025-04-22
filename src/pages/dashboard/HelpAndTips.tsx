
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, HelpCircle, PlayCircle } from "lucide-react";

export default function HelpAndTips() {
  const generalTips = [
    {
      title: "Keep it concise",
      content: "Most recruiters spend only 6-7 seconds scanning a resume. Aim for 1-2 pages maximum."
    },
    {
      title: "Use action verbs",
      content: "Start bullet points with strong action verbs like 'achieved,' 'implemented,' or 'managed.'"
    },
    {
      title: "Quantify accomplishments",
      content: "Use numbers and percentages to measure your achievements whenever possible."
    },
    {
      title: "Tailor for each job",
      content: "Customize your resume for each application to include relevant keywords from the job description."
    },
    {
      title: "Proofread carefully",
      content: "Typos and grammatical errors can immediately disqualify you. Have someone else review your resume."
    }
  ];

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
                Follow these guidelines to create an effective resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generalTips.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-theme-emerald shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-muted-foreground">{tip.content}</p>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-theme-blue opacity-70" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Resume Tutorial {item}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learn how to craft a perfect resume that gets noticed by recruiters
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
