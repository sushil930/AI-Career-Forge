import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignInPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInPromptModal({ isOpen, onClose }: SignInPromptModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 text-slate-500 hover:bg-slate-100"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Sign In Required</h2>
        <p className="text-slate-600 mb-6">
          To access this feature, please sign in or create an account. Resume Analyzer is available without signing in.
        </p>
        <div className="flex flex-col space-y-3">
          <Button onClick={handleLoginClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
            Sign In
          </Button>
          <Button onClick={handleRegisterClick} variant="outline" className="w-full border-slate-300 hover:bg-slate-50 rounded-full">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
