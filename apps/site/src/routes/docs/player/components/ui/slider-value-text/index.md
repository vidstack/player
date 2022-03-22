<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight:slot=usage{2}
<vds-slider>
	<vds-slider-value-text type="current"></vds-slider-value-text>
</vds-slider>
```

```html:copy-highlight:slot=time-slider{2}
<vds-time-slider>
	<vds-slider-value-text type="pointer" format="time"></vds-slider-value-text>
</vds-time-slider>
```

```html:copy-highlight:slot=volume-slider{2-5}
<vds-volume-slider>
	<vds-slider-value-text
		type="current"
		format="percentage"
	></vds-slider-value-text>
</vds-volume-slider>
```

```html:copy-highlight:slot=styling{3}
<vds-slider>
	<!-- ... -->
	<vds-slider-value-text type="pointer"></vds-slider-value-text>
</vds-slider>
```

</Docs>
