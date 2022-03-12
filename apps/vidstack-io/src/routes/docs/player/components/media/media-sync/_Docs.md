## Usage

The `<vds-media-sync>` component manages playback and volume of multiple provider elements by
ensuring they're in sync (i.e., same state).

<slot name="usage" />

Each provider must be a child of `<vds-media-sync>`, so they can register with the component and
be managed together:

<slot name="usage-multiple" />

### Sync Playback

The `single-playback` <AttrWord /> will ensure that only one media provider is
playing at any given moment. All providers that are registered with `<vds-media-sync>` and playing
will be paused if a new provider begins to play:

<slot name="sync-playback" />

### Sync Volume

The `shared-volume` <AttrWord /> will synchronize the `muted` and `volume`
state between all providers that are registered with `<vds-media-sync>`:

<slot name="sync-volume" />

You can save the volume level to local storage, so it persists across page refreshes by using the
`volume-storage-key` <AttrWord /> and giving it a storage key name like so:

<slot name="volume-storage" />

Finally, a `vds-media-volume-sync` event will be fired as the volume is synchronized.

<slot name="volume-sync-event" />
