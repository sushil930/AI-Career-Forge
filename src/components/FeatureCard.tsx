
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="card-hover border-t-4 border-t-theme-blue">
      <CardHeader className="pb-2">
        <div className="mb-4 text-theme-blue w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
