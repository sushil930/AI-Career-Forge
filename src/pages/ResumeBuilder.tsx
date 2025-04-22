
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateResume, UserResumeInfo } from "@/utils/resumeUtils";
import { CircleDashed } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialUserInfo: UserResumeInfo = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
  },
  targetRole: "",
  experience: [
    {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      years: 0,
      description: "",
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      graduationYear: "",
    },
  ],
  skills: [],
};

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userInfo, setUserInfo] = useState<UserResumeInfo>(initialUserInfo);
  const [skillInput, setSkillInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  
  const updatePersonalInfo = (field: string, value: string) => {
    setUserInfo({
      ...userInfo,
      personalInfo: {
        ...userInfo.personalInfo,
        [field]: value,
      },
    });
  };
  
  const updateExperience = (field: string, value: string, index: number = 0) => {
    const updatedExperience = [...userInfo.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
      years: field === 'years' ? parseInt(value, 10) || 0 : updatedExperience[index].years,
    };
    
    setUserInfo({
      ...userInfo,
      experience: updatedExperience,
    });
  };
  
  const updateEducation = (field: string, value: string, index: number = 0) => {
    const updatedEducation = [...userInfo.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    
    setUserInfo({
      ...userInfo,
      education: updatedEducation,
    });
  };
  
  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setUserInfo({
        ...userInfo,
        skills: [...userInfo.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };
  
  const removeSkill = (indexToRemove: number) => {
    setUserInfo({
      ...userInfo,
      skills: userInfo.skills.filter((_, index) => index !== indexToRemove),
    });
  };
  
  const handleNextTab = () => {
    if (activeTab === "personal") setActiveTab("experience");
    else if (activeTab === "experience") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("skills");
  };
  
  const handlePrevTab = () => {
    if (activeTab === "skills") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("experience");
    else if (activeTab === "experience") setActiveTab("personal");
  };

  const generateResumeContent = async () => {
    // Basic validation
    if (
      !userInfo.personalInfo.name ||
      !userInfo.personalInfo.email ||
      !userInfo.targetRole ||
      !userInfo.experience[0].company ||
      !userInfo.education[0].institution ||
      userInfo.skills.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsGenerating(true);
    try {
      const resumeContent = await generateResume(userInfo);
      setGeneratedResume(resumeContent);
      toast.success("Resume generated successfully!");
    } catch (error) {
      toast.error("Error generating resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadResume = () => {
    if (!generatedResume) return;
    
    // Create a Blob from the resume content
    const blob = new Blob([generatedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${userInfo.personalInfo.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        
        {!generatedResume ? (
          <Card>
            <CardHeader>
              <CardTitle>Build Your Resume</CardTitle>
              <CardDescription>
                Fill out the form below to generate a professional resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={userInfo.personalInfo.name}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.personalInfo.email}
                          onChange={(e) => updatePersonalInfo("email", e.target.value)}
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={userInfo.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="targetRole">Target Job Role *</Label>
                      <Input
                        id="targetRole"
                        value={userInfo.targetRole}
                        onChange={(e) => setUserInfo({ ...userInfo, targetRole: e.target.value })}
                        placeholder="Frontend Developer"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleNextTab}>Next: Experience</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={userInfo.experience[0].company}
                        onChange={(e) => updateExperience("company", e.target.value)}
                        placeholder="ABC Technologies"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Job Title *</Label>
                      <Input
                        id="role"
                        value={userInfo.experience[0].role}
                        onChange={(e) => updateExperience("role", e.target.value)}
                        placeholder="Senior Frontend Developer"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          value={userInfo.experience[0].startDate}
                          onChange={(e) => updateExperience("startDate", e.target.value)}
                          placeholder="Jan 2020"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date (or "Present")</Label>
                        <Input
                          id="endDate"
                          value={userInfo.experience[0].endDate}
                          onChange={(e) => updateExperience("endDate", e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                      <div>
                        <Label htmlFor="years">Years of Experience *</Label>
                        <Input
                          id="years"
                          type="number"
                          min="0"
                          value={userInfo.experience[0].years}
                          onChange={(e) => updateExperience("years", e.target.value)}
                          placeholder="3"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        value={userInfo.experience[0].description}
                        onChange={(e) => updateExperience("description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements in this role..."
                        rows={5}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Personal</Button>
                    <Button onClick={handleNextTab}>Next: Education</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="education" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="institution">Institution/University *</Label>
                      <Input
                        id="institution"
                        value={userInfo.education[0].institution}
                        onChange={(e) => updateEducation("institution", e.target.value)}
                        placeholder="University of Technology"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="degree">Degree/Certification *</Label>
                      <Input
                        id="degree"
                        value={userInfo.education[0].degree}
                        onChange={(e) => updateEducation("degree", e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input
                        id="graduationYear"
                        value={userInfo.education[0].graduationYear}
                        onChange={(e) => updateEducation("graduationYear", e.target.value)}
                        placeholder="2018"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Experience</Button>
                    <Button onClick={handleNextTab}>Next: Skills</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-4">
                  <div>
                    <Label htmlFor="skills">Skills & Technologies *</Label>
                    <div className="flex">
                      <Input
                        id="skills"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill (e.g., React.js)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button onClick={addSkill} className="ml-2">Add</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Your Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userInfo.skills.length === 0 ? (
                        <p className="text-gray-500">No skills added yet</p>
                      ) : (
                        userInfo.skills.map((skill, index) => (
                          <div 
                            key={index} 
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                          >
                            <span>{skill}</span>
                            <button 
                              className="ml-2 text-blue-600 hover:text-blue-800"
                              onClick={() => removeSkill(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevTab}>Previous: Education</Button>
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Resume</CardTitle>
                  <CardDescription>
                    AI-generated based on your information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={downloadResume}>Download Resume</Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setGeneratedResume(null)}
                    >
                      Edit Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-theme-blue text-sm mr-3 mt-0.5">
                        1
                      </span>
                      <span>Download your resume for use in job applications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-theme-blue text-sm mr-3 mt-0.5">
                        2
                      </span>
                      <span>Match your resume to specific job descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-theme-blue text-sm mr-3 mt-0.5">
                        3
                      </span>
                      <span>Make tailored versions for different job applications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] border rounded-md p-4 font-mono whitespace-pre-wrap">
                    {generatedResume}
                  </ScrollArea>
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
