import React from 'react';
import { motion } from 'framer-motion';

const stackTop = [
  { name: 'TypeScript', icon: 'devicon-typescript-plain' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain' },
  { name: 'Python', icon: 'devicon-python-plain' },
  { name: 'React', icon: 'devicon-react-original' },
  { name: 'Node.js', icon: 'devicon-nodejs-plain' },
];

const stackBottom = [
  { name: 'FastAPI', icon: 'devicon-python-plain' },
  { name: 'Postgres', icon: 'devicon-postgresql-plain' },
  { name: 'Docker', icon: 'devicon-docker-plain' },
  { name: 'Git', icon: 'devicon-git-plain' },
  { name: 'Linux', icon: 'devicon-linux-plain' },
];

const Stack: React.FC = () => {
  return (
    <section id="stack" className="py-28 md:py-48 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-20 mb-16 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="w-full">
          <h2 className="font-jakarta text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-white">
            CORE <br /> <span className="text-accent">STACK</span>
          </h2>
        </div>
        <div className="max-w-xs md:text-right">
          <p className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-3">Technologies</p>
          <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">
            The core toolchain I use to build resilient bots, APIs, and microservices.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Top */}
      <div className="relative flex overflow-hidden py-8 md:py-12 border-y border-white/5 bg-white/[0.01]">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
          className="flex gap-14 md:gap-20 items-center whitespace-nowrap px-8 select-none"
        >
          {[...stackTop, ...stackTop, ...stackTop].map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="group flex items-center gap-5 md:gap-7 interactive touch-manipulation"
            >
              <i
                className={`${item.icon} text-4xl md:text-8xl text-white opacity-20 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all duration-500`}
              />
              <span className="font-jakarta text-2xl md:text-7xl font-black uppercase text-white/10 group-hover:text-white transition-colors duration-300">
                {item.name}
              </span>
              <span className="text-accent text-xl md:text-3xl opacity-20">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Infinite Marquee Bottom */}
      <div className="relative flex overflow-hidden py-8 md:py-12 border-b border-white/5">
        <motion.div
          animate={{ x: [-1200, 0] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
          className="flex gap-14 md:gap-20 items-center whitespace-nowrap px-8 select-none"
        >
          {[...stackBottom, ...stackBottom, ...stackBottom].map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="group flex items-center gap-5 md:gap-7 interactive touch-manipulation"
            >
              <i
                className={`${item.icon} text-4xl md:text-8xl text-white opacity-20 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all duration-500`}
              />
              <span className="font-jakarta text-2xl md:text-7xl font-black uppercase text-white/10 group-hover:text-white transition-colors duration-300">
                {item.name}
              </span>
              <span className="text-accent text-xl md:text-3xl opacity-20">/</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Metric Cards with Tactile Touch & Spring Hover */}
      <div className="mt-20 md:mt-32 container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        <div className="md:col-span-2 flex flex-col justify-center">
          <span className="text-[10px] md:text-[11px] uppercase font-mono tracking-[0.4em] text-accent mb-3 block">
            Capabilities
          </span>
          <p className="text-xl md:text-2xl font-light text-white leading-snug">
            TypeScript, Python, React. Engineered for <span className="text-accent font-bold">high concurrency</span> and low latency.
          </p>
        </div>

        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.96 }}
          className="p-6 md:p-8 bg-white/[0.02] rounded-2xl flex flex-col justify-between border border-white/10 hover:border-accent/40 transition-colors shadow-lg active:scale-95 touch-manipulation"
        >
          <span className="font-space text-3xl md:text-5xl font-black text-white">250+</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-4">
            Production Endpoints
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.96 }}
          className="p-6 md:p-8 bg-white/[0.02] rounded-2xl flex flex-col justify-between border border-white/10 hover:border-accent/40 transition-colors shadow-lg active:scale-95 touch-manipulation"
        >
          <span className="font-space text-3xl md:text-5xl font-black text-accent">24/7</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-4">
            Bot High Availability
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Stack;
