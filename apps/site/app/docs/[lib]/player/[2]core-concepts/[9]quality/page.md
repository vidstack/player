---
title: Quality
description: Configuring playback quality with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how playback quality can be tracked and configured with Vidstack
Player.

{% callout type="info" %}
Quality tracking and selection is currently only supported by the
[HLS Provider](/docs/react/player/providers/hls).
{% /callout %}

## Introduction

Adaptive streaming protocols like [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) not only
enable streaming media in chunks, but also have the ability adapt playback quality based on the
device size, network conditions, and other information. Adaptive qualities is important for speeding
up initial delivery and to avoid loading excessive amounts of data which cause painful buffering
delays.

Streaming platforms such as [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream)
and [Mux](https://www.mux.com) will take an input video file (e.g., `awesome-video.mp4`) and create
multiple renditions out of the box for you, with multiple resolutions (width/height) and bit
rates:

![HLS manifest with multiple child resolution manifests.]($lib/img/hls-manifest.png)

By default, the best quality is automatically selected by the streaming engine such as `hls.js`.
You'll usually see this as an "Auto" option in the player quality menu. It can also be manually
set if the engine is not making optimal decisions as they're generally more conservative to
avoid excessive bandwidth usage. In the following sections, you'll learn how to track available
playback qualities with Vidstack Player and also how to configure it manually.

## Quality List

The read-only `qualities` property on the player returns a `VideoQualityList` object that contains
`VideoQuality` objects. Each video quality represents a currently available video rendition.

Similar to text tracks or audio tracks, the returned list is live; that is, as qualities are added
to and removed from the player, the list's contents change dynamically. Once you have a reference
to the list, you can monitor it for changes to detect when new qualities are added or existing
ones are removed by [listening to list events](#events).

```ts
const player = document.querySelector('media-player');

// Length
const hasItems = player.qualities.length;

// Iterating
for (const quality of player.qualities) {
}

// Can be read-only if provider does not support setting quality:
const isReadonly = player.qualities.readonly;

// Automatic quality selection is enabled:
const isAutoSelect = player.qualities.auto;

// Map to array
player.qualities.toArray();
```

The `VideoQuality` interface contains the following shape:

```ts
interface VideoQuality {
  width: number;
  height: number;
  bitrate: number;
  codec: string;
  selected: boolean;
}
```

### Selecting

The `selected` property can be used to set the current video quality like so:

```ts
const firstQuality = player.qualities[0];
firstQuality.selected = true;

const secondQuality = player.qualities[1];
// this statement will set `firstQuality` to false.
secondQuality.selected = true;
```

Once set, the underlying provider will update the playback quality setting. Two things to keep
in mind is: (1) if the list is readonly, setting selected will do nothing (use
`qualities.readonly` to check), and (2) if the list _not_ readonly, setting selected will
remove auto quality selection.

### Switch

The quality switching behavior can be configured using the `switch` property on the
`VideoQualityList` object. The following options are available:

- `current` (default): Trigger an immediate quality level switch. This will abort the current
  fragment request if any, flush the whole buffer, and fetch fragment matching with current position
  and requested quality level.

- `next`: Trigger a quality level switch for next fragment. This could eventually flush
  already buffered next fragment.

- `load`: Set quality level for next loaded fragment.

```ts
player.qualities.switch = 'next';
```

### Auto Select

You can request the engine to handle automatic quality selection using the `autoSelect`
method on the `VideoQualityList` object like so:

```ts
player.qualities.autoSelect();
```

Keep in mind, [manually setting qualities](#selecting) will disable auto selection, you will
need to call `autoSelect()` to enable it again.

### List Events

The `VideoQualityList` objects is an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
which dispatches the following events:

- `add`: Fired when a video quality has been added to the list.
- `remove`: Fired when a video quality has been removed from the list.
- `change`: Fired when the selected video quality changes.
- `auto-change`: Fired when the auto-quality selection mode changes.
- `readonly-change`: Fired when the read-only mode changes.

```ts
player.qualities.addEventListener('add', (event) => {
  const newVideoQuality = event.detail; // `VideoQuality`
  // ...
});

player.qualities.addEventListener('change', (event) => {
  const { prev, current } = event.detail; // Video Qualities
  // ...
});
```

## Media Store

The following video quality properties are available on the media store:

- `qualities`: An array containing the current list of `VideoQuality` objects.
- `quality`: The current `VideoQuality` object or `null` if none is available.
- `autoQuality`: Whether automatic quality selection is enabled.
- `canSetQuality`: Whether qualities can be manually selected, in other words whether the quality
  list is _not_ read-only.

{% code_snippet name="subscribe" highlight="react:8" /%}

## Media Remote

The `changeQuality` method on the media remote can be used to dispatch requests to update
the current quality like so:

{% code_snippet name="remote" /%}

## Media Events

The following video quality events are available on the player:

- `qualities-change`: Fired when the available list of video qualities has changed.
- `quality-change`: Fired when the selected video quality has changed.

{% code_snippet name="events" /%}
