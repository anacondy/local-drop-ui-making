import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ServerInfo {
  ip: string;
  port: number;
  url: string;
}

interface QRCodeViewProps {
  serverInfo: ServerInfo | null;
}

export default function QRCodeView({ serverInfo }: QRCodeViewProps) {
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);

  // Force the use of the backend's real LAN IP for the QR code and link
  const shareUrl = serverInfo?.url ?? window.location.origin;
  const displayUrl = shareUrl;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center px-4 py-1 w-full">
      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.93 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 16, scale: isReady ? 1 : 0.93 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative"
      >
        <div className="rounded-[24px] p-[2px]" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(220,220,223,0.6))' }}>
          <div className="rounded-[22px] p-4" style={{
            background: 'linear-gradient(145deg, #ffffff, #f0f0f3)',
            boxShadow: '6px 6px 20px rgba(0,0,0,0.08), -6px -6px 20px rgba(255,255,255,0.95), inset 0 2px 0 rgba(255,255,255,0.9)',
          }}>
            <div className="rounded-[14px] p-3 relative overflow-hidden" style={{
              background: '#ffffff',
              boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.03), inset -2px -2px 6px rgba(255,255,255,0.8)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
                borderRadius: '14px 14px 0 0',
              }} />
              <QRCodeSVG value={shareUrl} size={200} bgColor="#ffffff" fgColor="#1c1c1e" level="M" includeMargin={false} />
            </div>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
          className="absolute -top-2 -right-2 gloss-dark-pill w-9 h-9 rounded-2xl flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0114.08 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </motion.div>
      </motion.div>

      {/* URL bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-4 w-full max-w-[290px]"
      >
        <div className="rounded-2xl px-3 py-2.5 flex items-center gap-2.5" style={{
          background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
          boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.05), inset -3px -3px 8px rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.03)',
        }}>
          {/* Link icon — opens URL in browser */}
          <a href={shareUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-xl gloss-raised-sm flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </a>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[9px] text-gloss-mid font-semibold uppercase tracking-widest">Share URL</span>
            <span className="text-[13px] font-bold text-gloss-dark truncate tracking-tight">{displayUrl}</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy} className="gloss-raised-sm w-7 h-7 rounded-xl flex items-center justify-center shrink-0">
            {copied ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="mt-2 text-[11px] text-gloss-mid text-center leading-relaxed max-w-[240px]">
        Scan from another device on the same network to connect instantly
      </motion.p>
    </div>
  );
}
