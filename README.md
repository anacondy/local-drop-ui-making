# 🚀 LocalDrop UI

> **A high-performance, cross-platform file-sharing PWA with real-time sync, QR code connectivity, and glassmorphism UI.**

---

## 📌 **About**

**LocalDrop UI** is a **Progressive Web App (PWA)** designed for **blazing-fast file transfers** over local networks (LAN/Wi-Fi). No internet, no cloud, no accounts—just **direct, secure, and instant** file sharing between devices.

✅ **Works on:** Windows, macOS, Linux, Android, iOS
✅ **No Installation:** Open in any modern browser
✅ **PWA Support:** Install as a standalone app on mobile/desktop
✅ **Real-Time Sync:** Files appear instantly across all connected devices
✅ **QR Code Connect:** Scan & connect in seconds
✅ **Glassmorphism UI:** Sleek, modern, and responsive

---

## 🛠 **Tech Stack**
   Layer | Technology |
 |-------|------------|
 | **Frontend** | React 19 + TypeScript + Vite |
 | **Styling** | Tailwind CSS v4 + Glassmorphism |
 | **Backend** | Flask (Python) |
 | **Real-Time** | Polling (WebSocket upgrade planned) |
 | **File Handling** | Python `os`, `shutil`, `pathlib` |
 | **QR Code** | `qrcode` (Python) + `qrcode.react` (Frontend) |
 | **PWA** | Vite PWA Plugin + Web App Manifest |
 | **Mobile Builds** | Capacitor.js (for iOS/Android) |

---

## 📥 **Installation & Setup**

### **Prerequisites**
- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **Git** (for cloning)

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/anacondy/local-drop-ui-making.git
cd local-drop-ui-making