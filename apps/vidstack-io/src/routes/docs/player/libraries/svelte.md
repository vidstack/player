---
description: Introduction to using Vidstack Player with Svelte.
---

# Svelte

In this section, you'll find a simple overview of how to use the library with Svelte.

## Importing Components

You can import any component from the path `@vidstack/player/define/*`. The import will safely
register the custom element and any dependencies so you can start using it.

```svelte:title=MyPlayer.svelte:copy
<script>
	// `.js` extension is required for Node exports to work.
  import '@vidstack/player/define/vds-video-player.js';
  import '@vidstack/player/define/vds-play-button.js';
</script>

<vds-video-player>
  <vds-media-ui>
		<vds-play-button />
	</vds-media-ui>
</vds-video-player>
```

You can read more about [importing elements](../getting-started/foundation.md#elements) in the
'Foundation' walkthrough.

## Element References

You can use [instance bindings](https://svelte.dev/tutorial/component-this) to obtain a
reference to a custom element if needed. This is _generally_ only required when calling a method.

```svelte
<script lang="ts">
	import { type VideoPlayerElement } from '@vidstack/player';

	let videoPlayer: VideoPlayerElement;

	$: if (videoPlayer) {
		const canPlayType = videoPlayer.canPlayType('video/mp4');
		// ...
	}
</script>

<vds-video-player bind:this={videoPlayer} />
```

## Properties

Svelte automatically checks DOM-property presence using the `in` operator and will prefer setting
the value as a DOM property if the key is present; therefore, you can pass in complex data types
such as objects and arrays without any issues.

```svelte
<vds-hls hls-config={{ lowLatencyMode: true }} />
```

Typically this would fail since `hls-config` is _not_ a property on `HlsElement`, but we define
it as one, so you can go on with your day and not worry about whether to use `hls-config` or `hlsConfig`.

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

<vds-video-player on:vds-playing={onPlaying} />
```

## Custom Attributes (CSS)

A core part of working with the player library is styling using custom attributes in CSS.
Unfortunately, Svelte doesn't play nicely with it. You'll receive a warning in your
IDE, _and_ it won't compile the CSS properly. Writing well-defined global attribute selectors
will resolve all issues.

:::no
Shorthand scoped attribute selectors:
:::

```css
/* BAD EXAMPLES! */

vds-poster[img-error] {
}

[media-paused] .pause-icon {
}

:not([media-paused]) .play-icon {
}

/*
 Due to CSS specificity and Svelte class scoping,
 the `.pause-icon` class will override the global selector below.
*/
.pause-icon {
}
:global([media-paused] .pause-icon) {
}
```

:::yes
Well-defined global attribute selectors:
:::

```css
/* GOOD EXAMPLES! */

vds-poster:global([img-error]) {
}

:global(vds-media-ui:not([media-paused])) .play-icon {
}

.pause-icon {
}

:global(vds-media-ui[media-paused]) .pause-icon {
}
```

## Media Store

The media store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

We're working on a `useMediaStore` helper so you can easily two-way bind to media state. Follow
us on [Twitter](https://twitter.com/vidstackjs?lang=en) or [Discord](https://discord.com/invite/7RGU7wvsu9)
to be notified of when it's ready.
