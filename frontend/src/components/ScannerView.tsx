import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';

interface ScannerViewProps {
  onFilesClick: () => void;
}

export default function ScannerView({ onFilesClick }: ScannerViewProps) {
  const [isActive, setIsActive] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      // Check torch support
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
      setTorchSupported(!!caps.torch);
      setIsActive(true);
      setScanning(true);
    } catch {
      setCameraError('Camera access denied. Please allow camera permission and try again.');
    }
  }, []);

  const scanLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA || !scanning) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
    if (code?.data) {
      setScannedUrl(code.data);
      setScanning(false);
      return;
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  }, [scanning]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (isActive && scanning) {
      rafRef.current = requestAnimationFrame(scanLoop);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isActive, scanning, scanLoop]);

  const toggleTorch = async () => {
    if (!streamRef.current || !torchSupported) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] });
      setTorchOn(t => !t);
    } catch {}
  };

  const handleRescan = () => {
    setScannedUrl(null);
    setScanning(true);
    rafRef.current = requestAnimationFrame(scanLoop);
  };

  const handleOpen = () => {
    if (scannedUrl) window.open(scannedUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center px-4 py-1 w-full">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative"
      >
        <div className="rounded-[24px] p-[2px]" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(220,220,223,0.6))' }}>
          <div className="rounded-[22px] p-4" style={{
            background: 'linear-gradient(145deg, #ffffff, #f0f0f3)',
            boxShadow: '6px 6px 20px rgba(0,0,0,0.08), -6px -6px 20px rgba(255,255,255,0.95), inset 0 2px 0 rgba(255,255,255,0.9)',
          }}>
            {/* Camera viewfinder */}
            <div className="relative w-[208px] h-[208px] rounded-[14px] overflow-hidden bg-black">
              {/* Live camera video */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {/* Hidden canvas for scanning */}
              <canvas ref={canvasRef} className="hidden" />

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 px-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff453a" strokeWidth="2" className="mb-2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                  </svg>
                  <p className="text-white text-[10px] text-center leading-relaxed">{cameraError}</p>
                </div>
              )}

              {/* Scanning overlay */}
              {!cameraError && !scannedUrl && (
                <>
                  {/* Corner brackets */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 208 208" fill="none">
                    <path d="M10 50V18a8 8 0 018-8h32" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                    <path d="M158 10h32a8 8 0 018 8v32" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                    <path d="M10 158v32a8 8 0 008 8h32" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                    <path d="M158 198h32a8 8 0 008-8v-32" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                  </svg>
                  {/* Scan line */}
                  {isActive && (
                    <div className="absolute left-3 right-3 h-[2px] scan-line" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.7) 80%, transparent 100%)',
                      boxShadow: '0 0 20px rgba(255,255,255,0.3)',
                    }} />
                  )}
                  {/* Status badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                      <motion.div animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-[5px] h-[5px] rounded-full bg-red-400" />
                      <span className="text-[9px] text-white/80 font-semibold tracking-wider uppercase">Scanning</span>
                    </div>
                  </div>
                </>
              )}

              {/* Success overlay */}
              <AnimatePresence>
                {scannedUrl && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center px-3 gap-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                    </svg>
                    <p className="text-white text-[10px] font-bold text-center">QR Detected!</p>
                    <p className="text-white/60 text-[9px] text-center break-all leading-relaxed line-clamp-2">{scannedUrl}</p>
                    <div className="flex gap-2 mt-1">
                      <button onClick={handleOpen}
                        className="bg-white/20 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg border border-white/20">
                        Open
                      </button>
                      <button onClick={handleRescan}
                        className="bg-white/10 text-white/70 text-[9px] px-3 py-1.5 rounded-lg border border-white/10">
                        Rescan
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Camera badge */}
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
          className="absolute -top-2 -right-2 gloss-dark-pill w-9 h-9 rounded-2xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-5 flex items-center gap-4">
        {/* Flash */}
        <motion.button whileTap={{ scale: 0.92 }} onClick={toggleTorch}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
          style={{
            background: torchOn ? 'linear-gradient(145deg, #ffd60a, #ff9f0a)' : 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: torchOn ? '0 0 20px rgba(255,200,0,0.4)' : '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.5)',
            opacity: torchSupported ? 1 : 0.4,
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={torchOn ? '#fff' : '#1c1c1e'} strokeWidth="2" strokeLinecap="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </motion.button>

        {/* Files */}
        <motion.button whileTap={{ scale: 0.92 }} onClick={onFilesClick}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        </motion.button>

        {/* Manual entry */}
        <motion.button whileTap={{ scale: 0.92 }}
          onClick={() => { const u = prompt('Enter URL to connect:'); if (u) window.open(u, '_blank'); }}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-1.5 flex items-center gap-4">
        <span className="w-12 text-center text-[9px] text-gloss-mid font-semibold">Flash</span>
        <span className="w-12 text-center text-[9px] text-gloss-mid font-semibold">Files</span>
        <span className="w-12 text-center text-[9px] text-gloss-mid font-semibold">Manual</span>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="mt-2 text-[11px] text-gloss-mid text-center leading-relaxed max-w-[240px]">
        Point camera at another device's QR code to connect
      </motion.p>
    </div>
  );
}
