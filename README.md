# Balatro Browser

> **Languages:** English · [简体中文](README_ZH.md)

Turn your Balatro career save into a polished, browsable profile page.

A pure-frontend SPA: import `profile.json` or `profile.jkr` and everything is parsed and rendered **locally in your browser** — nothing is uploaded.

![Balatro Browser screenshot](screenshot/screenshot-1.png)

## Features

- **Career overview** — total wins / losses, win rate, best hand, most money in a run
- **Collection progress** — deck stakes, joker stickers, challenge completion
- **Deck collection** — per-deck wins/losses, highest stake, stake breakdown; sortable with detail drawer
- **Deck usage & hand profile** — most-played decks, hand-type preferences
- **Joker Hall of Fame** — usage counts and observed wins/losses
- **Economy** — career money-related stats
- **Challenges & leaderboards** — official challenge names, consumable / voucher usage ranks
- **Export image** — save the current profile page as PNG
- **Multilingual** — UI and in-game terms in 简体中文 / 繁體中文 / English / 日本語 / 한국어

## Quick start

```bash
bun install
bun dev
```

Open the local URL from your terminal and drop in a save file.

### Build & preview

```bash
bun run typecheck   # TypeScript
bun run lint        # ESLint
bun run build       # production build
bun run preview     # preview build output
```

## Getting your save file

Supported formats:

| File | Description |
|------|-------------|
| `profile.json` | Exported JSON save (e.g. decrypted from `profile.jkr`) |
| `profile.jkr` | Default compressed save (auto-decompressed on import) |

Common save locations:

- **macOS**: `~/Library/Application Support/Balatro/`
- **macOS (Apple Arcade)**: `~/Library/Containers/com.playstack.balatroarcade/Data/Library/Preferences/com.playstack.balatroarcade.plist`
- **Windows**: `%AppData%/Balatro/`
- **Linux**: `~/.local/share/Balatro/` or your Steam data folder

### Apple Arcade Balatro

If you play the Apple Arcade version, the save is stored as `com.playstack.balatroarcade.plist`. Use [export-balatro-jkr.py](https://gist.github.com/RealTong/a11cbeda965292e8e889f7cbab68c60d) to extract `profile.jkr`, then import it here.

## Privacy

All parsing and rendering happens in the browser. No backend, no upload.

## Tech stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- [pako](https://github.com/nodeca/pako) — `.jkr` decompression
- [html-to-image](https://github.com/bubkoo/html-to-image) — page screenshot export

Joker and other card thumbnails are loaded from [Balatro Wiki](https://balatrowiki.org/) (`balatrowiki.org/images/`); failed loads fall back to a placeholder.

## Project structure

```
src/
├── App.tsx                 # import routing, locale, export
├── lib/
│   ├── profile.ts          # save types & derived stats
│   ├── format.ts           # big-number / sci-notation formatting
│   ├── gameData.ts         # stakes, deck colors, wiki image URLs
│   ├── uiText.tsx          # UI copy i18n
│   ├── balatroLocale*.ts   # in-game term localization
│   ├── challengeNames.ts   # official challenge names
│   └── jkrFile.ts          # .jkr / .jks parsing
└── components/profile/     # profile section UI
```

## License & disclaimer

Fan-made tool, not affiliated with LocalThunk or Playstack. Balatro and related assets belong to their respective owners.
