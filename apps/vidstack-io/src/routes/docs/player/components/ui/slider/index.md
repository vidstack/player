<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy:slot=usage
<vds-slider min="0" max="100" value="50" step="1">
  <!--- ... -->
</vds-slider>
```

```html:copy:slot=example
<vds-slider>
	<div class="slider-track"></div>
	<div class="slider-track fill"></div>
	<div class="slider-thumb-container">
		<div class="slider-thumb"></div>
	</div>
</vds-slider>
```

```html:slot=tw-variants
<div class="pointing:bg-indigio-300 dragging:bg-indigo-500" />
```

```html:slot=tw-variables
<div class="left-[var(--vds-slider-fill-percent)]" />
```

```html:slot=tw-example
<vds-slider class="relative h-6 w-full bg-gray-200">
	<!-- Slider Thumb. -->
	<div
		class="
			position interactive:left-[var(--vds-slider-pointer-percent)]
			absolute top-0 left-[var(--vds-slider-fill-percent)]
			h-4 w-4 -translate-x-1/2 transform bg-gray-400
			will-change-[left]
		"
	></div>
</vds-slider>
```

</Docs>
