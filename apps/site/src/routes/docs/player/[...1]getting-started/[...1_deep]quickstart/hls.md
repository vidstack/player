---
title: HLS Player Installation
description: Instructions to get your HLS player installed and on-screen.
---

!!!step title="Install NPM Package"|(slot=description)=Install `@vidstack/player` and dependencies via NPM.

```bash copy
npm i lit hls.js @vidstack/player@next
```

!!!

!!!step title="Register Elements"|(slot=description)=Register the custom media elements. The `.js` extension is required for the package export map to work.

```js copy
import '@vidstack/player/define/vds-media.js';
import '@vidstack/player/define/vds-hls.js';
```

!!!

!!!step title="Add Player Markup"|description="Add the following player HTML boilerplate to get started."

```html copy
<vds-media>
  <vds-hls poster="https://media-files.vidstack.io/poster.png">
    <video
      controls
      src="https://media-files.vidstack.io/hls/index.m3u8"
      poster="https://media-files.vidstack.io/poster-seo.png"
      preload="none"
    ></video>
  </vds-hls>
</vds-media>
```

!!!
