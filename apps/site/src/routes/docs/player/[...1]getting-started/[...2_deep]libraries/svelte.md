---
title: Svelte
description: Introduction to using Vidstack Player with Svelte.
---

## Importing Components

You can import any component from the path `@vidstack/player/define/*`. The import will safely
register the custom element and any dependencies so you can start using it.

```svelte title=MyPlayer.svelte|copy
<script>
  // `.js` extension is required for Node exports to work.
  import '@vidstack/player/define/vds-media.js';
  import '@vidstack/player/define/vds-video.js';
  import '@vidstack/player/define/vds-play-button.js';
</script>

<vds-media>
  <vds-video>
    <!-- ... -->
  </vds-video>

  <div class="media-controls">
    <vds-play-button />
  </div>
</vds-media>
```

## Element References

You can use [instance bindings](https://svelte.dev/tutorial/component-this) to obtain a
reference to a custom element if needed. This is _generally_ only required when calling a method.

```svelte
<script lang="ts">
  import { type VideoElement } from '@vidstack/player';

  let provider: VideoElement;

  $: if (provider) {
    provider.startLoadingMedia();
    // ...
  }
</script>

<vds-media>
  <vds-video loading="custom" bind:this={provider}>
    <!-- ... -->
  </vds-video>
</vds-media>
```

## Properties

Svelte automatically checks DOM-property presence using the `in` operator and will prefer setting
the value as a DOM property if the key is present; therefore, you can pass in complex data types
such as objects and arrays without any issues.

```svelte
<vds-hls hls-library={() => import('hls.js')} hls-config={{ lowLatencyMode: true }} />
```

## Events

You can listen to custom events just as you would listen to any other event. All event types
can be imported from the `@vidstack/player` module.

```svelte
<script lang="ts">
  import { type MediaPlayingEvent } from '@vidstack/player';

  function onPlaying(event: MediaPlayingEvent) {
    // ...
  }
</script>

<vds-media>
  <vds-video on:vds-playing={onPlaying}>
    <!-- ... -->
  </vds-video>
</vds-media>
```

## Custom Attributes (CSS)

A core part of working with the player library is styling using custom attributes in CSS.
Unfortunately, Svelte doesn't play nicely with it. You'll receive a warning in your
IDE, _and_ it won't compile the CSS properly. Writing well-defined global attribute selectors
will resolve all issues.

Global styles using [`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess):

```html{1}
<style global>
  vds-poster[img-error] {
  }

  vds-media[paused] .pause-icon {
  }

  vds-media:not([paused]) .play-icon {
  }
</style>
```

Or, well-defined global attribute selectors:

```css
vds-poster:global([img-error]) {
}

vds-media:global([paused]) .pause-icon {
}

vds-media:global(:not([paused])) .play-icon {
}
```

## Media Store

The media store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

We're working on a `useMediaStore` helper so you can easily two-way bind to media state. Follow
us on [Twitter](https://twitter.com/vidstackjs?lang=en) or [Discord](https://discord.com/invite/7RGU7wvsu9)
to be notified of when it's ready.
