import { motion, AnimatePresence } from 'framer-motion';

export interface Device {
  id: string;
  name: string;
  platform: 'android' | 'ios' | 'windows' | 'macos' | 'linux';
  ip: string;
}

interface ConnectedDevicesProps {
  devices: Device[];
  networkName: string;
  port: number;
}

function PlatformIcon({ platform }: { platform: Device['platform'] }) {
  const icons: Record<string, React.ReactNode> = {
    android: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#3DDC84">
        <path d="M17.532 15.106a1.003 1.003 0 111.001-1.737 1.003 1.003 0 01-1 1.737zm-11.044 0a1.003 1.003 0 11.998-1.737 1.003 1.003 0 01-.998 1.737zm11.4-6.018l2.006-3.459a.413.413 0 10-.715-.414L17.16 8.69c-1.533-.698-3.25-1.09-5.08-1.09s-3.548.392-5.08 1.09L4.98 5.215a.413.413 0 10-.715.414l2.005 3.46C2.84 11.188.478 14.665.01 18.77h23.98c-.468-4.105-2.83-7.582-6.102-9.682z" />
      </svg>
    ),
    ios: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#1c1c1e">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    windows: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#00A4EF">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.614h9.75v9.451L0 20.699M10.949 12.614H24V24l-13.051-1.851" />
      </svg>
    ),
    macos: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#555">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    linux: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#333">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  };
  return icons[platform] || icons.linux;
}

export default function ConnectedDevices({ devices, networkName, port }: ConnectedDevicesProps) {
  return (
    <div className="px-5 pb-2">
      <div
        className="rounded-[22px] p-3"
        style={{
          background: 'linear-gradient(145deg, #ffffff, #ebebee)',
          boxShadow: `
            6px 6px 16px rgba(0, 0, 0, 0.07),
            -6px -6px 16px rgba(255, 255, 255, 0.9),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.8)
          `,
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #e4e4e7, #eaeaed)',
                boxShadow: `
                  inset 2px 2px 5px rgba(0, 0, 0, 0.04),
                  inset -2px -2px 5px rgba(255, 255, 255, 0.7)
                `,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.55a11 11 0 0114.08 0" />
                <path d="M1.42 9a16 16 0 0121.16 0" />
                <path d="M8.53 16.11a6 6 0 016.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-gloss-mid font-semibold uppercase tracking-widest">Network</span>
              <span className="text-[13px] font-bold text-gloss-dark tracking-tight">{networkName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              key={devices.length}
              initial={{ x: -10, backgroundColor: devices.length < 1 ? '#ff3b30' : '#34c759' }}
              animate={{ 
                x: 0, 
                backgroundColor: devices.length < 1 ? '#ff3b30' : '#34c759',
                scale: [1, 1.4, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                x: { type: "spring", stiffness: 300, damping: 20 },
                scale: { duration: 2, repeat: Infinity },
                opacity: { duration: 2, repeat: Infinity }
              }}
              className="w-[8px] h-[8px] rounded-full"
            />
            <span className="text-[12px] font-bold text-gloss-dark tracking-tight">
              {devices.length} {devices.length === 1 ? 'Node' : 'Nodes'}
            </span>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {devices.length > 0 ? (
            <div className="space-y-2">
              {devices.map((device, index) => (
                <motion.div
                  key={device.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.93 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{
                    delay: index * 0.06,
                    type: 'spring',
                    stiffness: 350,
                    damping: 25,
                  }}
                  className="rounded-[14px] px-3 py-2.5 flex items-center justify-between"
                  style={{
                    background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
                    boxShadow: `
                      inset 2px 2px 6px rgba(0, 0, 0, 0.04),
                      inset -2px -2px 6px rgba(255, 255, 255, 0.7)
                    `,
                    border: '1px solid rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(145deg, #ffffff, #ebebee)',
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.04), -1px -1px 3px rgba(255,255,255,0.8)',
                      }}
                    >
                      <PlatformIcon platform={device.platform} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-gloss-dark tracking-tight">{device.name}</span>
                      <span className="text-[10px] text-gloss-mid font-medium">{device.ip}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[5px] h-[5px] rounded-full bg-wifi-green" />
                    <span className="text-[10px] text-gloss-mid font-semibold">Active</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[14px] px-4 py-5 flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
                boxShadow: `
                  inset 2px 2px 6px rgba(0, 0, 0, 0.04),
                  inset -2px -2px 6px rgba(255, 255, 255, 0.7)
                `,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              <span className="text-[11px] text-gloss-mid text-center font-medium leading-relaxed">
                No devices connected<br />
                Share QR code to connect
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center mt-3 gap-1.5">
          <div className="w-1 h-1 rounded-full bg-gloss-mid/40" />
          <span className="text-[10px] text-gloss-mid/60 font-medium">
            HTTP Port {port} • Wi-Fi / Ethernet
          </span>
          <div className="w-1 h-1 rounded-full bg-gloss-mid/40" />
        </div>
      </div>
    </div>
  );
}
