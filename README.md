# FCT Blueprint Compressor

> Ultra-lean Factorio blueprint string optimizer for shipping cleaner, shorter blueprint payloads.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)](LICENSE)
[![Frontend: Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111)](script.js)
[![Styles: CSS3](https://img.shields.io/badge/Styles-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](style.css)
[![Markup: HTML5](https://img.shields.io/badge/Markup-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](index.html)
[![Factorio Blueprint Tool](https://img.shields.io/badge/Factorio-Blueprint%20Tool-orange?style=for-the-badge)](README.md)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Technical Notes](#technical-notes)
  - [Project Structure](#project-structure)
  - [Key Design Decisions](#key-design-decisions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)
- [Community and Support](#community-and-support)
- [Support the Development](#support-the-development)
- [Contacts](#contacts)

## Overview

`FCT Blueprint Compressor` is a browser-based utility that takes raw Factorio blueprint strings, decodes and optimizes their JSON payload, then re-compresses them for minimum size and easier distribution across chats, guides, and forums.

The app is intentionally dependency-light (single runtime compression library) and frontend-only, which means no backend, no API latency, and no server-side data retention.

> [!IMPORTANT]
> Your blueprint data is processed locally in the browser runtime. Nothing is uploaded by default.

## Features

- **Blueprint payload optimization**
  - Recursively strips empty arrays/objects and non-essential defaults (`direction: 0`, `enabled: true`) to reduce JSON noise before compression.
- **Aggressive compression strategy**
  - Iterates across multiple `pako` compression settings (`level` + `memLevel`) and keeps the smallest Base64 result.
- **Safety validation flow**
  - Includes a verification action that inflates and parses output to catch malformed data before you paste it back into Factorio.
- **Live compression telemetry**
  - Displays original vs compressed character counts plus total and percentage savings.
- **Internationalized UI**
  - Supports multiple locale profiles (`ru`, `en`, `uk`, `kk`, `cs`, `nl`, `sv`, `de`, `pl`, `fr`, `zh`, `ja`) with persisted language choice.
- **Zero-build static delivery**
  - Runs directly from static files, so you can host on GitHub Pages, Cloudflare Pages, Netlify, or any static CDN.

> [!TIP]
> Bigger blueprints generally produce better compression deltas because structural redundancy is higher.

## Technology Stack

- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Compression Library**: [`pako@2.1.0`](https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js)
- **Architecture**: Client-side, static SPA-like interface (without a framework)
- **Runtime**: Modern web browsers with Base64 + `Uint8Array` support
- **Distribution Model**: Static hosting

## Technical Notes

### Project Structure

```text
.
├── index.html            # UI markup and script imports
├── style.css             # Styling and visual theme
├── script.js             # Core logic: i18n, optimize, compress, verify, actions
├── profiles/
│   ├── en.js             # English locale dictionary
│   ├── ru.js             # Russian locale dictionary
│   └── ...               # Other language packs
├── CODE_OF_CONDUCT.md    # Community behavior guidelines
├── CONTRIBUTING.md       # Contribution workflow and quality gates
├── LICENSE               # Apache License 2.0
└── README.md             # Project documentation
```

### Key Design Decisions

1. **Client-only processing**
   - Chosen to avoid privacy concerns and infrastructure complexity.
2. **Two-phase optimization**
   - First optimize JSON semantics, then run deflate; this usually beats brute-force compression on raw input.
3. **Multi-locale dictionaries**
   - Locale packs are plain JS objects to keep i18n implementation dead simple and framework-agnostic.
4. **No bundler by default**
   - Keeps onboarding friction low and allows instant local runs by opening `index.html`.

> [!NOTE]
> The project currently pulls `pako` from a CDN. If your environment is air-gapped, vendor this dependency locally.

## Getting Started

### Prerequisites

You only need:

- A modern browser (`Chrome`, `Firefox`, `Edge`, `Safari`)
- Optional for local server mode: `Python 3.x` or `Node.js`
- Optional for contribution workflow: `Git`

### Installation

```bash
# 1) Clone repository
git clone https://github.com/fctostin-team/blueprint-code_compression.git

# 2) Enter project directory
cd blueprint-code_compression

# 3a) Fast path: open directly in browser
# Linux:
xdg-open index.html

# macOS:
open index.html

# Windows (PowerShell):
start index.html
```

Optional local static server:

```bash
# Python 3 static server
python3 -m http.server 8080
# then open http://localhost:8080
```

## Testing

There is no dedicated automated test suite yet, but there are reliable manual and sanity checks.

```bash
# 1) Run local static server for reproducible tests
python3 -m http.server 8080

# 2) Open app in browser
# http://localhost:8080

# 3) Manual verification checklist:
# - paste a valid blueprint string starting with "0"
# - click Compress
# - verify stats are displayed
# - click Verify
# - confirm success status message
# - switch locale and re-check labels/status text
```

> [!WARNING]
> If the input string does not start with `0`, the app rejects it as invalid Factorio blueprint payload.

## Deployment

Because this is a static app, deployment is straightforward.

### Option A: GitHub Pages

```bash
# Push main branch to GitHub
# In repository settings: Pages -> Deploy from branch -> main /(root)
```

### Option B: Any static host (Netlify/Cloudflare Pages/Vercel static)

- Point host root to repository root.
- No build command required.
- Publish directory: `.` (project root).

> [!CAUTION]
> Keep CDN dependencies reachable in production, or switch to local vendored assets for deterministic availability.

## Usage

```text
1) Paste original Factorio blueprint string in "Original Blueprint" textarea.
2) Hit "Compress Blueprint".
3) Copy generated output from "Compressed Blueprint".
4) Run "Verify" before importing back into the game.
5) Paste verified result into Factorio or share it publicly.
```

Quick behavior reference:

```text
Input  -> Decode Base64 -> Inflate zlib -> Parse JSON
      -> Optimize JSON  -> Deflate zlib  -> Encode Base64
      -> Prefix "0"     -> Output ready-to-use blueprint string
```

## Configuration

This project has **no required `.env` file** and no backend config.

Config knobs currently available in code:

- `DEFAULT_LANGUAGE` in `script.js` controls initial locale fallback.
- `profiles/*.js` defines translatable UI strings.
- Compression tuning is hardcoded in `script.js` (loops over `level` and `memLevel`).

If you need advanced runtime configurability, recommended path is adding a small `config.js` loaded before `script.js`.

## License

Distributed under the Apache License 2.0. See [LICENSE](LICENSE) for legal terms.

## Community and Support

Project created with the support of the FCTostin community.

[![YouTube](https://img.shields.io/badge/YouTube-Channel-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@FCT-Ostin)
[![Telegram](https://img.shields.io/badge/Telegram-Join_Chat-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/FCTostin)
[![Steam](https://img.shields.io/badge/Steam-Join_Group-1b2838?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/groups/FCTgroup)

## Support the Development

[![Patreon](https://img.shields.io/badge/Patreon-Support-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/c/OstinFCT)
[![Boosty](https://img.shields.io/badge/Boosty-Donate-F15F2C?style=for-the-badge&logo=boosty&logoColor=white)](https://boosty.to/ostinfct)

## Contacts

- YouTube: <https://www.youtube.com/@FCT-Ostin>
- Telegram: <https://t.me/FCTostin>
- Steam Group: <https://steamcommunity.com/groups/FCTgroup>
- Patreon: <https://www.patreon.com/c/OstinFCT>
- Boosty: <https://boosty.to/ostinfct>
