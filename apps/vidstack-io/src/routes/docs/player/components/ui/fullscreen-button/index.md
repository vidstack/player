<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight{3-6}:slot=usage
<vds-video-player>
	<vds-media-ui>
		<vds-fullscreen-button>
		  <div class="enter-fs">Enter Fullscreen</div>
			<div class="exit-fs">Exit Fullscreen</div>
		</vds-fullscreen-button>
	</vds-media-ui>
</vds-video-player>
```

```html:copy:slot=styling
<vds-fullscreen-button>
	<svg class="enter-fs-icon" aria-hidden="true" viewBox="0 0 24 24">
		<path fill="currentColor" d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z" />
	</svg>
	<svg class="exit-fs-icon" aria-hidden="true" viewBox="0 0 24 24">
		<path fill="currentColor" d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z" />
	</svg>
</vds-fullscreen-button>
```

</Docs>
