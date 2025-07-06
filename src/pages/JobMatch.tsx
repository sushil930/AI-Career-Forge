import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CircleDashed, FileText, Zap, AlertTriangle, CheckCircle2, ArrowRight, Target, Briefcase, CheckCheck, X, ThumbsUp, Upload } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { cn } from "@/lib/utils";

// Define type for the expected analysis result from the API
// (Should match the structure returned by the backend controller)
interface MatchAnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  matchingKeywords: string[];
  suggestions: string[];
}

const JobMatchPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isResumeDragActive, setIsResumeDragActive] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Update state type to use the new interface
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);
  const [showResumeGuide, setShowResumeGuide] = useState(false);
  const [showJobGuide, setShowJobGuide] = useState(false);

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(null); // Reset previous file
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(selectedFile);
      } else {
        toast.error("Please upload a PDF or DOCX file for the resume.");
        setResumeFile(null);
      }
    }
  };

  const clearResumeFile = () => {
    setResumeFile(null);
    const input = document.getElementById('resume-file-upload') as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleResumeDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResumeDragActive(true);
  };

  const handleResumeDragLeave = () => {
    setIsResumeDragActive(false);
  };

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResumeDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fileType = droppedFile.type;
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(droppedFile);
      } else {
        toast.error("Please upload a PDF or DOCX file for the resume.");
        setResumeFile(null);
      }
    }
  };

  const handleMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast.error("Please upload your resume and enter the job description");
      return;
    }

    setIsAnalyzing(true);
    setMatchResult(null);

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await apiClient.post('/api/match/resume-job', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 && response.data.analysis) {
        setMatchResult(response.data.analysis);
        toast.success(response.data.message || "Job match analysis complete!");
      } else {
        toast.error("Analysis completed but response format was unexpected.");
        console.error("Unexpected match response:", response);
      }

    } catch (error: any) {
      console.error("Match Error:", error);
      let errorMessage = "Error analyzing job match. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Could not reach the server.";
      }
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to determine score text and color
  const getScoreData = (score: number) => {
    if (score < 50) {
      return {
        text: "Low Match",
        description: "Your resume needs significant improvements to match this job's requirements.",
        color: "text-red-500",
        bgColor: "bg-red-500",
        icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
        lightBg: "bg-red-50",
        border: "border-red-100"
      };
    } else if (score < 70) {
      return {
        text: "Average Match",
        description: "Your resume partially matches this job. Adding missing keywords could improve your chances.",
        color: "text-amber-500",
        bgColor: "bg-amber-500",
        icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
        lightBg: "bg-amber-50",
        border: "border-amber-100"
      };
    } else if (score < 90) {
      return {
        text: "Good Match",
        description: "Your resume matches well with this job. A few adjustments could make it even stronger.",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500",
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
        lightBg: "bg-emerald-50",
        border: "border-emerald-100"
      };
    } else {
      return {
        text: "Excellent Match",
        description: "Your resume is highly aligned with this job posting. You're a top candidate!",
        color: "text-indigo-600",
        bgColor: "bg-indigo-600",
        icon: <ThumbsUp className="h-6 w-6 text-indigo-600" />,
        lightBg: "bg-indigo-50",
        border: "border-indigo-100"
      };
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Resume to Job Match
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find out how well your resume aligns with specific job requirements and get tailored suggestions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="h-full shadow-sm transition-all hover:shadow overflow-hidden border-indigo-100">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Your Resume
                </CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>Upload your resume (PDF or DOCX)</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7" 
                    onClick={() => setShowResumeGuide(!showResumeGuide)}
                  >
                    {showResumeGuide ? "Hide Tips" : "Upload Tips"}
                  </Button>
                </CardDescription>
              </CardHeader>
              {showResumeGuide && (
                <div className="bg-blue-50 p-3 text-sm text-blue-800 border-b border-blue-100">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure your resume is in PDF or DOCX format.</li>
                    <li>For best results, use an up-to-date, well-formatted resume.</li>
                    <li>File size should ideally be under 5MB.</li>
                  </ul>
                </div>
              )}
              <CardContent className="p-6">
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out",
                    isResumeDragActive ? "border-indigo-400 bg-indigo-50" : "border-gray-300 bg-gray-50 hover:border-gray-400",
                    isAnalyzing && "opacity-50 cursor-not-allowed"
                  )}
                  onDragOver={handleResumeDragOver}
                  onDragLeave={handleResumeDragLeave}
                  onDrop={handleResumeDrop}
                >
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all", resumeFile ? 'bg-indigo-100' : 'bg-indigo-50')}>
                    <Upload size={30} className={cn("transition-all", resumeFile ? 'text-indigo-600' : 'text-indigo-400')} />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {isResumeDragActive ? "Drop your resume here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-gray-500 mb-4 text-sm">PDF or DOCX, up to 5MB</p>
                  <Input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeFileChange}
                    className="hidden"
                    id="resume-file-upload"
                    disabled={isAnalyzing}
                  />
                  {!resumeFile && (
                    <label
                      htmlFor="resume-file-upload"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white bg-indigo-600 hover:bg-indigo-700 h-9 px-4 py-2",
                        isAnalyzing ? "opacity-50 cursor-not-allowed" : "cursor-pointer shadow-sm hover:shadow"
                      )}
                      aria-disabled={isAnalyzing}
                    >
                      Browse Files
                    </label>
                  )}
                </div>
                {resumeFile && (
                  <div className="mt-4 text-sm flex items-center gap-2 bg-white p-3 rounded-md border border-indigo-100 shadow-sm max-w-full w-full">
                    <div className="p-2 bg-indigo-50 rounded-full">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium" title={resumeFile.name}>{resumeFile.name}</p>
                      <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-500"
                      onClick={clearResumeFile}
                      disabled={isAnalyzing}
                      title="Clear selection"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="h-full shadow-sm transition-all hover:shadow overflow-hidden border-indigo-100">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-500" />
                  Job Description
                </CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>Paste the job description you're interested in</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7" 
                    onClick={() => setShowJobGuide(!showJobGuide)}
                  >
                    {showJobGuide ? "Hide Tips" : "Show Tips"}
                  </Button>
                </CardDescription>
              </CardHeader>
              {showJobGuide && (
                <div className="bg-blue-50 p-3 text-sm text-blue-800 border-b border-blue-100">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Copy the entire job description for best results</li>
                    <li>Include requirements, qualifications, and responsibilities</li>
                    <li>Full job descriptions provide more accurate matching</li>
                  </ul>
                </div>
              )}
              <CardContent className="p-0">
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={14}
                  className="resize-none rounded-none border-0 focus-visible:ring-1 focus-visible:ring-indigo-500"
                  disabled={isAnalyzing}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mb-12">
            <Button
              onClick={handleMatch}
              disabled={isAnalyzing || !resumeFile || !jobDescription.trim()}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-6 px-8 text-lg transition-all duration-200"
            >
              {isAnalyzing ? (
                <>
                  <CircleDashed className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing match...
                </>
              ) : (
                <>
                  Analyze Match
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {matchResult && (
            <div className="space-y-10 animate-in fade-in duration-500">
              {/* Match Score */}
              <Card className="overflow-hidden shadow-sm border-indigo-100">
                <CardHeader className="pb-2 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-500" />
                    Job Match Results
                  </CardTitle>
                  <CardDescription>
                    How well your resume aligns with the job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    <div className="relative">
                      <div className="w-60 h-60 relative">
                        {/* Background circle */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="10"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke={getScoreData(matchResult.matchScore).bgColor}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 54}
                            strokeDashoffset={2 * Math.PI * 54 * (1 - matchResult.matchScore / 100)}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        
                        {/* Score text in the center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-6xl font-bold ${getScoreData(matchResult.matchScore).color}`}>
                            {matchResult.matchScore}%
                          </span>
                          <span className="text-sm font-medium mt-2 text-gray-600">Match Score</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-w-md">
                      <h3 className="text-xl font-bold mb-3">{getScoreData(matchResult.matchScore).text}</h3>
                      <div className={`p-5 rounded-lg mb-4 ${getScoreData(matchResult.matchScore).lightBg} ${getScoreData(matchResult.matchScore).border}`}>
                        <div className="flex items-start gap-3">
                          {getScoreData(matchResult.matchScore).icon}
                          <div>
                            <p className="font-medium mb-2">
                              {matchResult.matchScore >= 80 ? (
                                "Excellent alignment with this position!"
                              ) : matchResult.matchScore >= 60 ? (
                                "Your resume shows potential for this role"
                              ) : (
                                "Your resume needs attention for this job"
                              )}
                            </p>
                            <p className="text-sm text-gray-700">
                              {getScoreData(matchResult.matchScore).description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-5">
                        <div className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                          {matchResult.matchingKeywords.length} matching keywords
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                          {matchResult.missingKeywords.length} missing keywords
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                          {matchResult.suggestions.length} improvement tips
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Two Column Layout for Keywords */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Matching Keywords */}
                <Card className="shadow-sm border-emerald-100">
                  <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-green-50">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCheck className="h-5 w-5 text-emerald-500" />
                      Matching Keywords
                    </CardTitle>
                    <CardDescription>
                      Keywords found in both your resume and the job description
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {matchResult.matchingKeywords?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchingKeywords.map((keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 transition-all hover:bg-emerald-100"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                            {keyword}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                        <AlertTriangle className="h-10 w-10 text-gray-300 mb-2" />
                        <p>No strong keyword matches found.</p>
                        <p className="text-sm mt-1">Consider reviewing the job description more carefully.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Missing Keywords */}
                <Card className="shadow-sm border-red-100">
                  <CardHeader className="border-b bg-gradient-to-r from-red-50 to-amber-50">
                    <CardTitle className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      Missing Keywords
                    </CardTitle>
                    <CardDescription>
                      Important keywords from the job description missing in your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {matchResult.missingKeywords?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingKeywords.map((keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-100 transition-all hover:bg-red-100"
                          >
                            <X className="h-3.5 w-3.5 mr-1.5" />
                            {keyword}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                        <CheckCircle2 className="h-10 w-10 text-emerald-300 mb-2" />
                        <p>No significant missing keywords identified.</p>
                        <p className="text-sm mt-1">Your resume appears to cover the job requirements well.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions */}
              <Card className="shadow-sm border-amber-100">
                <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-yellow-50">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Improvement Suggestions
                  </CardTitle>
                  <CardDescription>
                    Tailored recommendations to better align your resume with this job
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {matchResult.suggestions?.length > 0 ? (
                    <ul className="space-y-4 max-w-3xl mx-auto">
                      {matchResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start p-3 rounded-lg transition-all duration-200 hover:bg-amber-50">
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-700 font-medium mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                      <CheckCircle2 className="h-10 w-10 text-emerald-300 mb-2" />
                      <p>No specific suggestions available.</p>
                      <p className="text-sm mt-1">Your resume already aligns well with this job posting.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-center">Next Steps</h3>
                <p className="text-center text-gray-600 mb-6 max-w-xl mx-auto">
                  Update your resume with the suggested improvements or analyze another job description
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild variant="outline" className="min-w-44 h-12 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all">
                    <a href="/builder">
                      <FileText className="mr-2 h-4 w-4" />
                      Update Resume
                    </a>
                  </Button>
                  <Button 
                    onClick={() => {
                      setMatchResult(null);
                      // Optionally clear resumeFile and jobDescription here if desired for a full reset
                      // setResumeFile(null); 
                      // setJobDescription("");
                    }} 
                    className="min-w-44 h-12 bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                  >
                    Analyze Another Job
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatchPage;
