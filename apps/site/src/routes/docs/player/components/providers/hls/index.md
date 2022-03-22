<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy:slot=usage
<vds-hls
	controls
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/hls/index.m3u8"
	poster="https://media-files.vidstack.io/poster.png"
></vds-hls>
```

```html:copy:slot=player
<vds-hls-player
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/hls/index.m3u8"
	poster="https://media-files.vidstack.io/poster.png"
>
	<vds-media-ui slot="ui">
		<!-- ... -->
	</vds-media-ui>
</vds-hls-player>
```

```html:slot=loading-hls
<!-- Default development URL. -->
<vds-hls
  hls-library="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.js"
/>
<!-- Default production URL. -->
<vds-hls
  hls-library="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.min.js"
/>
```

```js:slot=importing-hls{1,4}
import Hls from 'hls.js';

const element = document.querySelector('vds-hls');
element.hlsLibrary = Hls;
```

```js:slot=dynamically-import-hls{2}
const element = document.querySelector('vds-hls');
element.hlsLibrary = () => import('hls.js');
```

```js:slot=configuring-hls{2}
const element = document.querySelector('vds-hls');
element.hlsConfig = { lowLatencyMode: true };
```

```svelte:copy-highlight{2}
<vds-hls
  hls-config={{ lowLatencyMode: true }}
/>
```

```js:slot=hls-engine{2}
const element = document.querySelector('vds-hls');
const hlsjs = element.hlsEngine;
```

```js:slot=hls-engine-events{3-10}
const element = document.querySelector('vds-hls');

element.addEventListener('vds-hls-instance', (event) => {
	const hlsjs = event.detail;
	// ...
});

element.addEventListener('vds-hls-destroying', (event) => {
	// ...
});
```

```js:slot=hls-events{3-6}
const element = document.querySelector('vds-hls');

element.addEventListener('vds-hls-manifest-loaded', (event) => {
  const levelLoadedData = event.detail;
  // ...
});
```

</Docs>
