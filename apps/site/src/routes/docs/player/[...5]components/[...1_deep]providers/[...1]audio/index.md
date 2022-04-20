<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copy|slot="usage"
<vds-audio>
  <audio controls preload="none" src="https://media-files.vidstack.io/audio.mp3"></audio>
</vds-audio>
```

```html copy|slot=multiple-sources
<vds-audio>
  <audio controls preload="none">
    <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mpeg" />
    <source src="https://media-files.vidstack.io/audio.ogg" type="audio/ogg" />
    Your browser doesn't support the HTML5 <code>audio</code> tag.
  </audio>
</vds-audio>
```

</Docs>
