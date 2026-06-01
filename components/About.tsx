import React from 'react';
import { Globe, Webhook, Box } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-6 relative scroll-mt-24 border-b-thick border-black bg-white">
      <div className="container mx-auto max-w-[65ch] md:max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-auto md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
          
          {/* Main Intro Card - Standard Text */}
          <div className="md:col-span-4 md:row-span-2 card-raw flex flex-col justify-center bg-white p-8 md:p-12">
            <h2 className="text-4xl md:text-6xl font-archivo uppercase mb-6 leading-tight">Engineering <br /> Efficiency</h2>
            <p className="text-black/80 max-w-[65ch] leading-relaxed text-sm md:text-base font-medium">
              API Engineer & Automation Specialist focusing on scalable backend systems and high-performance intelligent bots. 
              <br /><br />
              I specialize in building robust architectures using modern technologies to ensure maximum uptime, optimal latency, and seamless data flow across microservices.
            </p>
          </div>

          {/* Skill Card 1 - Core Competencies */}
          <div className="md:col-span-2 md:row-span-1 card-raw bg-white flex flex-col justify-between p-6">
             <div className="flex gap-2 mb-4">
                <div className="w-2 h-2 bg-black"></div>
                <div className="w-2 h-2 bg-black"></div>
                <div className="w-2 h-2 bg-black"></div>
             </div>
             <div className="flex flex-col gap-3">
                <div>
                   <h3 className="text-xl font-archivo mb-1 uppercase">Web Developer</h3>
                   <p className="text-black/60 text-[10px] font-archivo uppercase tracking-widest flex items-center gap-1"><Globe size={12}/> Architecture & UI</p>
                </div>
                <div>
                   <h3 className="text-xl font-archivo mb-1 uppercase">API Integration</h3>
                   <p className="text-black/60 text-[10px] font-archivo uppercase tracking-widest flex items-center gap-1"><Webhook size={12}/> Microservices</p>
                </div>
                <div>
                   <h3 className="text-xl font-archivo mb-1 uppercase">Automation</h3>
                   <p className="text-black/60 text-[10px] font-archivo uppercase tracking-widest flex items-center gap-1"><Box size={12}/> Logic & Bots</p>
                </div>
             </div>
          </div>

          {/* Location Card */}
          <div className="md:col-span-2 md:row-span-1 card-raw flex flex-col justify-between bg-black text-white p-6">
             <div className="p-4 bg-white border-thick border-white w-fit">
                <Globe className="w-6 h-6 text-black" aria-hidden="true" />
             </div>
             <div>
                <p className="text-white/60 text-[10px] uppercase font-archivo tracking-widest mb-1">Based in</p>
                <h3 className="text-2xl font-archivo uppercase">Pontianak, ID</h3>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;