import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Search, Loader2 } from 'lucide-react';

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [track, setTrack] = useState<Track>({
    title: "back to friends",
    artist: "sombr",
    src: "/audio/default.mp3",
    image: "https://i.ytimg.com/vi/c8zq4kAn_O0/hq720.jpg"
  });

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }

    const audio = new Audio(track.src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

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
          audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
          audioRef.current.pause();
      }
  }, [isPlaying]);

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
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      <AnimatePresence>
        {showSearch && (
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="mc-panel-dark w-72 p-4"
            >
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="Search track..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-mc-obsidian text-white font-vt323 text-lg p-2 flex-grow mc-border outline-none focus:border-mc-diamond"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mc-btn mc-btn-primary px-3 py-2"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="mc-panel-dark flex items-center p-2 gap-4 shadow-[8px_8px_0_rgba(0,0,0,0.5)]"
      >
        <button
            className="w-12 h-12 flex-shrink-0 bg-mc-stone mc-border flex items-center justify-center hover:bg-mc-diamond transition-colors text-black"
            onClick={togglePlay}
        >
            {audioLoading ? (
                <Loader2 className="animate-spin w-6 h-6" />
            ) : isPlaying ? (
                <Pause fill="currentColor" size={20} />
            ) : (
                <Play fill="currentColor" size={20} className="ml-1" />
            )}
        </button>

        <div className="flex flex-col justify-center whitespace-nowrap overflow-hidden w-28 md:w-36">
            <span className="text-xs font-pixel text-mc-diamond truncate">{track.title}</span>
            <span className="text-lg font-vt323 text-white/70 truncate mt-1">{track.artist}</span>
        </div>

        <button
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center mc-border hover:bg-mc-stone transition-colors ${showSearch ? 'bg-mc-stone text-black' : 'bg-transparent text-white'}`}
            onClick={() => setShowSearch(!showSearch)}
        >
            <Search size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
