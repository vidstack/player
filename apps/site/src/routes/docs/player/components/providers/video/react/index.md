<script>
import Docs from '../_Docs.md'
</script>

<Docs>

```jsx:copy:slot=usage
<Video
	controls
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/720p.mp4"
	poster="https://media-files.vidstack.io/poster.png"
/>
```

```jsx:copy:slot=player
<VideoPlayer
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/720p.mp4"
	poster="https://media-files.vidstack.io/poster.png"
>
	<MediaUi slot="ui">
		<!-- ... -->
	</MediaUi>
</VideoPlayer>
```

```jsx:copy:slot=multiple-sources
<Video
	controls
	width="1280"
	height="720"
	poster="https://media-files.vidstack.io/poster.png"
>
	<source src="https://media-files.vidstack.io/720p.ogv" type="video/ogg" />
	<source src="https://media-files.vidstack.io/720p.avi" type="video/avi" />
	<source src="https://media-files.vidstack.io/720p.mp4" type="video/mp4" />
	Your browser doesn't support the HTML5 <code>video</code> tag.
</Video>
```

</Docs>
