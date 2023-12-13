import { useState, useEffect } from 'react';

const Loader = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-customBlue rounded-full"></div>
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {`${Math.round(progress)}%`}
        </div>
        <div
          className="absolute inset-0 w-14 h-14 border-4 border-transparent rounded-full animate-spin"
          style={{ borderLeftColor: '#6366F1', borderTopColor: '#A5B4FC', borderRightColor: '#93C5FD', borderBottomColor: '#3B82F6' }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;