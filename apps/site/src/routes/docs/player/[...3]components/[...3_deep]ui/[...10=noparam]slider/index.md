<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copy|slot=usage
<vds-slider min="0" max="100" value="50" step="1">
  <!--- ... -->
</vds-slider>
```

```html|slot=tw-variants
<div class="pointing:bg-indigo-300 dragging:bg-indigo-500" />
```

```html|slot=tw-variables
<div class="left-[var(--vds-fill-percent)]" />
```

```html|slot=tw-example
<vds-slider class="relative h-6 w-full bg-gray-200">
	<!-- Slider Thumb. -->
	<div
		class="
			position interactive:left-[var(--vds-pointer-percent)]
			absolute top-0 left-[var(--vds-fill-percent)]
			h-4 w-4 -translate-x-1/2 transform bg-gray-400
			will-change-[left]
		"
	></div>
</vds-slider>
```

</Docs>
