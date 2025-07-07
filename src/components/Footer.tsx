import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-slate-100 py-8 sm:py-12 md:py-16">
      {/* Texture overlay */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50"></div>
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-soft-light">
          <svg width="100%" height="100%">
            <filter id="footerNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#footerNoise)" />
          </svg>
        </div>
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center sm:text-left">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2">
            <div className="mb-4 sm:mb-6">
              <span className="font-bold text-xl sm:text-2xl text-slate-900">AI Career Forge</span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-sm mx-auto sm:mx-0">
              Using AI to help you forge your career path with better resumes and job matching.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm uppercase text-slate-400 font-medium tracking-wider mb-4 sm:mb-6">
              Product
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link to="/analyze" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>Resume Analysis</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>Resume Builder</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link to="/job-match" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>Job Matching</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>Pricing</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xs sm:text-sm uppercase text-slate-400 font-medium tracking-wider mb-4 sm:mb-6">
              Company
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link to="/about" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>About Us</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>Contact</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <a href="mailto:support@aicareerforge.com" className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center group">
                  <span>support@aicareerforge.com</span>
                  <ArrowUpRight size={12} className="sm:size-[14px] ml-1 transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 mt-10 sm:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs sm:text-sm">
          <p>&copy; {currentYear} AI Career Forge. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
