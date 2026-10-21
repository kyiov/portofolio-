import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { searchMusicTrack, TrackResult } from '../services/musicApi';

type Track = TrackResult & { query?: string };

const DEFAULT_COVER = '/audio/black-beatles.jpg';

const DEFAULT_TRACK: Track = {
  title: 'Black Beatles',
  artist: 'Rae Sremmurd ft. Gucci Mane',
  src: '/audio/black-beatles.mp3',
  image: '/audio/black-beatles.jpg',
  query: 'Black Beatles',
};

const STORAGE_KEY = 'musicPlayerTrack';
const PLAYER_PANEL_ID = 'music-player-panel';
const SEARCH_PANEL_ID = 'music-search-panel';
const SEARCH_INPUT_ID = 'music-search-input';

const srOnlyClass = 'sr-only';

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

function Icon({ name, size = 16 }: { name: 'play' | 'pause' | 'search' | 'close' | 'prev' | 'chevron-right'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'play') return <svg {...common} fill="currentColor" stroke="none"><path d="M7 4.5v15l12-7.5-12-7.5Z" /></svg>;
  if (name === 'pause') return <svg {...common} fill="currentColor" stroke="none"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>;
  if (name === 'search') return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'chevron-right') return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
  return <svg {...common} fill="currentColor" stroke="none"><path d="m19 4.5-10 7.5 10 7.5v-15ZM5 4h2v16H5z" /></svg>;
}

const MusicPlayer: React.FC = () => {
  const [track, setTrack] = useState<Track>(DEFAULT_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentTrackRef = useRef(track);
  const recoveryRef = useRef(false);
  const recoveryTrackRef = useRef('');
  const autoplayRequestedRef = useRef(false);

  useEffect(() => { currentTrackRef.current = track; }, [track]);

  const playTrack = useCallback(async (nextTrack: Track) => {
    const audio = audioRef.current;
    if (!audio || !nextTrack.src) return;

    currentTrackRef.current = nextTrack;
    setTrack(nextTrack);
    setError('');
    setLoading(true);
    audio.src = nextTrack.src;
    audio.load();

    try {
      await audio.play();
      recoveryTrackRef.current = '';
      autoplayRequestedRef.current = false;
      setIsPlaying(true);
    } catch (playError) {
      setIsPlaying(false);
      setLoading(false);
      if ((playError as DOMException)?.name === 'NotAllowedError') {
        autoplayRequestedRef.current = true;
      } else {
        setError('Audio belum bisa diputar. Tekan tombol play untuk mencoba lagi.');
      }
    }
  }, []);

  const recoverCurrentTrack = useCallback(async () => {
    const current = currentTrackRef.current;
    if (current.src === DEFAULT_TRACK.src) {
      await playTrack(DEFAULT_TRACK);
      return;
    }
    const recoveryQuery = current.query || `${current.title} ${current.artist}`;
    if (!recoveryQuery.trim() || recoveryRef.current) return;

    const recoveryKey = `${current.title}|${current.artist}`;
    if (recoveryTrackRef.current === recoveryKey) return;
    recoveryTrackRef.current = recoveryKey;
    recoveryRef.current = true;
    setLoading(true);
    try {
      const freshTrack = await searchMusicTrack(recoveryQuery);
      await playTrack(freshTrack);
    } catch {
      setLoading(false);
      setIsPlaying(false);
      setError('Stream lagu sudah kedaluwarsa. Memutar Black Beatles...');
      await playTrack(DEFAULT_TRACK);
    } finally {
      recoveryRef.current = false;
    }
  }, [playTrack]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onPlaying = () => { setIsPlaying(true); setLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onError = () => {
      setLoading(false);
      setIsPlaying(false);
      void recoverCurrentTrack();
    };
    const onEnded = () => {
      audio.currentTime = 0;
      setProgress(0);
      void audio.play().catch(() => setIsPlaying(false));
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMetadata);
    audio.addEventListener('durationchange', onMetadata);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    // Hydration: prefer stored track if valid, otherwise Black Beatles
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.src && parsed.title !== 'No track loaded') {
          setTrack(parsed);
          currentTrackRef.current = parsed;
          audio.src = parsed.src;
        } else {
          setTrack(DEFAULT_TRACK);
          currentTrackRef.current = DEFAULT_TRACK;
          audio.src = DEFAULT_TRACK.src;
        }
      } else {
        setTrack(DEFAULT_TRACK);
        currentTrackRef.current = DEFAULT_TRACK;
        audio.src = DEFAULT_TRACK.src;
      }
    } catch {
      setTrack(DEFAULT_TRACK);
      currentTrackRef.current = DEFAULT_TRACK;
      audio.src = DEFAULT_TRACK.src;
    }

    return () => {
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMetadata);
      audio.removeEventListener('durationchange', onMetadata);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, [playTrack, recoverCurrentTrack]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(track));
    } catch {
      // Storage unavailable or full
    }
  }, [track]);

  useEffect(() => {
    if (showSearch) window.setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [showSearch]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        if (!audio.src) {
          audio.src = track.src || DEFAULT_TRACK.src;
        }
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      await recoverCurrentTrack();
    }
  }, [track, recoverCurrentTrack]);

  useEffect(() => {
    const retryAutoplay = () => {
      if (!autoplayRequestedRef.current || !audioRef.current?.paused) return;
      autoplayRequestedRef.current = false;
      void togglePlay();
    };
    const events = ['pointerdown', 'keydown', 'touchstart'] as const;
    events.forEach((event) => window.addEventListener(event, retryAutoplay, { passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, retryAutoplay));
  }, [togglePlay]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery || loading) return;

    setLoading(true);
    setError('');
    try {
      const result = await searchMusicTrack(normalizedQuery);
      await playTrack(result);
      setQuery('');
      setShowSearch(false);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Gagal mencari lagu.');
      setLoading(false);
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(duration, ((event.clientX - rect.left) / rect.width) * duration));
    setProgress(audio.currentTime);
  };

  const handleSeekKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const step = event.shiftKey ? 10 : 5;
    let nextTime = audio.currentTime;
    if (event.key === 'ArrowRight') nextTime += step;
    else if (event.key === 'ArrowLeft') nextTime -= step;
    else if (event.key === 'Home') nextTime = 0;
    else if (event.key === 'End') nextTime = duration;
    else return;
    event.preventDefault();
    audio.currentTime = Math.max(0, Math.min(duration, nextTime));
    setProgress(audio.currentTime);
  };

  const restart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    if (audioRef.current.paused) void togglePlay();
  }, [togglePlay]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: [{ src: track.image || DEFAULT_COVER, sizes: '512x512', type: 'image/jpeg' }],
    });
    navigator.mediaSession.setActionHandler('play', () => void togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => void togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', restart);
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
    };
  }, [track, togglePlay, restart]);

  return (
    <div className="fixed right-0 bottom-24 sm:bottom-28 z-50 flex items-center select-none">
      <p className={srOnlyClass} role="status" aria-live="polite">
        {loading ? 'Memuat audio.' : isPlaying ? `Memutar ${track.title} oleh ${track.artist}` : 'Musik dijeda'}
      </p>

      {/* Expanded Music Player Panel (Slides out cleanly from right side) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            id={PLAYER_PANEL_ID}
            aria-label="Detail music player"
            aria-busy={loading}
            className="mr-3 sm:mr-5 w-[calc(100vw-2rem)] sm:w-80 max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]/95 p-4 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header: Status and Close/Tuck button */}
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-accent shadow-[0_0_8px_#00f2fe]' : 'bg-white/20'}`} />
                {isPlaying ? 'Now playing' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-label="Tutup dan sembunyikan ke samping"
                className="flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <span>Tutup</span>
                <Icon name="chevron-right" size={12} />
              </button>
            </div>

            {/* Track Info with Spinning Vinyl */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black shadow-lg">
                {/* Vinyl grooved disc */}
                <div
                  className="h-full w-full rounded-full relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle, #09090b 22%, #1c1c20 23%, #09090b 35%, #1c1c20 36%, #09090b 48%, #1c1c20 49%, #09090b 62%, #1c1c20 63%, #09090b 78%, #1c1c20 79%, #000 100%)',
                    animation: 'spin 6s linear infinite',
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                >
                  <img
                    src={track.image || DEFAULT_COVER}
                    alt={track.title}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.src !== window.location.origin + DEFAULT_COVER) {
                        img.src = DEFAULT_COVER;
                      }
                    }}
                    className={`absolute inset-0 m-auto h-7 w-7 rounded-full object-cover border border-white/30 ${!isPlaying ? 'opacity-70 grayscale' : 'opacity-100'}`}
                  />
                  <div className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-black border border-white/40" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white tracking-tight">{track.title}</p>
                <p className="truncate font-mono text-[11px] text-white/40">{track.artist}</p>
              </div>
            </div>

            {/* Seek Bar */}
            <div
              className="mb-1 cursor-pointer"
              onClick={seek}
              onKeyDown={handleSeekKeyDown}
              role="slider"
              aria-label="Posisi lagu"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={progress}
              aria-valuetext={`${formatTime(progress)} dari ${formatTime(duration)}`}
              tabIndex={duration ? 0 : -1}
            >
              <div className="group relative h-1 rounded-full bg-white/10 transition hover:h-1.5">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
                <div
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100"
                  style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="mb-3 flex justify-between font-mono text-[10px] tabular-nums text-white/30">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Playback Controls */}
            <div className="mb-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                aria-label="Mulai ulang lagu"
                className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <Icon name="prev" size={14} />
              </button>
              <button
                type="button"
                onClick={() => void togglePlay()}
                aria-label={isPlaying ? 'Pause lagu' : 'Putar lagu'}
                disabled={loading}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 hover:bg-accent disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <Icon name={isPlaying ? 'pause' : 'play'} size={18} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowSearch((value) => !value)}
                aria-label="Cari lagu"
                aria-expanded={showSearch}
                className={`rounded-full p-2 transition hover:bg-white/10 ${showSearch ? 'text-accent' : 'text-white/40'}`}
              >
                <Icon name="search" size={14} />
              </button>
            </div>

            {/* Search Input Box */}
            <AnimatePresence>
              {showSearch && (
                <motion.form
                  id={SEARCH_PANEL_ID}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={(event) => void handleSearch(event)}
                  className="mt-3 overflow-hidden border-t border-white/[0.06] pt-3"
                >
                  <div className="flex gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5">
                      <Icon name="search" size={13} />
                      <input
                        id={SEARCH_INPUT_ID}
                        ref={searchInputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari lagu atau artis..."
                        className="min-w-0 flex-1 bg-transparent py-2 text-xs text-white outline-none placeholder:text-white/25"
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!query.trim() || loading}
                      className="rounded-lg bg-accent px-3 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-30"
                    >
                      {loading ? '...' : 'Play'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <p role="alert" className="mt-3 border-t border-red-400/10 pt-2 font-mono text-[10px] leading-relaxed text-red-300/80">
                {error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        SETENGAH PIRINGAN DI TEPI LAYAR (Half-Vinyl Edge Dock)
        - Hanya setengah piringan yang muncul di tepi kanan layar.
        - Berputar halus saat play (CSS animation-play-state).
        - Bersih, minimalis, dan tidak mengganggu konten.
      */}
      <div
        className="relative group cursor-pointer"
        onClick={() => setIsExpanded((prev) => !prev)}
        title={`${track.title} - ${track.artist} (Klik untuk membuka)`}
      >
        {/* Half-vinyl container (translated 50% into the screen margin) */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 translate-x-1/2 transition-transform duration-300 ease-out group-hover:translate-x-[40%]">
          {/* Circular Vinyl Record with grooves and spin animation */}
          <div
            className="w-full h-full rounded-full border border-white/20 shadow-[-6px_0_24px_rgba(0,0,0,0.85)] relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle, #09090b 22%, #1a1a1f 23%, #09090b 35%, #1a1a1f 36%, #09090b 48%, #1a1a1f 49%, #09090b 62%, #1a1a1f 63%, #09090b 78%, #1a1a1f 79%, #000000 100%)',
              animation: 'spin 6s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {/* Vinyl light sheen overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.07) 50deg, transparent 110deg, rgba(255,255,255,0.07) 230deg, transparent 290deg)',
              }}
            />

            {/* Center Label (Album Art Cover) */}
            <div className="absolute inset-0 m-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/25 shadow-md">
              <img
                src={track.image || DEFAULT_COVER}
                alt={`Cover ${track.title}`}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src !== window.location.origin + DEFAULT_COVER) {
                    img.src = DEFAULT_COVER;
                  }
                }}
                className={`w-full h-full object-cover ${!isPlaying ? 'opacity-70 grayscale' : 'opacity-100'}`}
              />
              {/* Spindle hole */}
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black border border-white/40 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Tactile Mini Play/Pause Trigger Button at the left edge of the half-disc */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void togglePlay();
          }}
          aria-label={isPlaying ? 'Pause lagu' : 'Putar lagu'}
          className="absolute left-[-12px] top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#09090b] text-white shadow-lg transition-transform hover:scale-110 hover:border-accent hover:text-accent group-hover:left-[-16px]"
        >
          {loading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent/40 border-t-accent" />
          ) : (
            <Icon name={isPlaying ? 'pause' : 'play'} size={11} />
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
