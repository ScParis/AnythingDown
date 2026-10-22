# AnythingDown 🚀

A modern, high-performance, and TypeScript-first media downloader library for Node.js. Download videos, audios, slideshows, and stories from **Instagram (Reels, Feed, Stories), TikTok, Facebook, YouTube, Twitter/X, Reddit, Twitch, and 1000+ platforms**.

Includes:
- 📦 **NPM Library** (TypeScript / JavaScript)
- 🌐 **Full REST API** with built-in Web Dashboard
- 🤖 **Multi-Platform Bot** (Telegram & WhatsApp)

---

## ✨ Features

- ⚡ **Hybrid Architecture**:
  - **Native Fast Extractors**: Lightweight scraping for TikTok (watermark-free Aweme API), Instagram (embed & SaveIG), and Facebook.
  - **Universal Fallback Engine (`yt-dlp`)**: Supports 1,800+ sites with automatic fallback if native APIs change.
- 🎯 **Automatic Binary Management**:
  - Automatically locates system `yt-dlp` and `ffmpeg`.
  - Self-downloads and manages latest standalone executables in a user-safe directory (`~/.anythingdown/bin`), avoiding permission issues (`EACCES`) on FAT32/exFAT drives.
  - Built-in auto-update (`updateBinaries()`).
- 🎵 **FFmpeg Integration**: High-definition video (1080p, 2K, 4K) stream merging and direct MP3 audio extraction with metadata.
- 📊 **Real-time Progress Events**: `onProgress` callbacks providing exact percentage, download speed, and ETA.
- 🍪 **Cookies & Proxy Support**: Bypass rate limits, age restrictions, and access private Instagram/Facebook posts.
- 🎮 **5 Interactive Canvas Universe Themes**:
  - 🌀 **TRON '82**: 3D neon vector grid, Lightcycles with solid light trails, Recognizer ship, 90° turns.
  - 🏙️ **CYBERPUNK 2077**: Night City neon skyline, acid rain, Trauma Team flying AVs, Kiroshi Optics HUD & Netrunner Cyberdeck RAM.
  - 🏎️ **TOP GEAR '92 (SNES)**: Pseudo-3D Mode 7 speedway, iconic Red Cannibal car, interactive Nitro flames boost & 16-bit arcade audio.
  - 💣 **COUNTER-STRIKE (DE_DUST2)**: Dust II sandstone bombsite A, interactive AK-47 viewmodel with recoil & muzzle flash, live C4 beeping countdown, headshot SFX & real-time kill feed.
  - 🌴 **GRAND THEFT AUTO VI (VICE CITY / LEONIDA)**: Miami sunset sky, synthwave sun, palm silhouettes, Grotti Cheetah supercar with neon underglow, VCPD police helicopter with rotating searchlight & Wanted Level stars system.
- 🌐 **REST API & Web UI**: Streaming downloads, JSON metadata endpoints, and interactive Web Audio sound synthesizer (zero external sound assets).
- 🤖 **Telegram & WhatsApp Bots**: Turnkey bots ready to receive links and reply with media attachments.

---

## 📦 Installation & Build

```bash
# Clone and install dependencies
npm install

# Build TypeScript to dist/
npm run build
```

---

## 🌐 1. Running the REST API

Start the server on port `3000` (or custom `PORT=...`):

```bash
npm run start:api
```

- **Web Dashboard**: Open [http://localhost:3000](http://localhost:3000) to test pasting links directly in your browser.
- **Health Check**: `GET http://localhost:3000/api/health`
- **Metadata**: `POST http://localhost:3000/api/info` with JSON body `{"url": "https://..."}`
- **Download Media (Streaming)**:
  - Video (MP4): `http://localhost:3000/api/download?url=https://...&format=mp4`
  - Audio (MP3): `http://localhost:3000/api/download?url=https://...&format=mp3`

---

## 🤖 2. Running the Bots

### Telegram Bot
Create a bot with [@BotFather](https://t.me/BotFather) on Telegram to get your token, then run:

```bash
export TELEGRAM_BOT_TOKEN="SEU_TOKEN_AQUI"
npm run start:bot:telegram
```

Features:
- Auto-detects Instagram Reels, TikTok, YouTube, Facebook, Twitter links.
- Interactive inline buttons to choose between **[📹 Vídeo MP4]** and **[🎵 Áudio MP3]**.
- Sends files directly in chat and removes temporary server files.

### WhatsApp Bot
Run the WhatsApp bot client:

```bash
npm run start:bot:whatsapp
```

Features:
- Generates a QR Code in your terminal. Scan it with WhatsApp (Dispositivos Conectados).
- Receives any link in chat/groups, downloads the media, and sends it back as a video or audio file.
- Sessions are saved in `~/.anythingdown/whatsapp_auth/` so you don't need to scan every time.

### Run Both Bots Simultaneously
```bash
TELEGRAM_BOT_TOKEN="SEU_TOKEN_AQUI" npm run start:bot -- --all
```

---

## 💻 3. Using as a Library in Code

### Simple Download (Video or Audio)
```typescript
import { AnythingDown } from 'anythingdown';

// Download video to ./downloads
const result = await AnythingDown.download('https://www.tiktok.com/@username/video/123456789', {
  outputDir: './downloads',
});

if (result.success) {
  console.log(`Saved to: ${result.filePath}`);
}
```

### Download Audio as MP3
```typescript
import { AnythingDown } from 'anythingdown';

const result = await AnythingDown.downloadAudio('https://www.youtube.com/watch?v=aqz-KE-bpKQ', {
  outputDir: './downloads',
  filename: 'my_song',
});
```

### Real-time Progress Tracking
```typescript
import { AnythingDown } from 'anythingdown';

const result = await AnythingDown.download('https://www.instagram.com/reel/Cxxxxxx/', {
  outputDir: './downloads',
  onProgress: (progress) => {
    console.log(`Progress: ${progress.percent}% | Speed: ${progress.speed} | ETA: ${progress.eta}`);
  },
});
```

---

## 🧪 Quick CLI Test

```bash
node examples/cli.js "https://www.youtube.com/watch?v=aqz-KE-bpKQ" --audio
```

---

## 📄 License

MIT © AnythingDown Contributors
