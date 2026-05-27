import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Check if hovering over clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (window.getComputedStyle(target).cursor === 'pointer' || target.tagName === 'A' || target.tagName === 'BUTTON') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Hide custom cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border-2 border-[#4d924c] pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: clicked ? 0.8 : isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : 0
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 2 }}
      >
          {isHovering && <div className="w-1 h-1 bg-[#4d924c]"></div>}
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-white pointer-events-none z-[10000]"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
    </>
  );
};

export default CustomCursor;
