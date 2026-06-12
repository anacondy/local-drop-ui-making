import { motion } from 'framer-motion';

interface HeaderBarProps {
  title: string;
}

export default function HeaderBar({ title }: HeaderBarProps) {
  return (
    <div className="flex items-center justify-between px-5 py-2">
      {/* Close button - glossomorphic raised 3D */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #ffffff, #e6e6e9)',
          boxShadow: `
            4px 4px 10px rgba(0, 0, 0, 0.06),
            -4px -4px 10px rgba(255, 255, 255, 0.85),
            inset 0 1px 0 rgba(255, 255, 255, 0.7)
          `,
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1c1c1e" strokeWidth="2.2" strokeLinecap="round">
          <path d="M2 2l10 10M12 2L2 12" />
        </svg>
      </motion.button>

      {/* Title with subtle branding */}
      <div className="flex flex-col items-center">
        <h1 className="text-[18px] font-bold tracking-tight text-gloss-dark">
          {title}
        </h1>
        <span className="text-[9px] text-gloss-mid font-semibold uppercase tracking-[0.2em] -mt-0.5">
          File Transfer
        </span>
      </div>

      {/* Settings button - glossomorphic raised 3D */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #ffffff, #e6e6e9)',
          boxShadow: `
            4px 4px 10px rgba(0, 0, 0, 0.06),
            -4px -4px 10px rgba(255, 255, 255, 0.85),
            inset 0 1px 0 rgba(255, 255, 255, 0.7)
          `,
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </motion.button>
    </div>
  );
}
