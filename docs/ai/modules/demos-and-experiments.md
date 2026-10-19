# Module: Demos and Experiments

## Purpose
Collection of exploratory and experimental UI components, including 3D interactive graphics (Three.js / React Three Fiber), an interactive music player with video embeds, a Vietnamese spoonerism tool ("nói lái"), and reusable design system component showcases.

## Responsibilities and Boundaries
- Host experimental creative code without coupling it to core financial ledger logic.
- Showcase 3D model rendering, postprocessing, and particle effects (`@react-three/fiber`, `@react-three/drei`).
- Provide an interactive media and music player with audio spectrum visualizations (`/music`).
- Provide linguistics utility demos (e.g. Vietnamese spoonerism / "nói lái" wordplay tool `/talking-driving`).
- Showcase Ant Design component wrappers, tables, and buttons (`/demo/`).

## Source Map
```
src/
├── routes/(public)/
│   ├── demo/                             # Component showcase routes (/demo/table, /demo/button)
│   ├── demoComponent.tsx                 # Composite UI demo
│   ├── music.tsx                         # Route for music player
│   └── talking-driving.tsx               # Route for "nói lái" linguistics experiment
└── shared/pages/
    ├── demo/                             # Table & button test pages
    ├── music/                            # Music player with video embeds & ranking
    └── talking-driving/                  # Vietnamese syllable parser and rhyme swapper
```

## Main Components
- **`MusicPlayerPage`** (`src/shared/pages/music/index.tsx`): Interactive playlist, video modal, and voting ranking interface.
- **`TalkingDriving`** (`src/shared/pages/talking-driving/index.tsx`): Syllable parser highlighting and swapping phonetic onsets and rimes.
- **3D Visualizations**: Located in `src/shared/components/feranmut-heart/` and `src/shared/components/sakura-branch/`, using `@react-three/fiber` for real-time 3D rendering.

## Business and Data Flows
- Standalone client-side applications that do not depend on protected backend financial data.
- State is managed locally via React hooks (`useState`, `useMemo`).

## Dependencies and Integrations
- **3D**: `three`, `@react-three/fiber`, `@react-three/drei`, `postprocessing`.
- **Motion**: `motion/react` and `framer-motion` for fluid interface animations.

## Extension Guide
- Place experimental components in `src/shared/pages/demo/` or `src/shared/components/` and expose them via public route wrappers.

## Constraints and Common Pitfalls
- 3D Canvas elements must be cleaned up on route transitions to prevent WebGL context leaks.

## Tests and Verification
- Run `npm run build` to verify 3D bundles and asset pipelines.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/music/index.tsx`
  - `src/shared/pages/talking-driving/index.tsx`
- Known Gaps: None.
