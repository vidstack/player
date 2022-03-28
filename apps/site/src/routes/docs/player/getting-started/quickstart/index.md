---
title: Video Player Installation
description: Instructions to get your video player installed and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit @vidstack/player
```

!!!

!!!step :title=Register Elements :desc=Register the custom media elements. The `.js` extension is required for the package export map to work.

```js:copy
import '@vidstack/player/define/vds-media.js';
import '@vidstack/player/define/vds-video.js';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-media>
  <vds-video
    loading="lazy"
    poster="https://media-files.vidstack.io/poster.png"
    preload="metadata"
  >
    <video
      controls
    	src="https://media-files.vidstack.io/720p.mp4"
      poster="https://media-files.vidstack.io/poster-seo.png"
      preload="none"
    ></video>
  </vds-video>
</vds-media>
```

!!!
