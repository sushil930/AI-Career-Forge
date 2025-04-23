import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CircleDashed, FileText } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api";

// Define type for the expected analysis result from the API
// (Should match the structure returned by the backend controller)
interface MatchAnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  matchingKeywords: string[];
  suggestions: string[];
}

const JobMatchPage = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Update state type to use the new interface
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please enter both resume text and job description");
      return;
    }

    setIsAnalyzing(true);
    setMatchResult(null); // Clear previous results

    try {
      // Call the backend API endpoint
      const response = await apiClient.post('/match/resume-job', {
        resumeText, // Sending the raw text
        jobDescription,
      });

      // Store the analysis object from the response
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

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Resume to Job Match</h1>
          <p className="text-xl text-gray-600">
            Compare your resume against a job description to see how well you match
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
              <CardDescription>
                Paste the text of your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={12}
                className="resize-none"
                disabled={isAnalyzing}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Paste the job description you're interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={12}
                className="resize-none"
                disabled={isAnalyzing}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-12">
          <Button
            onClick={handleMatch}
            disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Match"
            )}
          </Button>
        </div>

        {matchResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Match Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Match Score</CardTitle>
                <CardDescription>
                  How well your resume matches the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-theme-blue flex items-center justify-center">
                    <span className="text-5xl font-bold text-theme-blue">
                      {matchResult.matchScore}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matching Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Matching Keywords</CardTitle>
                <CardDescription>
                  Keywords found in both your resume and the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchingKeywords?.length > 0 ? (
                    matchResult.matchingKeywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No strong keyword matches found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
                <CardDescription>
                  Important keywords from the job description missing in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingKeywords?.length > 0 ? (
                    matchResult.missingKeywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No missing keywords identified.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  How to better align your resume with this job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {matchResult.suggestions?.length > 0 ? (
                    matchResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-theme-blue text-sm mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{suggestion}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific suggestions available.</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="outline">
                <a href="/builder">
                  <FileText className="mr-2 h-4 w-4" />
                  Update Resume
                </a>
              </Button>
              <Button onClick={() => setMatchResult(null)}>
                Analyze Another Job
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchPage;
