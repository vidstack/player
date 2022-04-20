<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx copyHighlight|slot=usage{2}
<TimeSlider>
  <SliderVideo src="https://media-files.vidstack.io/240p.mp4" />
</TimeSlider>
```

```jsx|slot=video-events{2-3}
<SliderVideo
	onCanplay={onCanplay}
	onError={onError}
/>
```

```jsx copyHighlight|slot=styling{3}
<TimeSlider>
  {/* ... */}
  <SliderVideo src="https://media-files.vidstack.io/240p.mp4" />
</TimeSlider>
```

</Docs>
