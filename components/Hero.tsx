import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 800], [0, 150]);
  const yText = useTransform(scrollY, [0, 800], [0, -120]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.05]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-20 overflow-hidden bg-[#050505]">
      <motion.div 
        style={{ y: yImage, scale, opacity }}
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center p-6 md:p-20"
      >
        <div className="relative w-full max-w-6xl h-full filter contrast-[1.1] brightness-[0.7] transition-all duration-1000">
          <img 
            src="https://c.termai.cc/i161/eVaNqs7.jpg" 
            alt="MUH4RHQ" 
            className="w-full h-full object-cover rounded-[50px] md:rounded-[100px]"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
          <div className="absolute inset-0 bg-[#050505]/30"></div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center py-20"
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 md:gap-4 flex-wrap justify-center">
          <span className="w-6 md:w-12 h-px bg-accent/50"></span>
          <span className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.35em] text-accent">
            INFORMATICS ENGINEERING STUDENT
          </span>
          <span className="w-6 md:w-12 h-px bg-accent/50"></span>
        </motion.div>

        <motion.div style={{ y: yText }} className="relative reveal-text w-full">
          <motion.h1 
            variants={itemVariants}
            className="font-jakarta text-[14vw] md:text-[15vw] font-black leading-[0.8] tracking-[-0.08em] uppercase select-none text-white mix-blend-difference"
          >
            MUH4RHQ
          </motion.h1>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-12 md:mt-20 max-w-3xl px-4"
        >
          <p className="text-xl md:text-3xl lg:text-4xl text-white/90 font-light tracking-tight leading-snug">
            Informatics Engineering Student · <span className="text-accent font-black italic">API Engineer</span> & <span className="text-white font-black italic underline decoration-accent underline-offset-[12px]">Bot Developer</span>.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-16 md:mt-24"
        >
          <motion.a 
            href="#contact" 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="interactive group relative px-10 py-5 overflow-hidden rounded-full transition-all block touch-manipulation active:scale-95"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-accent transition-colors"></div>
            <span className="relative z-10 text-white group-hover:text-black font-jakarta font-black uppercase text-[10px] md:text-xs tracking-[0.3em] flex items-center gap-4 transition-colors">
              Start a Project <span className="text-xl transform group-hover:translate-x-2 transition-transform">→</span>
            </span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
