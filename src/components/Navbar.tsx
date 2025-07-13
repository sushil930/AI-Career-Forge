import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Home, FileText, ClipboardList, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SignInPromptModal } from './SignInPromptModal';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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

  const navLinks = [
    { to: '/', text: 'Home', icon: <Home size={20} />, requiresAuth: false },
    { to: '/analyze', text: 'Analyze Resume', icon: <FileText size={20} />, requiresAuth: false },
    { to: '/builder', text: 'Resume Builder', icon: <ClipboardList size={20} />, requiresAuth: true },
    { to: '/job-match', text: 'Job Match', icon: <Briefcase size={20} />, requiresAuth: true },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <>
      <nav className={`relative py-4 px-6 sticky top-0 z-40 transition-all duration-300 ${isScrolled || !isHomePage ? 'shadow-md bg-white/90 backdrop-blur-sm' : 'bg-transparent'}`}>
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
              AI Career Forge
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
            {navLinks.filter(link => !link.requiresAuth).map(link => (
              <Link key={link.to} to={link.to} className={`${isActive(link.to)} transition-colors text-sm font-medium`}>
                {link.text}
              </Link>
            ))}
            {navLinks.filter(link => link.requiresAuth).map(link => (
              <div
                key={link.to}
                onClick={() => {
                  if (!user) {
                    setShowSignInModal(true);
                  } else {
                    navigate(link.to);
                  }
                }}
                className={`${isActive(link.to)} transition-colors text-sm font-medium cursor-pointer`}
              >
                {link.text}
              </div>
            ))}
            {renderAuthButtons()}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu Drawer */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white !important z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <span className="font-bold text-xl text-slate-800">Navigation</span>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-200" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div
                  key={link.to}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (link.requiresAuth && !user) {
                      setShowSignInModal(true);
                    } else {
                      navigate(link.to);
                    }
                  }}
                  className={`${isActive(link.to)} flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 hover:bg-blue-50 cursor-pointer`}
                >
                  <span className={isActive(link.to) === "text-blue-600 font-medium" ? "text-blue-600" : "text-slate-500"}>{link.icon}</span>
                  <span className="text-lg">{link.text}</span>
                </div>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-slate-200 flex flex-col space-y-4">
              {renderMobileAuthButtons()}
            </div>
          </div>
        </div>
      </nav>
      <SignInPromptModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </>
  );
}
