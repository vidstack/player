---
description: Introduction to using the React distribution.
---

# React

In this section, you'll find a simple overview of how to use the React version of the library.

## Importing Components

You can import all components from the path `@vidstack/player/react`. Component names mirror
the element tag name except they're in PascalCase without the `vds` prefix.

- `vds-play-button` -> `PlayButton`
- `vds-slider-value-text` -> `SliderValueText`

```js
import { VideoPlayer, PlayButton } from '@vidstack/player/react';
```

Keep in mind that we're implicitly registering the underlying custom element by importing a
React component. You can read more about how [importing elements](../getting-started/foundation.md#elements)
works in the 'Foundation' walkthrough.

## Element References

All components forward the underlying custom element reference, so you can use the familiar
`useRef` hook to get a hold of it. This is _generally_ only required when calling a method.

```tsx
import { useRef, useEffect } from 'React';
import { type VideoPlayerElement } from '@vidstack/player';
import { VideoPlayer } from '@vidstack/player/react';

function MyPlayer() {
  const playerRef = useRef<VideoPlayerElement>(null);

  useEffect(() => {
    const canPlayType = playerRef.current!.canPlayType('video/mp4');
    // ...
  }, []);

  return <VideoPlayer ref={playerRef} />;
}
```

## Properties

We expose all custom element properties on the React wrapper, which gets forwarded to the
element itself; therefore, you can pass in complex data types such as objects and arrays without
any issues.

```tsx
import { HlsPlayer } from '@vidstack/player/react';

function MyPlayer() {
  return <HlsPlayer hlsConfig={{ lowLatencyMode: true }} />;
}
```

## Events

All custom events are forwarded to a callback whose name mirrors the original event name but in
PascalCase, and without the `vds` prefix.

- `vds-play` -> `onPlay`
- `vds-can-play` -> `onCanPlay`

```tsx
import { type MediaPlayingEvent } from '@vidstack/player';
import { VideoPlayer } from '@vidstack/player/react';

function MyPlayer() {
  function onPlaying(event: MediaPlayingEvent) {
    // ...
  }

  return <VideoPlayer onPlaying={onPlaying} />;
}
```

## Media Store

The media store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

We're working on a `useMediaStore` hook so you can easily two-way bind to media state. Follow
us on [Twitter](https://twitter.com/vidstackjs?lang=en) or [Discord](https://discord.com/invite/7RGU7wvsu9)
to be notified of when it's ready.
