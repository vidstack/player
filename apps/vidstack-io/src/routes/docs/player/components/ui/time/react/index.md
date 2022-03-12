<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy-highlight:slot=usage{3}
<VideoPlayer>
	<MediaUi>
		<Time type="current" />
	</MediaUi>
</VideoPlayer>
```

```jsx:copy:slot=remaining-time
{/* Displays the amount of time remaining until playback ends. */}
<Time type="current" remainder />
```

</Docs>
