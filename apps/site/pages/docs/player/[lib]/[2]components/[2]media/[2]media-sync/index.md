---
description: This component is used to keep media states such as playback and volume in sync between multiple players.
---

## Usage

The `$tag:vds-media-sync` component manages playback and volume of multiple provider elements by
ensuring they're in sync (i.e., same state).

{% code_snippet name="usage" copyHighlight=true highlight="html:2,7|react:6,9" /%}

Each provider must be a descendant of `$tag:vds-media-sync`, so they can register with the
component and be managed together:

{% code_snippet name="usage-multiple" /%}

### Single Playback

The `singlePlayback` property will ensure that only one media provider is
playing at any given moment. All providers that are registered with `$tag:vds-media-sync` and playing
will be paused if a new provider begins to play:

{% code_preview name="single-playback" size="xlarge" copyHighlight=true highlight="react:6" /%}

### Sync Volume

The `syncVolume` property will synchronize the `muted` and `volume` state between all providers
that are registered with `$tag:vds-media-sync`:

{% code_preview name="sync-volume" size="xlarge" copyHighlight=true highlight="react:6" /%}

You can save the volume level to local storage, so it persists across page refreshes by using the
`volumeStorageKey` property and giving it a storage key name like so:

{% code_snippet name="volume-storage" copy=true copyHighlight=true highlight="react:6-8" /%}

Finally, a `$event:vds-media-volume-sync` event will be fired as the volume is synchronized.

{% code_snippet name="volume-sync-event" /%}
