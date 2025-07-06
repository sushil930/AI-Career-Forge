import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeScoreCard } from "@/components/ResumeScoreCard";
import { Input } from "@/components/ui/input";
// Removed client-side utils for parsing/analysis
// import { analyzeResume, parseResumeText, ResumeAnalysis } from "@/utils/resumeUtils";
import { toast } from "sonner";
import { CircleDashed, Upload, FileText, X, CheckCircle2, AlertTriangle, ChevronRight, ArrowRight, BarChart4, Lightbulb, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api"; // Import apiClient

// Type for the nested analysis data
interface ResumeAnalysis {
  overallScore: number;
  categoryScores: {
    formatting: number;
    content: number;
    keywords: number;
    impact: number;
    [key: string]: number;
  };
  suggestions: string[];
  strengths: string[];
  analysisTimestamp?: any; // Added timestamp based on backend code
}

// Type for the actual API response structure for analysis endpoint
interface AnalyzeApiResponse {
  message: string;
  analysis: ResumeAnalysis;
}

const AnalyzeResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null); // State to hold analysis results
  const [isDragActive, setIsDragActive] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(null);
    setUploadedResumeId(null);
    setAnalysisResult(null); // Reset analysis results when new file selected

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a PDF or DOCX file");
      }
    }
  };

  // Function to clear the selected file
  const clearFile = () => {
    setFile(null);
    // Optionally reset input value if needed, though hiding/showing usually suffices
    const input = document.getElementById('resume-upload') as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fileType = droppedFile.type;

      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a PDF or DOCX file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setUploadedResumeId(null);
    setAnalysisResult(null); // Clear previous analysis on new upload

    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      const response = await apiClient.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 && response.data.resumeId) {
        setUploadedResumeId(response.data.resumeId);
        toast.success(response.data.message || "Resume uploaded successfully!");
      } else {
        toast.error("Upload succeeded but response format was unexpected.");
        console.error("Unexpected upload response:", response);
      }

    } catch (error: any) {
      console.error("Upload Error:", error);
      let errorMessage = "Error uploading resume. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Could not reach the server.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Analysis Trigger Function --- 
  const handleAnalysisTrigger = async () => {
    if (!uploadedResumeId) {
      toast.error("No uploaded resume ID found to analyze.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // Use the correct API response type here
      const response = await apiClient.post<AnalyzeApiResponse>(`/api/resumes/${uploadedResumeId}/analyze`);

      // Store the nested 'analysis' object from the response data
      if (response.status === 200 && response.data?.analysis) { // Check for response.data.analysis
        console.log("Received analysis data from backend:", response.data.analysis); // Log the data being set
        setAnalysisResult(response.data.analysis); // Store the nested analysis object
        toast.success(response.data.message || "Resume analysis complete!"); // Use the message from the response
      } else {
        toast.error("Analysis completed but response format was unexpected (missing analysis data).");
        console.error("Unexpected analysis response:", response);
      }

    } catch (error: any) {
      console.error("Analysis Error:", error);
      let errorMessage = "Failed to analyze resume. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Could not reach the server.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset the component state to allow another upload
  const handleUploadAnother = () => {
    setFile(null);
    setUploadedResumeId(null);
    setAnalysisResult(null);
  };

  // Helper function to determine score text color
  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500';
    if (score < 70) return 'text-amber-500';
    if (score < 90) return 'text-emerald-500';
    return 'text-indigo-600';
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI Resume Analysis</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your resume and get AI-powered insights to make it stand out to employers and applicant tracking systems
            </p>
          </div>

          {/* Progress indicators */}
          <div className="mb-10">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              <div className={`flex flex-col items-center ${analysisResult ? 'opacity-50' : 'opacity-100'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${file || uploadedResumeId ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}>
                  <Upload size={18} />
                </div>
                <span className="mt-2 text-sm font-medium">Upload</span>
              </div>
              <div className={`w-16 h-0.5 ${uploadedResumeId || analysisResult ? 'bg-blue-500' : 'bg-gray-200'} mx-2`} />
              <div className={`flex flex-col items-center ${analysisResult ? 'opacity-50' : 'opacity-100'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${uploadedResumeId && !analysisResult ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}>
                  <BarChart4 size={18} />
                </div>
                <span className="mt-2 text-sm font-medium">Analyze</span>
              </div>
              <div className={`w-16 h-0.5 ${analysisResult ? 'bg-blue-500' : 'bg-gray-200'} mx-2`} />
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisResult ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}>
                  <CheckCircle2 size={18} />
                </div>
                <span className="mt-2 text-sm font-medium">Results</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload Form */}
          {!uploadedResumeId && !analysisResult && (
            <Card className="mb-8 shadow-sm animate-fade-in">
              <CardHeader className="border-b bg-slate-50/80">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Step 1: Upload Your Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume in PDF or DOCX format for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* File input area */}
                <div 
                  className={`flex flex-col items-center py-12 border-2 ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'} rounded-lg transition-all duration-200 ease-in-out`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={`w-16 h-16 rounded-full ${file ? 'bg-blue-100' : 'bg-blue-50'} flex items-center justify-center mb-4 transition-all`}>
                    <Upload size={30} className={`${file ? 'text-blue-600' : 'text-blue-400'} transition-all`} />
                  </div>
                  <p className="text-lg font-medium mb-2">{isDragActive ? 'Drop your file here' : 'Drag and drop your resume'}</p>
                  <p className="text-gray-500 mb-6">or</p>
                  <Input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white bg-blue-600 hover:bg-blue-700 h-10 px-6 py-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-sm hover:shadow'}`}
                    aria-disabled={isLoading}
                  >
                    Browse Files
                  </label>
                  {file && (
                    <div className="mt-6 text-sm flex items-center gap-2 bg-white p-3 rounded-md border border-blue-100 shadow-sm max-w-sm w-full">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium" title={file.name}>{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-500"
                        onClick={clearFile}
                        disabled={isLoading}
                        title="Clear selection"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {/* Upload Button */}
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-11 transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Upload Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Analyze Button */}
          {uploadedResumeId && !analysisResult && (
            <Card className="mb-8 shadow-sm border-blue-100 animate-fade-in">
              <CardHeader className="border-b bg-blue-50/70">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart4 className="h-5 w-5 text-blue-500" />
                  Step 2: Analyze Resume
                </CardTitle>
                <CardDescription>
                  Your resume is uploaded and ready for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Resume uploaded successfully</p>
                    <p className="text-sm text-gray-600">Resume ID: {uploadedResumeId}</p>
                  </div>
                </div>
                
                <p className="text-center mb-8 text-gray-600">
                  Click the button below to get detailed scores and suggestions to improve your resume
                </p>
                
                {/* Button to trigger analysis */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleAnalysisTrigger}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-11 transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        Analyze Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Display Analysis Results */}
          {analysisResult && (
            <div className="space-y-10 animate-fade-in">
              {/* Overall Score */}
              <Card className="overflow-hidden shadow-sm border-blue-100">
                <CardHeader className="pb-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-blue-500" />
                    Overall Resume Score
                  </CardTitle>
                  <CardDescription>
                    Based on formatting, content quality, keywords, and impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="relative">
                      <div className="w-52 h-52 relative">
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
                            stroke={analysisResult.overallScore > 80 ? "#4F46E5" : analysisResult.overallScore > 60 ? "#10B981" : "#F97316"}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 54}
                            strokeDashoffset={2 * Math.PI * 54 * (1 - analysisResult.overallScore / 100)}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        
                        {/* Score text in the center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-5xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                            {analysisResult.overallScore}%
                          </span>
                          <span className="text-sm text-gray-500 mt-1">Overall Score</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-w-md">
                      <h3 className="text-xl font-bold mb-3">Score Summary</h3>
                      <div className={`p-4 rounded-lg mb-4 ${
                        analysisResult.overallScore >= 80 ? 'bg-green-50 border border-green-100' :
                        analysisResult.overallScore >= 60 ? 'bg-blue-50 border border-blue-100' :
                        'bg-amber-50 border border-amber-100'
                      }`}>
                        <div className="flex items-start gap-3">
                          {analysisResult.overallScore >= 80 ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                          ) : analysisResult.overallScore >= 60 ? (
                            <CheckCircle2 className="h-6 w-6 text-blue-500 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-amber-500 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium mb-1">
                              {analysisResult.overallScore >= 80 ? 'Your resume is quite strong!' :
                               analysisResult.overallScore >= 60 ? 'Your resume is on the right track' :
                               'Your resume needs improvement'}
                            </p>
                            <p className="text-sm text-gray-700">
                              {analysisResult.overallScore >= 80 ? 'Your resume demonstrates strong formatting, content, and keyword optimization. Apply with confidence!' :
                               analysisResult.overallScore >= 60 ? 'Your resume has solid elements but could use improvement in some areas to stand out more.' :
                               'Your resume requires significant improvements to be competitive in today\'s job market.'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Analysis performed {analysisResult.analysisTimestamp ? 
                          new Date(analysisResult.analysisTimestamp).toLocaleString() : 
                          'recently'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Scores */}
              <div>
                <h2 className="text-2xl font-semibold mb-5 pl-1 border-l-4 border-blue-500 pl-3">Category Breakdown</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <ResumeScoreCard
                    category="Formatting"
                    score={analysisResult?.categoryScores?.formatting || 0}
                    color="#3B82F6" // blue
                  />
                  <ResumeScoreCard
                    category="Content Quality"
                    score={analysisResult?.categoryScores?.content || 0}
                    color="#10B981" // green
                  />
                  <ResumeScoreCard
                    category="Keywords"
                    score={analysisResult?.categoryScores?.keywords || 0}
                    color="#F97316" // orange
                  />
                  <ResumeScoreCard
                    category="Impact"
                    score={analysisResult?.categoryScores?.impact || 0}
                    color="#8B5CF6" // purple
                  />
                </div>
              </div>

              {/* Two column layout for suggestions and strengths */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Suggestions */}
                <Card className="shadow-sm border-amber-100 h-full">
                  <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Areas for Improvement
                    </CardTitle>
                    <CardDescription>
                      Actionable suggestions to enhance your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {analysisResult?.suggestions?.map((suggestion, index) => (
                        <li key={index} className="flex items-start p-3 rounded-lg transition-all duration-200 hover:bg-amber-50">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      )) || <li className="p-3 text-gray-500">No suggestions available.</li>}
                    </ul>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="shadow-sm border-green-100 h-full">
                  <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-500" />
                      Resume Strengths
                    </CardTitle>
                    <CardDescription>
                      Areas where your resume performs well
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {analysisResult?.strengths?.map((strength, index) => (
                        <li key={index} className="flex items-start p-3 rounded-lg transition-all duration-200 hover:bg-green-50">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      )) || <li className="p-3 text-gray-500">No strengths highlighted.</li>}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Actions After Analysis */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-center">Next Steps</h3>
                <p className="text-center text-gray-600 mb-6">
                  Based on your analysis, improve your resume or find matching jobs
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={handleUploadAnother}
                    variant="outline"
                    className="min-w-36 h-12 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Another
                  </Button>
                  <Button 
                    onClick={() => navigate('/builder')}
                    className="min-w-36 h-12 bg-blue-600 hover:bg-blue-700 text-white transition-all" 
                  >
                    <FileText className="mr-2 h-4 w-4" /> Build Improved Resume
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

export default AnalyzeResume;
