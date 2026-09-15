
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
    <section id="stack" className="py-32 md:py-56 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20 mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="w-full">
            <h2 className="font-jakarta text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-white">
              CORE <br/> <span className="text-accent">STACK</span>
            </h2>
        </div>
        <div className="max-w-xs md:text-right">
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Stack</p>
            <p className="text-base md:text-lg text-white font-light italic">What I use to build bots, APIs, and automation tools.</p>
        </div>
      </div>

      <div className="relative flex overflow-hidden py-10 md:py-14 border-y border-white/5 bg-white/[0.01]">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-16 md:gap-24 items-center whitespace-nowrap px-12"
        >
          {[...stackTop, ...stackTop, ...stackTop].map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`}
              className="group flex items-center gap-6 md:gap-8 interactive"
            >
              <i className={`${item.icon} text-5xl md:text-9xl text-white opacity-10 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all duration-700`}></i>
              <span className="font-jakarta text-3xl md:text-8xl font-black uppercase text-white/5 group-hover:text-white transition-colors">
                {item.name}
              </span>
              <span className="text-accent text-2xl md:text-4xl opacity-10">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative flex overflow-hidden py-10 md:py-14 border-b border-white/5">
        <motion.div 
          animate={{ x: [-1200, 0] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-16 md:gap-24 items-center whitespace-nowrap px-12"
        >
          {[...stackBottom, ...stackBottom, ...stackBottom].map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`}
              className="group flex items-center gap-6 md:gap-8 interactive"
            >
              <i className={`${item.icon} text-5xl md:text-9xl text-white opacity-10 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all duration-700`}></i>
              <span className="font-jakarta text-3xl md:text-8xl font-black uppercase text-white/5 group-hover:text-white transition-colors">
                {item.name}
              </span>
              <span className="text-accent text-2xl md:text-4xl opacity-10">/</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-24 md:mt-40 container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="md:col-span-2">
            <span className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.4em] md:tracking-[0.6em] text-accent mb-4 md:mb-6 block">Stack</span>
            <p className="text-2xl md:text-3xl font-light text-white leading-tight">
                TypeScript, Python, React. I build <span className="font-black italic">bots and APIs</span> that handle real traffic.
            </p>
        </div>
        <div className="p-8 bg-white/5 rounded-2xl flex flex-col justify-between border border-white/5 group hover:border-accent/30 transition-all min-h-[140px]">
            <span className="text-3xl md:text-4xl font-black text-white group-hover:text-accent">250+</span>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40">API Endpoints</span>
        </div>
        <div className="p-8 bg-white/5 rounded-2xl flex flex-col justify-between border border-white/5 group hover:border-accent/30 transition-all min-h-[140px]">
            <span className="text-3xl md:text-4xl font-black text-white group-hover:text-accent">24/7</span>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40">Bot Uptime</span>
        </div>
      </div>
    </section>
  );
};

export default Stack;
