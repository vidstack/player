<script>
import Docs from './_Docs.md'
</script>

<Docs>

```html:copy:slot=usage
<vds-video
	controls
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/720p.mp4"
	poster="https://media-files.vidstack.io/poster.png"
>
	Your browser doesn't support the HTML5 <code>video</code> tag.
</vds-video>
```

```html:copy:slot=player
<vds-video-player
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/720p.mp4"
	poster="https://media-files.vidstack.io/poster.png"
>
	<vds-media-ui slot="ui">
		<!-- ... -->
	</vds-media-ui>
</vds-video-player>
```

```html:copy:slot=multiple-sources
<vds-video
	controls
	width="1280"
	height="720"
	poster="https://media-files.vidstack.io/poster.png"
>
	<source src="https://media-files.vidstack.io/720p.ogv" type="video/ogg" />
	<source src="https://media-files.vidstack.io/720p.avi" type="video/avi" />
	<source src="https://media-files.vidstack.io/720p.mp4" type="video/mp4" />
	Your browser doesn't support the HTML5 <code>video</code> tag.
</vds-video>
```

</Docs>
