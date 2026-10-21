import React, { useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import { motion, useScroll, useSpring } from 'framer-motion';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Only run custom cursor physics on pointer:fine (desktop mouse)
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const dot = document.getElementById('custom-cursor');
    const ring = document.getElementById('cursor-follower');

    if (isTouch || !dot || !ring) {
      if (dot) dot.style.display = 'none';
      if (ring) ring.style.display = 'none';
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let magneticTarget: HTMLElement | null = null;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Smooth physics loop with LERP & magnetic attractor
    const render = () => {
      if (isVisible) {
        // Direct zero-lag position for center dot
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        let targetRingX = mouseX;
        let targetRingY = mouseY;

        // Magnetic attraction to active interactive element
        if (magneticTarget) {
          const rect = magneticTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // Blend 40% towards center of button for magnetic feel
          targetRingX = mouseX + (centerX - mouseX) * 0.45;
          targetRingY = mouseY + (centerY - mouseY) * 0.45;
        }

        // Fluid spring follower (interpolation factor 0.22)
        ringX += (targetRingX - ringX) * 0.22;
        ringY += (targetRingY - ringY) * 0.22;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(render);

    const updateInteractivity = () => {
      const interactives = document.querySelectorAll('a, button, .interactive');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
          magneticTarget = el as HTMLElement;
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
          magneticTarget = null;
        });
      });
    };

    updateInteractivity();
    const observer = new MutationObserver(updateInteractivity);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-accent selection:text-black bg-[#050505] antialiased">
      {/* Top scroll velocity progress line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[100] origin-left shadow-[0_0_12px_#00f2fe]"
        style={{ scaleX }}
      />

      <Navbar />
      <MusicPlayer />

      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Contact />
      </main>

      <footer className="pt-32 pb-16 px-6 lg:px-20 bg-[#050505] flex flex-col gap-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          <div className="flex flex-col gap-4">
            <span className="font-space text-2xl font-black uppercase text-white tracking-tight">
              MUH4RHQ<span className="text-accent">_</span>
            </span>
            <p className="text-white/40 max-w-xs text-sm font-light leading-relaxed">
              Informatics Engineering student, bot developer & API engineer. TypeScript, Python, React, Node.js.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent">Navigation</span>
            <nav className="flex flex-col gap-2.5 font-bold uppercase text-xs">
              <a href="#about" className="text-white/60 hover:text-accent transition-colors interactive">About</a>
              <a href="#projects" className="text-white/60 hover:text-accent transition-colors interactive">Projects</a>
              <a href="#stack" className="text-white/60 hover:text-accent transition-colors interactive">Stack</a>
              <a href="#contact" className="text-white/60 hover:text-accent transition-colors interactive">Contact</a>
            </nav>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent">Connect</span>
            <div className="flex gap-4">
              <a
                href="https://github.com/muhar363"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-mono uppercase text-white hover:border-accent hover:text-accent transition-all interactive active:scale-95"
              >
                Github ↗
              </a>
              <a
                href="https://wa.me/6282148570591"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-mono uppercase text-white hover:border-accent hover:text-accent transition-all interactive active:scale-95"
              >
                Whatsapp ↗
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 font-mono text-[10px] uppercase tracking-widest text-white/30">
          <span>© {new Date().getFullYear()} MUH4RHQ</span>
          <span>TYPESCRIPT · PYTHON · REACT · NODE.JS</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
