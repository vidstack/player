<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy-highlight:slot=usage{2}
<Slider>
	<SliderValueText type="current" />
</Slider>
```

```jsx:copy-highlight:slot=time-slider{2}
<TimeSlider>
	<SliderValueText type="pointer" format="time" />
</TimeSlider>
```

```jsx:copy-highlight:slot=volume-slider{2-5}
<VolumeSlider>
	<SliderValueText
		type="current"
		format="percentage"
	/>
</VolumeSlider>
```

```jsx:copy-highlight:slot=styling{3}
<Slider>
	{/* ... */}
	<SliderValueText type="pointer" />
</Slider>
```

</Docs>
