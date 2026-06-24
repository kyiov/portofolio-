
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'p-4 md:p-6' : 'p-6 md:p-10'}`}>
      <div className={`mx-auto max-w-7xl w-full flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-[#18181B]/80 backdrop-blur-xl border border-blue-500/20 rounded-lg px-8 py-3 shadow-[0_0_20px_rgba(37,99,235,0.15)]' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <a href="#" className="font-space text-xl md:text-2xl font-bold tracking-tighter interactive text-white uppercase glitch-text">
            MUH4RHQ<span className="text-[#2563EB]">_</span>
          </a>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 md:gap-10"
        >
          {['About', 'Stack', 'Contact'].map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-medium text-white/60 hover:text-[#2563EB] hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.8)] transition-all interactive px-2 py-1"
            >
              {item}
            </a>
          ))}
        </motion.nav>
      </div>
    </header>
  );
};

export default Navbar;
