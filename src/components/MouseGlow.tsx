import React, { useEffect, useRef } from 'react';

const MouseGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;

      const { clientX, clientY } = e;
      const size = 400;
      
      glowRef.current.style.left = `${clientX - size / 2}px`;
      glowRef.current.style.top = `${clientY - size / 2}px`;
      glowRef.current.style.width = `${size}px`;
      glowRef.current.style.height = `${size}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={glowRef} className="glow" />;
};

export default MouseGlow;