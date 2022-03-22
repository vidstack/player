<script>
import Docs from '../_Docs.md';
</script>

<Docs>

```jsx:copy:slot=usage
<AspectRatio
	ratio="16/9"
	minHeight="150px"
	maxHeight="100vh"
>
	{/* Must be direct child. */}
	<VideoPlayer>
		{/* ... */}
	</VideoPlayer>
</AspectRatio>
```

</Docs>
