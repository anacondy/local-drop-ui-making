import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../components/HeaderBar';

interface SharedFile {
  name: string;
  icon: string;
  size?: number;
  fileType?: string;
}

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function SharedFilesPage({ onBack }: { onBack: () => void }) {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = () => {
    fetch('/api/files')
      .then(r => r.json())
      .then(data => { setFiles(data.files || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles();
    const iv = setInterval(fetchFiles, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="h-full w-full bg-gloss-bg flex justify-center items-center">
      <div className="w-full max-w-[430px] h-full flex flex-col overflow-hidden">
        <HeaderBar title="Shared Files" subtitle="Network Vault" onBack={onBack} />

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-gloss-mid border-t-gloss-dark rounded-full" />
            </div>
          ) : files.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-8 rounded-[22px] p-8 flex flex-col items-center" style={{
                background: 'linear-gradient(145deg, #ffffff, #ebebee)',
                boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.9)',
              }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1.5" className="mb-3">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
              <p className="text-[13px] font-bold text-gloss-dark">Vault is empty</p>
              <p className="text-[11px] text-gloss-mid mt-1 text-center">Files shared by connected devices will appear here</p>
            </motion.div>
          ) : (
            <div className="mt-3 space-y-2">
              <AnimatePresence>
                {files.map((file, i) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 350, damping: 25 }}
                    className="rounded-[18px] px-4 py-3 flex items-center gap-3"
                    style={{
                      background: 'linear-gradient(145deg, #ffffff, #ebebee)',
                      boxShadow: '5px 5px 12px rgba(0,0,0,0.06), -5px -5px 12px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,0.8)',
                      border: '1px solid rgba(255,255,255,0.6)',
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{
                      background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
                      boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.04), inset -2px -2px 5px rgba(255,255,255,0.7)',
                    }}>
                      <span dangerouslySetInnerHTML={{ __html: file.icon }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gloss-dark truncate">{file.name}</p>
                      {file.size && <p className="text-[10px] text-gloss-mid font-medium">{formatSize(file.size)}</p>}
                    </div>
                    <a
                      href={`/download/${encodeURIComponent(file.name)}`}
                      download
                      className="gloss-dark-pill text-white text-[10px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 no-underline shrink-0"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 3v13M7 11l5 5 5-5M4 20h16" />
                      </svg>
                      Save
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Upload button */}
        <div className="px-5 pb-5 pt-2 shrink-0">
          <label className="block w-full cursor-pointer">
            <input type="file" multiple className="hidden" onChange={async (e) => {
              const fileList = e.target.files;
              if (!fileList?.length) return;
              const fd = new FormData();
              fd.append('session_token', (window as unknown as { __SESSION_TOKEN__?: string }).__SESSION_TOKEN__ ?? '');
              fd.append('client_launch_timestamp', Date.now().toString());
              for (let i = 0; i < fileList.length; i++) fd.append('files', fileList[i]);
              await fetch('/upload', { method: 'POST', body: fd });
              e.target.value = '';
              fetchFiles();
            }} />
            <motion.div whileTap={{ scale: 0.97 }} className="gloss-dark-pill w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v13" />
              </svg>
              <span className="text-white text-[13px] font-bold">Share a File</span>
            </motion.div>
          </label>
        </div>

        <div className="flex justify-center pb-4 shrink-0">
          <div className="w-[134px] h-[5px] rounded-full bg-gloss-dark/20" />
        </div>
      </div>
    </div>
  );
}
