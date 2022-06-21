---
title: Foundation
description: Introduction to using Vidstack Player with React.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of using Vidstack Player with React.

## Importing Components

You can import all components from the path `@vidstack/player-react`. Component names mirror
the element tag name except they're in PascalCase without the `vds` prefix.

- `vds-media` -> `Media`
- `vds-video` -> `Video`
- `vds-play-button` -> `PlayButton`

```js
import { Media, Video, PlayButton } from '@vidstack/player-react';
```

Keep in mind that you're implicitly registering the underlying custom element by importing a
React component.

## Element References

All components forward the underlying custom element reference, so you can use the familiar
`useRef` hook to get a hold of it. This is _generally_ only required when calling a method.

```tsx
import { useRef, useEffect } from 'React';
import { type VideoElement } from '@vidstack/player';
import { Media, Video } from '@vidstack/player-react';

function MyPlayer() {
  const providerRef = useRef<VideoElement>(null);

  useEffect(() => {
    const provider = providerRef.current;
    provider.startLoadingMedia();
  }, []);

  return (
    <Media>
      <Video loading="custom" ref={providerRef}>
        <video src="..." />
      </Video>
    </Media>
  );
}
```

## Properties

We expose all custom element properties on the React wrapper, which gets forwarded to the
element itself; therefore, you can pass in complex data types such as objects and arrays without
any issues.

```tsx
import { Media, Hls } from '@vidstack/player-react';

function MyPlayer() {
  return (
    <Media>
      <Hls hlsLibrary={() => import('hls.js')} hlsConfig={{ lowLatencyMode: true }}>
        <video src="..." />
      </Hls>
    </Media>
  );
}
```

## Events

All custom events are forwarded to a callback whose name mirrors the original event name but in
PascalCase, and without the `vds` prefix.

- `vds-play` -> `onPlay`
- `vds-can-play` -> `onCanPlay`

```tsx
import { type MediaPlayingEvent } from '@vidstack/player';
import { Media, Video } from '@vidstack/player-react';

function MyPlayer() {
  function onPlaying(event: MediaPlayingEvent) {
    // ...
  }

  return (
    <Media>
      <Video onPlaying={onPlaying}>
        <video src="..." />
      </Video>
    </Media>
  );
}
```

## Media Store

The media store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

We're working on a `useMediaStore` hook so you can easily two-way bind to media state. Follow
us on [Twitter](https://twitter.com/vidstackjs?lang=en) or [Discord](https://discord.com/invite/7RGU7wvsu9)
to be notified of when it's ready.
