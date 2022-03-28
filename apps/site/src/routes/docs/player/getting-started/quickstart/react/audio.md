---
title: Audio Player Installation (React)
description: Instructions to get your audio player installed in your React project and on-screen.
---

!!!step :title=Install NPM Package :desc=Install `@vidstack/player` and dependencies via NPM.

```bash:copy
npm i lit @vidstack/player
```

!!!

!!!step :title=Import Components :desc=Import media components into the `jsx` or `tsx` file where you'll be building your player.

```js:copy
import { Audio, Media } from '@vidstack/player/react';
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player JSX boilerplate to get started.

```jsx:copy
<Media>
  <Audio
    loading="lazy"
    preload="metadata"
  >
    <audio
      controls
      src="https://media-files.vidstack.io/audio.mp3"
      preload="none"
    ></audio>
  </Audio>
</Media>
```

!!!
