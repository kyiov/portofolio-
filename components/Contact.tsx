import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Code2, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <div className="bento-card bg-white text-black border-none flex flex-col md:flex-row items-center justify-between gap-12 p-12 md:p-20">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Let's build something <br /> great together.
            </h2>
            <p className="text-black/50 text-lg font-medium mb-10">
              I'm currently open for new projects and collaborations in API development and automation.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <a href="https://wa.me/6282148570591" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform">
                  <MessageCircle size={18} />
                  WhatsApp
               </a>
               <a href="https://github.com/kyiov" target="_blank" className="flex items-center gap-2 px-6 py-3 border border-black/10 rounded-full font-bold hover:bg-black/5 transition-colors">
                  <Code2 size={18} />
                  GitHub
               </a>
            </div>
          </div>
          
          <div className="relative">
             <div className="w-40 h-40 md:w-64 md:h-64 bg-black rounded-full flex items-center justify-center group cursor-pointer overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full scale-90"
                ></motion.div>
                <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform">HIRE ME</span>
             </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="text-center md:text-left p-4">
              <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Email</p>
              <a href="mailto:abdulmuhar564@gmail.com" className="text-white hover:text-white/70 transition-colors">abdulmuhar564@gmail.com</a>
           </div>
           <div className="text-center md:text-left p-4">
              <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Location</p>
              <p className="text-white">Pontianak, Indonesia</p>
           </div>
           <div className="text-center md:text-left p-4">
              <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Availability</p>
              <p className="text-white">Full-time / Freelance</p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
