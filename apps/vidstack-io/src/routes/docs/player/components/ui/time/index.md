<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight:slot=usage{3}
<vds-video-player>
	<vds-media-ui>
		<vds-time type="current"></vds-time>
	</vds-media-ui>
</vds-video-player>
```

```html:copy:slot=remaining-time
<!-- Displays the amount of time remaining until playback ends. -->
<vds-time type="current" remainder></vds-time>
```

</Docs>
