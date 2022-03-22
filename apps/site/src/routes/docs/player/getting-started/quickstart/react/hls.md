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
import { HlsPlayer, MediaUi } from '@vidstack/player/react';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player JSX boilerplate to get started.

```jsx:copy
<HlsPlayer
	src="https://media-files.vidstack.io/hls/index.m3u8"
	poster="https://media-files.vidstack.io/poster.png"
	controls
	loading="lazy"
>
	{/* `<source>` and `<track>` elements can go here. */}
	<MediaUi slot="ui">
  	{/* UI elements go here. */}
	</MediaUi>
</HlsPlayer>
```

!!!
