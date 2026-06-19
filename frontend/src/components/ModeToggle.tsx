import { motion } from 'framer-motion';

interface ModeToggleProps {
  mode: 'qr' | 'files';
  onToggle: (mode: 'qr' | 'files') => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="flex justify-center px-6 py-1">
      <div
        className="rounded-[20px] p-[6px] flex items-center relative w-[270px]"
        style={{
          background: 'linear-gradient(145deg, #e2e2e5, #eaeaed)',
          boxShadow: `inset 3px 3px 8px rgba(0, 0, 0, 0.05), inset -3px -3px 8px rgba(255, 255, 255, 0.7)`,
          border: '1px solid rgba(0, 0, 0, 0.03)',
        }}
      >
        <motion.div
          className="absolute top-[6px] bottom-[6px] rounded-[16px]"
          style={{
            width: 'calc(50% - 6px)',
            left: '6px',
            background: 'linear-gradient(145deg, #2c2c2e, #1a1a1c)',
            boxShadow: `4px 4px 12px rgba(0, 0, 0, 0.3), -1px -1px 4px rgba(255, 255, 255, 0.05)`,
          }}
          initial={false}
          animate={{ x: mode === 'qr' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        />

        <button
          onClick={() => onToggle('qr')}
          className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke={mode === 'qr' ? '#ffffff' : '#8e8e93'}>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="3" height="3" />
            <path d="M21 14h-3v3M21 17v4h-4" />
          </svg>
          <span className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${mode === 'qr' ? 'text-white' : 'text-gloss-mid'}`}>QR Code</span>
        </button>

        <button
          onClick={() => onToggle('files')}
          className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke={mode === 'files' ? '#ffffff' : '#8e8e93'}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
          </svg>
          <span className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${mode === 'files' ? 'text-white' : 'text-gloss-mid'}`}>Files</span>
        </button>
      </div>
    </div>
  );
}
