import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  const renderAuthButtons = () => {
    if (isLoading) {
      return <Button disabled variant="ghost" className="text-slate-400">Loading...</Button>;
    }
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="rounded-full border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-slate-600 hover:text-blue-600 hover:bg-transparent"
          >
            Logout
          </Button>
        </div>
      );
    } else {
      return (
        <Button 
          onClick={handleGetStartedClick}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight size={16} />
        </Button>
      );
    }
  };

  const renderMobileAuthButtons = () => {
    if (isLoading) {
      return <Button className="w-full rounded-full" disabled>Loading...</Button>;
    }
    if (user) {
      return (
        <>
          <Button
            variant="outline"
            className="w-full rounded-full border-slate-200 hover:border-blue-600"
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/dashboard');
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full text-slate-600"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      );
    } else {
      return (
        <Button
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            setIsMenuOpen(false);
            handleGetStartedClick();
          }}
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight size={16} />
        </Button>
      );
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-blue-600 font-medium" : "text-slate-600 hover:text-blue-600";
  };

  return (
    <nav className={`relative backdrop-blur-sm py-4 px-6 sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-md bg-white/90' : 'bg-white'}`}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="font-bold text-2xl text-slate-900 group-hover:text-blue-600 transition-colors">
            AI Resume Pro
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${isActive("/")} transition-colors text-sm font-medium`}>
            Home
          </Link>
          <Link to="/analyze" className={`${isActive("/analyze")} transition-colors text-sm font-medium`}>
            Analyze Resume
          </Link>
          <Link to="/builder" className={`${isActive("/builder")} transition-colors text-sm font-medium`}>
            Resume Builder
          </Link>
          <Link to="/job-match" className={`${isActive("/job-match")} transition-colors text-sm font-medium`}>
            Job Match
          </Link>
          {renderAuthButtons()}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md z-50 animate-in fade-in slide-in-from-top duration-300">
          {/* Mobile texture overlay */}
          <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none">
            <svg width="100%" height="100%">
              <filter id="mobileNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#mobileNoise)" />
            </svg>
          </div>
          <div className="container mx-auto py-8 px-6 flex flex-col space-y-6">
            <Link
              to="/"
              className={`${isActive("/")} text-lg font-medium transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/analyze"
              className={`${isActive("/analyze")} text-lg font-medium transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Analyze Resume
            </Link>
            <Link
              to="/builder"
              className={`${isActive("/builder")} text-lg font-medium transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Resume Builder
            </Link>
            <Link
              to="/job-match"
              className={`${isActive("/job-match")} text-lg font-medium transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Job Match
            </Link>
            <div className="pt-4 mt-4 border-t border-slate-100">
              {renderMobileAuthButtons()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
