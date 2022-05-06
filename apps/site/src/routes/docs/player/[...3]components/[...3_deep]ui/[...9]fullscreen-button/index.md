<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copy|slot=usage
<vds-fullscreen-button>
  <div class="media-enter-fs">Enter Fullscreen</div>
  <div class="media-exit-fs">Exit Fullscreen</div>
</vds-fullscreen-button>
```

```html copyHighlight{2}|slot=fullscreen-target
<vds-fullscreen-button fullscreen-target="provider" />
```

</Docs>
