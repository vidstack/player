<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy-highlight{6-8}:slot=usage
<VideoPlayer
	poster="https://media-files.vidstack.io/poster.png"
	loading="lazy"
>
	<MediaUi>
		<Poster
			alt="Large alien ship hovering over New York."
		/>
	</MediaUi>
</VideoPlayer>
```

```jsx:slot=loading-strategy
<Poster loading="lazy" />
```

```jsx:slot=double-loading-strategy
<VideoPlayer loading="lazy">
	<MediaUi>
		<Poster loading="lazy" />
	</MediaUi>
</VideoPlayer>
```

```jsx:copy-highlight{6-19}:slot=styling
<VideoPlayer
	poster="https://media-files.vidstack.io/poster.png"
	loading="lazy"
>
	<MediaUi>
		<Poster
			alt="Large alien ship hovering over New York."
		/>

		<div className="big-play-button-container">
			<PlayButton className="big-play-button">
				<svg className="play-icon" ariaHidden="true" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
					/>
				</svg>
			</PlayButton>
		</div>
	</MediaUi>
</VideoPlayer>
```

</Docs>
