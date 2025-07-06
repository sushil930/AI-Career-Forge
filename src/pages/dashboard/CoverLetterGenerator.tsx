import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CircleDashed, 
  Copy, 
  Download, 
  FileText, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Edit3, 
  ArrowRight,
  User,
  Briefcase,
  FileEdit,
  Wand2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Template options for cover letters
const templates = [
  { id: "professional", name: "Professional", description: "Formal and traditional style" },
  { id: "modern", name: "Modern", description: "Contemporary and bold approach" },
  { id: "creative", name: "Creative", description: "Unique and attention-grabbing" }
];

export default function CoverLetterGenerator() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [editorMode, setEditorMode] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState(null);

  // Fetch user's resumes on component mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await apiClient.get('/api/resumes');
        if (response.data && Array.isArray(response.data.resumes)) {
          setResumes(response.data.resumes);
        } else {
          console.warn('Unexpected format for resumes:', response.data);
          setResumes([]);
        }
      } catch (err) {
        console.error("Error fetching resumes:", err);
        toast.error("Failed to load your resumes");
        setResumes([]);
      }
    };

    fetchResumes();
  }, []);

  // Simulated generation progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);
    } else {
      setGenerationProgress(0);
    }

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Reset when changing tabs
  useEffect(() => {
    if (activeTab === "view" && !coverLetter) {
      setActiveTab("create");
    }
  }, [activeTab, coverLetter]);

  // Function to generate cover letter using API
  const handleGenerate = async () => {
    if (!selectedResume || !jobDescription) {
      toast.error("Please select a resume and enter a job description");
      return;
    }

    setIsGenerating(true);
    setActiveTab("create");
    setError(null);
    setGenerationProgress(10); // Start progress indicator
    
    try {
      // Prepare the request payload
      const payload = {
        selectedResume,
        jobDescription,
        companyName,
        roleName,
        selectedTemplate
      };
      
      // Call the backend API
      const response = await apiClient.post('/api/cover-letter/generate', payload);
      
      if (response.data && response.data.generatedCoverLetter) {
        setCoverLetter(response.data.generatedCoverLetter);
        setActiveTab("view");
        toast.success("Cover letter generated successfully!");
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (err) {
      console.error("Error generating cover letter:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to generate cover letter";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0); // Reset progress
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Cover letter copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${companyName || 'company'}-${roleName || 'role'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Cover letter downloaded!");
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cover Letter Generator</h2>
            <p className="text-muted-foreground">Create customized cover letters for your job applications with AI assistance</p>
          </div>
          
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-blue-200 bg-blue-50 text-blue-700 self-start md:self-center">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-blue-500" />
            AI Powered
          </Badge>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <FileEdit className="h-4 w-4 mr-2" />
            Create Letter
          </TabsTrigger>
          <TabsTrigger value="view" disabled={!coverLetter} className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <FileText className="h-4 w-4 mr-2" />
            View & Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={fadeIn}
          >
            <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center text-gray-800">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Your Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select your resume and provide details about the job
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-gray-700">Select Resume</Label>
                    <Select value={selectedResume} onValueChange={setSelectedResume}>
                      <SelectTrigger id="resume" className="border-gray-300 focus:border-blue-400">
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumes.length > 0 ? (
                          resumes.map(resume => (
                            <SelectItem key={resume.id} value={resume.id}>
                              {resume.originalFilename || resume.title || `Resume ${resume.id.substring(0, 6)}`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-resumes" disabled>
                            No resumes available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-gray-700">Company Name</Label>
                      <Input 
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Acme Corp"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role-name" className="text-gray-700">Position/Role</Label>
                      <Input 
                        id="role-name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="e.g., Senior Developer"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job-description" className="text-gray-700">Job Description</Label>
                    <Textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here... The more details you provide, the better the result will be."
                      rows={8}
                      className="resize-none border-gray-300 focus:border-blue-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center text-gray-800">
                  <Wand2 className="h-5 w-5 mr-2 text-blue-500" />
                  Generation Options
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose your preferences for the cover letter style
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Select Template Style</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      {templates.map(template => (
                        <div 
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedTemplate === template.id 
                              ? 'border-blue-500 bg-blue-50/50' 
                              : 'border-gray-200 hover:border-gray-300'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{template.name}</span>
                            {selectedTemplate === template.id && (
                              <CheckCircle2 className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !selectedResume || !jobDescription}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Cover Letter
                        </>
                      )}
                    </Button>
                    
                    {isGenerating && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Generating your cover letter...</span>
                          <span>{generationProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Personalized to match the job requirements and your qualifications</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="view">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className={`border-b ${editorMode ? 'bg-amber-50' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-gray-800">
                    <FileText className={`h-5 w-5 mr-2 ${editorMode ? 'text-amber-500' : 'text-green-500'}`} />
                    {editorMode ? 'Edit Your Cover Letter' : 'Your Generated Cover Letter'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditorMode(!editorMode)}
                    className={`h-8 ${editorMode ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {editorMode ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Done Editing
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-1" /> Edit
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription className="text-gray-600">
                  {editorMode 
                    ? 'Make any necessary adjustments to your cover letter'
                    : `Cover letter for ${companyName || '[Company Name]'} - ${roleName || '[Position]'}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={15}
                    className={`
                      resize-none font-serif text-base leading-relaxed p-6
                      ${editorMode 
                        ? 'border-amber-300 focus:border-amber-400 bg-white' 
                        : 'border-gray-200 bg-gray-50 focus:bg-white'}
                    `}
                    readOnly={!editorMode}
                  />
                  
                  <div className="flex flex-wrap gap-4 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleCopy}
                      className="border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                    <Button 
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download as Text
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("create")}
                      className="border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Create Another
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t px-6 py-4">
                <div className="text-sm text-gray-500 italic">
                  Pro tip: Customize the letter to reflect your unique voice and personality before sending.
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
