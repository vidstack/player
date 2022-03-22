---
title: Audio Player Installation (React)
description: Instructions to get your audio player installed in your React project and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit @vidstack/player
```

!!!

!!!step :title=Import Components :desc=Import player components into the `jsx` or `tsx` file where you'll be building your player.

```js:copy
import { AudioPlayer, MediaUi } from '@vidstack/player/react';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player JSX boilerplate to get started.

```jsx:copy
<AudioPlayer
	src="https://media-files.vidstack.io/audio.mp3"
	controls
	loading="lazy"
>
	{/* `<source>` and `<track>` elements can go here. */}
	<MediaUi slot="ui">
  	{/* UI elements go here. */}
	</MediaUi>
</AudioPlayer>
```

!!!
