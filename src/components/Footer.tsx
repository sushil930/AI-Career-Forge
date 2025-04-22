
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-theme-darkSlate text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AI Resume Pro</h3>
            <p className="text-gray-300 mb-4">
              Using AI to help you build, analyze, and improve your resume for better job opportunities.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-gray-300 hover:text-white transition-colors">
                  Analyze Resume
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-gray-300 hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/job-match" className="text-gray-300 hover:text-white transition-colors">
                  Job Match
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Have questions or feedback?</p>
            <p className="text-gray-300 mb-4">Email us at support@airesumepro.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} AI Resume Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
