<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx copyHighlight|slot=usage{2}
<Slider>
  <SliderValueText type="current" />
</Slider>
```

```jsx copyHighlight|slot=time-slider{2}
<TimeSlider>
  <SliderValueText type="pointer" format="time" />
</TimeSlider>
```

```jsx copyHighlight|slot=volume-slider{2}
<VolumeSlider>
  <SliderValueText type="current" format="percentage" />
</VolumeSlider>
```

</Docs>
