
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeScoreCard } from "@/components/ResumeScoreCard";
import { Input } from "@/components/ui/input";
import { analyzeResume, parseResumeText, ResumeAnalysis } from "@/utils/resumeUtils";
import { toast } from "sonner";
import { CircleDashed, Upload } from "lucide-react";

const AnalyzeResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      // Check if the file is a PDF or DOCX
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
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    try {
      setIsUploading(true);
      const resumeText = await parseResumeText(file);
      setIsUploading(false);
      
      setIsAnalyzing(true);
      const analysis = await analyzeResume(resumeText);
      setAnalysisResult(analysis);
      setIsAnalyzing(false);
      
      toast.success("Resume analysis complete!");
    } catch (error) {
      toast.error("Error analyzing resume. Please try again.");
      setIsUploading(false);
      setIsAnalyzing(false);
    }
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
        
        {!analysisResult ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOCX format to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                />
                <label htmlFor="resume-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Browse Files
                  </Button>
                </label>
                
                {file && (
                  <div className="mt-4 text-sm text-gray-600">
                    Selected file: {file.name}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isUploading || isAnalyzing}
                  className="w-full md:w-auto"
                >
                  {isUploading ? (
                    <>
                      <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Overall Score */}
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
            
            {/* Category Scores */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Category Scores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ResumeScoreCard 
                  category="Formatting" 
                  score={analysisResult.categoryScores.formatting} 
                  color="#3B82F6" // blue
                />
                <ResumeScoreCard 
                  category="Content Quality" 
                  score={analysisResult.categoryScores.content} 
                  color="#10B981" // green
                />
                <ResumeScoreCard 
                  category="Keywords" 
                  score={analysisResult.categoryScores.keywords} 
                  color="#F97316" // orange
                />
                <ResumeScoreCard 
                  category="Impact" 
                  score={analysisResult.categoryScores.impact} 
                  color="#8B5CF6" // purple
                />
              </div>
            </div>
            
            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  Actionable suggestions to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-theme-blue text-sm mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Strengths</CardTitle>
                <CardDescription>
                  Areas where your resume performs well
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-theme-emerald text-sm mr-3 mt-0.5">
                        ✓
                      </span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => setAnalysisResult(null)} 
                variant="outline"
              >
                Upload Another Resume
              </Button>
              <Button>
                Build Improved Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeResume;
