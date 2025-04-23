import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDashed, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiClient from "@/lib/api";

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

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userInfo, setUserInfo] = useState<ResumeInputData>(initialUserInfo);
  const [skillInput, setSkillInput] = useState("");
  const [respInput, setRespInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [generatedResumeId, setGeneratedResumeId] = useState<string | null>(null);

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
      const response = await apiClient.post('/builder/generate', userInfo);

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

    const downloadUrl = `${apiClient.defaults.baseURL}/builder/download/${generatedResumeId}`;
    toast.info("Initiating PDF download...");
    console.log(`Attempting to download PDF from: ${downloadUrl}`);

    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
          <p className="text-xl text-gray-600">
            Create a professional, ATS-friendly resume in minutes
          </p>
        </div>

        {!generatedText ? (
          <Card>
            <CardHeader>
              <CardTitle>Build Your Resume</CardTitle>
              <CardDescription>
                Fill out the form below to generate a professional resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 mb-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="certs">Certs</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={userInfo.personalInfo.name}
                        onChange={(e) => handleInputChange('personalInfo', "name", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', "email", e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userInfo.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', "phone", e.target.value)}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                      <Input
                        id="linkedin"
                        value={userInfo.personalInfo.linkedin}
                        onChange={(e) => handleInputChange('personalInfo', "linkedin", e.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input
                        id="portfolio"
                        value={userInfo.personalInfo.portfolio}
                        onChange={(e) => handleInputChange('personalInfo', "portfolio", e.target.value)}
                        placeholder="yourportfolio.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={userInfo.personalInfo.address}
                        onChange={(e) => handleInputChange('personalInfo', "address", e.target.value)}
                        placeholder="City, State (Optional)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleNextTab}>Next: Summary</Button>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <div>
                    <Label htmlFor="summary">Professional Summary / Objective</Label>
                    <Textarea
                      id="summary"
                      value={userInfo.summary}
                      onChange={(e) => handleInputChange('summary', 'summary', e.target.value)}
                      placeholder="Optional: A brief summary of your skills and career goals..."
                      rows={5}
                    />
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Personal</Button>
                    <Button onClick={handleNextTab}>Next: Experience</Button>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  {userInfo.experience.map((exp, index) => (
                    <Card key={index} className="p-4 border relative">
                      <CardHeader className="p-2">
                        <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`jobTitle-${index}`}>Job Title *</Label>
                            <Input
                              id={`jobTitle-${index}`}
                              value={exp.jobTitle}
                              onChange={(e) => handleInputChange('experience', "jobTitle", e.target.value, index)}
                              placeholder="Software Engineer"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`company-${index}`}>Company *</Label>
                            <Input
                              id={`company-${index}`}
                              value={exp.company}
                              onChange={(e) => handleInputChange('experience', "company", e.target.value, index)}
                              placeholder="Tech Corp"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${index}`}>Location</Label>
                            <Input
                              id={`location-${index}`}
                              value={exp.location}
                              onChange={(e) => handleInputChange('experience', "location", e.target.value, index)}
                              placeholder="City, State (Optional)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
                            <Input
                              id={`startDate-${index}`}
                              value={exp.startDate}
                              onChange={(e) => handleInputChange('experience', "startDate", e.target.value, index)}
                              placeholder="YYYY-MM"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`endDate-${index}`}>End Date *</Label>
                            <Input
                              id={`endDate-${index}`}
                              value={exp.endDate}
                              onChange={(e) => handleInputChange('experience', "endDate", e.target.value, index)}
                              placeholder="YYYY-MM or Present"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`responsibilities-${index}`}>Responsibilities / Achievements *</Label>
                          <ul className="space-y-1 mt-1 mb-2">
                            {exp.responsibilities?.map((resp, rIndex) => (
                              <li key={rIndex} className="text-sm flex items-center">
                                <span className="mr-2">•</span>{resp}
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-2 text-red-500" onClick={() => removeResponsibility(index, rIndex)}><Trash2 size={14} /></Button>
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            <Input
                              id={`responsibilities-${index}`}
                              value={index === userInfo.experience.length - 1 ? respInput : ""}
                              onChange={(e) => setRespInput(e.target.value)}
                              placeholder="Add a responsibility/achievement..."
                              className="flex-grow"
                            />
                            <Button type="button" variant="secondary" onClick={() => addResponsibility(index)}>Add</Button>
                          </div>
                        </div>
                      </CardContent>
                      {userInfo.experience.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeExperienceBlock(index)}
                        >
                          <Trash2 size={14} /> Remove Exp #{index + 1}
                        </Button>
                      )}
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addExperienceBlock}>+ Add Another Experience</Button>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Summary</Button>
                    <Button onClick={handleNextTab}>Next: Education</Button>
                  </div>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  <p>(Education form fields go here)</p>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Experience</Button>
                    <Button onClick={handleNextTab}>Next: Skills</Button>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  {userInfo.skills.map((skillSet, index) => (
                    <Card key={index} className="p-4 border relative">
                      <Label htmlFor={`skillCat-${index}`}>Skill Category</Label>
                      <Input
                        id={`skillCat-${index}`}
                        value={skillSet.category}
                        onChange={(e) => handleInputChange('skills', 'category', e.target.value, index)}
                        placeholder="e.g., Programming Languages, Software, Soft Skills"
                        className="mb-2"
                      />
                      <Label htmlFor={`skills-${index}`}>Skills *</Label>
                      <ul className="space-y-1 mt-1 mb-2 min-h-[20px]">
                        {skillSet.items?.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm flex items-center bg-gray-100 px-2 py-1 rounded">
                            {item}
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto text-red-500" onClick={() => removeSkill(index, itemIndex)}><Trash2 size={14} /></Button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Input
                          id={`skills-${index}`}
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill (e.g., Python, React)"
                          className="flex-grow"
                        />
                        <Button type="button" variant="secondary" onClick={() => addSkill(index)}>Add Skill</Button>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addSkillCategory} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Skill Category
                  </Button>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Education</Button>
                    <Button onClick={handleNextTab}>Next: Projects</Button>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <p>(Project form fields go here)</p>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Skills</Button>
                    <Button onClick={handleNextTab}>Next: Certs</Button>
                  </div>
                </TabsContent>

                <TabsContent value="certs" className="space-y-4">
                  <p>(Certification form fields go here)</p>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Projects</Button>
                    <Button
                      onClick={generateResumeContent}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Resume"
                      )}
                    </Button>
                  </div>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <div className="lg:grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Resume</CardTitle>
                  <CardDescription>
                    Review the AI-generated text below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[60vh] w-full rounded-md border p-4 whitespace-pre-wrap font-mono text-sm">
                    {generatedText}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-4 mt-6 lg:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3">
                  <Button onClick={downloadResume}>Download Resume (PDF)</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setGeneratedText(null);
                      setGeneratedResumeId(null);
                    }}
                  >
                    Edit Information
                  </Button>
                  <Button variant="outline" disabled>Save Resume (Coming Soon)</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
