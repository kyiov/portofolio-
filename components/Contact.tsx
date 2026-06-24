
import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 md:py-48 px-6 lg:px-20 bg-[#050505] overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 md:mb-32 gap-12 md:gap-20">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="font-jakarta text-[14vw] md:text-[10vw] lg:text-[8vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-white">
              LET'S <br/> <span className="text-accent">CREATE</span>
            </h2>
            <p className="mt-8 md:mt-12 text-lg md:text-xl lg:text-3xl text-white/60 font-light max-w-2xl leading-tight">
              Punya ide menarik? Saya selalu siap untuk tantangan baru. Hubungi saya untuk konsultasi gratis.
            </p>
          </motion.div>
          
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="hidden md:block pt-12"
          >
            <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full border border-white/10 flex items-center justify-center p-5 relative">
               <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping"></div>
               <div className="w-full h-full rounded-full bg-accent flex items-center justify-center shadow-[0_0_50px_accent-glow]">
                  <span className="text-black text-4xl lg:text-6xl font-black">✦</span>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col">
          {[
            { label: 'Open Source', title: 'GITHUB', url: 'https://github.com/Har404-err', accent: '#d4ff00' },
            { label: 'Chat Now', title: 'WHATSAPP', url: 'https://wa.me/6282148570591', accent: '#ffffff' }
          ].map((link, idx) => (
            <motion.a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive group relative py-10 md:py-16 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between transition-all duration-500 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-700 ease-out"></div>
              
              <div className="relative z-10 flex flex-col">
                <span className="text-[9px] md:text-[11px] uppercase font-black tracking-[1em] text-white/30 group-hover:text-accent transition-colors mb-3">{link.label}</span>
                <span className="font-jakarta text-5xl md:text-7xl lg:text-[8rem] font-black uppercase tracking-tighter text-white/10 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-1">
                  {link.title}
                </span>
              </div>
              
              <div className="relative z-10 mt-8 md:mt-0 flex items-center gap-8">
                 <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-500">
                    <span className="text-white group-hover:text-black text-2xl md:text-4xl transition-colors transform group-hover:rotate-45 transition-transform duration-500">↗</span>
                 </div>
              </div>
            </motion.a>
          ))}
          <div className="border-t border-white/5"></div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
           <div className="p-12 md:p-16 bg-[#050505] hover:bg-white/[0.02] transition-colors">
              <span className="text-[11px] uppercase font-black tracking-[0.6em] text-accent mb-8 block">Presence</span>
              <p className="font-jakarta text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">PONTIANAK, ID <br/> <span className="text-white/20">UTC+7</span></p>
           </div>
           <div className="p-12 md:p-16 bg-[#050505] hover:bg-white/[0.02] transition-colors">
              <span className="text-[11px] uppercase font-black tracking-[0.6em] text-accent mb-8 block">Experience</span>
              <p className="font-jakarta text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">BUILDING SINCE <br/> <span className="text-white/20">2025</span></p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
