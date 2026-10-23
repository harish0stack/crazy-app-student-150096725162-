# NEON//LAB — Cyberpunk Audio Visualizer

A premium interactive particle sandbox for the AI Coding Lab assignment. Move through a living field of light, deploy neon shockwaves, and enable a local synthesized audio response.

## Student
- **Name:** Harish Malviya
- **Roll number:** 150096725162
- **AI tool:** v0.dev
- **Project:** Option A — Cyberpunk Neon Audio-Visualizer & Particle Sandbox

## Features
- Canvas particle simulation with pointer trails and click shockwaves
- Native Web Audio API synthesized effects (no microphone permission required)
- Density, speed, glow, and chroma controls
- Pause, resume, reset, FPS, and particle telemetry
- Responsive cyberpunk interface with keyboard help panel
- Hidden screen pulse interaction
- In-app Debug Lab instructions and educational unit tests

## Technologies
Next.js preview shell, React client component, HTML Canvas API, Web Audio API, requestAnimationFrame, CSS, and vanilla browser APIs. No external runtime services or API keys are required.

## Run locally
Open the project in the v0 preview, or install it with the shadcn CLI / GitHub workflow. For the static assignment deliverable, save the generated application logic as `index.html` and open it directly in a browser. GitHub Pages can host the same static file without a build step.

## Controls
- Move pointer: attract particles and create trails
- Click canvas: create a shockwave and particle explosion
- `Space`: pause/resume
- `R`: reset particle field
- `H`: show/hide keyboard shortcuts
- `X`: secret screen flash
- Enable Audio: opt into synthesized sound effects

## Debugging exercise
Temporarily rename the animation function `animate` to `animateScene` without updating the `requestAnimationFrame(animate)` call. Open Chrome DevTools with **View → Developer → Developer Tools**, inspect the Console error, ask an AI to identify the mismatch, then restore the name `animate` and reload. Keep the final submitted version bug-free.

## Unit tests
The reusable `calculateParticleEnergy` validator is tested with normal, zero, and negative inputs using three passing `console.assert()` calls. Negative speed is safely normalized with `Math.max(0, ...)`, and a success message is printed in the Console.

## Publish with GitHub Pages
1. Create a GitHub repository and add the static `index.html` and `README.md` deliverables.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, choose `main` and `/root`, then save.
4. GitHub will provide the live Pages URL after deployment.

- **Repository URL:** `https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`
- **Live deployment URL:** `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Secret Features
Rapidly click the particle canvas to discover the chromatic pulse. You can also press `X` to activate it directly. The hidden interaction is intentionally safe and purely visual.
