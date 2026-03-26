# yuwixx — v2 portfolio

Dark minimal single-scroll portfolio with live GitHub data and a Spotify pill player.

## Stack

- **React 18** + **TypeScript**
- **Vite** — zero-config build
- **Lanyard WebSocket** — real-time Discord/Spotify presence
- **GitHub REST API** — profile, repos, language breakdown
- **ghchart.rshah.org** — contribution graph SVG
- No UI libraries — 100% hand-crafted styles

## Quick start

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import on [vercel.com](https://vercel.com) → pick **Vite** preset
3. Build command: `npm run build` · Output: `dist`
4. Deploy — `vercel.json` handles SPA routing automatically ✓

## Important: Lanyard

Your Discord ID is already set in `src/components/SpotifyPill.tsx` and `src/components/Hero.tsx`.

> You **must** be a member of the [Lanyard Discord server](https://discord.gg/lanyard) for the API to track your presence.

## Customise

| File | What to edit |
|------|-------------|
| `src/components/Hero.tsx` | Bio text, links |
| `src/components/Footer.tsx` | Social links |
| `src/hooks/useGitHub.ts` | Change `GH_USER` constant |
| `src/index.css` | `:root` CSS variables (colors, fonts) |

## Notes

- The contribution graph uses `ghchart.rshah.org` which parses your public GitHub SVG — no token needed.
- Language stats are aggregated across your 10 largest repos.
- The Spotify pill auto-hides when you're not listening and slides back in when you are.
