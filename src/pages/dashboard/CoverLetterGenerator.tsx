
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleDashed, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function CoverLetterGenerator() {
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  // Mock function to simulate cover letter generation
  const handleGenerate = () => {
    if (!selectedResume || !jobDescription) {
      toast.error("Please select a resume and enter a job description");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const mockCoverLetter = `Dear Hiring Manager,

I am writing to express my interest in the [Position] role at [Company Name]. With my background in software development and experience in React and TypeScript, I believe I would be a valuable addition to your team.

My expertise in building responsive web applications aligns perfectly with the requirements outlined in your job description. I am particularly excited about the opportunity to work on innovative projects and contribute to your company's mission.

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience can benefit your organization.

Sincerely,
John Doe`;

      setCoverLetter(mockCoverLetter);
      setIsGenerating(false);
      toast.success("Cover letter generated successfully!");
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Cover letter copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cover-letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Cover letter downloaded!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Cover Letter Generator</h2>
        <p className="text-muted-foreground">Create customized cover letters for your job applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>
              Select a resume and enter the job description to generate a cover letter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Select Resume</Label>
                <Select value={selectedResume} onValueChange={setSelectedResume}>
                  <SelectTrigger id="resume">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software-developer">Software Developer Resume</SelectItem>
                    <SelectItem value="product-manager">Product Manager Resume</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst Resume</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !selectedResume || !jobDescription}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
            <CardDescription>
              Your generated cover letter will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coverLetter ? (
              <div className="space-y-4">
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={15}
                  className="resize-none font-mono text-sm"
                />
                
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-20" />
                <p>Your cover letter will appear here after generation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
