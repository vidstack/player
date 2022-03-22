---
title: Buffering Indicator Docs
---

<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight:slot=styling{3-30}
<vds-video-player>
	<vds-media-ui>
		<div
			class="buffering-container"
		>
			<svg
				class="buffering-icon"
				fill="none"
				viewBox="0 0 120 120"
				aria-hidden="true"
			>
				<circle
					class="buffering-track"
					cx="60"
					cy="60"
					r="54"
					stroke="currentColor"
					stroke-width="8"
				></circle>
				<circle
					class="buffering-track-fill"
					cx="60"
					cy="60"
					r="54"
					stroke="currentColor"
					stroke-width="10"
					pathLength="100"
				></circle>
			</svg>
		</div>
	</vds-media-ui>
</vds-video-player>
```

</Docs>
