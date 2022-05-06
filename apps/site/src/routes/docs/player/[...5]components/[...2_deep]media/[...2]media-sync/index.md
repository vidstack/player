<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copy|slot=usage
<vds-media-sync>
  <!-- Does not have to be a direct child. -->
  <vds-video>
    <!-- .... -->
  </vds-video>
</vds-media-sync>
```

```html|slot=usage-multiple
<vds-media>
  <vds-media-sync>
    <vds-video></vds-video>
  </vds-media-sync>
</vds-media>

<vds-media>
  <vds-media-sync>
    <vds-video></vds-video>
  </vds-media-sync>
</vds-media>
```

```html copy|slot=single-playback
<vds-media-sync single-playback />
```

```html copy|slot=sync-volume
<vds-media-sync sync-volume />
```

```html|slot=volume-storage
<vds-media-sync sync-volume volume-storage-key="my-storage-key" />
```

```js copyHighlight|slot=volume-sync-event{3-6}
const mediaSync = document.querySelector('vds-media-sync');

mediaSync.addEventListener('vds-media-volume-sync', (event) => {
  const { muted, volume } = event.detail;
  // ...
});
```

</Docs>
