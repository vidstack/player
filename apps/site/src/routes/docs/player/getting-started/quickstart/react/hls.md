---
title: HLS Player Installation (React)
description: Instructions to get your HLS player installed in your React project and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit hls.js @vidstack/player
```

!!!

!!!step :title=Import Components :desc=Import player components into the `jsx` or `tsx` file where you'll be building your player.

```js:copy
import { Hls as HLS, Media } from '@vidstack/player/react';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player JSX boilerplate to get started.

```jsx:copy
<Media>
  <HLS
    loading="lazy"
    poster="https://media-files.vidstack.io/poster.png"
    preload="metadata"
  >
    <video
      controls
      src="https://media-files.vidstack.io/hls/index.m3u8"
      poster="https://media-files.vidstack.io/poster-seo.png"
      preload="none"
    ></video>
  </HLS>
</Media>
```

!!!
