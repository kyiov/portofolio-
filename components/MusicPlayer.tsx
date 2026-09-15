import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { searchMusicTrack, TrackResult } from '../services/musicApi';

type Track = TrackResult & { query?: string };

const DEFAULT_COVER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop stop-color="%2300f2fe"/%3E%3Cstop offset="1" stop-color="%234facfe"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="512" height="512" rx="96" fill="%2309090b"/%3E%3Cpath d="M112 366V146l144 124 144-124v220" fill="none" stroke="url(%23g)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/%3E%3C/svg%3E';

const DEFAULT_TRACK: Track = {
  title: 'No track loaded',
  artist: 'Search to play',
  src: '',
  image: DEFAULT_COVER,
  query: '',
};

const STORAGE_KEY = 'musicPlayerTrack';
const PLAYER_PANEL_ID = 'music-player-panel';
const SEARCH_PANEL_ID = 'music-search-panel';
const SEARCH_INPUT_ID = 'music-search-input';

const srOnlyClass = 'sr-only';

const getPlaybackStatus = (loading: boolean, isPlaying: boolean, track: Track): string => {
  if (loading) return 'Memuat audio.';
  return isPlaying ? `Memutar ${track.title} oleh ${track.artist}.` : `${track.title} dijeda.`;
};

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const isTrack = (value: unknown): value is Track => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Track>;
  return typeof candidate.title === 'string'
    && typeof candidate.artist === 'string'
    && typeof candidate.src === 'string'
    && typeof candidate.image === 'string';
};

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

function Icon({ name, size = 16 }: { name: 'play' | 'pause' | 'search' | 'close' | 'prev'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'play') return <svg {...common} fill="currentColor" stroke="none"><path d="M7 4.5v15l12-7.5-12-7.5Z" /></svg>;
  if (name === 'pause') return <svg {...common} fill="currentColor" stroke="none"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>;
  if (name === 'search') return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
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
      setError('Stream lagu sudah kedaluwarsa. Coba cari lagu ini lagi.');
    } finally {
      recoveryRef.current = false;
    }
  }, [playTrack]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
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

    const savedTrack = readStorage<unknown>(STORAGE_KEY, null);
    const initialTrack = isTrack(savedTrack) && savedTrack.title !== 'Black Beatles'
      ? savedTrack
      : DEFAULT_TRACK;
    if (initialTrack?.src) {
      currentTrackRef.current = initialTrack;
      setTrack(initialTrack);
      audio.src = initialTrack.src;
    } else {
      setTrack(DEFAULT_TRACK);
      currentTrackRef.current = DEFAULT_TRACK;
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
          await recoverCurrentTrack();
          return;
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
  }, [recoverCurrentTrack]);

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
      artwork: track.image ? [{ src: track.image, sizes: '512x512', type: 'image/jpeg' }] : [],
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

  const playbackStatus = getPlaybackStatus(loading, isPlaying, track);
  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-3">
      <p className={srOnlyClass} role="status" aria-live="polite" aria-atomic="true">{playbackStatus}</p>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            id={PLAYER_PANEL_ID}
            aria-label="Detail music player"
            aria-busy={loading}
            className="w-[calc(100vw-2rem)] sm:w-80 max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-accent shadow-[0_0_8px_currentColor]' : 'bg-white/20'}`} />
                {isPlaying ? 'Now playing' : 'Paused'}
              </span>
              <button type="button" onClick={() => setIsExpanded(false)} aria-label="Tutup music player" aria-controls={PLAYER_PANEL_ID} className="rounded-lg p-1 text-white/30 transition hover:bg-white/10 hover:text-white"><Icon name="close" size={14} /></button>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <motion.img
                src={track.image || DEFAULT_COVER}
                alt="Cover lagu"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className={`h-14 w-14 rounded-full border border-white/10 object-cover shadow-xl ${!isPlaying ? 'grayscale opacity-60' : ''}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{track.title}</p>
                <p className="truncate text-[11px] text-white/40">{track.artist}</p>
              </div>
            </div>

            <div className="mb-1 cursor-pointer" onClick={seek} onKeyDown={handleSeekKeyDown} role="slider" aria-label="Posisi lagu" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={progress} aria-valuetext={`${formatTime(progress)} dari ${formatTime(duration)}`} aria-disabled={!duration} tabIndex={duration ? 0 : -1}>
              <div className="group relative h-1 rounded-full bg-white/10 transition hover:h-1.5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
                <div className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100" style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="mb-3 flex justify-between text-[10px] tabular-nums text-white/30"><span>{formatTime(progress)}</span><span>{formatTime(duration)}</span></div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <button type="button" onClick={restart} aria-label="Mulai ulang lagu" className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"><Icon name="prev" size={14} /></button>
              <button type="button" onClick={() => void togglePlay()} aria-label={isPlaying ? 'Pause lagu' : 'Putar lagu'} disabled={loading} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-accent disabled:opacity-50">{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <Icon name={isPlaying ? 'pause' : 'play'} size={16} />}</button>
              <button type="button" onClick={() => setShowSearch((value) => !value)} aria-label="Cari lagu" aria-expanded={showSearch} {...(showSearch ? { 'aria-controls': SEARCH_PANEL_ID } : {})} className={`ml-1 rounded-full p-2 transition hover:bg-white/10 ${showSearch ? 'text-accent' : 'text-white/40'}`}><Icon name="search" size={14} /></button>
            </div>

            <AnimatePresence>
              {showSearch && (
                <motion.form id={SEARCH_PANEL_ID} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} onSubmit={(event) => void handleSearch(event)} aria-label="Form pencarian lagu" className="mt-3 overflow-hidden border-t border-white/[0.06] pt-3">
                  <div className="flex gap-2"><div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5"><Icon name="search" size={13} /><label htmlFor={SEARCH_INPUT_ID} className={srOnlyClass}>Artis atau judul lagu</label><input id={SEARCH_INPUT_ID} ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Artis atau judul lagu..." className="min-w-0 flex-1 bg-transparent py-2 text-xs text-white outline-none placeholder:text-white/25" disabled={loading} /></div><button type="submit" disabled={!query.trim() || loading} className="rounded-lg bg-accent px-3 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-30">{loading ? 'Memuat…' : 'Play'}</button></div>
                </motion.form>
              )}
            </AnimatePresence>

            {error && <p role="alert" aria-live="assertive" className="mt-3 border-t border-red-400/10 pt-2 text-[10px] leading-relaxed text-red-300/80">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="flex items-center overflow-hidden rounded-full border border-white/10 bg-[#0a0a0a]/85 pr-1.5 shadow-2xl backdrop-blur-xl" style={{ boxShadow: isPlaying ? '0 0 24px rgba(0, 242, 254, 0.25)' : undefined }}>
        <button type="button" onClick={() => void togglePlay()} aria-label={isPlaying ? 'Pause lagu' : 'Putar lagu'} aria-busy={loading} className="group relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full"><img src={track.image || DEFAULT_COVER} alt={`Cover ${track.title}`} className={`absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-40 ${!isPlaying ? 'grayscale' : ''}`} /><span className="relative z-10 text-accent">{loading ? <><span aria-hidden="true" className="block h-5 w-5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" /><span className={srOnlyClass}>Memuat audio</span></> : <Icon name={isPlaying ? 'pause' : 'play'} size={16} />}</span></button>
        <button type="button" onClick={() => setIsExpanded((value) => !value)} aria-label="Buka detail music player" aria-expanded={isExpanded} {...(isExpanded ? { 'aria-controls': PLAYER_PANEL_ID } : {})} className="min-w-0 flex-1 px-3 text-left"><span className="block max-w-32 truncate text-[10px] font-black uppercase tracking-wider text-accent">{track.title}</span><span className="block max-w-32 truncate font-mono text-[9px] text-white/50">{track.artist}</span></button>
        <button type="button" onClick={() => { setShowSearch((value) => !value); setIsExpanded(true); }} aria-label="Cari lagu" aria-expanded={showSearch} {...(showSearch ? { 'aria-controls': SEARCH_PANEL_ID } : {})} className={`rounded-full p-2 transition hover:bg-white/10 ${showSearch ? 'text-accent' : 'text-white/50'}`}><Icon name="search" size={15} /></button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
