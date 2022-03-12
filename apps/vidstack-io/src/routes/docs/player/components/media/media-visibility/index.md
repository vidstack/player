<script>
import Docs from './_Docs.md';
</script>

<Docs>

<!--
	------------------------------------------------------------------------------
	Viewport Visibility
	------------------------------------------------------------------------------
-->

```html:copy:slot=usage
<vds-media-visibility>
	<!-- Does not have to be a direct child -->
	<vds-video-player>
		<!-- .... -->
	</vds-video-player>
</vds-media-visibility>
```

```html:copy:slot=usage-multiple
<vds-media-visibility>
	<vds-video-player />
</vds-media-visibility>

<vds-media-visibility>
	<vds-video-player />
</vds-media-visibility>
```

```html:copy:slot=viewport-actions
<vds-media-visibility
	enter-viewport="play"
	exit-viewport="pause"
	intersection-threshold="1"
	viewport-enter-delay="0"
/>
```

```js:copy-highlight:slot=viewport-visibility-change{3-8}
const element = document.querySelector('vds-media-visibility');

element.addEventListener('vds-media-visibility-change', (event) => {
	const { viewport } = event.detail;
	if (viewport.isIntersecting) {
		// ...
	}
});
```

<!--
	------------------------------------------------------------------------------
	Page Visibility
	------------------------------------------------------------------------------
-->

```html:copy:slot=page-actions
<vds-media-visibility
	enter-page="play"
	exit-page="pause"
	page-enter-delay="0"
	page-change-type="state"
/>
```

```js:copy-highlight:slot=page-visibility-change{3-11}
const element = document.querySelector('vds-media-visibility');

element.addEventListener('vds-media-visibility-change', (event) => {
	const { page } = event.detail;
	// state can be: 'active' | 'passive' | 'hidden'
	// visibility can be: 'visible' | 'hidden'
	const { state, visibility } = page;
	if (state === 'hidden') {
		// ...
	}
});
```

</Docs>
