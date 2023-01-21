---
title: Components
description: Introduction to using Vidstack Player components with React.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of using Vidstack Player components with React.

## Importing Components

You can import all components from the path `@vidstack/react`. Component names mirror
the element tag name except they're in PascalCase without the `vds` prefix.

- `vds-media` -> `Media`
- `vds-video` -> `Video`
- `vds-play-button` -> `PlayButton`

```js
import { Media, PlayButton, Video } from '@vidstack/react';
```

Keep in mind that you're implicitly registering the underlying custom element by importing a
React component.

## Element References

All components forward the underlying custom element reference, so you can use the familiar
`useRef` hook to get a hold of it. This is _generally_ only required when calling a method.

```tsx
import { Media, Video } from '@vidstack/react';
import { useEffect, useRef } from 'React';
import { type MediaElement } from 'vidstack';

function MyPlayer() {
  const media = useRef<MediaElement>(null);

  useEffect(() => {
    media.current!.startLoadingMedia();
  }, []);

  return (
    <Media load="custom" ref={media}>
      <Video>
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
import { HLSVideo, Media } from '@vidstack/react';
import { useState } from 'react';

function MyPlayer() {
  const [paused, setPaused] = useState(true);
  return (
    <Media paused={paused}>
      <HLSVideo hlsLibrary={() => import('hls.js')} hlsConfig={{ lowLatencyMode: true }}>
        <video src="..." />
      </HLSVideo>
    </Media>
  );
}
```

## Events

All custom events are forwarded to a callback whose name mirrors the original event name but in
PascalCase:

```tsx
import { Media, Video } from '@vidstack/react';
import { type MediaPlayingEvent } from 'vidstack';

function MyPlayer() {
  function onPlaying(event: MediaPlayingEvent) {
    // ...
  }

  return (
    <Media onPlaying={onPlaying}>
      <Video>
        <video src="..." />
      </Video>
    </Media>
  );
}
```

## Element Types

All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `MediaElement`).

```ts {% copy=true %}
import { type MediaElement, type VideoElement } from 'vidstack';

let media: MediaElement;
```
