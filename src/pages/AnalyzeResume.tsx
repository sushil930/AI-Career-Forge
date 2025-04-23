import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeScoreCard } from "@/components/ResumeScoreCard";
import { Input } from "@/components/ui/input";
// Removed client-side utils for parsing/analysis
// import { analyzeResume, parseResumeText, ResumeAnalysis } from "@/utils/resumeUtils";
import { toast } from "sonner";
import { CircleDashed, Upload, FileText, X } from "lucide-react";
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
      const response = await apiClient.post('/resumes/upload', formData, {
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
      const response = await apiClient.post<AnalyzeApiResponse>(`/resumes/${uploadedResumeId}/analyze`);

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

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">AI Resume Analysis</h1>
          <p className="text-xl text-gray-600">
            Upload your resume to get AI-powered insights and suggestions
          </p>
        </div>

        {/* Step 1: Upload Form (Show if no resume uploaded OR analysis completed) */}
        {!uploadedResumeId && !analysisResult && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Step 1: Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOCX format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* File input area */}
              <div className="flex flex-col items-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Upload size={40} className="text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drag and drop your resume</p>
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
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-disabled={isLoading}
                >
                  Browse Files
                </label>
                {file && (
                  <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate" title={file.name}>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:bg-red-100"
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
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Resume"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Analyze Button (Show if uploaded but not yet analyzed) */}
        {uploadedResumeId && !analysisResult && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Step 2: Analyze Resume</CardTitle>
              <CardDescription>
                Your resume (ID: {uploadedResumeId}) is ready for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Click the button below to get detailed scores and suggestions.
              </p>
              {/* Button to trigger analysis */}
              <Button
                onClick={handleAnalysisTrigger}
                disabled={isLoading} // Disable only while loading
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Now"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Display Analysis Results (Show if analysis is complete) */}
        {analysisResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Overall Score - Reinstated */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overall Resume Score</CardTitle>
                <CardDescription>
                  Based on formatting, content quality, keywords, and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-theme-blue flex items-center justify-center">
                    <span className="text-5xl font-bold text-theme-blue">
                      {analysisResult.overallScore}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Scores - Reinstated */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Category Scores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Add optional chaining to safely access scores */}
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

            {/* Suggestions - Reinstated */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  Actionable suggestions to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {/* Also add optional chaining for safety here */}
                  {analysisResult?.suggestions?.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-theme-blue text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{suggestion}</span>
                    </li>
                  )) || <li>No suggestions available.</li>}
                </ul>
              </CardContent>
            </Card>

            {/* Strengths - Reinstated */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Strengths</CardTitle>
                <CardDescription>
                  Areas where your resume performs well
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {/* Also add optional chaining for safety here */}
                  {analysisResult?.strengths?.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-theme-emerald text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span>{strength}</span>
                    </li>
                  )) || <li>No strengths highlighted.</li>}
                </ul>
              </CardContent>
            </Card>

            {/* Actions After Analysis - Reinstated */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleUploadAnother}
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Another Resume
              </Button>
              <Button onClick={() => navigate('/builder')}> {/* Example Navigation */}
                <FileText className="mr-2 h-4 w-4" /> Build Improved Resume
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyzeResume;
