---
title: Live Streams
description: Introduction to live streams with Vidstack Player.
---

# {% $frontmatter.title %}

{% callout type="experimental" %}
Live stream support is still experimental in that we require further feedback, tuning,
and to extend configuration options. Feel free to join our [Discord](https://discord.com/invite/7RGU7wvsu9) or open a [discussion on GitHub](https://github.com/vidstack/player/discussions)
if you have anything to share!
{% /callout %}

Live streams are currently supported via the [HLS provider](/docs/player/providers/hls)
which uses [`hls.js`](https://github.com/video-dev/hls.js/), and in
[browsers that natively support HLS](https://caniuse.com/http-live-streaming). The player
will prefer using `hls.js` over the native engine when supported to enable a consistent and
configurable experience across vendors.

## Stream Type

The live stream type can be set like so:

{% code_snippet name="stream-type" /%}

The type of stream can either be `on-demand`, `live`, `live:dvr`, `ll-live` (low-latency),
`ll-live:dvr`. If the value is not set, it will be inferred by the player which can be less
accurate (e.g., at identifying DVR support).

## Live DVR

Live DVR (Digital Video Recording) refers to live streams that support pausing, seeking back, and
overall playing the live stream at the desired pace. Whether DVR is supported or not helps
determine whether seeking operations are permitted during live streams, and consequently how to
best configure UI components such as the time slider.

The player will try to infer whether a stream supports DVR but generally it's inaccurate. Prefer
using the [stream type](#stream-type) property to specify whether DVR is supported or not. In
addition, the `minLiveDVRWindow` can be used to specify the minimum seekable length in seconds
before seeking operations are permitted (default value is 60 seconds):

{% code_snippet name="min-live-dvr" /%}

The min DVR window is used in the following check: `seekableWindow >= minLiveDVRWindow`.

## Live Edge

The live edge is a window from the starting edge of the live stream (`liveEdgeStart`) to the furthest
seekable part of the media (`seekableEnd`). The
[`media-ui-extensions` live edge proposal](https://github.com/video-dev/media-ui-extensions/blob/main/proposals/0007-live-edge.md)
covers the complexities involved in determining the live edge and why it can't be a single point
in time, but rather a window.

![Seekable window and live edge window inside of it]($lib/img/live-edge-start.png)

The method used to determine the starting edge of the live stream depends on the HLS playback
engine used:

- The HLS provider uses the
  [`liveSyncPosition`](https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlslivesyncposition)
  provided by `hls.js` to determine the live edge start. The starting edge is determined by a delay
  that's set by the
  [`liveSyncDurationCount`](https://github.com/video-dev/hls.js/blob/master/docs/API.md#livesyncdurationcount)
  configuration which represents a multiple of `EXT-X-TARGETDURATION` (default multiple is safely 3).

- The native playback engine on iOS Safari simply uses the furthest seekable part of the media
  (i.e., `seekableEnd`).

### Tolerance

The `liveEdgeTolerance` value is used to further apply a safety buffer to account for
buffering delays or accidental skips. The default value is 10, meaning the playback position can
be 10 seconds behind live edge start and still be considered at the edge. It can be configured
on the player like so:

{% code_snippet name="live-edge-tolerance" /%}

### Conditions

The player determines whether it's at the live edge by checking the following conditions:

1. If seeking is not permitted (i.e., `canSeek` is false) then we're always at the edge. This will
   be falsy if there's no DVR support, seekable length is infinity, or the seekable window is not
   equal to `minLiveDVRWindow`.
2. The user hasn't intentionally seeked behind the edge by more than 2 seconds.
3. The current playback time is greater than `liveEdgeStart` (minus the
   safety `liveEdgeTolerance`).

If the user naturally falls behind through buffering delays or by pausing, the player will consider
the user not to be at the edge and not catch them up automatically. The user can seek back to the
edge by scrubbing to the end of the time slider or pressing the live indicator.

You can also programmatically seek to the edge by calling the `seekToLiveEdge` method on
the player like so:

{% code_snippet name="seek-edge" highlight="react:9" /%}

👉 The [MediaRemoteControl](/docs/react/player/core-concepts/state-management#updating) also provides a
`seekToLiveEdge` method!

## Media State

{% callout type="info" %}
📖 See the [state management guide](/docs/player/core-concepts/state-management#reading) for how
to read media state.
{% /callout %}

The following media state can be used during live streams:

- `streamType`: Indicates the [type of live stream](#stream-type). This can be provided by you or
  inferred by the player.
- `live`: Whether the current stream is live.
- `liveEdge`: Whether the current stream is inside the live edge window (including the live
  edge tolerance buffer).
- `liveEdgeTolerance`: The number of seconds that the current time can be behind the live edge
  start and still be considered at the edge.
- `liveEdgeWindow`: The length of the live edge window in seconds starting from start of the live
  edge and ending at seekable end. If the duration of the stream is infinity or the stream is
  non-live then this value will default to 0.
- `minLiveDVRWindow`: The minimum seekable length in seconds before media seeking operations are
  permitted on live DVR streams. The default value is 30.
- `canSeek`: Whether seeking is permitted for the live stream. This value will be false if there
  is no DVR support, or the seekable window is smaller than the minimum live DVR window.
- `seekableStart`: The earliest time in seconds at which media can be seeked to. Generally,
  this is zero, but for live streams it may start at a non-zero value. This value can be infinity.
- `seekableEnd`: The furthest time in seconds at which media can be seeked to. This will default to
  infinity if no seekable range is found.
- `seekableWindow`: The length of the seekable part of the media in seconds starting at seekable
  start and ending at seekable end. This value can be infinity.
- `userBehindLiveEdge`: Whether the user has intentionally seeked behind the live edge. The user
  must've seeked 2 or more seconds behind during a live stream for this to be considered
  true.

## User Interface

The following components will adapt to a live stream:

- `$tag:media-time`: Displays the text "LIVE" if the live stream is not seekable.
- `$tag:media-time-slider`: Disabled if seeking operations are not permitted for the live stream.
  When disabled, it can not be interacted with, no pointer/drag events will be fired, and the
  thumb will pinned to the right edge.
- `$tag:media-slider-value`: Displays a negative offset from the current live time when used
  inside the time slider. The text "LIVE" will be displayed if the stream is not seekable.

## Styling

The following media data attributes are available for styling based on the current live state:

```css
/* stream is live. */
media-player[data-live] {
}

/* stream is at the live edge. */
media-player[data-live-edge] {
}

/* stream is at the live edge and playing. */
media-player[data-live-edge][data-playing] {
}

/* seeking is permitted for live DVR stream. */
media-player[data-live][data-can-seek] {
}
```

## Events

The following events are available for detecting live state changes:

{% code_snippet name="live-events" /%}
