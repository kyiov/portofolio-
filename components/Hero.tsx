import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -50]);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div 
        style={{ opacity, y }}
        className="text-center z-10 max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Available for new projects
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-gradient glitch-hover transition-all"
        >
          Building Digital <br /> Infrastructure.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          API Engineer and Automation Specialist focusing on scalable backend systems 
          and high-performance intelligent bots.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#contact" className="btn-shiny group">
            Get in touch
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#stack" className="text-white/70 hover:text-white font-bold transition-colors flex items-center gap-2 group text-sm">
            View Stack
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative center light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
};

export default Hero;
