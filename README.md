# hiiiiiiiiiii.com 🤖

> The most artificial Human Intelligence on the web.

A cyberpunk arcade-themed landing page for Human Intelligence Labs - a studio that builds cool sh*t using AI.

## 🎮 Features

- **Dark Cyberpunk Theme**: Terminal aesthetics with neon greens, purples, and scanline effects
- **Playable Mini-Game**: "Debug or Die" - an infinite side-scroller where you dodge bugs and 404 errors
- **Glitch Animations**: The logo glitches randomly for that authentic hacked arcade machine vibe
- **Retro Pixel Art**: All UI elements are pixelated with Press Start 2P and VT323 fonts
- **Fully Responsive**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🎯 Game Controls

- **Space Bar** or **Click/Tap** to jump
- Avoid the bugs 🐛 and 404 errors
- Try to beat the high score!

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **HTML5 Canvas** (game)

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main landing page
│   └── globals.css      # Global styles & effects
├── components/
│   ├── Header.tsx       # Glitchy header with logo
│   └── Game.tsx         # Debug or Die canvas game
├── public/              # Static assets
└── ...config files
```

## 🎨 Customization

### Colors

All colors are defined in `tailwind.config.js`:
- `neon-green`: #00ff41
- `neon-purple`: #bf00ff
- `neon-pink`: #ff00ff
- `neon-blue`: #00d9ff

### Fonts

- Logo & Headings: **Press Start 2P** (pixel font)
- Body Text: **VT323** (terminal font)

### Game Difficulty

Edit `gameSpeed` in `components/Game.tsx` to adjust difficulty.

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy to Vercel with one click or use the Vercel CLI.

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📄 License

MIT - Do whatever you want with it!

## 🎮 Credits

Built with chaotic-good energy and a lot of caffeine ☕

---

**Human Intelligence Labs** - We build cool sh*t using the robots you fear.

