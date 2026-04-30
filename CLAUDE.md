# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run deploy     # Build + publish to GitHub Pages (gh-pages -d dist)
```

No test suite exists.

## Architecture

Single-page React/Vite app. Entry: `src/main.jsx` → `AppShell.jsx`.

`AppShell.jsx` renders a three-tab shell (Raw / Medium Fidelity / High Fidelity). All views stay mounted to preserve state across tab switches; visibility is toggled via `display` style.

### Medium Fidelity — `spotify-hci-v2.jsx`

Three prototypes (P1 Swipe Spring Cleaning, P2 Staleness Drawer, P3 Tune Your Algorithm) displayed side-by-side on a pannable/zoomable infinite canvas. Each prototype has an interactive flow board plus static screen boards. The canvas uses raw pointer, wheel, and Safari gesture events (no library).

### High Fidelity — `spotify-hifi.jsx`

A single 390×800px phone mockup. All navigation is a `screen` string in `HiFiView` state — no router. Screen flow: `home → library → algo → tuning → summary → algo`. All influence state (genre/artist/song as `{[id]: 0–1}`) lives in `HiFiView` and is passed down as props.

### Shared conventions (both files)

- **No external UI libraries.** Everything is inline CSS-in-JS.
- **Color tokens** (duplicated in both files): `BG='#0E0A1F'`, `CREAM='#F5EFE0'`, `LIME='#D4FF6B'`, `CORAL='#FF6B57'`, `VIOLET='#B7A8FF'`
- **`P` object**: SVG path strings for icons. `Ic` component renders them.
- **`Shell`**: phone frame wrapper (390×800, rounded corners, status bar, home indicator).
- **`Pill`**: pill-shaped toggle button.
- HiFi uses `Img` (picsum.photos by seed) for album art; medium-fi uses `Art` (generated gradients).
- Z-index layering in hifi screens: content scroll layer → mini player (z:5) → tab bar (z:6) → any overlay (z:8+).

### Deployment

Deployed to GitHub Pages. `vite.config.js` sets `base: '/hci-team-project-prototypes/'` — keep this in sync with the repo name if it changes.
