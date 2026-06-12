import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScannerView() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-2 w-full">
      {/* Scanner Frame - Premium Glossomorphic 3D */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20, scale: isActive ? 1 : 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative"
      >
        {/* Outer gradient border */}
        <div
          className="rounded-[28px] p-[2px]"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(220,220,223,0.6))',
          }}
        >
          <div
            className="rounded-[26px] p-4"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f0f0f3)',
              boxShadow: `
                8px 8px 24px rgba(0, 0, 0, 0.08),
                -8px -8px 24px rgba(255, 255, 255, 0.95),
                inset 0 2px 0 rgba(255, 255, 255, 0.9),
                inset 0 -1px 0 rgba(0, 0, 0, 0.03)
              `,
            }}
          >
            {/* Camera viewfinder */}
            <div className="relative w-[208px] h-[208px] rounded-[18px] overflow-hidden">
              {/* Dark camera bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#0f0f1a]" />
              
              {/* Ambient light simulation */}
              <div className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 70% 80%, rgba(100,100,200,0.04) 0%, transparent 60%)
                  `,
                }}
              />

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
                  `,
                  backgroundSize: '26px 26px',
                }}
              />

              {/* Corner brackets - thicker and more visible */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 208 208" fill="none">
                <path d="M10 50V18a8 8 0 018-8h32" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
                <path d="M158 10h32a8 8 0 018 8v32" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
                <path d="M10 158v32a8 8 0 008 8h32" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
                <path d="M158 198h32a8 8 0 008-8v-32" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
              </svg>

              {/* Scanning line with glow */}
              {isActive && (
                <div className="absolute left-3 right-3 h-[2px] scan-line"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.7) 80%, transparent 100%)',
                    boxShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)',
                  }}
                />
              )}

              {/* Center focus reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 border-[1.5px] border-white/40 rounded-md"
                />
              </div>

              {/* Status badge at bottom */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3.5 py-2 border border-white/10">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-[6px] h-[6px] rounded-full bg-red-400"
                  />
                  <span className="text-[10px] text-white/80 font-semibold tracking-wider uppercase">
                    Ready to Scan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera icon badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
          className="absolute -top-2 -right-2 gloss-dark-pill w-10 h-10 rounded-2xl flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Scanner controls - 3D raised buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-5 flex items-center gap-4"
      >
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: `
              4px 4px 10px rgba(0, 0, 0, 0.06),
              -4px -4px 10px rgba(255, 255, 255, 0.85),
              inset 0 1px 0 rgba(255, 255, 255, 0.7)
            `,
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: `
              4px 4px 10px rgba(0, 0, 0, 0.06),
              -4px -4px 10px rgba(255, 255, 255, 0.85),
              inset 0 1px 0 rgba(255, 255, 255, 0.7)
            `,
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: `
              4px 4px 10px rgba(0, 0, 0, 0.06),
              -4px -4px 10px rgba(255, 255, 255, 0.85),
              inset 0 1px 0 rgba(255, 255, 255, 0.7)
            `,
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h8" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Labels under buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-1.5 flex items-center gap-4"
      >
        <span className="w-12 text-center text-[9px] text-gloss-mid font-semibold">Flash</span>
        <span className="w-12 text-center text-[9px] text-gloss-mid font-semibold">Gallery</span>
        <span className="w-12 text-center text-[9px] text-gloss-mid font-semibold">Manual</span>
      </motion.div>

      {/* Instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-3 text-[12px] text-gloss-mid text-center leading-relaxed max-w-[250px]"
      >
        Point your camera at another device's QR code to connect and start sharing
      </motion.p>
    </div>
  );
}
