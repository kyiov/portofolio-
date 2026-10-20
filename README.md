<div align="center">

# MUH4RHQ_

**Personal Portfolio**

[![Live](https://img.shields.io/badge/Live-muh4r.zone.id-000?style=flat-square&labelColor=000&color=2563EB)](https://muh4r.zone.id)
[![GitHub](https://img.shields.io/badge/GitHub-kyiov-000?style=flat-square&logo=github&labelColor=000)](https://github.com/kyiov)

</div>

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Build | Vite 6 |
| Deploy | Vercel |

## Features

- **M Monogram Loader** — SVG stroke-draw animation with gradient glow
- **Music Player** — Search & stream via [KyioAPI](https://api.kyio.web.id) (`yt-play`, `spotify-sc`)
- **Project Showcase** — Interactive API demo with code tabs (cURL / JS / Python)
- **Custom Cursor** — Dot + follower with hover-aware interactivity
- **CRT Aesthetic** — Scanlines, noise overlay, neon accents on dark `#050505`

## Structure

```
components/
├── Hero.tsx            Landing section
├── About.tsx           Profile & background
├── Projects.tsx        KyioAPI showcase
├── Stack.tsx           Tech stack grid
├── Contact.tsx         Links & contact
├── Navbar.tsx          Navigation + smooth scroll
├── MusicPlayer.tsx     Audio search & playback
└── MLoader.tsx         SVG monogram loader

services/
└── musicApi.ts         Multi-engine audio stream resolver

design-system/          Tokens, fonts, shared styles
```

## Run Locally

```bash
git clone https://github.com/kyiov/portofolio-.git
cd portofolio-
npm install
npm run dev             # localhost:3000
```

## Author

**MUH4RHQ** — API Engineer & Bot Developer
Pontianak, ID

- [GitHub](https://github.com/kyiov)
- [WhatsApp](https://wa.me/6282148570591)
- [KyioAPI](https://api.kyio.web.id)

## License

[MIT](LICENSE)
