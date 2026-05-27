import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -50]);

  return (
    <section id="hero" className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden border-b border-white/10 scroll-mt-24">
      {/* Blocky background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
           aria-hidden="true">
      </div>

      <motion.div 
        style={{ opacity, y }}
        className="text-center z-10 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase font-bold tracking-[0.3em] mb-12 rounded-sm"
        >
          <div className="w-2 h-2 bg-white" aria-hidden="true"></div>
          Status: Operational
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter mb-8 md:mb-12 leading-[1.1] md:leading-[0.85] uppercase glitch-hover transition-all"
        >
          Building <br className="hidden md:block" /> The <span className="text-white/20">Core</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm md:text-base text-white/60 font-bold max-w-[65ch] mx-auto mb-16 leading-relaxed uppercase tracking-widest px-4"
        >
          Architecting High-Performance API Infrastructure & Advanced Automation Logic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#about" aria-label="Learn more about me" className="h-14 px-12 border border-white/10 flex items-center gap-3 text-white/50 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest rounded-lg focus-visible:ring-2 focus-visible:ring-[#4d924c]">
            Explore Architecture
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative center beam */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-white/20 to-transparent" aria-hidden="true"></div>
    </section>
  );
};

export default Hero;