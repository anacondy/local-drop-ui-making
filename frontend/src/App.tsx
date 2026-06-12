import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import HeaderBar from './components/HeaderBar';
import ModeToggle from './components/ModeToggle';
import QRCodeView from './components/QRCodeView';
import ScannerView from './components/ScannerView';
import ConnectedDevices from './components/ConnectedDevices';
import SharedFilesPage from './pages/SharedFilesPage';
import FileBrowserPage from './pages/FileBrowserPage';
import type { Device } from './components/ConnectedDevices';

type Page = 'home' | 'shared-files' | 'file-browser';

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
  const [page, setPage] = useState<Page>('home');
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
        .then((data: { devices: { id: string; device: string; role: string }[] }) => {
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
      if (info.offset.x < -threshold && mode === 'qr') { setDirection(1); setMode('scan'); }
      else if (info.offset.x > threshold && mode === 'scan') { setDirection(-1); setMode('qr'); }
    },
    [mode]
  );

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  if (page === 'shared-files') return <SharedFilesPage onBack={() => setPage('home')} />;
  if (page === 'file-browser') return <FileBrowserPage onBack={() => setPage('home')} />;

  return (
    <div className="h-full w-full bg-gloss-bg flex justify-center items-center">
      <div className="w-full max-w-[430px] h-full flex flex-col relative overflow-hidden">
        <HeaderBar title="LocalDrop" onDownloadClick={() => setPage('shared-files')} />

        <div className="mt-2">
          <ModeToggle mode={mode} onToggle={handleModeToggle} />
        </div>

        <div className="flex-1 relative overflow-hidden mt-1" style={{ perspective: '1200px' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={mode}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
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
                <ScannerView onFilesClick={() => setPage('file-browser')} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            <motion.div
              animate={{ width: mode === 'qr' ? 20 : 8, backgroundColor: mode === 'qr' ? '#1c1c1e' : '#c7c7cc' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="h-2 rounded-full"
            />
            <motion.div
              animate={{ width: mode === 'scan' ? 20 : 8, backgroundColor: mode === 'scan' ? '#1c1c1e' : '#c7c7cc' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="h-2 rounded-full"
            />
          </div>
        </div>

        <div className="shrink-0">
          <ConnectedDevices devices={devices} networkName="LocalDrop_Network" port={serverInfo?.port ?? 5000} />
          <div className="flex justify-center pb-3 pt-1">
            <div className="w-[134px] h-[5px] rounded-full bg-gloss-dark/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
