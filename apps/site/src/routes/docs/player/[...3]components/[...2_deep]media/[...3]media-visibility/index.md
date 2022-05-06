<script>
import Docs from './_Docs.md';
</script>

<Docs>

<!--
	------------------------------------------------------------------------------
	Viewport Visibility
	------------------------------------------------------------------------------
-->

```html copy|slot=usage
<vds-media-visibility>
  <!-- Does not have to be a direct child. -->
  <vds-video>
    <!-- .... -->
  </vds-video>
</vds-media-visibility>
```

```html copy|slot=viewport-actions
<vds-media-visibility
  enter-viewport="play"
  exit-viewport="pause"
  intersection-threshold="1"
  viewport-enter-delay="0"
/>
```

```js copyHighlight|slot=viewport-visibility-change{3-8}
const mediaVisibility = document.querySelector('vds-media-visibility');

mediaVisibility.addEventListener('vds-media-visibility-change', (event) => {
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

```html copy|slot=page-actions
<vds-media-visibility
  enter-page="play"
  exit-page="pause"
  page-enter-delay="0"
  page-change-type="state"
/>
```

```js copyHighlight|slot=page-visibility-change{3-11}
const mediaVisibility = document.querySelector('vds-media-visibility');

mediaVisibility.addEventListener('vds-media-visibility-change', (event) => {
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
