<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy-highlight{3-6}:slot=usage
<VideoPlayer>
	<MediaUi>
		<MuteButton>
			<div className="mute">Mute</div>
			<div className="unmute">Unmute</div>
		</MuteButton>
	</MediaUi>
</VideoPlayer>
```

```jsx:copy:slot=styling
<MuteButton>
	<svg className="mute-icon" ariaHidden="true" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536l-1.414 1.414L19 13.414l-3.536 3.536l-1.414-1.414L17.586 12L14.05 8.464l1.414-1.414L19 10.586l3.536-3.536l1.414 1.414L20.414 12z"
		/>
	</svg>
	<svg className="unmute-icon" ariaHidden="true" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z"
		/>
	</svg>
</MuteButton>
```

</Docs>
