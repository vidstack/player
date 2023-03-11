---
title: Audio Tracks
description: Configuring audio tracks with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how audio tracks can be tracked and configured with Vidstack
Player.

{% callout type="info" %}
Audio tracks are currently only supported by the [HLS Provider](/docs/react/player/providers/hls).
{% /callout %}

## Tracks List

The read-only `audioTracks` property on the player returns a `AudioTrackList` object that contains
`AudioTrack` objects

Similar to text tracks, the returned list is live; that is, as tracks are added
to and removed from the player, the list's contents change dynamically. Once you have a reference
to the list, you can monitor it for changes to detect when new tracks are added or existing
ones are removed by [listening to list events](#events).

```ts
const player = document.querySelector('media-player');

// Length
const hasItems = player.audioTracks.length;

// Iterating
for (const track of player.audioTracks) {
}

// Map to array
player.audioTracks.toArray();
```

The `AudioTrack` interface contains the following shape:

```ts
interface AudioTrack {
  /**
   * A string which uniquely identifies the track within the media.
   */
  id: string;
  /**
   * A human-readable label for the track, or an empty string if unknown.
   */
  label: string;
  /**
   * A string specifying the audio track's primary language, or an empty string if unknown. The
   * language is specified as a BCP 47 (RFC 5646) language code, such as "en-US" or "pt-BR".
   */
  language: string;
  /**
   * A string specifying the category into which the track falls. For example, the main audio
   * track would have a kind of "main".
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioTrack/kind}
   */
  kind: string;
}
```

### Selecting

The `selected` property can be used to set the current audio track like so:

```ts
const firstTrack = player.audioTracks[0];
firstTrack.selected = true;

const secondTrack = player.audioTracks[1];
// this statement will set `firstTrack` to false.
secondTrack.selected = true;
```

Once set, the underlying provider will update the audio track.

### List Events

The `AudioTrackList` objects is an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
which dispatches the following events:

- `add`: Fired when an audio track has been added to the list.
- `remove`: Fired when an audio track has been removed from the list.
- `change`: Fired when the selected audio track changes.

```ts
player.audioTracks.addEventListener('add', (event) => {
  const newTrack = event.detail; // `AudioTrack`
  // ...
});

player.audioTracks.addEventListener('change', (event) => {
  const { prev, current } = event.detail; // Audio Tracks
  // ...
});
```

## Media Store

The following audio track related properties are available on the media store:

- `audioTracks`: An array containing the current list of `AudioTrack` objects.
- `audioTrack`: The current `AudioTrack` object or `null` if none is available.

{% code_snippet name="subscribe" highlight="react:8" /%}

## Media Remote

The `changeAudioTrack` method on the media remote can be used to dispatch requests to update
the current audio track like so:

{% code_snippet name="remote" /%}

## Media Events

The following audio track related events are available on the player:

- `audio-tracks-change`: Fired when the available list of audio tracks has changed.
- `audio-track-change`: Fired when the selected audio track has changed.

{% code_snippet name="events" /%}
