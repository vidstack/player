<script>
import Docs from '../_Docs.md'
</script>

<Docs>

```jsx:copy:slot=usage
<Hls
	controls
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/hls/index.m3u8"
	poster="https://media-files.vidstack.io/poster.png"
/>
```

```jsx:copy:slot=player
<HlsPlayer
	width="1280"
	height="720"
	loading="lazy"
	src="https://media-files.vidstack.io/hls/index.m3u8"
	poster="https://media-files.vidstack.io/poster.png"
>
	<MediaUi slot="ui">
		<!-- ... -->
	</MediaUi>
</HlsPlayer>
```

```jsx:slot=loading-hls
{/* Default development URL. */}
<Hls
  hlsLibrary="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.js"
/>
{/* Default production URL. */}
<Hls
  hlsLibrary="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.min.js"
/>
```

```jsx:copy-highlight:slot=importing-hls{4}
import Hls from 'hls.js';

<Hls
	hlsLibrary={Hls}
/>
```

```jsx:copy-highlight:slot=dynamically-import-hls{2}
<Hls
  hlsLibrary={() => import('hls.js')}
/>
```

```jsx:copy-highlight:slot=configuring-hls{2}
<Hls
	hlsConfig={{ lowLatencyMode: true }}
/>
```

```js:slot=hls-engine
const hlsjs = hlsProviderRef.hlsEngine;
```

```jsx:copy-highlight:slot=hls-engine-events{13-14}
function Example() {
	function onHlsInstance(event) {
		const hlsjs = event.detail;
		// ...
	}

	function onHlsDestroy() {
		// ...
	}

	return (
		<Hls
			onHlsInstance={onHlsInstance}
			onHlsDestroying={onHlsDestroy}
		/>
	)
}
```

```jsx:copy-highlight:slot=hls-events{2}
<Hls
	onHlsManifestLoaded={onManifestLoaded}
/>
```

</Docs>
