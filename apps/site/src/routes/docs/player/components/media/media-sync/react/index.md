<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy:slot=usage
<MediaSync>
  {/* Does not have to be a direct child. */}
  <Video>
    {/* ... */}
  </Video>
</MediaSync>
```

```jsx:slot=usage-multiple
<Media>
  <MediaSync>
    <Video></Video>
  </MediaSync>
</Media>

<Media>
  <MediaSync>
    <Video></Video>
  </MediaSync>
</Media>
```

```jsx:copy:slot=sync-playback
<MediaSync singlePlayback>
  {/* ... */}
</MediaSync>
```

```jsx:copy:slot=sync-volume
<MediaSync syncVolume>
  {/* ... */}
</MediaSync>
```

```jsx:slot=volume-storage
<MediaSync syncVolume volumeStorageKey="my-storage-key">
  {/* ... */}
</MediaSync>
```

```js:copy-highlight:slot=volume-sync-event{2-6}
<MediaSync
	onMediaVolumeSync={(event) => {
	  const { muted, volume } = event.detail;
	  // ...

	}}
/>
```

</Docs>
