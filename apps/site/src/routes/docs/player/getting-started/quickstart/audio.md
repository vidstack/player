---
title: Audio Player Installation
description: Instructions to get your audio player installed and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit @vidstack/player@next
```

!!!

!!!step :title=Register Elements :desc=Register the custom media elements. The `.js` extension is required for the package export map to work.

```js:copy
import '@vidstack/player/define/vds-media.js';
import '@vidstack/player/define/vds-audio.js';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-media>
  <vds-audio
    loading="lazy"
    preload="metadata"
  >
    <audio
      controls
	    src="https://media-files.vidstack.io/audio.mp3"
      preload="none"
    ></audio>
  </vds-audio>
</vds-media>
```

!!!
