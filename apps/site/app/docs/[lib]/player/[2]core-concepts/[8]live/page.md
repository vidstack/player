---
title: Live Streams
description: Introduction to live streams with Vidstack Player.
---

# {% $frontmatter.title %}

Live streams are currently supported via the [HLS provider](/docs/player/providers/hls)
which uses [`hls.js`](https://github.com/video-dev/hls.js/), and in
[browsers that natively support HLS](https://caniuse.com/http-live-streaming). The player
will prefer using `hls.js` over the native engine when supported to enable a consistent and
configurable experience across vendors.

## User Interface

The following components will adapt to a live stream:

- `$tag:media-time`: Displays the text "LIVE" if the live stream is not seekable.
- `$tag:media-time-slider`: Disabled if seeking operations are not permitted for the live stream.
  When disabled, it can not be interacted with, no pointer/drag events will be fired, the thumb will
  pinned to the right edge, and the background color will be set to red.
- `$tag:media-slider-value-text`: Displays a negative offset from the current live time when used
  inside the time slider. The text "LIVE" will be displayed if the stream is not seekable.

## Media State

📖 See the [state management guide](/docs/player/core-concepts/state-management#reading) for how
to read media state.

The following media state can be useful during a live stream:

- `live`: Whether the current stream is live.
- `liveEdge`: Whether the current stream is at the live edge (i.e., at the furthest seekable part
  of the media).
- `liveTolerance`: The number of seconds that the current time can be behind duration and still be
  considered live. The default value is 15, meaning the user can be up to 15 seconds behind
  the live time and still be considered live. This value can be configured on the player.
- `liveWindow`: The total length of the live stream starting at the first seekable time up to the
  current live time. If the stream is not seekable or the stream is non-live then
  this value will default to 0.
- `canSeek`: Whether seeking is permitted for the live stream. This value will be false if the
  duration on the native media element returns infinity.
- `duration`: The current live time - synced to the edge.
- `seekableStart`: Contains the earliest time in seconds at which media can be seeked to. Generally,
  this is zero, but for live streams it may start at a non-zero value. This value can be infinity.
- `seekableEnd`: The latest time in seconds at which media can be seeked to. This will default to
  infinity if no seekable range is found.
- `userBehindLiveEdge`: Whether the user has intentionally seeked behind the live edge. The user
  must've seeked roughly 2 or more seconds behind during a live stream for this to be considered
  true.

## Live Edge

The live edge is the furthest seekable part of the media that represents the current live time
of the stream.

The player determines whether it's at the live edge by checking the following conditions:

1. If seeking is not permitted (i.e., `canSeek` is false) then we're always at the edge.
2. The user hasn't intentionally seeked behind the edge by more than 2 seconds.
3. The current playback time is within the live tolerance (default 15s) of the current live
   time.

As long as the mentioned conditions above are true, the player will seek back to the live edge
on subsequent plays. If the user naturally falls behind through buffering delays or by
pausing, the player will consider the user not to be at the edge and not catch them up
automatically. The user can seek back to the edge by scrubbing to the end of the time slider.

You can also programmatically seek to the edge by calling the `seekToLiveEdge` method on
the player like so:

{% code_snippet name="seek-edge" highlight="react:9" /%}

👉 The [MediaRemoteControl](/docs/react/player/core-concepts/state-management#updating) also provides a
`seekToLiveEdge` method!

## Styling

The following media attributes are available for styling based on the current live state:

```css
media-player[live] {
  /* stream is live. */
}

media-player[live-edge] {
  /* stream is at the live edge. */
}

media-player[live][can-seek] {
  /* seeking is permitted for live stream. */
}
```

## Events

The following events are available for detecting live state changes:

{% code_snippet name="live-events" /%}
