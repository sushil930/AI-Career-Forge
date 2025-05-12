import React, { useState, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';

/**
 * Component that shows a loading animation during page refreshes and navigation
 */
const PageRefresh: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  // Handle page refresh (actual browser refresh)
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsRefreshing(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Handle router transitions
  useEffect(() => {
    // Show loader on navigation
    setIsRefreshing(true);
    
    // Hide loader after a short delay to allow page to render
    const timer = setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Don't show loader on initial page load (only when using POP navigation type - i.e., browser back/forward)
  useEffect(() => {
    if (navigationType === 'POP') {
      setIsRefreshing(true);
      const timer = setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [navigationType]);

  if (!isRefreshing) return null;

  return <Loader fullScreen color="#3B82F6" />;
};

export default PageRefresh; 