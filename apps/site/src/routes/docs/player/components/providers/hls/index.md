<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html:copy:slot=usage
<vds-hls poster="https://media-files.vidstack.io/poster.png">
  <video
	  controls
    preload="none"
  	src="https://media-files.vidstack.io/hls/index.m3u8"
	  poster="https://media-files.vidstack.io/poster-seo.png"
  ></video>
</vds-hls>
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

const provider = document.querySelector('vds-hls');
provider.hlsLibrary = Hls;
```

```js:slot=dynamically-import-hls{2}
const provider = document.querySelector('vds-hls');
provider.hlsLibrary = () => import('hls.js');
```

```js:slot=configuring-hls{2}
const provider = document.querySelector('vds-hls');
provider.hlsConfig = { lowLatencyMode: true };
```

```svelte:copy-highlight{2}
<vds-hls
  hls-config={{ lowLatencyMode: true }}
/>
```

```js:slot=hls-engine{2}
const provider = document.querySelector('vds-hls');
const hlsjs = provider.hlsEngine;
```

```js:slot=hls-engine-events{3-10}
const provider = document.querySelector('vds-hls');

provider.addEventListener('vds-hls-instance', (event) => {
	const hlsjs = event.detail;
	// ...
});

provider.addEventListener('vds-hls-destroying', (event) => {
	// ...
});
```

```js:slot=hls-events{3-6}
const provider = document.querySelector('vds-hls');

provider.addEventListener('vds-hls-manifest-loaded', (event) => {
  const levelLoadedData = event.detail;
  // ...
});
```

</Docs>
