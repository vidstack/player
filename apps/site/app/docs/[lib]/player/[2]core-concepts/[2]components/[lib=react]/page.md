---
title: Components
description: Introduction to using Vidstack Player components with React.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of using Vidstack Player components with React.

## Importing Components

You can import all components from the path `@vidstack/react`. Component names mirror
the element tag name except they're in PascalCase:

- `media-player` -> `MediaPlayer`
- `media-outlet` -> `MediaOutlet`
- `media-play-button` -> `MediaPlayButton`

```js
import { MediaOutlet, MediaPlayButton, MediaPlayer } from '@vidstack/react';
```

Keep in mind that you're implicitly registering the underlying custom element by importing a
React component.

## Element References

All components forward the underlying custom element reference, so you can use the familiar
`useRef` hook to get a hold of it.

```tsx
import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { useEffect, useRef } from 'React';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  useEffect(() => {
    player.current!.startLoading();
  }, []);

  return (
    <MediaPlayer load="custom" ref={player}>
      <MediaOutlet></MediaOutlet>
    </MediaPlayer>
  );
}
```

## Properties

We expose all custom element properties on the React wrapper, which gets forwarded to the
element itself; therefore, you can pass in complex data types such as objects and arrays without
any issues.

```tsx
import { MediaPlayer } from '@vidstack/react';
import { useState } from 'react';

function Player() {
  const [paused, setPaused] = useState(true);
  return (
    <MediaPlayer src={[{ src: '...', type: '...' }]} paused={paused}>
      {/* ... */}
    </MediaPlayer>
  );
}
```

## Events

All custom events are forwarded to a callback whose name mirrors the original event name but in
PascalCase:

```tsx
import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { type MediaPlayingEvent } from 'vidstack';

function Player() {
  function onPlaying(event: MediaPlayingEvent) {
    // ...
  }

  return (
    <MediaPlayer onPlaying={onPlaying}>
      <MediaOutlet />
    </MediaPlayer>
  );
}
```

## Element Types

All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `MediaPlayerElement`).

```ts {% copy=true %}
import { type MediaOutlet, type MediaPlayerElement } from 'vidstack';

let player: MediaPlayerElement;
```

## Provider Types

The following utilities can be useful for narrowing the type of a media provider:

```tsx {% copy=true %}
import {
  isAudioProvider,
  isHLSProvider,
  isVideoProvider,
  type AudioProvider,
  type HLSProvider,
  type MediaProvider,
  type VideoProvider,
} from 'vidstack';

function Player() {
  function onProviderChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;

    if (isAudioProvider(provider)) {
      const audioElement = provider.audio;
    }

    if (isVideoProvider(provider)) {
      const videoElement = provider.video;
    }

    if (isHLSProvider(provider)) {
      provider.config = { lowLatencyMode: true };
      provider.onInstance((hls) => {
        // ...
      });
    }
  }

  return <MediaPlayer onProviderChange={onProviderChange}>{/* ... */}</MediaPlayer>;
}
```
