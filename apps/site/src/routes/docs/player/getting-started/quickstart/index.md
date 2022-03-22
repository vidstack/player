---
title: Video Player Installation
description: Instructions to get your video player installed and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit @vidstack/player
```

!!!

!!!step :title=Register Element :desc=Register the `vds-video-player` custom element. The `.js` extension is required for the package export map to work.

```js:copy
import '@vidstack/player/define/vds-video-player.js';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-video-player
	src="https://media-files.vidstack.io/720p.mp4"
	poster="https://media-files.vidstack.io/poster.png"
	controls
	loading="lazy"
>
	<!-- `<source>` and `<track>` elements can go here. -->
	<vds-media-ui slot="ui">
  	<!-- UI elements go here. -->
	</vds-media-ui>
</vds-video-player>
```

!!!
