import { useState, useEffect } from 'react';

type FileType = 'all' | 'images' | 'videos' | 'audios' | 'docs' | 'code' | 'zip' | 'others';

interface BrowseFile {
  name: string;
  icon: string;
  fileType: FileType;
  size?: number;
  timestamp?: number;
}

const TYPE_LABELS: { key: FileType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'images', label: 'Images' },
  { key: 'videos', label: 'Videos' },
  { key: 'audios', label: 'Audios' },
  { key: 'docs', label: 'Docs' },
  { key: 'others', label: 'Others' },
];

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(ts?: number) {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear().toString().slice(2)}`;
}

export default function FileBrowserPage({ onBack }: { onBack: () => void }) {
  const [files, setFiles] = useState<BrowseFile[]>([]);
  const [activeType, setActiveType] = useState<FileType>('all');
  const [search, setSearch] = useState('');
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

  const filtered = files.filter(f => {
    if (activeType !== 'all' && f.fileType !== activeType) return false;
    if (search.trim() && !f.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full relative h-[calc(100vh-140px)]">
      <div className="px-5 pt-1 pb-2 shrink-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TYPE_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className="shrink-0 px-3.5 py-2 rounded-2xl text-[11px] font-bold tracking-tight transition-colors active:scale-95"
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
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-gloss-mid border-t-gloss-dark rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-[22px] p-8 flex flex-col items-center" style={{
              background: 'linear-gradient(145deg, #ffffff, #ebebee)',
              boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.9)',
            }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" strokeWidth="1.5" className="mb-2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-[12px] text-gloss-mid text-center">
              {search ? `No files matching "${search}"` : `No files found`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
              {filtered.map((file) => (
                <div
                  key={file.name}
                  className="rounded-[16px] px-3.5 py-3 flex items-center gap-3 cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #ebebee)',
                    boxShadow: '4px 4px 10px rgba(0,0,0,0.05), -4px -4px 10px rgba(255,255,255,0.9)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    transform: 'translateZ(0)'
                  }}
                  onTouchStart={() => { window.__holdTimer = setTimeout(() => alert(`File: ${file.name}
Size: ${formatSize(file.size)}
Date: ${new Date((file.timestamp||0)*1000).toLocaleString()}`), 600); }}
                  onTouchEnd={() => clearTimeout(window.__holdTimer)}
                  onTouchMove={() => clearTimeout(window.__holdTimer)}
                  onMouseDown={() => { window.__holdTimer = setTimeout(() => alert(`File: ${file.name}
Size: ${formatSize(file.size)}
Date: ${new Date((file.timestamp||0)*1000).toLocaleString()}`), 600); }}
                  onMouseUp={() => clearTimeout(window.__holdTimer)}
                  onMouseLeave={() => clearTimeout(window.__holdTimer)}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: 'linear-gradient(145deg, #e6e6e9, #eeeef1)',
                    boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    <span dangerouslySetInnerHTML={{ __html: file.icon }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gloss-dark truncate">{file.name}</p>
                    <div className="flex gap-2 items-center mt-0.5">
                      {file.size && <p className="text-[10px] text-gloss-mid font-medium">{formatSize(file.size)}</p>}
                      {file.timestamp && <p className="text-[10px] text-[#34c759] font-bold">&bull; {formatDate(file.timestamp)}</p>}
                    </div>
                  </div>
                  <a
                    href={`/download/${encodeURIComponent(file.name)}`}
                    download
                    className="gloss-raised-sm w-8 h-8 rounded-xl flex items-center justify-center shrink-0 no-underline active:scale-90 transition-transform"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 3v13M7 11l5 5 5-5M4 20h16" />
                    </svg>
                  </a>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2 shrink-0 bg-gloss-bg border-t border-white/60 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-2xl px-4 py-3 flex items-center gap-3" style={{
            background: 'linear-gradient(145deg, #ffffff, #e8e8eb)',
            boxShadow: '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files..."
              className="flex-1 w-full bg-transparent outline-none text-[13px] font-medium text-gloss-dark placeholder:text-gloss-mid"
            />
          </div>
          
          <label className="shrink-0 cursor-pointer">
            <input type="file" multiple className="hidden" onChange={async (e) => {
              const fileList = e.target.files;
              if (!fileList?.length) return;
              const fd = new FormData();
              const tokenRes = await fetch('/api/session-token');
              const tokenData = await tokenRes.json();
              fd.append('session_token', tokenData.token);
              fd.append('client_launch_timestamp', Date.now().toString());
              for (let i = 0; i < fileList.length; i++) fd.append('files', fileList[i]);
              await fetch('/upload', { method: 'POST', body: fd });
              e.target.value = '';
              fetchFiles();
            }} />
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center gloss-dark-pill shadow-[0_0_15px_rgba(0,0,0,0.2)] active:scale-90 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                 <polyline points="16 6 12 2 8 6"/>
                 <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
