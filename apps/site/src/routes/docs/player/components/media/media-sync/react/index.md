<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy:slot=usage
<MediaSync>
	{/* Does not have to be a direct child. */}
	<VideoPlayer>
		{/* .... */}
	</VideoPlayer>
</MediaSync>
```

```jsx:copy:slot=usage-multiple
<MediaSync>
	<VideoPlayer />
</MediaSync>

<MediaSync>
	<VideoPlayer />
</MediaSync>
```

```jsx:copy:slot=sync-playback
<MediaSync singlePlayback>
  {/* ... */}
</MediaSync>
```

```jsx:copy:slot=sync-volume
<MediaSync sharedVolume>
  {/* ... */}
</MediaSync>
```

```jsx:slot=volume-storage
<MediaSync sharedVolume volumeStorageKey="my-storage-key">
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
