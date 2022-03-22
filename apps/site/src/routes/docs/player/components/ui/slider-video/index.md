<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight:slot=usage{2-4}
<vds-time-slider>
	<vds-slider-video
		src="https://media-files.vidstack.io/240p.mp4"
	></vds-slider-video>
</vds-time-slider>
```

```js:slot=video-events{2-4}
const element = document.querySelector('vds-slider-video');
element.addEventListener('canplay', (event) => {
	// ...
});
```

```html:copy-highlight:slot=styling{3-5}
<vds-time-slider>
	<!-- ... -->
	<vds-slider-video
		src="https://media-files.vidstack.io/240p.mp4"
	></vds-slider-video>
</vds-time-slider>
```

</Docs>
