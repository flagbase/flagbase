import React, { useState, useEffect } from 'react';

function LoadingAnimation() {
  const [text, setText] = useState('.');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setText((prevText) => (prevText === '.....' ? '.' : prevText + '.'));
    }, 250);

    return () => clearInterval(intervalId);
  }, []);

  return <div className="w-10 text-black">{text}</div>;
}

export default LoadingAnimation;
