import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = ['About', 'Stack'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    const sections = ['hero', ...navLinks.map(l => l.toLowerCase())];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all ${scrolled ? 'bg-white border-b-thick border-black' : 'bg-transparent border-b-thick border-transparent'}`}>
      <div className="mx-auto max-w-5xl w-full flex justify-between items-center px-4 md:px-6 py-4">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-black flex items-center justify-center overflow-hidden" aria-hidden="true">
             <div className="w-3 h-3 bg-white"></div>
          </div>
          <span className="font-archivo text-xl uppercase tracking-tighter text-black">MUH4RHQ</span>
        </motion.div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className={`text-[12px] font-archivo uppercase tracking-[2px] transition-all px-2 py-1 ${activeSection === item.toLowerCase() ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
              aria-current={activeSection === item.toLowerCase() ? 'page' : undefined}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-black p-2 border-thick border-black"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b-thick border-black overflow-hidden"
          >
            <nav className="flex flex-col items-center py-6 gap-6">
              {navLinks.map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-archivo uppercase tracking-[2px] transition-all px-4 py-2 ${activeSection === item.toLowerCase() ? 'bg-black text-white' : 'text-black'}`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;