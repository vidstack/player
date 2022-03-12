<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy:slot=usage
<Audio
	controls
	loading="lazy"
	src="https://media-files.vidstack.io/audio.mp3"
/>
```

```jsx:copy:slot=player
<AudioPlayer
	loading="lazy"
	src="https://media-files.vidstack.io/audio.mp3"
>
	<MediaUi slot="ui">
		<!-- ... -->
	</MediaUi>
</AudioPlayer>
```

```jsx:copy:slot=multiple-sources
<Audio controls>
	<source src="https://media-files.vidstack.io/audio.mp3" type="audio/mpeg" />
	<source src="https://media-files.vidstack.io/audio.ogg" type="audio/ogg" />
	Your browser doesn't support the HTML5 <code>audio</code> tag.
</Audio>
```

</Docs>
