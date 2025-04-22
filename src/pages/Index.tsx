
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Home from "./Home";

const Index = () => {
  return (
    <div>
      <Home />
      <div className="container mx-auto px-6 py-12 text-center">
        <Button size="lg" asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
