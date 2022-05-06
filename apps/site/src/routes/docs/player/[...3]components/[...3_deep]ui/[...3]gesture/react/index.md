<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx copyHighlight|slot=usage{4}
<Media>
  <Video>{/* ... */}</Video>

  <Gesture type="click" repeat="0" action="toggle:paused" priority="1" />
</Media>
```

```jsx|slot=repeat
{/* Single click. */}
<Gesture type="click" repeat="0" />
{/* Double click. */}
<Gesture type="click" repeat="1" />
```

```jsx|slot=priority
{/* Lower priority. */}
<Gesture type="click" priority="1" action="toggle:paused" />
{/* Higher priority. */}
<Gesture type="click" repeat="1" priority="0" action="seek:30" />
```

</Docs>
