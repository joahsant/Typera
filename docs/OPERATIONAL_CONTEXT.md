# OPERATIONAL CONTEXT — TYPERA

## Current State
- **Phase:** 3.0 (Dynamic Font Mutation)
- **Architecture:** React 18 + Vite + Zustand + opentype.js + Blob URL Rendering.
- **Base Font:** Inter (processed as `opentype.Font`).
- **Active Task:** Real-time font transformation loop with `useFontEngine` hook.

## Validated Decisions
- **Rendering:** Using dynamic `@font-face` with Blob URLs for zero-latency preview.
- **Engine Logic:** Transform algorithms applied directly to `opentype.js` glyph paths before serialization.
- **Performance:** Mandatory <16ms budget for frame-perfect slider interaction.

## Active Constraints
- Frame budget: <16ms for real-time preview updates.
- Undo history limit: 50 states.
- Debounced autosave: 300ms.
