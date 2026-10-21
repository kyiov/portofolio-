import React, { useCallback, useEffect, useRef, useState } from 'react';

type Track = {
  title: string;
  artist: string;
  src: string;
  image: string;
};

const DEFAULT_COVER = '/audio/black-beatles.jpg';

const DEFAULT_TRACK: Track = {
  title: 'Black Beatles',
  artist: 'Rae Sremmurd ft. Gucci Mane',
  src: '/audio/black-beatles.mp3',
  image: '/audio/black-beatles.jpg',
};

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        setLoading(true);
        await audio.play();
        setIsPlaying(true);
        setLoading(false);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setLoading(false);
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(DEFAULT_TRACK.src);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onPlaying = () => {
      setIsPlaying(true);
      setLoading(false);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onError = () => {
      setIsPlaying(false);
      setLoading(false);
    };
    const onEnded = () => {
      audio.currentTime = 0;
      void audio.play().catch(() => setIsPlaying(false));
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: DEFAULT_TRACK.title,
        artist: DEFAULT_TRACK.artist,
        artwork: [{ src: DEFAULT_COVER, sizes: '512x512', type: 'image/jpeg' }],
      });
      navigator.mediaSession.setActionHandler('play', () => void togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => void togglePlay());
    }

    return () => {
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, [togglePlay]);

  return (
    <div
      className="fixed right-0 bottom-24 sm:bottom-28 z-50 select-none"
      role="region"
      aria-label="Piringan hitam pemutar musik"
    >
      {/* 
        SETENGAH PIRINGAN HITAM DI TEPI LAYAR
        - Bersih, minimalis, proporsional.
        - Tidak ada tombol di luar piringan.
        - Berputar saat play (CSS animationPlayState), berhenti di posisi terakhir saat pause.
        - Klik langsung piringan untuk Play / Pause.
      */}
      <button
        type="button"
        onClick={() => void togglePlay()}
        aria-label={isPlaying ? 'Jeda musik Black Beatles' : 'Putar musik Black Beatles'}
        title={isPlaying ? 'Black Beatles (Klik untuk jeda)' : 'Black Beatles (Klik untuk putar)'}
        className="group relative block outline-none cursor-pointer p-0 m-0 bg-transparent border-0"
      >
        {/* Container setengah piringan (offset 50% ke tepi layar kanan) */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 translate-x-1/2 transition-transform duration-300 ease-out group-hover:translate-x-[38%] group-active:scale-95">
          {/* Piringan Vinil Hitam dengan alur mikro konsentris & rotasi halus */}
          <div
            className="w-full h-full rounded-full border border-white/20 shadow-[-6px_0_20px_rgba(0,0,0,0.85)] relative overflow-hidden"
            style={{
              background:
                'radial-gradient(circle, #09090b 22%, #1a1a1f 23%, #09090b 35%, #1a1a1f 36%, #09090b 48%, #1a1a1f 49%, #09090b 62%, #1a1a1f 63%, #09090b 78%, #1a1a1f 79%, #000000 100%)',
              animation: 'spin 5s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {/* Pantulan kilau cahaya vinil (conic sheen) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.08) 50deg, transparent 110deg, rgba(255,255,255,0.08) 230deg, transparent 290deg)',
              }}
            />

            {/* Label Album Art di Tengah */}
            <div className="absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/30 shadow-md">
              <img
                src={DEFAULT_COVER}
                alt="Cover Black Beatles"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src !== window.location.origin + DEFAULT_COVER) {
                    img.src = DEFAULT_COVER;
                  }
                }}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  !isPlaying ? 'opacity-70 grayscale' : 'opacity-100'
                }`}
              />

              {/* Lubang Spindel Tengah */}
              <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-black border border-white/40 shadow-inner" />

              {/* Hover overlay: ikon Play / Pause taktil halus di tengah label */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                {loading ? (
                  <span className="w-2.5 h-2.5 border border-white/40 border-t-accent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M7 4.5v15l12-7.5-12-7.5Z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default MusicPlayer;
