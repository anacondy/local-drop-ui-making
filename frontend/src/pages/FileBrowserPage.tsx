import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../components/HeaderBar';

type FileType = 'all' | 'images' | 'videos' | 'audios' | 'docs' | 'code' | 'zip' | 'others';

interface BrowseFile {
  name: string;
  icon: string;
  fileType: FileType;
  size?: number;
}

const TYPE_LABELS: { key: FileType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'images', label: 'Images' },
  { key: 'videos', label: 'Videos' },
  { key: 'audios', label: 'Audios' },
  { key: 'docs', label: 'Docs' },
  { key: 'code', label: 'Code' },
  { key: 'zip', label: 'Zip' },
  { key: 'others', label: 'Others' },
];

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function FileBrowserPage({ onBack }: { onBack: () => void }) {
  const [files, setFiles] = useState<BrowseFile[]>([]);
  const [activeType, setActiveType] = useState<FileType>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetch('/api/files')
      .then(r => r.json())
      .then(data => { setFiles(data.files || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = files;
    if (activeType !== 'all') list = list.filter(f => f.fileType === activeType);
    if (search.trim()) list = list.filter(f => f.name.toLowerCase().includes(search.toLowerCase().trim()));
    return list;
  }, [files, activeType, search]);

  return (
    <div className="h-full w-full bg-gloss-bg flex justify-center items-center">
      <div className="w-full max-w-[430px] h-full flex flex-col overflow-hidden">
        

        {/* Type filter tabs — fixed */}
        <div className="px-5 pt-1 pb-2 shrink-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TYPE_LABELS.map(({ key, label }) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.93 }}
                onClick={() => setActiveType(key)}
                className="shrink-0 px-3.5 py-2 rounded-2xl text-[11px] font-bold tracking-tight transition-colors"
                style={activeType === key ? {
                  background: 'linear-gradient(145deg, #2c2c2e, #1a1a1c)',
                  boxShadow: '4px 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                  color: '#ffffff',
                } : {
                  background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.04), inset -2px -2px 5px rgba(255,255,255,0.7)',
                  color: '#8e8e93',
                }}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-gloss-mid border-t-gloss-dark rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-6 rounded-[22px] p-8 flex flex-col items-center" style={{
                background: 'linear-gradient(145deg, #ffffff, #ebebee)',
                boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.9)',
              }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1.5" className="mb-2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <p className="text-[12px] text-gloss-mid text-center">
                {search ? `No files matching "${search}"` : `No ${activeType === 'all' ? '' : activeType + ' '}files found`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((file, i) => (
                  <motion.div
                    key={file.name}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ delay: i < 20 ? i * 0.03 : 0, type: 'spring', stiffness: 350, damping: 25 }}
                    className="rounded-[16px] px-3.5 py-3 flex items-center gap-3"
                    style={{
                      background: 'linear-gradient(145deg, #ffffff, #ebebee)',
                      boxShadow: '4px 4px 10px rgba(0,0,0,0.05), -4px -4px 10px rgba(255,255,255,0.9)',
                      border: '1px solid rgba(255,255,255,0.6)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{
                      background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
                      boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.04)',
                    }}>
                      <span dangerouslySetInnerHTML={{ __html: file.icon }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-gloss-dark truncate">{file.name}</p>
                      {file.size && <p className="text-[10px] text-gloss-mid">{formatSize(file.size)}</p>}
                    </div>
                    <a
                      href={`/download/${encodeURIComponent(file.name)}`}
                      download
                      className="gloss-raised-sm w-8 h-8 rounded-xl flex items-center justify-center shrink-0 no-underline"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 3v13M7 11l5 5 5-5M4 20h16" />
                      </svg>
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Search bar — fixed at bottom */}
        <div className="px-5 pb-4 pt-2 shrink-0">
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mb-3"
              >
                <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{
                  background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
                  boxShadow: '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search files…"
                    className="flex-1 bg-transparent outline-none text-[13px] font-medium text-gloss-dark placeholder:text-gloss-mid"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-gloss-mid">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M2 2l10 10M12 2L2 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center">
            <motion.button whileTap={{ scale: 0.93 }} onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearch(''); }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: searchOpen ? 'linear-gradient(145deg, #2c2c2e, #1a1a1c)' : 'linear-gradient(145deg, #ffffff, #e8e8eb)',
                boxShadow: searchOpen ? '4px 4px 12px rgba(0,0,0,0.25)' : '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85)',
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchOpen ? 'white' : '#1c1c1e'} strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="flex justify-center pb-4 shrink-0">
          <div className="w-[134px] h-[5px] rounded-full bg-gloss-dark/20" />
        </div>
      </div>
    </div>
  );
}
