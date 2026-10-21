/**
 * Music search & streaming API for portfolio MusicPlayer.
 *
 * Integrated with Melodify's multi-tier scraper & streaming architecture:
 *   1. Local track fast-path (Black Beatles / default tracks)
 *   2. In-memory streamCache for zero-lag re-requests
 *   3. Piped API multi-instance CORS YouTube search
 *   4. SaveTube direct audio CDN extraction (AES-128-CBC)
 *   5. Fallback stream resolution
 */

export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
  query?: string;
  duration?: number;
}

const SAVETUBE_KEY_HEX = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
const streamCache = new Map<string, TrackResult>();

/** Default local track */
export const LOCAL_BLACK_BEATLES: TrackResult = {
  title: 'Black Beatles',
  artist: 'Rae Sremmurd ft. Gucci Mane',
  src: '/audio/black-beatles.mp3',
  image: '/audio/black-beatles.jpg',
  query: 'Black Beatles',
  duration: 291,
};

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
  'piped-api.lunar.icu',
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
      const timeout = window.setTimeout(() => controller.abort(), 7000);
      const res = await fetch(
        `https://${instance}/search?q=${encodeURIComponent(query)}&filter=videos`,
        { signal: controller.signal },
      );
      window.clearTimeout(timeout);
      if (!res.ok) continue;
      const data = await res.json();
      const items: any[] = data.items ?? [];
      const valid = items
        .filter((i) => i.url || i.videoId)
        .slice(0, 8)
        .map((i) => ({
          videoId: i.videoId || (i.url as string).split('v=')[1] || (i.url as string).split('/').pop() || '',
          title: i.title ?? '',
          uploader: i.uploader ?? i.uploaderName ?? 'YouTube',
          thumbnail: i.thumbnail ?? `https://i.ytimg.com/vi/${i.videoId || ''}/hqdefault.jpg`,
          duration: i.duration ?? 0,
        }));
      if (valid.length > 0) return valid;
    } catch {
      // try next instance
    }
  }
  return [];
}

const ST_HEADERS = {
  'Content-Type': 'application/json',
};

async function getSavetubeCdn(): Promise<string> {
  const res = await fetch('https://media.savetube.vip/api/random-cdn', {
    headers: ST_HEADERS,
  });
  const data = await res.json();
  if (!data.cdn) throw new Error('SaveTube CDN tidak tersedia');
  return data.cdn as string;
}

async function savetubeAudio(videoId: string): Promise<TrackResult | null> {
  const cdn = await getSavetubeCdn();

  const infoRes = await fetch(`https://${cdn}/v2/info`, {
    method: 'POST',
    headers: ST_HEADERS,
    body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
  });
  const infoJson = await infoRes.json();
  if (!infoJson?.data) throw new Error(infoJson?.message || 'Metadata audio tidak tersedia');

  const metadata = await decryptSaveTubeData(infoJson.data);

  const dlRes = await fetch(`https://${cdn}/download`, {
    method: 'POST',
    headers: ST_HEADERS,
    body: JSON.stringify({
      id: videoId,
      downloadType: 'audio',
      quality: '128',
      key: metadata.key,
    }),
  });
  const dlJson = await dlRes.json();
  const downloadUrl = dlJson?.data?.downloadUrl;
  if (!downloadUrl) throw new Error('URL stream audio tidak tersedia');

  const cover = metadata.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return {
    title: cleanTitle(metadata.title || 'YouTube Music'),
    artist: metadata.artist || metadata.author || 'Artist',
    src: downloadUrl,
    image: cover,
    duration: metadata.duration || 0,
  };
}

const cleanTitle = (title: string): string =>
  title
    .replace(/\(Official Video\)|\[Official Video\]|Lyrics|Official Audio|\[Lyrics\]|\(Lyrics\)|Remastered|\(Remastered\)|Official Music Video|\(Official Music Video\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 60);

/**
 * Search and resolve music stream.
 * Prioritizes local track, in-memory cache, and Melodify's SaveTube resolver.
 */
export async function searchMusicTrack(query: string): Promise<TrackResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) throw new Error('Masukkan judul lagu atau nama penyanyi.');

  // Fast-path: Black Beatles local
  if (/^black\s*beatles/i.test(normalizedQuery)) {
    return LOCAL_BLACK_BEATLES;
  }

  // Cache check
  const cacheKey = normalizedQuery.toLowerCase();
  if (streamCache.has(cacheKey)) {
    return streamCache.get(cacheKey)!;
  }

  // Tier 1: Piped search + SaveTube extraction
  try {
    const results = await pipedSearch(normalizedQuery);
    if (results.length > 0) {
      for (let i = 0; i < Math.min(3, results.length); i++) {
        const item = results[i];
        if (!item.videoId) continue;
        try {
          const track = await savetubeAudio(item.videoId);
          if (track?.src) {
            const finalTrack: TrackResult = {
              ...track,
              title: cleanTitle(item.title || track.title),
              artist: item.uploader || track.artist,
              image: item.thumbnail || track.image || '/audio/black-beatles.jpg',
              query: normalizedQuery,
            };
            streamCache.set(cacheKey, finalTrack);
            return finalTrack;
          }
        } catch {
          // try next result candidate
        }
      }
    }
  } catch {
    // continue to fallback
  }

  throw new Error('Gagal memuat stream audio. Silakan coba judul lagu lain.');
}
