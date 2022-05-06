<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copyHighlight|slot=usage{2}
<vds-time-slider>
  <vds-slider-video src="https://media-files.vidstack.io/240p.mp4"></vds-slider-video>
</vds-time-slider>
```

```js|slot=video-events{2-4}
const sliderVideo = document.querySelector('vds-slider-video');
sliderVideo.addEventListener('canplay', (event) => {
	// ...
});
```

</Docs>
