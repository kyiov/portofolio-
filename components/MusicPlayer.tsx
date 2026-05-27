import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Search, Loader2, Activity } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [analyserActive, setAnalyserActive] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [track, setTrack] = useState<Track>({
    title: "back to friends",
    artist: "sombr",
    src: "/audio/default.mp3",
    image: "https://i.ytimg.com/vi/c8zq4kAn_O0/hq720.jpg"
  });

  const initAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        setAnalyserActive(true);
      } catch (e) {
        console.warn("Web Audio API not supported or blocked by CORS:", e);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = track.src;
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Reset audio context source if track changes
    if (audioContextRef.current && analyserRef.current) {
        try {
            sourceRef.current?.disconnect();
            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
        } catch (e) {
            console.warn("Could not reconnect audio source:", e);
        }
    }

    const handleCanPlay = () => {
        setAudioLoading(false);
        if (isPlaying) {
            audio.play().catch(e => {
                console.warn("Autoplay blocked:", e);
                setIsPlaying(false);
            });
        }
    };

    const handleLoadStart = () => setAudioLoading(true);
    const handleError = (e: any) => {
        console.error("Audio Error:", e);
        setAudioLoading(false);
        setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    return () => {
        audio.pause();
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('error', handleError);
    };
  }, [track.src]);

  useEffect(() => {
      if (!audioRef.current) return;
      if (isPlaying) {
          if (audioContextRef.current?.state === 'suspended') {
              audioContextRef.current.resume();
          }
          audioRef.current.play().then(() => {
              if (!analyserActive) initAudioContext();
          }).catch(() => setIsPlaying(false));
      } else {
          audioRef.current.pause();
      }
  }, [isPlaying]);

  // Audio Visualizer Draw Loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      animationFrameId = requestAnimationFrame(renderFrame);
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height;

          ctx.fillStyle = '#4d924c'; // Grass Green
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      } else if (isPlaying && !analyserActive) {
        // Simulated visualizer fallback if CORS blocks Web Audio API
        const bars = 16;
        const barWidth = width / bars - 1;
        let x = 0;
        for (let i = 0; i < bars; i++) {
            const barHeight = Math.random() * height * 0.8 + height * 0.2;
            ctx.fillStyle = '#4d924c';
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
      } else {
        // Flat line when paused
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(0, height / 2, width, 1);
      }
    };

    renderFrame();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, analyserActive]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
        const res = await fetch(`https://api.nexray.eu.cc/downloader/ytplay?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (data.status && data.result) {
            const item = data.result;
            setTrack({
                title: item.title.replace(/\(Official Video\)|Lyrics|Official Audio/gi, '').substring(0, 30),
                artist: item.channel,
                src: item.download_url, 
                image: item.thumbnail
            });
            setIsPlaying(true);
            setShowSearch(false);
            setQuery('');
        }
    } catch (err) {
        console.error("Search Error", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {showSearch && (
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="bg-black border border-white/20 w-72 p-4 backdrop-blur-xl"
            >
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="Search track..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-white/5 text-[#4d924c] font-vt323 text-lg p-2 flex-grow border border-white/10 outline-none focus:border-[#4d924c]"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-white text-black font-bold px-3 py-2 hover:bg-white/80 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="bg-black/90 backdrop-blur-xl border border-white/20 flex items-center p-3 gap-4 shadow-2xl"
      >
        <button
            className="w-10 h-10 flex-shrink-0 bg-white border border-transparent flex items-center justify-center hover:bg-white/80 transition-colors text-black"
            onClick={togglePlay}
        >
            {audioLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
            ) : isPlaying ? (
                <Pause fill="currentColor" size={18} />
            ) : (
                <Play fill="currentColor" size={18} className="ml-1" />
            )}
        </button>

        <div className="flex flex-col justify-center w-24 md:w-32">
            <span className="text-[10px] font-bold uppercase text-[#4d924c] truncate tracking-wider">{track.title}</span>
            <span className="text-[9px] text-white/40 truncate mt-0.5 uppercase tracking-widest">{track.artist}</span>
            <canvas ref={canvasRef} width="120" height="20" className="mt-2 w-full h-[15px] opacity-80"></canvas>
        </div>

        <button
            className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border border-transparent hover:border-white/20 transition-all ${showSearch ? 'text-[#4d924c]' : 'text-white/30'}`}
            onClick={() => setShowSearch(!showSearch)}
        >
            <Search size={14} />
        </button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
