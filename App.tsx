
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import { motion, useScroll, useSpring } from 'framer-motion';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [isSiteLoading, setIsSiteLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading screen singkat
    const timer = setTimeout(() => {
      setIsSiteLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const dot = document.getElementById('custom-cursor');
    const ring = document.getElementById('cursor-follower');
    
    // Helper untuk set posisi & visibilitas
    const setCursor = (x: number, y: number, visible: boolean) => {
        if (!dot || !ring) return;
        
        dot.style.opacity = visible ? '1' : '0';
        ring.style.opacity = visible ? '1' : '0';
        
        if (visible) {
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            ring.style.left = `${x}px`;
            ring.style.top = `${y}px`;
        }
    };

    // Desktop Mouse
    const onMouseMove = (e: MouseEvent) => setCursor(e.clientX, e.clientY, true);
    
    // Mobile Touch (Restored Dragging)
    const onTouchStart = (e: TouchEvent) => setCursor(e.touches[0].clientX, e.touches[0].clientY, true);
    const onTouchMove = (e: TouchEvent) => setCursor(e.touches[0].clientX, e.touches[0].clientY, true);
    const onTouchEnd = () => {
        if (dot && ring) {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        }
    };

    // Event Listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    
    const updateInteractivity = () => {
      const interactives = document.querySelectorAll('a, button, .interactive');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    };

    updateInteractivity();
    const observer = new MutationObserver(updateInteractivity);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-accent selection:text-black bg-[#050505]">
      <AnimatePresence>
        {isSiteLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center flex-col gap-6"
          >
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.3)]"
            >
               <div className="w-8 h-8 rounded-full bg-accent animate-pulse shadow-[0_0_20px_rgba(0,242,254,0.6)]"></div>
            </motion.div>
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="font-space font-black tracking-[0.3em] text-accent uppercase text-sm"
            >
              INITIALIZING
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="fixed top-0 left-0 right-0 h-[4px] bg-accent z-[100] origin-left shadow-[0_0_15px_accent-glow]"
        style={{ scaleX }}
      />
      
      <Navbar />
      <MusicPlayer />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Stack />
        <Contact />
      </main>

      <footer className="pt-40 pb-20 px-6 lg:px-20 bg-[#050505] flex flex-col gap-20">
        <div className="w-full h-px bg-white/10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
           <div className="flex flex-col gap-6">
              <span className="font-jakarta text-2xl font-black uppercase text-white">MUH4RHQ</span>
              <p className="text-white/40 max-w-xs font-medium">Crafting digital experiences & intelligent bots. Specialized in API Development and Automation.</p>
           </div>
           
           <div className="flex flex-col gap-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-accent">Navigation</span>
              <nav className="flex flex-col gap-3 font-bold uppercase text-sm">
                 <a href="#about" className="hover:text-accent transition-colors interactive">About</a>
                 <a href="#stack" className="hover:text-accent transition-colors interactive">Stack</a>
                 <a href="#contact" className="hover:text-accent transition-colors interactive">Contact</a>
              </nav>
           </div>

           <div className="flex flex-col gap-6 md:items-end">
              <span className="text-[10px] uppercase font-black tracking-widest text-accent">Connect</span>
              <div className="flex gap-6">
                 <a href="https://github.com/Har404-err" target="_blank" className="font-bold text-white hover:text-accent transition-colors interactive uppercase">Github</a>
                 <a href="https://wa.me/6282148570591" target="_blank" className="font-bold text-white hover:text-accent transition-colors interactive uppercase">Whatsapp</a>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 opacity-20">
          <span className="text-[10px] uppercase tracking-[0.6em] font-black">© {new Date().getFullYear()} MUH4RHQ PORTFOLIO</span>
          <span className="text-[10px] uppercase tracking-[0.6em] font-black">BUILT WITH SPEED</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
