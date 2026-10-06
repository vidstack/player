# Security policy

## Supported versions

Vidstack Player is in security-only maintenance.

| Version | Supported                                  |
| ------- | ------------------------------------------ |
| 1.x     | Priority security fixes until January 2028 |
| 0.x     | No                                         |

After January 2028, no versions receive fixes. We recommend migrating to [Video.js 10](https://videojs.org?utm_source=vidstack), which is actively maintained by the teams behind Vidstack, Plyr, Media Chrome, and Video.js. See the migration guide for [React](https://videojs.org/docs/framework/react/guides/migrate-from-vidstack?utm_source=vidstack) or [web components and other frameworks](https://videojs.org/docs/framework/html/guides/migrate-from-vidstack?utm_source=vidstack).

## Reporting a vulnerability

Please don't open a public issue or discussion for a security problem.

Report it privately with GitHub's [private vulnerability reporting](https://github.com/vidstack/player/security/advisories/new).

Include the affected package (`vidstack` or `@vidstack/react`) and version, a description of the issue and its impact, and steps to reproduce it. We'll acknowledge your report, keep you updated while we investigate, and credit you in the advisory unless you'd rather stay anonymous.

"Priority" means issues that let an attacker run script, read data, or otherwise compromise a site that embeds the player. Other bugs aren't fixed during security-only maintenance.
