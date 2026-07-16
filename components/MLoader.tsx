import React from 'react';

interface MLoaderProps {
  progress: number;
}

// Loader kubus isometrik (adaptasi Uiverse by Juanes200122) — direkolor dari
// emas ke neon cyan -> violet agar selaras dengan aksen situs. Animasi murni
// CSS: bounce (kubus melayang), umbral (glow gradient), particles (partikel).
const MLoader: React.FC<MLoaderProps> = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Halo glow di belakang */}
      <div
        aria-hidden
        className="absolute w-40 h-40 rounded-full blur-3xl animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.35), rgba(139,92,246,0.15), transparent 70%)' }}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="200"
        width="200"
        className="relative"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,254,0.6))' }}
      >
        <g style={{ order: -1 }}>
          <polygon
            transform="rotate(45 100 100)"
            strokeWidth="1"
            stroke="#00f2fe"
            fill="none"
            points="70,70 148,50 130,130 50,150"
            id="bounce"
          />
          <polygon
            transform="rotate(45 100 100)"
            strokeWidth="1"
            stroke="#8b5cf6"
            fill="none"
            points="70,70 148,50 130,130 50,150"
            id="bounce2"
          />
          <polygon
            transform="rotate(45 100 100)"
            strokeWidth="2"
            fill="#1a1a2e"
            points="70,70 150,50 130,130 50,150"
          />
          <polygon
            strokeWidth="2"
            fill="url(#gradiente)"
            points="100,70 150,100 100,130 50,100"
          />
          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
              <stop style={{ stopColor: '#0a0a1a', stopOpacity: 1 }} offset="20%" />
              <stop style={{ stopColor: '#1a1a2e', stopOpacity: 1 }} offset="60%" />
            </linearGradient>
          </defs>

          <polygon
            transform="translate(20, 31)"
            strokeWidth="2"
            fill="#0e7490"
            points="80,50 80,75 80,99 40,75"
          />
          <polygon
            transform="translate(20, 31)"
            strokeWidth="2"
            fill="url(#gradiente2)"
            points="40,-40 80,-40 80,99 40,75"
          />
          <defs>
            <linearGradient y2="100%" x2="0%" y1="-17%" x1="10%" id="gradiente2">
              <stop style={{ stopColor: '#00f2fe00', stopOpacity: 1 }} offset="20%" />
              <stop
                style={{ stopColor: '#00f2fe54', stopOpacity: 1 }}
                offset="100%"
                id="animatedStop"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="rotate(180 100 100) translate(20, 20)"
            strokeWidth="2"
            fill="#00f2fe"
            points="80,50 80,75 80,99 40,75"
          />
          <polygon
            transform="rotate(0 100 100) translate(60, 20)"
            strokeWidth="2"
            fill="url(#gradiente3)"
            points="40,-40 80,-40 80,85 40,110.2"
          />
          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
              <stop style={{ stopColor: '#8b5cf600', stopOpacity: 1 }} offset="20%" />
              <stop
                style={{ stopColor: '#8b5cf654', stopOpacity: 1 }}
                offset="100%"
                id="animatedStop2"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="rotate(45 100 100) translate(80, 95)"
            strokeWidth="2"
            fill="#a5f3fc"
            points="5,0 5,5 0,5 0,0"
            className="loader-particle"
          />
          <polygon
            transform="rotate(45 100 100) translate(80, 55)"
            strokeWidth="2"
            fill="#67e8f9"
            points="6,0 6,6 0,6 0,0"
            className="loader-particle"
          />
          <polygon
            transform="rotate(45 100 100) translate(70, 80)"
            strokeWidth="2"
            fill="#fff"
            points="2,0 2,2 0,2 0,0"
            className="loader-particle"
          />

          <polygon
            strokeWidth="2"
            fill="#0d0d1a"
            points="29.5,99.8 100,142 100,172 29.5,130"
          />
          <polygon
            transform="translate(50, 92)"
            strokeWidth="2"
            fill="#12121f"
            points="50,50 120.5,8 120.5,35 50,80"
          />
        </g>
      </svg>
    </div>
  );
};

export default MLoader;
