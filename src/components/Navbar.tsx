import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

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
      return <Button disabled>Loading...</Button>;
    }
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      );
    } else {
      return <Button onClick={handleGetStartedClick}>Get Started</Button>;
    }
  };

  const renderMobileAuthButtons = () => {
    if (isLoading) {
      return <Button className="w-full" disabled>Loading...</Button>;
    }
    if (user) {
      return (
        <>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/dashboard');
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      );
    } else {
      return (
        <Button
          className="w-full"
          onClick={() => {
            setIsMenuOpen(false);
            handleGetStartedClick();
          }}
        >
          Get Started
        </Button>
      );
    }
  };

  return (
    <>
      <nav className="bg-white py-4 px-6 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl gradient-text">AI Resume Pro</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-theme-darkSlate hover:text-theme-blue transition-colors">
              Home
            </Link>
            <Link to="/analyze" className="text-theme-darkSlate hover:text-theme-blue transition-colors">
              Analyze Resume
            </Link>
            <Link to="/builder" className="text-theme-darkSlate hover:text-theme-blue transition-colors">
              Resume Builder
            </Link>
            <Link to="/job-match" className="text-theme-darkSlate hover:text-theme-blue transition-colors">
              Job Match
            </Link>
            {renderAuthButtons()}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 animate-fade-in">
            <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
              <Link
                to="/"
                className="text-theme-darkSlate hover:text-theme-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/analyze"
                className="text-theme-darkSlate hover:text-theme-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Analyze Resume
              </Link>
              <Link
                to="/builder"
                className="text-theme-darkSlate hover:text-theme-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Resume Builder
              </Link>
              <Link
                to="/job-match"
                className="text-theme-darkSlate hover:text-theme-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Job Match
              </Link>
              {renderMobileAuthButtons()}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
