---
title: Components
description: Introduction to using Vidstack Player components with HTML.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of working with the custom elements in Vidstack Player.

## Elements

We provide a variety of components out of the box that help enhance the player.

Some are concerned with layout such as `<media-player>` and `<media-provider>`, some provide visual
controls such as `<media-play-button>` or `<media-time-slider>`, and others manage player instances.

We recommend either searching (`cmd + k`) for what you're looking for or browsing the sidebar.
Each element contains documentation on how to use/style it, and an API reference.

You can register _all_ elements like so:

```js
import { defineCustomElements } from 'vidstack/elements';

defineCustomElements();
```

Or, individually like so:

```js {% copy=true %}
// The `.js` extension is required.
import 'vidstack/define/media-player.js';
import 'vidstack/define/media-poster.js';
```

Next, we can use the defined elements and the browser will "upgrade" them once the script above
has loaded and run.

```html
<!-- Browser will upgrade custom elements once they're defined. -->
<media-player>
  <media-provider></media-provider>
  <media-poster></media-poster>
</media-player>
```

## Attach Hook

Vidstack elements go through a two-step process in which they're defined then attached before
they're finally ready to be interacted with:

```ts
const player = document.querySelector('media-player');

// 1. Like any other custom element it needs to be defined:
customElements.whenDefined('media-player', () => {
  // `media-player` is now defined.

  // 2. Wait for the custom element instance to be attached.
  player.onAttach(() => {
    // Safe to now interact with instance props/methods.
    player.play();
  });
});
```

You can await the `defineCustomElements` call to ensure _all_ elements are defined:

```ts
import { defineCustomElements } from 'vidstack/elements';

async function onLoad() {
  await defineCustomElements();
  const player = document.querySelector('media-player');
  player.onAttach(() => {
    // ...
  });
}

document.addEventListener('load', onLoad, { once: true });
```

## Keep Alive

By default, Vidstack elements will be destroyed when they've disconnected from the DOM and have not
re-connected after an animation frame tick. You can specify that an element should be kept
alive like so:

```html
<!-- Keep this element and all children alive until manually destroyed. -->
<media-player keep-alive>
  <!-- This will be kept alive as well. -->
  <media-provider></media-provider>
  <!-- ... -->
</media-player>
```

Now, you can manually destroy the element instance and all children by calling the `destroy()`
method on the element that you specified to keep alive like so:

```ts
const player = document.querySelector('media-player');
// This will destroy the player element instance and all child instances.
player.destroy();
```

{% callout type="info" %}
You don't need to worry about keeping elements alive if you're using a framework integration such
as React. Elements will be disposed of correctly based on the framework lifecycle.
{% /callout %}

## Attributes

Most component props can be set directly in HTML via attributes like so:

```html
<!-- The following will set the `type` and `format` props. -->
<media-time type="current" format="time"></media-time>
```

All attributes in Vidstack are the kebab-case variant of the property name. For example, the
`fooBar` property would be the attribute `foo-bar`.

## Events

Events can be listened to by obtaining a reference to the element instance and attaching an
event listener like so:

```ts
const player = document.querySelector('media-player');

player.addEventListener('play', function onPlay() {
  // ...
});
```

## Instance

Obtaining a reference to the element instance enables you to manipulate the custom element itself
and directly call properties/methods like so:

```ts
const player = document.querySelector('media-player');

player.onAttach(() => {
  // Set a instance property:
  player.muted = true;

  // Call a instance method:
  player.play();
});
```

## Element Types

All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `MediaPlayerElement`).

```ts {% copy=true %}
import { type MediaPlayerElement, type MediaPosterElement } from 'vidstack';

let player: MediaPlayerElement;
```

## Provider Types

The following utilities can be useful for narrowing the type of a media provider:

```ts {% copy=true %}
import {
  isAudioProvider,
  isHLSProvider,
  isVideoProvider,
  type AudioProvider,
  type HLSProvider,
  type MediaProvider,
  type VideoProvider,
} from 'vidstack';

const player = document.querySelector('media-player');

player.addEventListener('provider-change', (event) => {
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
});
```
