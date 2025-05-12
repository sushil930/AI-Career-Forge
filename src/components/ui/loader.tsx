import React from 'react';
import { LineWobble } from 'ldrs/react';
import 'ldrs/react/LineWobble.css';

interface LoaderProps {
  size?: string;
  stroke?: string;
  bgOpacity?: string;
  speed?: string;
  color?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = "80", 
  stroke = "5", 
  bgOpacity = "0.1", 
  speed = "1.75", 
  color = "#3B82F6", // Default to blue
  fullScreen = false,
  className = ""
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <LineWobble
          size={size}
          stroke={stroke}
          bgOpacity={bgOpacity}
          speed={speed}
          color={color}
        />
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LineWobble
        size={size}
        stroke={stroke}
        bgOpacity={bgOpacity}
        speed={speed}
        color={color}
      />
    </div>
  );
};

export default Loader; 