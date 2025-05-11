import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreProps {
  category: string;
  score: number;
  color: string;
}

export function ResumeScoreCard({ category, score, color }: ScoreProps) {
  // Calculate the stroke-dashoffset for the circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{category}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          
          {/* Score text in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>
              {score}%
            </span>
          </div>
        </div>
        
        {/* Score description */}
        <div className="mt-3 text-center text-sm text-gray-500">
          {score < 50 ? "Needs improvement" : 
           score < 70 ? "Average" :
           score < 90 ? "Good" : "Excellent"}
        </div>
      </CardContent>
    </Card>
  );
}
