
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-theme-blue mb-2 sm:mb-4">404</h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-4 sm:mb-6">Oops! This page is missing from our resume.</p>
        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button asChild size="default" className="sm:h-11 sm:text-base">
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
