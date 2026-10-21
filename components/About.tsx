import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AboutCard: React.FC<{
  num: string;
  title: string;
  subtitle: string;
  desc: string;
}> = ({ num, title, subtitle, desc }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMove = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
      opacity: 1,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={() => setPos((p) => ({ ...p, opacity: 0 }))}
      onTouchStart={(e) => e.touches[0] && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => setPos((p) => ({ ...p, opacity: 0 }))}
      className="group relative p-8 lg:p-12 rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-accent/40 transition-all duration-300 ease-out interactive overflow-hidden min-h-[340px] flex flex-col active:scale-[0.98] touch-manipulation shadow-xl"
    >
      {/* Radial Touch/Mouse Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(0, 242, 254, 0.08), transparent 45%)`,
        }}
      />

      <div className="relative z-10">
        <span className="text-[10px] font-mono tracking-[0.4em] text-accent mb-6 block uppercase font-bold">
          {num} / {title}
        </span>
        <h3 className="text-2xl lg:text-3xl font-black uppercase text-white leading-tight mb-4 group-hover:text-accent transition-colors">
          {subtitle}
        </h3>
      </div>

      <div className="mt-auto relative z-10">
        <p className="text-white/45 group-hover:text-white/75 font-light text-sm lg:text-base leading-relaxed transition-colors mb-6">
          {desc}
        </p>
        <div className="w-8 h-[2px] bg-white/10 group-hover:w-full group-hover:bg-accent transition-all duration-500" />
      </div>
    </div>
  );
};

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
                BUILD <br />
                <span className="text-accent italic">BOTS</span> &<br />
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
                  Informatics Engineering student focused on backend architecture, high-performance REST APIs, and automated bot systems. Passionate about engineering resilient microservices with TypeScript, Python, React, and Node.js.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-full border border-accent/40 text-[9px] font-mono uppercase font-bold text-accent bg-accent/10">
                    Informatics Engineering
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-white/10 text-[9px] font-mono uppercase text-white/50">
                    Bots
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-white/10 text-[9px] font-mono uppercase text-white/50">
                    REST API
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-white/10 text-[9px] font-mono uppercase text-white/50">
                    Automation
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                num: '01',
                title: 'BOTS',
                subtitle: 'WhatsApp Bots',
                desc: 'WhatsApp bots with modular command handlers, plugin systems, and media downloaders. Running 24/7 in production.',
              },
              {
                num: '02',
                title: 'API',
                subtitle: 'REST API Gateway',
                desc: 'REST API gateway with 250+ endpoints. AI models, video downloaders, scraping, and tools with multi-provider fallback.',
              },
              {
                num: '03',
                title: 'AUTOMATION',
                subtitle: 'Scripts & Pipeline',
                desc: 'Automated scraping, health monitoring, and edge deployment pipelines. Linux, Docker, reverse proxy.',
              },
            ].map((card, idx) => (
              <AboutCard key={idx} {...card} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
