
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreProps {
  category: string;
  score: number;
  color: string;
}

export function ResumeScoreCard({ category, score, color }: ScoreProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="resume-progress-bar mt-2">
          <div 
            className="resume-progress-value" 
            style={{ 
              width: `${score}%`, 
              backgroundColor: color 
            }} 
          />
        </div>
        <div className="mt-1 text-right text-sm font-medium">{score}%</div>
      </CardContent>
    </Card>
  );
}
