<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy:slot=usage
<Slider min="0" max="100" value="50" step="1">
	{/* ... */}
</Slider>
```

```jsx:copy:slot=example
<Slider>
	<div className="slider-track" />
	<div className="slider-track fill" />
	<div className="slider-thumb-container">
		<div className="slider-thumb" />
	</div>
</Slider>
```

```jsx:slot=tw-variants
<div className="pointing:bg-indigo-300 dragging:bg-indigo-500" />
```

```jsx:slot=tw-variables
<div className="left-[var(--vds-slider-fill-percent)]" />
```

```jsx:slot=tw-example
<Slider className="relative h-6 w-full bg-gray-200">
	{/* Slider Thumb. */}
	<div
		className="
			position interactive:left-[var(--vds-slider-pointer-percent)]
			absolute top-0 left-[var(--vds-slider-fill-percent)]
			h-4 w-4 -translate-x-1/2 transform bg-gray-400
			will-change-[left]
		"
	/>
</Slider>
```

</Docs>
