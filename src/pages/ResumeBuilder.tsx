import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDashed, Trash2, Plus, TestTube2, FileText, CheckCircle, ChevronRight, ChevronLeft, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiClient from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ResumeInputData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    linkedin?: string;
    portfolio?: string;
    address?: string;
  };
  summary?: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    details?: string[];
  }[];
  experience: {
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }[];
  skills: {
    category?: string;
    items: string[];
  }[];
  certifications?: {
    name: string;
    issuingOrganization?: string;
    dateObtained?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
  }[];
  targetJobRole?: string;
  targetJobDescription?: string;
}

const initialUserInfo: ResumeInputData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    address: "",
  },
  summary: "",
  targetJobRole: "",
  experience: [
    {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: [],
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      details: [],
    },
  ],
  skills: [
    { category: "General", items: [] }
  ],
  certifications: [],
  projects: [],
  targetJobDescription: "",
};

const mockResumeData: ResumeInputData = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "555-123-4567",
    linkedin: "linkedin.com/in/alexjohnson",
    portfolio: "alexjohnson.dev",
    address: "123 Tech Street, Silicon Valley, CA 94000",
  },
  summary: "Highly motivated and results-oriented Software Engineer with 5+ years of experience in developing and deploying scalable web applications. Proficient in full-stack development with expertise in React, Node.js, and cloud technologies. Seeking to leverage strong problem-solving skills and a passion for innovation in a challenging role at a forward-thinking company.",
  targetJobRole: "Senior Software Engineer",
  experience: [
    {
      jobTitle: "Software Engineer",
      company: "Innovate Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "2021-06-01",
      endDate: "Present",
      responsibilities: [
        "Developed and maintained front-end and back-end components for enterprise-level applications.",
        "Collaborated with cross-functional teams to define, design, and ship new features.",
        "Improved application performance by 20% through code optimization and refactoring.",
        "Mentored junior developers and conducted code reviews."
      ],
    },
    {
      jobTitle: "Junior Developer",
      company: "Tech Start LLC",
      location: "Austin, TX",
      startDate: "2019-01-15",
      endDate: "2021-05-30",
      responsibilities: [
        "Assisted in the development of web applications using JavaScript and Python.",
        "Participated in daily stand-ups and agile development processes.",
        "Contributed to bug fixing and software testing.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2017-09-01",
      endDate: "2019-05-15",
      details: ["Thesis on Machine Learning applications in web development", "GPA: 3.8/4.0"],
    },
    {
      institution: "State College",
      degree: "Bachelor of Science",
      fieldOfStudy: "Information Technology",
      startDate: "2013-09-01",
      endDate: "2017-05-20",
      details: ["Graduated Cum Laude", "President of Coding Club"],
    },
  ],
  skills: [
    { category: "Programming Languages", items: ["JavaScript (ES6+)", "Python", "Java", "TypeScript", "SQL"] },
    { category: "Frameworks/Libraries", items: ["React", "Node.js", "Express.js", "Spring Boot", "Next.js"] },
    { category: "Databases", items: ["MongoDB", "PostgreSQL", "MySQL", "Redis"] },
    { category: "Tools/Platforms", items: ["Git", "Docker", "AWS", "Kubernetes", "JIRA"] },
    { category: "Methodologies", items: ["Agile", "Scrum", "CI/CD"] }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect - Associate",
      issuingOrganization: "Amazon Web Services",
      dateObtained: "2022-08-10",
    },
    {
      name: "Certified ScrumMaster (CSM)",
      issuingOrganization: "Scrum Alliance",
      dateObtained: "2021-03-20",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Developed a full-stack e-commerce platform with features like product listings, shopping cart, user authentication, and payment gateway integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      link: "github.com/alexjohnson/ecommerce-platform",
    },
    {
      name: "AI Powered Chatbot",
      description: "Built an intelligent chatbot for customer support using NLP techniques, integrated with a live-chat system.",
      technologies: ["Python", "Flask", "Dialogflow", "WebSocket"],
      link: "alexjohnson.dev/chatbot-project",
    },
  ],
  targetJobDescription: "Seeking a challenging Senior Software Engineer position focused on building innovative and scalable solutions. Interested in roles that involve full-stack development, cloud architecture, and leading a team of talented engineers. The ideal company values collaboration, continuous learning, and making a positive impact through technology.",
};

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userInfo, setUserInfo] = useState<ResumeInputData>(initialUserInfo);
  const [skillInput, setSkillInput] = useState("");
  const [respInput, setRespInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [generatedResumeId, setGeneratedResumeId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let filled = 0;
    let total = 7;
    
    if (userInfo.personalInfo.name && userInfo.personalInfo.email) filled++;
    
    if (userInfo.summary && userInfo.summary.length > 10) filled++;
    
    if (userInfo.experience[0]?.jobTitle && userInfo.experience[0]?.company) filled++;
    
    if (userInfo.education[0]?.institution && userInfo.education[0]?.degree) filled++;
    
    if (userInfo.skills[0]?.items.length > 0) filled++;
    
    if (userInfo.projects && userInfo.projects.length > 0) filled++;
    
    if (userInfo.certifications && userInfo.certifications.length > 0) filled++;
    
    setProgress(Math.round((filled / total) * 100));
  }, [userInfo]);

  const handleFillWithMockData = () => {
    setUserInfo(mockResumeData);
    toast.info("Form filled with mock data. Feel free to edit!");
  };

  const handleInputChange = (section: keyof ResumeInputData, field: string, value: any, index?: number) => {
    setUserInfo(prev => {
      const newState = JSON.parse(JSON.stringify(prev));

      if (index !== undefined && Array.isArray(newState[section])) {
        if (!newState[section][index]) newState[section][index] = {};
        newState[section][index][field] = value;
      } else if (typeof newState[section] === 'object' && newState[section] !== null) {
        (newState[section] as any)[field] = value;
      } else {
        (newState as any)[field] = value;
      }
      return newState;
    });
  };

  const addResponsibility = (expIndex: number) => {
    if (!respInput.trim()) return;
    setUserInfo(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      if (!newState.experience[expIndex].responsibilities) {
        newState.experience[expIndex].responsibilities = [];
      }
      newState.experience[expIndex].responsibilities.push(respInput.trim());
      return newState;
    });
    setRespInput("");
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    setUserInfo(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      newState.experience[expIndex].responsibilities.splice(respIndex, 1);
      return newState;
    });
  };

  const addSkill = (skillIndex: number) => {
    if (!skillInput.trim()) return;
    setUserInfo(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      if (!newState.skills[skillIndex].items) {
        newState.skills[skillIndex].items = [];
      }
      newState.skills[skillIndex].items.push(skillInput.trim());
      return newState;
    });
    setSkillInput("");
  };

  const removeSkill = (skillIndex: number, itemIndex: number) => {
    setUserInfo(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      newState.skills[skillIndex].items.splice(itemIndex, 1);
      return newState;
    });
  };

  const addExperienceBlock = () => {
    setUserInfo(prev => ({
      ...prev,
      experience: [...prev.experience, { jobTitle: "", company: "", startDate: "", endDate: "", responsibilities: [] }]
    }));
  };

  const removeExperienceBlock = (index: number) => {
    setUserInfo(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addSkillCategory = () => {
    setUserInfo(prev => ({
      ...prev,
      skills: [...prev.skills, { category: "New Category", items: [] }]
    }));
  };

  const handleNextTab = () => {
    if (activeTab === "personal") setActiveTab("summary");
    else if (activeTab === "summary") setActiveTab("experience");
    else if (activeTab === "experience") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("skills");
    else if (activeTab === "skills") setActiveTab("projects");
    else if (activeTab === "projects") setActiveTab("certs");
  };

  const handlePrevTab = () => {
    if (activeTab === "certs") setActiveTab("projects");
    else if (activeTab === "projects") setActiveTab("skills");
    else if (activeTab === "skills") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("experience");
    else if (activeTab === "experience") setActiveTab("summary");
    else if (activeTab === "summary") setActiveTab("personal");
  };

  const generateResumeContent = async () => {
    if (
      !userInfo.personalInfo.name ||
      !userInfo.personalInfo.email ||
      !userInfo.experience[0]?.company ||
      !userInfo.education[0]?.institution ||
      userInfo.skills[0]?.items.length === 0
    ) {
      toast.error("Please fill in required fields (Name, Email, first Experience, first Education, first Skill set).");
      return;
    }

    setIsGenerating(true);
    setGeneratedText(null);
    setGeneratedResumeId(null);

    try {
      const response = await apiClient.post('/api/builder/generate', userInfo);

      if (response.status === 201 && response.data.generatedText && response.data.generatedResumeId) {
        setGeneratedText(response.data.generatedText);
        setGeneratedResumeId(response.data.generatedResumeId);
        toast.success(response.data.message || "Resume generated successfully!");
      } else {
        toast.error("Generation succeeded but response format was unexpected.");
        console.error("Unexpected generation response:", response);
      }

    } catch (error: any) {
      console.error("Generation Error:", error);
      let errorMessage = "Error generating resume. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Could not reach the server.";
      }
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = () => {
    if (!generatedResumeId) {
      toast.error("No generated resume ID found. Please generate a resume first.");
      return;
    }
    if (!apiClient.defaults.baseURL) {
      toast.error("API client base URL is not configured.");
      console.error("apiClient.defaults.baseURL is missing");
      return;
    }

    const downloadUrl = `${apiClient.defaults.baseURL}/api/builder/download/${generatedResumeId}`;
    toast.info("Initiating PDF download...");
    console.log(`Attempting to download PDF from: ${downloadUrl}`);

    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 sm:mb-6 md:mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Resume Builder</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">
              Craft your perfect resume with our AI-powered assistant
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={handleFillWithMockData} 
              className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-300 text-xs sm:text-sm h-9 sm:h-10"
              size="sm"
            >
              <TestTube2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Fill with Example Data
            </Button>
            {!generatedText && (
              <Button 
                onClick={generateResumeContent}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm h-9 sm:h-10"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <CircleDashed className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Generate Resume
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {!generatedText && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">Resume Completion</span>
              <Badge variant="outline" className={progress === 100 ? "bg-green-100 text-green-800 border-green-300" : ""}>
                {progress}%
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {!generatedText ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b py-3 sm:py-4 px-4 sm:px-6">
                <CardTitle className="text-gray-800 text-lg sm:text-xl">Build Your Resume</CardTitle>
                <CardDescription className="text-gray-600 text-xs sm:text-sm">
                  Fill out each section to create a professional resume
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full rounded-none border-b bg-gray-50 px-1 sm:px-2 py-0 h-auto flex flex-wrap overflow-x-auto">
                    <TabsTrigger 
                      value="personal" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "personal" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger 
                      value="summary" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "summary" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Summary
                    </TabsTrigger>
                    <TabsTrigger 
                      value="experience" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "experience" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Experience
                    </TabsTrigger>
                    <TabsTrigger 
                      value="education" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "education" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Education
                    </TabsTrigger>
                    <TabsTrigger 
                      value="skills" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "skills" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Skills
                    </TabsTrigger>
                    <TabsTrigger 
                      value="projects" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "projects" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Projects
                    </TabsTrigger>
                    <TabsTrigger 
                      value="certs" 
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm rounded-none border-b-2 ${activeTab === "certs" ? "border-blue-500" : "border-transparent"}`}
                    >
                      Certifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="name" className="text-gray-700 text-sm sm:text-base">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          value={userInfo.personalInfo.name}
                          onChange={(e) => handleInputChange('personalInfo', "name", e.target.value)}
                          placeholder="John Doe"
                          className="border-gray-300 focus:border-blue-400 h-8 sm:h-10 text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="email" className="text-gray-700 text-sm sm:text-base">Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', "email", e.target.value)}
                          placeholder="john.doe@example.com"
                          className="border-gray-300 focus:border-blue-400 h-8 sm:h-10 text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userInfo.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', "phone", e.target.value)}
                          placeholder="(123) 456-7890"
                          className="border-gray-300 focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-gray-700">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={userInfo.personalInfo.linkedin}
                          onChange={(e) => handleInputChange('personalInfo', "linkedin", e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                          className="border-gray-300 focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio" className="text-gray-700">Portfolio URL</Label>
                        <Input
                          id="portfolio"
                          value={userInfo.personalInfo.portfolio}
                          onChange={(e) => handleInputChange('personalInfo', "portfolio", e.target.value)}
                          placeholder="johndoe.com"
                          className="border-gray-300 focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700">Location</Label>
                        <Input
                          id="address"
                          value={userInfo.personalInfo.address}
                          onChange={(e) => handleInputChange('personalInfo', "address", e.target.value)}
                          placeholder="City, State"
                          className="border-gray-300 focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-4 flex justify-end">
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700 h-8 sm:h-10 text-xs sm:text-sm"
                        size="sm"
                      >
                        Next: Summary <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="p-6 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Label htmlFor="summary" className="text-gray-700 font-medium">Professional Summary</Label>
                        <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">Recommended</Badge>
                      </div>
                      <p className="text-sm text-gray-500">Write a concise overview of your professional background, key skills, and career goals.</p>
                      <Textarea
                        id="summary"
                        value={userInfo.summary}
                        onChange={(e) => handleInputChange('summary', 'summary', e.target.value)}
                        placeholder="A motivated professional with 5+ years of experience in..."
                        rows={6}
                        className="border-gray-300 focus:border-blue-400 resize-none"
                      />
                    </div>
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePrevTab}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Experience <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="p-6 space-y-6">
                    {userInfo.experience.map((exp, index) => (
                      <Card key={index} className="p-0 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <CardHeader className="p-4 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              Experience {index + 1}
                              {exp.jobTitle && exp.company ? (
                                <Badge variant="secondary" className="ml-2 bg-green-50 text-green-600 border-0">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Complete
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="ml-2 text-amber-600 bg-amber-50 border-amber-200">Required</Badge>
                              )}
                            </CardTitle>
                            {userInfo.experience.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeExperienceBlock(index)}
                              >
                                <Trash2 size={14} className="mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`jobTitle-${index}`} className="text-gray-700">Job Title <span className="text-red-500">*</span></Label>
                              <Input
                                id={`jobTitle-${index}`}
                                value={exp.jobTitle}
                                onChange={(e) => handleInputChange('experience', "jobTitle", e.target.value, index)}
                                placeholder="Software Engineer"
                                className="border-gray-300 focus:border-blue-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`company-${index}`} className="text-gray-700">Company <span className="text-red-500">*</span></Label>
                              <Input
                                id={`company-${index}`}
                                value={exp.company}
                                onChange={(e) => handleInputChange('experience', "company", e.target.value, index)}
                                placeholder="Tech Company Inc."
                                className="border-gray-300 focus:border-blue-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`location-${index}`} className="text-gray-700">Location</Label>
                              <Input
                                id={`location-${index}`}
                                value={exp.location}
                                onChange={(e) => handleInputChange('experience', "location", e.target.value, index)}
                                placeholder="San Francisco, CA"
                                className="border-gray-300 focus:border-blue-400"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`startDate-${index}`} className="text-gray-700">Start Date</Label>
                                <Input
                                  id={`startDate-${index}`}
                                  value={exp.startDate}
                                  onChange={(e) => handleInputChange('experience', "startDate", e.target.value, index)}
                                  placeholder="YYYY-MM"
                                  className="border-gray-300 focus:border-blue-400"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`endDate-${index}`} className="text-gray-700">End Date</Label>
                                <Input
                                  id={`endDate-${index}`}
                                  value={exp.endDate}
                                  onChange={(e) => handleInputChange('experience', "endDate", e.target.value, index)}
                                  placeholder="YYYY-MM"
                                  className="border-gray-300 focus:border-blue-400"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor={`responsibilities-${index}`} className="text-gray-700">Responsibilities & Achievements</Label>
                            {exp.responsibilities?.length > 0 && (
                              <ul className="space-y-2 mt-2 mb-4">
                                {exp.responsibilities?.map((resp, rIndex) => (
                                  <motion.li 
                                    key={rIndex} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-sm flex items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
                                  >
                                    <span className="mr-2 text-blue-500">•</span>{resp}
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 ml-auto text-red-400 hover:text-red-600 hover:bg-red-50" 
                                      onClick={() => removeResponsibility(index, rIndex)}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </motion.li>
                                ))}
                              </ul>
                            )}
                            <div className="flex gap-2">
                              <Input
                                id={`responsibilities-${index}`}
                                value={respInput}
                                onChange={(e) => setRespInput(e.target.value)}
                                placeholder="Developed a feature that increased user engagement by 20%..."
                                className="flex-grow border-gray-300 focus:border-blue-400"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && respInput.trim()) {
                                    e.preventDefault();
                                    addResponsibility(index);
                                  }
                                }}
                              />
                              <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => addResponsibility(index)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={addExperienceBlock}
                      className="border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 w-full py-6"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Another Experience
                    </Button>
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePrevTab}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Education <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="institution" className="text-gray-700">Institution</Label>
                      <Input
                        id="institution"
                        value={userInfo.education[0]?.institution}
                        onChange={(e) => handleInputChange('education', 'institution', e.target.value, 0)}
                        placeholder="University of Technology"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="degree" className="text-gray-700">Degree</Label>
                      <Input
                        id="degree"
                        value={userInfo.education[0]?.degree}
                        onChange={(e) => handleInputChange('education', 'degree', e.target.value, 0)}
                        placeholder="Master of Science"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="fieldOfStudy" className="text-gray-700">Field of Study</Label>
                      <Input
                        id="fieldOfStudy"
                        value={userInfo.education[0]?.fieldOfStudy}
                        onChange={(e) => handleInputChange('education', 'fieldOfStudy', e.target.value, 0)}
                        placeholder="Computer Science"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-gray-700">Start Date</Label>
                      <Input
                        id="startDate"
                        value={userInfo.education[0]?.startDate}
                        onChange={(e) => handleInputChange('education', 'startDate', e.target.value, 0)}
                        placeholder="YYYY-MM"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="endDate" className="text-gray-700">End Date</Label>
                      <Input
                        id="endDate"
                        value={userInfo.education[0]?.endDate}
                        onChange={(e) => handleInputChange('education', 'endDate', e.target.value, 0)}
                        placeholder="YYYY-MM"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="details" className="text-gray-700">Details</Label>
                      <Textarea
                        id="details"
                        value={userInfo.education[0]?.details?.join('\n') || ''}
                        onChange={(e) => handleInputChange('education', 'details', e.target.value.split('\n'), 0)}
                        placeholder="Thesis on Machine Learning applications in web development"
                        rows={3}
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePrevTab}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Skills <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="p-6 space-y-6">
                    {userInfo.skills.map((skillSet, index) => (
                      <Card key={index} className="p-0 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <CardHeader className="p-4 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              Skill Category {index + 1}
                              {skillSet.items.length > 0 ? (
                                <Badge variant="secondary" className="ml-2 bg-green-50 text-green-600 border-0">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Complete
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="ml-2 text-amber-600 bg-amber-50 border-amber-200">Required</Badge>
                              )}
                            </CardTitle>
                            {userInfo.skills.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSkill(index, 0)}
                              >
                                <Trash2 size={14} className="mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`category-${index}`} className="text-gray-700">Category</Label>
                            <Input
                              id={`category-${index}`}
                              value={skillSet.category}
                              onChange={(e) => handleInputChange('skills', 'category', e.target.value, index)}
                              placeholder="e.g., Programming Languages, Software, Soft Skills"
                              className="border-gray-300 focus:border-blue-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`skills-${index}`} className="text-gray-700">Skills</Label>
                            <Textarea
                              id={`skills-${index}`}
                              value={skillSet.items.join('\n') || ''}
                              onChange={(e) => handleInputChange('skills', 'items', e.target.value.split('\n'), index)}
                              placeholder="JavaScript, Python, React"
                              rows={3}
                              className="border-gray-300 focus:border-blue-400"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={addSkillCategory}
                      className="border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 w-full py-6"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Another Skill Category
                    </Button>
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePrevTab}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Projects <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-gray-700">Project Name</Label>
                      <Input
                        id="name"
                        value={userInfo.projects?.[0]?.name || ''}
                        onChange={(e) => handleInputChange('projects', 'name', e.target.value, 0)}
                        placeholder="E-commerce Platform"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-gray-700">Project Description</Label>
                      <Textarea
                        id="description"
                        value={userInfo.projects?.[0]?.description || ''}
                        onChange={(e) => handleInputChange('projects', 'description', e.target.value, 0)}
                        placeholder="Developed a full-stack e-commerce platform with features like product listings, shopping cart, user authentication, and payment gateway integration."
                        rows={3}
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="technologies" className="text-gray-700">Technologies Used</Label>
                      <Textarea
                        id="technologies"
                        value={userInfo.projects?.[0]?.technologies?.join('\n') || ''}
                        onChange={(e) => handleInputChange('projects', 'technologies', e.target.value.split('\n'), 0)}
                        placeholder="JavaScript, Node.js, MongoDB, Stripe API"
                        rows={3}
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="link" className="text-gray-700">Project URL</Label>
                      <Input
                        id="link"
                        value={userInfo.projects?.[0]?.link || ''}
                        onChange={(e) => handleInputChange('projects', 'link', e.target.value, 0)}
                        placeholder="github.com/alexjohnson/ecommerce-platform"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePrevTab}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Certifications <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="certs" className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-gray-700">Certification Name</Label>
                      <Input
                        id="name"
                        value={userInfo.certifications?.[0]?.name || ''}
                        onChange={(e) => handleInputChange('certifications', 'name', e.target.value, 0)}
                        placeholder="AWS Certified Solutions Architect - Associate"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="issuingOrganization" className="text-gray-700">Issuing Organization</Label>
                      <Input
                        id="issuingOrganization"
                        value={userInfo.certifications?.[0]?.issuingOrganization || ''}
                        onChange={(e) => handleInputChange('certifications', 'issuingOrganization', e.target.value, 0)}
                        placeholder="Amazon Web Services"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="dateObtained" className="text-gray-700">Date Obtained</Label>
                      <Input
                        id="dateObtained"
                        value={userInfo.certifications?.[0]?.dateObtained || ''}
                        onChange={(e) => handleInputChange('certifications', 'dateObtained', e.target.value, 0)}
                        placeholder="2022-08-10"
                        className="border-gray-300 focus:border-blue-400"
                      />
                    </div>
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePrevTab}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        onClick={handleNextTab}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Projects <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="overflow-hidden border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-b">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" /> Generated Resume
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Review your AI-generated resume content below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[60vh] w-full p-6 font-mono text-sm leading-relaxed">
                  <div className="whitespace-pre-wrap">{generatedText}</div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="overflow-hidden border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
              <CardTitle className="text-gray-800">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                {generatedText ? (
                  <>
                    <Button 
                      onClick={downloadResume}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGeneratedText(null);
                        setGeneratedResumeId(null);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Edit Information
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500 italic">
                    Generate your resume to see download options
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-blue-800 text-base">Resume Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use action verbs like "achieved," "implemented," and "led" to describe your experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Quantify achievements with numbers when possible (e.g., "Increased sales by 20%")</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tailor your resume to match the specific job description you're applying for</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Focus on your most recent and relevant experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Keep your resume concise and ideally under 2 pages</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
