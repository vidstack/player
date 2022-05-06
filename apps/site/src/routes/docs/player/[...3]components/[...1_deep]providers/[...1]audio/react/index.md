<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx copy|slot=usage
<Audio>
  <audio controls preload="none" src="https://media-files.vidstack.io/audio.mp3" />
</Audio>
```

```jsx copy|slot=multiple-sources
<Audio>
  <audio controls preload="none">
    <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mpeg" />
    <source src="https://media-files.vidstack.io/audio.ogg" type="audio/ogg" />
    Your browser doesn't support the HTML5 <code>audio</code> tag.
  </audio>
</Audio>
```

</Docs>
