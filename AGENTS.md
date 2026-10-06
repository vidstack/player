# Vidstack Player agent guide

Vidstack Player is in security-only maintenance: priority security fixes for 1.x until January 2028, and nothing else. Its successor is [Video.js 10](https://github.com/videojs/v10), from the teams behind Vidstack, Plyr, Media Chrome, and Video.js. Don't start new projects with Vidstack or add new Vidstack code.

## Migrating to Video.js 10

- **Skill:** install the Video.js skill with `npx @videojs/cli agents skills`, or follow https://github.com/videojs/skills.
- **Migration guide:** read the guide for the project's package and follow the prompt in its "AI Quickstart" section.
  - `@vidstack/react`: https://videojs.org/docs/framework/react/guides/migrate-from-vidstack.md
  - `vidstack` (web components, Vue, Svelte, Angular, Solid, CDN): https://videojs.org/docs/framework/html/guides/migrate-from-vidstack.md
- **Docs:** https://videojs.org/docs/framework/react/llms.txt and https://videojs.org/docs/framework/html/llms.txt index every page as Markdown. Once Video.js is installed, use `node_modules/@videojs/react/docs/llms.txt` or `node_modules/@videojs/html/docs/llms.txt`, which match the installed version.

## Working in this repository

- Only fix security issues in Vidstack 1.x. Don't add features, refactor, change public APIs, or upgrade dependencies unless that fixes a vulnerability.
- Security reports go through `SECURITY.md`, not public issues.
- Use pnpm: `pnpm build`, `pnpm test`, `pnpm typecheck`, or `pnpm validate` for all of them plus formatting.
- Keep a fix as small as possible and add a test that fails without it.
