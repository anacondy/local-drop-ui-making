import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Android',
    color: '#3DDC84',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#3DDC84">
        <path d="M17.532 15.106a1.003 1.003 0 111.001-1.737 1.003 1.003 0 01-1 1.737zm-11.044 0a1.003 1.003 0 11.998-1.737 1.003 1.003 0 01-.998 1.737zm11.4-6.018l2.006-3.459a.413.413 0 10-.715-.414L17.16 8.69c-1.533-.698-3.25-1.09-5.08-1.09s-3.548.392-5.08 1.09L4.98 5.215a.413.413 0 10-.715.414l2.005 3.46C2.84 11.188.478 14.665.01 18.77h23.98c-.468-4.105-2.83-7.582-6.102-9.682z" />
      </svg>
    ),
  },
  {
    name: 'iOS',
    color: '#1c1c1e',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1c1c1e">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: 'Windows',
    color: '#00A4EF',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#00A4EF">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.614h9.75v9.451L0 20.699M10.949 12.614H24V24l-13.051-1.851" />
      </svg>
    ),
  },
  {
    name: 'macOS',
    color: '#555555',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#555">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: 'Linux',
    color: '#FCC624',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#333">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
];

export default function PlatformRow() {
  return (
    <div className="flex justify-center gap-3 px-6 py-1">
      {platforms.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 15, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: i * 0.06 + 0.1,
            type: 'spring',
            stiffness: 350,
            damping: 22,
          }}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.93, y: 2 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className="w-[50px] h-[50px] rounded-[16px] flex items-center justify-center cursor-pointer"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #e6e6e9)',
              boxShadow: `
                5px 5px 12px rgba(0, 0, 0, 0.07),
                -5px -5px 12px rgba(255, 255, 255, 0.9),
                inset 0 1.5px 0 rgba(255, 255, 255, 0.8)
              `,
              border: '1px solid rgba(255, 255, 255, 0.6)',
            }}
          >
            {p.icon}
          </div>
          <span className="text-[9px] font-semibold text-gloss-mid tracking-wide">{p.name}</span>
        </motion.div>
      ))}
    </div>
  );
}
