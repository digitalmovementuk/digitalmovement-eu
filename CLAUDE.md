# CLAUDE.md

## Standing rules (set by the owner)

### Open the result when a task is done

When a chat or task is completed, don't just name the deliverable: open it so
the user sees what was created. This is the last step, after commit and push.

Only for things that were made to be looked at: pages, sites, PDFs, images,
reports, artifacts. Never open instruction or setup files such as CLAUDE.md,
skills, memory, settings or hooks.

- **Website / landing-page changes**: build (`npm run build`), serve the build
  (`npx vite preview`, or the dev server on port 5185), and open it.
  - Cloud session: tell the app the port with `report_preview_port`, and send a
    desktop (1440 px) and a mobile (390 px) Playwright screenshot of the changed
    section with `SendUserFile` (`display: "render"`). In the cloud container,
    launch Chromium without `executablePath` (`scripts/dev/shot.mjs` points at
    macOS Chrome).
  - Local session: open the URL in the browser (`open` on macOS, `xdg-open` on
    Linux).
  - If it was deployed, also give the link: draft
    https://new.digitalmovement.eu/ (`npm run deploy:draft`), live
    https://digitalmovement.eu/.
- **PDFs, images, standalone HTML, reports**: `SendUserFile` with
  `display: "render"` (locally: `open <file>`).
- **claude.ai artifacts**: `Artifact` with `action: "open"`. A publish in the
  same turn already opens it, so no second call.
- Several deliverables: open each one. Nothing visible was created: skip this
  step.
