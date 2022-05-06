<script>
import Docs from './_Docs.md';
</script>

<Docs>

```html copyHighlight|slot=usage{6}
<vds-media>
  <vds-video>
    <!-- ... -->
  </vds-video>

  <vds-gesture type="click" repeat="0" action="toggle:paused" priority="1"></vds-gesture>
</vds-media>
```

```html|slot=repeat
<!-- Single click. -->
<vds-gesture type="click" repeat="0" />
<!-- Double click. -->
<vds-gesture type="click" repeat="1" />
```

```html|slot=priority
<!-- Lower priority. -->
<vds-gesture type="click" priority="1" action="toggle:paused" />
<!-- Higher priority. -->
<vds-gesture type="click" repeat="1" priority="0" action="seek:30" />
```

</Docs>
