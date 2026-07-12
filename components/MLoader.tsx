import React from 'react';
import { motion } from 'framer-motion';

interface MLoaderProps {
  progress: number;
}

// Loader inisial brand "M" — SVG stroke yang menggambar dirinya sendiri
// dengan gradient + glow neon (cyan -> violet). Tanpa dependency 3D.
const MLoader: React.FC<MLoaderProps> = ({ progress }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Halo glow di belakang */}
      <motion.div
        aria-hidden
        className="absolute w-40 h-40 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.35), rgba(139,92,246,0.15), transparent 70%)' }}
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        className="relative"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0,242,254,0.8))' }}
      >
        <defs>
          <linearGradient id="m-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Jejak M redup sebagai latar */}
        <path
          d="M15 85 L15 15 L50 58 L85 15 L85 85"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* M yang menggambar dirinya berulang */}
        <motion.path
          d="M15 85 L15 15 L50 58 L85 15 L85 85"
          stroke="url(#m-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0.4, 1, 1, 0.4] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.5, 0.75, 1],
          }}
        />
      </svg>
    </div>
  );
};

export default MLoader;
