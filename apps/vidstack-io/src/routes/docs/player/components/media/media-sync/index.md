<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy:slot=usage
<vds-media-sync>
	<!-- Does not have to be a direct child. -->
	<vds-video-player>
		<!-- .... -->
	</vds-video-player>
</vds-media-sync>
```

```html:copy:slot=usage-multiple
<vds-media-sync>
	<vds-video-player />
</vds-media-sync>

<vds-media-sync>
	<vds-video-player />
</vds-media-sync>
```

```html:copy:slot=sync-playback
<vds-media-sync single-playback />
```

```html:copy:slot=sync-volume
<vds-media-sync shared-volume />
```

```html:slot=volume-storage
<vds-media-sync shared-volume volume-storage-key="my-storage-key" />
```

```js:copy-highlight:slot=volume-sync-event{3-6}
const element = document.querySelector('vds-media-sync');

element.addEventListener('vds-media-volume-sync', (event) => {
	const { muted, volume } = event.detail;
	// ...
});
```

</Docs>
