import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import MatrixBackground from './components/MatrixBackground';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black selection:bg-[#4d924c] selection:text-black">
      <CustomCursor />
      <MatrixBackground />
      <Navbar />
      <MusicPlayer />
      
      <main className="relative z-10 pb-24">
        <Hero />
        <About />
        <Stack />
      </main>

      <footer className="py-16 px-6 border-t border-white/5 bg-black z-10 relative">
        <div className="container mx-auto max-w-[65ch] md:max-w-5xl flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-full"></div>
              <span className="font-bold tracking-tight">MUH4RHQ</span>
           </div>
           
           <p className="text-white/40 text-sm font-medium">
             © 2026 Crafted with precision.
           </p>

           <div className="flex gap-6">
              <a href="https://github.com/kyiov" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-white/50 hover:text-white transition-colors text-sm font-bold">GitHub</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;