
import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-48 px-6 lg:px-20 relative bg-[#050505] overflow-hidden">
      <div className="container mx-auto">
        {/* Main Content Block: Heading and Description */}
        <div className="flex flex-col gap-12 lg:gap-32">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            {/* Main Heading */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <h2 className="font-jakarta text-4xl md:text-6xl lg:text-8xl xl:text-[7rem] font-black tracking-[-0.07em] uppercase leading-[0.95] md:leading-[0.85] text-white">
                DIGITAL <br/>
                <span className="text-accent italic">ENGINEERING</span><br/>
                EXCELLENCE
              </h2>
            </motion.div>
            
            {/* Description */}
            <div className="lg:col-span-4 flex flex-col justify-end">
               <motion.div
                 whileInView={{ opacity: 1, y: 0 }}
                 initial={{ opacity: 0, y: 30 }}
                 viewport={{ once: true }}
                 className="border-l-2 border-accent pl-6 lg:pl-8 h-fit"
               >
                  <p className="text-white/80 font-light text-lg md:text-xl leading-relaxed max-w-md">
                    Obsessed with efficiency. I automate the boring stuff so you can focus on what matters.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase font-black text-accent bg-accent/5">Automation</span>
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase font-black text-white/40">REST API</span>
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase font-black text-white/40">Bot Dev</span>
                  </div>
               </motion.div>
            </div>
          </div>

          {/* Info Cards Row */}
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
                title: 'LOGIC',
                subtitle: 'Bot Architecture',
                desc: 'Building intelligent WhatsApp bots and scalable backend systems using Node.js and Baileys.'
              },
              {
                num: '02',
                title: 'INTELLIGENCE',
                subtitle: 'Applied AI Engineering',
                desc: 'Orchestrating LLMs via API to build smart assistants. Connecting OpenAI, Gemini, and local models into real-world applications.'
              },
              {
                num: '03',
                title: 'LAUNCH',
                subtitle: 'Production Ready',
                desc: 'Optimized deployment for high-performance web apps and 24/7 active bot services.'
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
