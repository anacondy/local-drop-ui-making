import { motion } from 'framer-motion';

interface ModeToggleProps {
  mode: 'qr' | 'scan';
  onToggle: (mode: 'qr' | 'scan') => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="flex justify-center px-6 py-1">
      <div
        className="rounded-[20px] p-[6px] flex items-center relative w-[270px]"
        style={{
          background: 'linear-gradient(145deg, #e2e2e5, #eaeaed)',
          boxShadow: `
            inset 3px 3px 8px rgba(0, 0, 0, 0.05),
            inset -3px -3px 8px rgba(255, 255, 255, 0.7)
          `,
          border: '1px solid rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Sliding dark pill */}
        <motion.div
          className="absolute top-[6px] bottom-[6px] rounded-[16px]"
          style={{
            width: 'calc(50% - 6px)',
            background: 'linear-gradient(145deg, #2c2c2e, #1a1a1c)',
            boxShadow: `
              4px 4px 12px rgba(0, 0, 0, 0.3),
              -1px -1px 4px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2)
            `,
          }}
          initial={false}
          animate={{
            left: mode === 'qr' ? '6px' : 'calc(50% + 0px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 32,
          }}
        />

        {/* QR Code tab */}
        <button
          onClick={() => onToggle('qr')}
          className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
            stroke={mode === 'qr' ? '#ffffff' : '#8e8e93'}
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="3" height="3" />
            <path d="M21 14h-3v3M21 17v4h-4" />
          </svg>
          <span
            className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${
              mode === 'qr' ? 'text-white' : 'text-gloss-mid'
            }`}
          >
            QR Code
          </span>
        </button>

        {/* Scanner tab */}
        <button
          onClick={() => onToggle('scan')}
          className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
            stroke={mode === 'scan' ? '#ffffff' : '#8e8e93'}
          >
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span
            className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${
              mode === 'scan' ? 'text-white' : 'text-gloss-mid'
            }`}
          >
            Scanner
          </span>
        </button>
      </div>
    </div>
  );
}
