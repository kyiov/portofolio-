import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Music } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track: Track = {
    title: "Evaluasi",
    artist: "Hindia",
    src: "https://api.yt2mp3.lol/api/download/ebc5edc295584e54", 
    image: "https://i.ytimg.com/vi/cWrSjCZ5AeE/hq720.jpg"
  };

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = track.src;
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
        setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    fetch(`https://api.nexray.eu.cc/downloader/ytplay?q=Evaluasi+`)
      .then(res => res.json())
      .then(data => {
        if (data.status && data.result) {
            audio.src = data.result.download_url;
        }
      })
      .catch(console.error);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  if (isCollapsed) {
    return (
      <button 
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-black border-thick border-black flex items-center justify-center z-50 hover:bg-white text-white hover:text-black transition-colors"
        aria-label="Expand music player"
      >
        <Music size={20} className={isPlaying ? "animate-pulse" : ""} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[300px] bg-white border-thick border-black overflow-hidden z-50 flex flex-col transition-all">
      
      {/* Main Row */}
      <div className="flex items-center p-3 gap-3">
        {/* Thumbnail */}
        <div className="w-[44px] h-[44px] flex-shrink-0 border-thin border-black overflow-hidden bg-black/5">
          <img 
            src={track.image} 
            alt={`Album art for ${track.title} by ${track.artist}`} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className="text-[11px] font-archivo text-black truncate leading-tight uppercase" title={track.title}>{track.title}</span>
            <span className="text-[10px] text-black/60 truncate uppercase font-archivo tracking-widest mt-0.5" title={track.artist}>{track.artist}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
            <button aria-label="Previous track" className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors">
                <SkipBack size={14} fill="currentColor" />
            </button>
            <button 
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause music" : "Play music"}
                className="w-8 h-8 flex items-center justify-center text-black hover:text-blue transition-colors"
            >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button aria-label="Next track" className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors">
                <SkipForward size={14} fill="currentColor" />
            </button>
        </div>

        {/* Collapse Button */}
        <button 
            onClick={() => setIsCollapsed(true)}
            aria-label="Minimize music player"
            className="w-6 h-full flex items-center justify-center border-l-thin border-black pl-2 ml-1 text-black/40 hover:text-black transition-colors"
        >
            <ChevronDown size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-black/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Audio progress">
        <div 
            className="h-full bg-black transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
        ></div>
      </div>
      
    </div>
  );
};

export default MusicPlayer;