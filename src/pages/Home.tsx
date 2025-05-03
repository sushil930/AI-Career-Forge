import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Link } from "react-router-dom";
import { ArrowRight, FileSearch, FileUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Resume with AI
            </h1>
            <p className="text-xl mb-8">
              Upload, analyze, and improve your resume with powerful AI tools. Stand out from the crowd and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-gray-100" 
                onClick={handleButtonClick}
              >
                <a href="/login">Analyze Your Resume</a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-colors"
                onClick={handleButtonClick}
              >
                <a href="/login">Build a Resume</a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/lovable-uploads/353bfbb2-cfb8-43d4-9933-11ecdf186bd3.png" 
              alt="AI Resume Analysis" 
              className="max-w-md w-full rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Resume Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leverage the power of AI to create, analyze, and optimize your resume for better job opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileUp size={24} />}
              title="AI Resume Analysis"
              description="Upload your existing resume and get instant AI-powered feedback with actionable suggestions for improvement."
            />
            <FeatureCard 
              icon={<FileSearch size={24} />}
              title="Job Match Analysis"
              description="Compare your resume against specific job descriptions to see how well you match and what keywords you're missing."
            />
            <FeatureCard 
              icon={<Users size={24} />}
              title="AI Resume Builder"
              description="Create a professional, ATS-friendly resume from scratch with our AI-powered resume builder."
            />
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={handleButtonClick} className="flex items-center">
              Get Started <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to create, analyze, and improve your resume in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-theme-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload or Create</h3>
              <p className="text-gray-600">
                Upload your existing resume or create a new one from scratch using our intuitive builder.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-theme-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your resume for formatting, content, keywords, and more to provide a comprehensive score.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-theme-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Improve & Download</h3>
              <p className="text-gray-600">
                Apply AI suggestions to improve your resume, then download it in your preferred format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-theme-darkSlate text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Job Search?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Start using AI Resume Pro today and increase your chances of landing your dream job.
          </p>
          <Button size="lg" className="bg-theme-blue hover:bg-blue-600" onClick={handleButtonClick}>
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
