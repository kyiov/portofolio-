import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -50]);

  return (
    <section id="hero" className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden border-b-thick border-black scroll-mt-24 bg-white">
      {/* Blocky background grid */}
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true"></div>

      <motion.div 
        style={{ opacity, y }}
        className="text-center z-10 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border-thick border-black text-[12px] uppercase font-archivo tracking-[2px] mb-12"
        >
          <div className="w-2 h-2 bg-white" aria-hidden="true"></div>
          Status: Operational
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-[120px] font-archivo mb-8 md:mb-12 leading-none uppercase"
        >
          Architecting <br className="hidden md:block" /> The <span className="text-black/10">Void</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-xl text-black font-semibold max-w-[65ch] mx-auto mb-16 leading-relaxed uppercase tracking-tight px-4"
        >
          High-Performance Infrastructure & Raw Industrial Logic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#about" aria-label="Learn more about me" className="btn-primary h-14 px-12 gap-3 focus-visible:ring-heavy">
            Enter System
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative center beam */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3px] h-24 bg-black" aria-hidden="true"></div>
    </section>
  );
};

export default Hero;