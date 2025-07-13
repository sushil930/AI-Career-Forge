import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { SignInPromptModal } from "@/components/SignInPromptModal";
import { ArrowRight, FileText, Check, Zap, ArrowUpRight, ChevronRight, BarChart, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const elements = document.querySelectorAll('.reveal');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowSignInModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          {/* Abstract shape - right */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-slate-50 to-white"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.03]"></div>
          
          {/* Accent circle */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-50 opacity-60 blur-3xl"></div>
          
          {/* Animated dots */}
          <div className="hidden lg:block">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-blue-600 opacity-10"
                style={{
                  width: `${Math.random() * 6 + 4}px`,
                  height: `${Math.random() * 6 + 4}px`,
                  top: `${Math.random() * 70 + 15}%`,
                  right: `${Math.random() * 40}%`,
                  animation: `float ${Math.random() * 8 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text content */}
            <div className={`lg:col-span-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                <Zap size={14} className="mr-1.5" /> AI-Powered Resume Optimization
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
                AI Career Forge: <span className="relative inline-block">
                  <span className="relative z-10">Transform</span>
                  <span className="absolute bottom-1 left-0 w-full h-2 sm:h-3 bg-blue-100 -z-10"></span>
                </span> your job search
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                AI Career Forge helps you craft the perfect resume and optimize your job search strategy with advanced AI analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Button 
                size="lg" 
                onClick={handleButtonClick}
                className="w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base py-5 px-5 sm:px-6"
              >
                  <span className="mr-2">Start Optimizing</span>
                  <ArrowRight size={16} className="sm:size-[18px]" />
              </Button>
                
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto text-slate-600 hover:text-blue-600"
                >
                  See how it works <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 border-t border-slate-100">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">94%</div>
                  <div className="text-xs sm:text-sm text-slate-500">ATS Pass Rate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">3x</div>
                  <div className="text-xs sm:text-sm text-slate-500">More Interviews</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">10k+</div>
                  <div className="text-xs sm:text-sm text-slate-500">Users</div>
                </div>
              </div>
            </div>
            
            {/* Image/Visualization */}
            <div 
              ref={heroImgRef} 
              className={`lg:col-span-7 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              {/* Dashboard Preview */}
              <div className="relative">
                {/* Main container with shadow and rotation effect */}
                <div 
                  className="bg-white rounded-2xl shadow-xl p-1 transition-all duration-500 hover:shadow-2xl"
                  style={{
                    perspective: '1000px',
                    transform: `rotate3d(0.2, 0.2, 0, ${scrollY * 0.02}deg)`
                  }}
                >
                  {/* Dashboard Content */}
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                    {/* Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mr-3">
                          <FileText size={16} className="text-white" />
                        </div>
                        <span className="font-medium text-slate-800">Resume Analysis Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full flex items-center">
                          <BarChart size={12} className="mr-1" /> Pro Version
                        </div>
                      </div>
                    </div>
                    
                    {/* Dashboard Body */}
                    <div className="grid grid-cols-12 gap-2 p-6">
                      {/* Left panel - Resume Content */}
                      <div className="col-span-6 bg-slate-50 rounded-lg p-4 h-60">
                        <div className="h-4 w-1/3 bg-slate-200 rounded mb-3"></div>
                        <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-4/5 bg-slate-200 rounded mb-4"></div>
                        
                        <div className="h-4 w-1/4 bg-slate-200 rounded mb-3"></div>
                        <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-3/4 bg-slate-200 rounded mb-4"></div>
                        
                        <div className="h-4 w-1/3 bg-slate-200 rounded mb-3"></div>
                        <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
                      </div>
                      
                      {/* Right Panel - Analysis */}
                      <div className="col-span-6 flex flex-col gap-2">
                        {/* Score card */}
                        <div className="bg-slate-50 rounded-lg p-4 h-28 flex items-center">
                          <div className="w-20 h-20 rounded-full border-4 border-blue-100 flex items-center justify-center mr-4">
                            <div className="text-xl font-bold text-blue-600">87%</div>
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-medium mb-1 text-slate-800">ATS Compatibility</div>
                            <div className="flex items-center gap-1">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} size={12} fill="#3b82f6" color="#3b82f6" />
                              ))}
                              <Star size={12} fill="transparent" color="#3b82f6" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Keywords section */}
                        <div className="bg-slate-50 rounded-lg p-4 flex-1">
                          <div className="text-sm font-medium text-slate-600 mb-3">Suggested Keywords</div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">leadership</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">analytics</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">project management</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">strategy</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">innovation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-float">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-800">Keywords Match</div>
                      <div className="text-sm font-bold text-green-600">92%</div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-float animation-delay-1000">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <BarChart size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-800">Readability</div>
                      <div className="text-sm font-bold text-blue-600">Professional</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 reveal fade-bottom">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                Optimize your resume in three steps
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Our intelligent platform makes it easy to create an interview-winning resume.
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="reveal fade-bottom delay-300">
                <div className="bg-slate-50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Upload Resume</h3>
                  <p className="text-slate-600">
                    Upload your existing resume or create a new one with our intuitive builder.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="reveal fade-bottom delay-500">
                <div className="bg-slate-50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">AI Analysis</h3>
                  <p className="text-slate-600">
                    Our AI analyzes your resume against job descriptions and ATS requirements.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="reveal fade-bottom delay-700">
                <div className="bg-slate-50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <span className="text-lg font-bold">3</span>
          </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">Optimize & Download</h3>
                  <p className="text-slate-600">
                    Apply AI suggestions to improve your resume and download in any format.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Redesigned */}
      <section className="py-24 bg-white relative">
        {/* Background texture */}
        <div className="absolute inset-0 -z-10">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02]"></div>
          
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <svg width="100%" height="100%">
              <filter id="testimonialNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#testimonialNoise)" />
            </svg>
          </div>

          {/* Gradient spots */}
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Testimonials Header */}
            <div className="mb-10 sm:mb-16 text-center reveal fade-bottom">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
                Trusted by thousands of job seekers
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                See how our AI resume optimization tool has helped professionals land their dream jobs
              </p>
            </div>
            
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-xl p-6 reveal fade-bottom delay-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6">
                  "I landed 3 interviews in my first week after optimizing my resume with AI Career Forge. The keyword suggestions were spot-on for the tech industry."
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden mr-3 border border-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-600 p-2">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Sarah Johnson</p>
                    <p className="text-sm text-blue-600">Software Engineer at Google</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-xl p-6 reveal fade-bottom delay-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6">
                  "The AI analysis identified gaps in my resume that I hadn't noticed. After implementing the suggestions, I received callbacks from companies that had previously rejected me."
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden mr-3 border border-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-600 p-2">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Michael Chen</p>
                    <p className="text-sm text-blue-600">Marketing Director</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-xl p-6 reveal fade-bottom delay-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6">
                  "As a recent graduate with limited experience, I was struggling to get noticed. AI Resume Pro helped me highlight my skills in a way that caught recruiters' attention."
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden mr-3 border border-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-600 p-2">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Priya Patel</p>
                    <p className="text-sm text-blue-600">Business Analyst</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Featured Testimonial - Large */}
            <div className="mt-8 sm:mt-12 reveal fade-bottom delay-300">
              <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="quoteMark" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <text x="10" y="50" fontFamily="serif" fontSize="80" fill="currentColor">"</text>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#quoteMark)" />
                  </svg>
                </div>
                
                {/* Blur circles */}
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-200/30 blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-200/30 blur-3xl"></div>
                
                <div className="relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300 mb-4">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                  
                  <p className="text-lg sm:text-xl md:text-2xl text-slate-700 font-medium mb-6 sm:mb-8 leading-relaxed">
                    "Before using AI Resume Pro, my resume was getting lost in the ATS systems. Now I'm getting callbacks from 80% of the positions I apply to. The tailored keyword suggestions for each job posting made all the difference."
                  </p>
                  
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-full bg-white p-1 shadow-sm mr-4">
                      <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <span className="font-bold text-lg">JD</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">James Donovan</p>
                      <p className="text-blue-600">Product Manager at Microsoft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center reveal fade-bottom">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to land your dream job?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with our AI-powered resume tools.
            </p>
            <Button 
              size="lg"
              onClick={handleButtonClick}
              className="bg-white text-blue-600 hover:bg-blue-50 rounded-full h-12 sm:h-14 px-6 sm:px-8 transition-all text-sm sm:text-base"
            >
              <span className="mr-2">Get Started Free</span>
              <ArrowRight size={16} className="sm:size-[18px]" />
          </Button>
          </div>
        </div>
      </section>
      
      <style>{`
        .reveal {
          position: relative;
          opacity: 0;
          transition: all 0.8s ease;
        }
        
        .reveal.active {
          opacity: 1;
        }
        
        .fade-bottom {
          transform: translateY(40px);
        }
        
        .fade-bottom.active {
          transform: translateY(0);
        }
        
        .delay-300 {
          transition-delay: 0.3s;
        }
        
        .delay-500 {
          transition-delay: 0.5s;
        }
        
        .delay-700 {
          transition-delay: 0.7s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      <SignInPromptModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </div>
  );
};

export default Home;
