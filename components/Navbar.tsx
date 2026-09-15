
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    /** Deteksi section aktif berdasarkan posisi scroll. */
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['about', 'projects', 'stack', 'contact'];
      const offset = window.scrollY + 120;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= offset && el.offsetTop + el.offsetHeight > offset) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Projects', 'Stack', 'Contact'];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'p-2.5 sm:p-4 md:p-6' : 'p-4 sm:p-6 md:p-10'}`}>
      <div className={`mx-auto max-w-7xl w-full flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-[#18181B]/80 backdrop-blur-xl border border-accent/20 rounded-lg px-4 sm:px-8 py-2.5 sm:py-3 shadow-[0_0_20px_rgba(0,242,254,0.15)]' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <a href="#" className="font-space text-lg sm:text-xl md:text-2xl font-bold tracking-tighter interactive text-white uppercase glitch-text">
            MUH4RHQ<span className="text-accent">_</span>
          </a>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 sm:gap-6 md:gap-10"
        >
          {navItems.map(item => {
            const id = item.toLowerCase();
            const isActive = activeSection === id;
            return (
              <a 
                key={item} 
                href={`#${id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className={`relative text-[9px] sm:text-[10px] md:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium transition-all interactive px-1.5 sm:px-2 py-1 ${
                  isActive 
                    ? 'text-accent drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]' 
                    : 'text-white/60 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </a>
            );
          })}
        </motion.nav>
      </div>
    </header>
  );
};

export default Navbar;
