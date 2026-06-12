import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import StatusBar from './components/StatusBar';
import HeaderBar from './components/HeaderBar';
import ModeToggle from './components/ModeToggle';
import QRCodeView from './components/QRCodeView';
import ScannerView from './components/ScannerView';
import PlatformRow from './components/PlatformRow';
import ConnectedDevices from './components/ConnectedDevices';
import type { Device } from './components/ConnectedDevices';

interface ServerInfo {
  ip: string;
  port: number;
  url: string;
}

function mapDeviceType(dtype: string): Device['platform'] {
  if (dtype === 'mobile') return 'android';
  if (dtype === 'tablet') return 'android';
  return 'macos';
}

function mapDeviceName(dtype: string, ip: string): string {
  const short = ip.split('.').pop() || ip;
  if (dtype === 'mobile') return `Mobile-${short}`;
  if (dtype === 'tablet') return `Tablet-${short}`;
  return `Desktop-${short}`;
}

export default function App() {
  const [mode, setMode] = useState<'qr' | 'scan'>('qr');
  const [devices, setDevices] = useState<Device[]>([]);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch('/api/info')
      .then(r => r.json())
      .then((data: ServerInfo) => setServerInfo(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const poll = () => {
      fetch('/api/devices')
        .then(r => r.json())
        .then((data: { devices: { id: string; device: string; role: string }[]; my_id: string }) => {
          const mapped: Device[] = (data.devices || []).map(d => ({
            id: d.id,
            name: mapDeviceName(d.device, d.id),
            platform: mapDeviceType(d.device),
            ip: d.id,
          }));
          setDevices(mapped);
        })
        .catch(() => {});
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleModeToggle = useCallback((newMode: 'qr' | 'scan') => {
    setDirection(newMode === 'scan' ? 1 : -1);
    setMode(newMode);
  }, []);

  const handleSwipe = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x < -threshold && mode === 'qr') {
        setDirection(1);
        setMode('scan');
      } else if (info.offset.x > threshold && mode === 'scan') {
        setDirection(-1);
        setMode('qr');
      }
    },
    [mode]
  );

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: dir > 0 ? 8 : -8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      rotateY: dir > 0 ? -8 : 8,
    }),
  };

  return (
    <div className="h-full w-full bg-gloss-bg flex justify-center items-center">
      <div className="w-full max-w-[430px] h-full flex flex-col relative overflow-hidden">
        <StatusBar />
        <HeaderBar title="LocalDrop" />

        <div className="mt-1">
          <PlatformRow />
        </div>

        <div className="mt-3">
          <ModeToggle mode={mode} onToggle={handleModeToggle} />
        </div>

        <div
          className="flex-1 relative overflow-hidden mt-1"
          style={{ perspective: '1200px' }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={mode}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleSwipe}
              className="absolute inset-0 flex items-start justify-center pt-2"
              style={{ touchAction: 'pan-y' }}
            >
              {mode === 'qr' ? (
                <QRCodeView serverInfo={serverInfo} />
              ) : (
                <ScannerView />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            <motion.div
              animate={{
                width: mode === 'qr' ? 20 : 8,
                backgroundColor: mode === 'qr' ? '#1c1c1e' : '#c7c7cc',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="h-2 rounded-full"
            />
            <motion.div
              animate={{
                width: mode === 'scan' ? 20 : 8,
                backgroundColor: mode === 'scan' ? '#1c1c1e' : '#c7c7cc',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="h-2 rounded-full"
            />
          </div>
        </div>

        <div className="shrink-0">
          <div className="flex justify-center pb-3">
            <motion.a
              href="/vault"
              whileTap={{ scale: 0.95 }}
              className="gloss-dark-pill text-white text-[12px] font-semibold px-6 py-3 rounded-2xl flex items-center gap-2.5 no-underline"
            >
              <div className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              </div>
              Open File Vault
            </motion.a>
          </div>

          <ConnectedDevices devices={devices} networkName="LocalDrop_Network" port={serverInfo?.port ?? 5000} />

          <div className="flex justify-center pb-3 pt-1">
            <div className="w-[134px] h-[5px] rounded-full bg-gloss-dark/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
