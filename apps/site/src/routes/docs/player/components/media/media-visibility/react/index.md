<script>
import Docs from '../_Docs.md';
</script>

<Docs>

<!--
	------------------------------------------------------------------------------
	Viewport Visibility
	------------------------------------------------------------------------------
-->

```jsx:copy:slot=usage
<MediaVisibility>
	<!-- Does not have to be a direct child -->
	<VideoPlayer>
		<!-- .... -->
	</VideoPlayer>
</MediaVisibility>
```

```jsx:copy:slot=usage-multiple
<MediaVisibility>
	<VideoPlayer />
</MediaVisibility>

<MediaVisibility>
	<VideoPlayer />
</MediaVisibility>
```

```jsx:copy:slot=viewport-actions
<MediaVisibility
	enterViewport="play"
	exitViewport="pause"
	intersectionThreshold="1"
	viewportEnterDelay="0"
/>
```

```jsx:copy-highlight:slot=viewport-visibility-change{2-7}
<MediaVisibility
	onMediaVisibilityChange={(event) => {
		const { viewport } = event.detail;
		if (viewport.isIntersecting) {
			// ...
		}
	}}
/>
```

<!--
	------------------------------------------------------------------------------
	Page Visibility
	------------------------------------------------------------------------------
-->

```jsx:copy:slot=page-actions
<MediaVisibility
	enterPage="play"
	exitPage="pause"
	pageEnterDelay="0"
	pageChangeType="state"
/>
```

```jsx:copy-highlight:slot=page-visibility-change{2-10}
<MediaVisibility
	onMediaVisibilityChange={(event) => {
		const { page } = event.detail;
		// state can be: 'active' | 'passive' | 'hidden'
		// visibility can be: 'visible' | 'hidden'
		const { state, visibility } = page;
		if (state === 'hidden') {
			// ...
		}
	}}
/>
```

</Docs>
