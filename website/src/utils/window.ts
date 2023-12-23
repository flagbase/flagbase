import { useState, useEffect } from 'react';

type WindowDim = {
  width: number;
  height: number;
}

function getWindowDimensions(): WindowDim {
  const { innerWidth: width, innerHeight: height } = typeof window !== 'undefined' && window;
  return {
    width,
    height
  };
}

export function useWindowDimensions(): WindowDim {
  const [windowDimensions, setWindowDimensions] = useState<WindowDim>(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    typeof window !== 'undefined' && window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}