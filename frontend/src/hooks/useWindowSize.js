import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away to set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width !== undefined && width < 768; // Tailwind md breakpoint
};

export const useIsTablet = () => {
  const { width } = useWindowSize();
  return width !== undefined && width >= 768 && width < 1024; // Between md and lg
};

export const useIsDesktop = () => {
  const { width } = useWindowSize();
  return width !== undefined && width >= 1024; // Tailwind lg breakpoint and above
};

export default useWindowSize;