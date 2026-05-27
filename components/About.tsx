import React from 'react';
import { Globe, Webhook, Box } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-6 relative scroll-mt-24">
      <div className="container mx-auto max-w-[65ch] md:max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-auto md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
          
          {/* Main Intro Card - Standard Text */}
          <div className="md:col-span-4 md:row-span-2 bento-card flex flex-col justify-center bg-[#050505] p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 tracking-tighter leading-tight">Engineering <br /> Efficiency</h2>
            <p className="text-white/60 max-w-[65ch] leading-relaxed text-sm md:text-base font-medium">
              API Engineer & Automation Specialist focusing on scalable backend systems and high-performance intelligent bots. 
              <br /><br />
              I specialize in building robust architectures using modern technologies to ensure maximum uptime, optimal latency, and seamless data flow across microservices.
            </p>
          </div>

          {/* Skill Card 1 - Core Competencies */}
          <div className="md:col-span-2 md:row-span-1 bento-card bg-[#050505] flex flex-col justify-between p-6">
             <div className="flex gap-2 mb-4">
                <div className="w-2 h-2 bg-[#4d924c]/40 rounded-sm"></div>
                <div className="w-2 h-2 bg-[#4d924c]/40 rounded-sm"></div>
                <div className="w-2 h-2 bg-[#4d924c]/40 rounded-sm"></div>
             </div>
             <div className="flex flex-col gap-3">
                <div>
                   <h3 className="text-lg font-bold mb-1 uppercase tracking-tighter">Web Developer</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Globe size={12}/> Architecture & UI</p>
                </div>
                <div>
                   <h3 className="text-lg font-bold mb-1 uppercase tracking-tighter">API Integration</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Webhook size={12}/> Microservices</p>
                </div>
                <div>
                   <h3 className="text-lg font-bold mb-1 uppercase tracking-tighter">Automation</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Box size={12}/> Logic & Bots</p>
                </div>
             </div>
          </div>

          {/* Location Card */}
          <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-between bg-[#050505] p-6">
             <div className="p-4 bg-white/5 border border-white/10 w-fit rounded-lg">
                <Globe className="w-6 h-6 text-white" aria-hidden="true" />
             </div>
             <div>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Based in</p>
                <h3 className="text-xl font-black uppercase">Pontianak, ID</h3>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;