import React from 'react';
import { Database, Server, Code, Terminal as TermIcon, Shield, Cloud, Zap, Cpu } from 'lucide-react';

const Stack: React.FC = () => {
  const stack = [
    { name: 'TypeScript', icon: 'devicon-typescript-plain' },
    { name: 'Node.js', icon: 'devicon-nodejs-plain' },
    { name: 'Python', icon: 'devicon-python-plain' },
    { name: 'Go', icon: 'devicon-go-plain' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
    { name: 'Redis', icon: 'devicon-redis-plain' },
    { name: 'Docker', icon: 'devicon-docker-plain' },
    { name: 'React', icon: 'devicon-react-original' },
  ];

  return (
    <section id="stack" className="py-16 md:py-24 px-4 md:px-6 bg-black scroll-mt-24">
      <div className="container mx-auto max-w-[65ch] md:max-w-5xl">
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Technology Stack</h2>
          <p className="text-white/40 max-w-[65ch] mx-auto md:mx-0 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">Selected instruments for high-performance production environments.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-xl">
          {stack.map((item) => (
            <div 
              key={item.name}
              className="bg-[#050505] p-8 md:p-12 flex flex-col items-center justify-center group hover:bg-white/[0.03] transition-all duration-300 focus-within:bg-white/[0.03]"
              tabIndex={0}
              aria-label={`Technology: ${item.name}`}
            >
              <i className={`${item.icon} text-4xl md:text-5xl mb-4 md:mb-6 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-focus:grayscale-0 group-focus:opacity-100 transition-all duration-300`} aria-hidden="true"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white group-focus:text-white transition-colors text-center">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;