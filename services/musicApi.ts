/**
 * Music search & streaming API for portfolio MusicPlayer.
 *
 * Adapted from Mithra EX's scrapers (system/lib/scraper/savetube.js + kyio.js):
 *   1. Piped API (api.piped.private.coffee) — CORS-friendly YouTube search
 *   2. SaveTube CDN — direct audio URL extraction (AES-128-CBC decrypt, same as mithra)
 *   3. Fallback to legacy kyio.web.id API endpoints
 *
 * All requests run client-side in the browser. SaveTube & Piped both send
 * permissive CORS headers, so no proxy is needed for the primary path.
 */

export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
  query?: string;
}

const SAVETUBE_KEY_HEX = 'C5D58EF67A7584E4A29F6C35BBC4EB12';

async function importAesKey(): Promise<CryptoKey> {
  const raw = new Uint8Array(SAVETUBE_KEY_HEX.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  return crypto.subtle.importKey('raw', raw, { name: 'AES-CBC' }, false, ['decrypt']);
}

async function decryptSaveTubeData(encBase64: string): Promise<Record<string, any>> {
  const key = await importAesKey();
  const encrypted = Uint8Array.from(atob(encBase64), (c) => c.charCodeAt(0));
  const iv = encrypted.slice(0, 16);
  const ciphertext = encrypted.slice(16);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
  const text = new TextDecoder().decode(decrypted);
  return JSON.parse(text);
}


const PIPED_INSTANCES = [
  'api.piped.private.coffee',
  'pipedapi.kavin.rocks',
  'pipedapi.leptons.xyz',
];

interface PipedSearchItem {
  videoId: string;
  title: string;
  uploader: string;
  thumbnail: string;
  duration: number;
}

async function pipedSearch(query: string): Promise<PipedSearchItem[]> {
  for (const instance of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      const res = await fetch(
        `https://${instance}/search?q=${encodeURIComponent(query)}&filter=videos`,
        { signal: controller.signal },
      );
      window.clearTimeout(timeout);
      if (!res.ok) continue;
      const data = await res.json();
      const items: any[] = data.items ?? [];
      return items
        .filter((i) => i.url || i.videoId)
        .slice(0, 8)
        .map((i) => ({
          videoId: i.videoId || (i.url as string).split('v=')[1] || (i.url as string).split('/').pop() || '',
          title: i.title ?? '',
          uploader: i.uploader ?? i.uploaderName ?? 'YouTube',
          thumbnail: i.thumbnail ?? `https://i.ytimg.com/vi/${i.videoId}/hqdefault.jpg`,
          duration: i.duration ?? 0,
        }));
    } catch {
    }
  }
  return [];
}


const ST_UA = 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36';

async function getSavetubeCdn(): Promise<string> {
  const res = await fetch('https://media.savetube.vip/api/random-cdn', {
    headers: { 'User-Agent': ST_UA },
  });
  const data = await res.json();
  if (!data.cdn) throw new Error('SaveTube CDN tidak tersedia');
  return data.cdn as string;
}

async function savetubeAudio(videoId: string): Promise<TrackResult | null> {
  const cdn = await getSavetubeCdn();

  const infoRes = await fetch(`https://${cdn}/v2/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': ST_UA },
    body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
  });
  const infoJson = await infoRes.json();
  if (!infoJson?.data) throw new Error(infoJson?.message || 'Metadata YouTube tidak tersedia');

  const metadata = await decryptSaveTubeData(infoJson.data);

  const dlRes = await fetch(`https://${cdn}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': ST_UA },
    body: JSON.stringify({
      downloadType: 'audio',
      quality: '128',
      key: metadata.key,
    }),
  });
  const dlJson = await dlRes.json();
  const downloadUrl = dlJson?.data?.downloadUrl;
  if (!downloadUrl) throw new Error('URL audio tidak tersedia');

  return {
    title: metadata.title || 'YouTube Music',
    artist: metadata.author || 'YouTube',
    src: downloadUrl,
    image: metadata.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}


const API_BASE = 'https://api.kyio.web.id';
const APIKEY = 'KYIO-APIKEY';

const cleanTitle = (title: string): string =>
  title
    .replace(/\(Official Video\)|\[Official Video\]|Lyrics|Official Audio|\[Lyrics\]|\(Lyrics\)|Remastered|\(Remastered\)|Official Music Video|\(Official Music Video\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 60);

function unwrapPayload(payload: unknown): Record<string, any> {
  let candidate: any = payload;
  for (let depth = 0; depth < 5; depth += 1) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) break;
    if (
      candidate.download_url ||
      candidate.download?.downloadURL ||
      candidate.download?.url ||
      candidate.audio_url ||
      candidate.audio?.url ||
      candidate.song
    ) {
      return candidate;
    }
    const nested = candidate.result ?? candidate.data;
    if (!nested || nested === candidate) break;
    candidate = nested;
  }
  return candidate && typeof candidate === 'object' ? candidate : {};
}

function makeTrack(result: Record<string, any>, query: string, fallbackArtist = 'YouTube'): TrackResult | null {
  const src = result.download_url || result.download?.downloadURL || result.download?.url || result.audio_url || result.audio?.url || result.url;
  if (typeof src !== 'string' || !src.trim()) return null;
  const resolved = src.startsWith('/') ? `${API_BASE}${src}` : /^https?:\/\//i.test(src) ? `${API_BASE}/api/internal/audio-proxy?url=${encodeURIComponent(src)}` : src;
  return {
    title: cleanTitle(result.title || result.song?.title || query),
    artist: result.artist || result.song?.artist?.name || fallbackArtist,
    src: resolved,
    image: result.thumbnail || result.song?.thumbnail || result.song?.thumbnails?.[0]?.url || result.image || result.cover || '',
    query,
  };
}

async function fetchJsonLegacy(path: string, query: string, timeoutMs: number): Promise<any> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE}${path}?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, { signal: controller.signal });
    if (!response.ok) return null;
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function legacyYtPlay(query: string): Promise<TrackResult | null> {
  try {
    const payload = await fetchJsonLegacy('/api/dl/yt-play', query, 12000);
    return makeTrack(unwrapPayload(payload), query);
  } catch {
    return null;
  }
}

async function legacyYtPlayV2(query: string): Promise<TrackResult | null> {
  try {
    const payload = await fetchJsonLegacy('/api/downloader/yt-play-v2', query, 12000);
    return makeTrack(unwrapPayload(payload), query);
  } catch {
    return null;
  }
}


export async function searchMusicTrack(query: string): Promise<TrackResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) throw new Error('Masukkan judul lagu atau nama penyanyi.');

  try {
    const results = await pipedSearch(normalizedQuery);
    if (results.length > 0) {
      for (let i = 0; i < Math.min(3, results.length); i++) {
        const item = results[i];
        try {
          const track = await savetubeAudio(item.videoId);
          if (track?.src) {
            return {
              ...track,
              title: cleanTitle(item.title || track.title),
              artist: item.uploader || track.artist,
              image: item.thumbnail || track.image,
              query: normalizedQuery,
            };
          }
        } catch {
        }
      }
    }
  } catch {
  }

  const ytResult = await legacyYtPlay(normalizedQuery);
  if (ytResult?.src) return ytResult;

  const v2Result = await legacyYtPlayV2(normalizedQuery);
  if (v2Result?.src) return v2Result;

  throw new Error('Gagal mendapatkan audio. Coba judul lagu lain atau ulangi beberapa saat lagi.');
}
