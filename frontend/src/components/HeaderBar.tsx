import { motion } from 'framer-motion';

interface HeaderBarProps {
  title: string;
  onDownloadClick?: () => void;
  onBack?: () => void;
  subtitle?: string;
}

export default function HeaderBar({ title, onDownloadClick, onBack, subtitle }: HeaderBarProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #ffffff, #e6e6e9)',
          boxShadow: '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85), inset 0 1px 0 rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {onBack ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1c1c1e" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        )}
      </motion.button>

      <div className="flex flex-col items-center">
        <h1 className="text-[18px] font-bold tracking-tight text-gloss-dark">{title}</h1>
        <span className="text-[9px] text-gloss-mid font-semibold uppercase tracking-[0.2em] -mt-0.5">
          {subtitle ?? 'File Transfer'}
        </span>
      </div>

      {onDownloadClick ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onDownloadClick}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e6e6e9)',
            boxShadow: '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85), inset 0 1px 0 rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v13" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" />
          </svg>
        </motion.button>
      ) : (
        <div className="w-10 h-10" />
      )}
    </div>
  );
}
