<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx copy|slot=usage
<FullscreenButton>
  <div className="media-enter-fs">Enter Fullscreen</div>
  <div className="media-exit-fs">Exit Fullscreen</div>
</FullscreenButton>
```

```jsx copyHighlight{2}|slot=fullscreen-target
<FullscreenButton fullscreenTarget="provider" />
```

</Docs>
