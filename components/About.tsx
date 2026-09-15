
import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-48 px-6 lg:px-20 relative bg-[#050505] overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col gap-12 lg:gap-32">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <h2 className="font-jakarta text-4xl md:text-6xl lg:text-8xl xl:text-[7rem] font-black tracking-[-0.07em] uppercase leading-[0.95] md:leading-[0.85] text-white">
                BUILD <br/>
                <span className="text-accent italic">BOTS</span> &<br/>
                APIS
              </h2>
            </motion.div>
            
            <div className="lg:col-span-4 flex flex-col justify-end">
               <motion.div
                 whileInView={{ opacity: 1, y: 0 }}
                 initial={{ opacity: 0, y: 30 }}
                 viewport={{ once: true }}
                 className="border-l-2 border-accent pl-6 lg:pl-8 h-fit"
               >
                  <p className="text-white/80 font-light text-lg md:text-xl leading-relaxed max-w-md">
                    I build WhatsApp bots, REST APIs, and automation tools. TypeScript, Python, React, Node.js.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase font-black text-accent bg-accent/5">Bots</span>
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase font-black text-white/40">REST API</span>
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase font-black text-white/40">Automation</span>
                  </div>
               </motion.div>
            </div>
          </div>

          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 60 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                num: '01',
                title: 'BOTS',
                subtitle: 'WhatsApp Bots',
                desc: 'WhatsApp bots with command handlers, plugin system, and media processing. Running 24/7 in production.'
              },
              {
                num: '02',
                title: 'API',
                subtitle: 'REST API Gateway',
                desc: 'REST API gateway with 250+ endpoints. AI, downloader, stalking, tools. Multi-engine fallback for reliability.'
              },
              {
                num: '03',
                title: 'AUTOMATION',
                subtitle: 'Scripts & Cron Jobs',
                desc: 'Automated scraping, monitoring, and deployment pipelines. Caddy reverse proxy, Vercel, GitHub Actions.'
              }
            ].map((card, idx) => (
              <div 
                key={idx}
                className="group relative p-8 lg:p-12 rounded-[30px] bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all duration-500 ease-out interactive overflow-hidden min-h-[350px] flex flex-col"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-[40px] group-hover:bg-accent/10 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <span className="text-[10px] font-black tracking-[0.4em] text-accent mb-8 block uppercase">{card.num} / {card.title}</span>
                  <h3 className="text-2xl lg:text-3xl font-black uppercase text-white leading-tight mb-6 group-hover:text-accent transition-colors">{card.subtitle}</h3>
                </div>
                
                <div className="mt-auto relative z-10">
                  <p className="text-white/40 group-hover:text-white/70 font-medium text-sm lg:text-base leading-relaxed transition-colors mb-8">{card.desc}</p>
                  <div className="w-8 h-[2px] bg-white/10 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
