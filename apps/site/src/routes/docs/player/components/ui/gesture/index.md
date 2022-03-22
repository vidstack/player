<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy-highlight:slot=usage{3-8}
<vds-video-player>
	<vds-media-ui>
		<vds-gesture
			type="click"
			repeat="0"
			action="toggle:paused"
			priority="1"
		></vds-gesture>
	</vds-media-ui>
</vds-video-player>
```

```html:slot=repeat
<!-- Single click. -->
<vds-gesture type="click" repeat="0" />
<!-- Double click. -->
<vds-gesture type="click" repeat="1" />
```

```html:slot=priority
<!-- Lower priority. -->
<vds-gesture type="click" priority="1" action="toggle:paused" />
<!-- Higher priority. -->
<vds-gesture type="click" repeat="1" priority="0" action="seek:30" />
```

```html:copy:slot=styling
<vds-gesture
	type="mouseleave"
	action="pause"
></vds-gesture>
<vds-gesture
	type="click"
	action="toggle:paused"
></vds-gesture>
<vds-gesture
	type="click"
	repeat="1"
	priority="1"
	action="toggle:fullscreen"
></vds-gesture>
<vds-gesture
	class="seek-gesture left"
	type="click"
	repeat="1"
	priority="0"
	action="seek:-30"
></vds-gesture>
<vds-gesture
	class="seek-gesture right"
	type="click"
	repeat="1"
	priority="0"
	action="seek:30"
></vds-gesture>
```

</Docs>
