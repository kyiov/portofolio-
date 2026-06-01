import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <MusicPlayer />
      
      <main className="relative z-10 pb-24">
        <Hero />
        <About />
        <Stack />
      </main>

      <footer className="py-16 px-6 border-t-thick border-black bg-white z-10 relative">
        <div className="container mx-auto max-w-[65ch] md:max-w-5xl flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black"></div>
              <span className="font-archivo text-xl uppercase tracking-tighter">MUH4RHQ</span>
           </div>
           
           <p className="text-black/60 text-sm font-semibold uppercase">
             © 2026 RawBlock / Built with precision.
           </p>

           <div className="flex gap-6">
              <a href="https://github.com/kyiov" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-black hover:text-blue transition-colors text-sm font-archivo uppercase">GitHub</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;