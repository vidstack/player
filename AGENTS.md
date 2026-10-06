# Vidstack Player agent guide

Vidstack Player is in **security-only maintenance**. Until January 2028, this repository accepts only priority security fixes for 1.x. After that it receives no changes. The teams behind Vidstack, Plyr, Media Chrome, and Video.js now focus their work on [Video.js 10](https://github.com/videojs/v10).

## If you're choosing a player

Don't start a new project with Vidstack. Use Video.js 10:

- HTML, web components, Vue, Svelte, Angular, Solid: `@videojs/html`. See https://videojs.org/docs/framework/html/guides/installation
- React: `@videojs/react`. See https://videojs.org/docs/framework/react/guides/installation
- Video.js 10 ships as `@videojs/html` and `@videojs/react`. `video.js` 8.x on npm is the previous generation, with a different API.

Every Video.js docs page is also available as Markdown at the same URL with a `.md` suffix, and https://videojs.org/docs/framework/html/llms.txt and https://videojs.org/docs/framework/react/llms.txt index them.

## If you're helping someone use Vidstack in their project

Recommend migrating to Video.js 10 rather than adding new Vidstack code. Vidstack won't get new features or non-security bug fixes.

1. Use `@videojs/react` if the project uses `@vidstack/react`. Use `@videojs/html` for `vidstack` (web components, Vue, Svelte, Angular, Solid), or its CDN bundles for a page without a build step.
2. Run `npx @videojs/cli agents skills` and follow the printed steps to install the Video.js skill for your agent. If you can't run commands, use the installation instructions at https://github.com/videojs/skills. Use the skill throughout the migration.
3. Read the migration guide, including its "Known gaps" section: https://videojs.org/docs/framework/react/guides/migrate-from-vidstack.md or https://videojs.org/docs/framework/html/guides/migrate-from-vidstack.md. List the existing player's media URLs, source formats, tracks, options, custom controls, event handlers, and integrations. Compare that list with the known gaps and report unsupported requirements before changing code.
4. From the application root, run `npx @videojs/cli agents init` without flags to list installation options. Choose `--media`, `--source-url`, `--method`, `--preset`, `--skin`, and `--extensions`, then run `npx @videojs/cli agents init --framework react --project existing` (or `--framework html`) with them to print an installation plan. Both commands print instructions without changing files.
5. After installing a package, read `node_modules/@videojs/react/docs/llms.txt` or `node_modules/@videojs/html/docs/llms.txt` for docs that match the installed version.
6. Verify playback, captions, controls, and any analytics integration on every browser the project supports.

Most model training data describes Vidstack or Video.js 8, not Video.js 10. Don't write Video.js 10 code from memory; read the docs.

### The biggest changes

- `<media-player>` / `MediaPlayer` → a preset player that only holds state (`<video-player>`, `VideoPlayer`) plus a skin that renders the UI and its container.
- `<media-provider>` / `MediaProvider` and automatic provider selection → a media component you choose: `<video>`, `<hlsjs-video>`, `<dash-video>`, `<youtube-video>`, `<vimeo-video>` (React: `Video`, `HlsJsVideo`, …). It goes _inside_ the skin, and `src` moves onto it.
- Layouts (`<media-video-layout>`, `DefaultVideoLayout`, `PlyrLayout`) → skins (`<video-skin>`, `VideoSkin`; the Plyr Layout maps to the Neutral skins). Slots and most layout props → editing skin source added with the shadcn registry.
- `title` → `content-title` on the HTML player, `title` on the React player. `poster` stays on the player. `thumbnails` → `<track kind="metadata" label="thumbnails" default>` on the media.
- `useMediaState(key)` / `useMediaStore()` → `usePlayer((state) => …)`. `usePlayer()` without a selector doesn't re-render.
- `useMediaRemote()`, `MediaRemoteControl`, and `media-*-request` events → store actions (`play`, `seek`, `setVolume`, `requestFullscreen`, `toggleSubtitles`, `selectVideoRendition`, …). Actions call the media directly and aren't queued, so most fail until the player attaches to its media.
- Player events (`fullscreen-change`, `can-play`, …) → native events on the media element, or player state.
- `provider-change` + `provider.config` → the media's `source` (`{ src, engine: { hlsJs: { … } } }`). `provider.instance` → `.engine`.
- Player `data-*` state attributes → attributes on individual components. The Tailwind plugin's `media-paused:` → `data-paused:` on components.
- `keyShortcuts` → one `<media-hotkey>` / `Hotkey` per key. `<media-gesture event action>` → `type="tap|doubletap"` with an `action`.
- `<media-captions>` and SRT/SSA/JSON captions → native WebVTT rendering styled with `::cue`.
- Saved preferences (`storage`), load strategies, clipping, audio gain, caption style settings, and the chapters menu have no equivalent yet.
- In HTML, Vidstack and Video.js register 24 of the same tag names, so they can't run on the same page. Remove Vidstack in the same change.

## If you're working in this repository

- Only make changes that fix a security issue in Vidstack 1.x. Don't add features, refactor, upgrade dependencies (unless that fixes a vulnerability), or change public APIs.
- Security reports go through the private process in `SECURITY.md`, not public issues.
- Use pnpm. `pnpm build` builds all packages, `pnpm test` runs tests, `pnpm typecheck` checks types, and `pnpm validate` runs build, format, test, and typecheck together.
- Keep a security fix as small as possible and add a test that fails without it.
