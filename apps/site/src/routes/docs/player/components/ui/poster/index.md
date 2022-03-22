<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight{6-8}:slot=usage
<vds-video-player
	poster="https://media-files.vidstack.io/poster.png"
	loading="lazy"
>
	<vds-media-ui>
		<vds-poster
			alt="Large alien ship hovering over New York."
		></vds-poster>
	</vds-media-ui>
</vds-video-player>
```

```html:slot=loading-strategy
<vds-poster loading="lazy" />
```

```html:slot=double-loading-strategy
<vds-video-player loading="lazy">
	<vds-media-ui>
		<vds-poster loading="lazy"></vds-poster>
	</vds-media-ui>
</vds-video-player>
```

```html:copy-highlight{6-19}:slot=styling
<vds-video-player
	poster="https://media-files.vidstack.io/poster.png"
	loading="lazy"
>
	<vds-media-ui>
		<vds-poster
			alt="Large alien ship hovering over New York."
		></vds-poster>

		<div class="big-play-button-container">
			<vds-play-button class="big-play-button">
				<svg class="play-icon" aria-hidden="true" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
					/>
				</svg>
			</vds-play-button>
		</div>
	</vds-media-ui>
</vds-video-player>
```

</Docs>
