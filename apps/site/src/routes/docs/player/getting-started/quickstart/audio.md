---
title: Audio Player Installation
description: Instructions to get your audio player installed and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit @vidstack/player
```

!!!

!!!step :title=Register Element :desc=Register the `vds-audio-player` custom element. The `.js` extension is required for the package export map to work.

```js:copy
import '@vidstack/player/define/vds-audio-player.js';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-audio-player
	src="https://media-files.vidstack.io/audio.mp3"
	controls
	loading="lazy"
>
	<!-- `<source>` and `<track>` elements can go here. -->
	<vds-media-ui slot="ui">
  	<!-- UI elements go here. -->
	</vds-media-ui>
</vds-audio-player>
```

!!!
