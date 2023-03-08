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

### Quality

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

The `selected` property can be used to set the current video quality like so:

```ts
const firstQuality = player.qualities.at(0);
firstQuality.selected = true;

const secondQuality = player.qualities.at(1);
// this statement will set `firstQuality` to false.
secondQuality.selected = true;
```

Once set, the underlying provider will update the playback quality setting. Two things to keep
in mind is: (1) if the list is readonly, setting selected will do nothing (use
`qualities.readonly` to check), and (2) if the list _not_ readonly, setting selected will
remove auto quality selection.

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

- `qualities`: An array containing the current list of [`VideoQuality`](#quality) objects.
- `quality`: The current `VideoQuality` object or `null` if none is available.
- `autoQuality`: Whether automatic quality selection is enabled.
- `canSetQuality`: Whether the quality list is read-only, in other words whether it can be updated.

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
