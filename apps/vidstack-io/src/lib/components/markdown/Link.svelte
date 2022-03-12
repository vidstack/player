<script lang="ts">
	import { isApiPath, isComponentsPath, isReactPath } from '$stores/path';

	export let href: string;

	$: path = href.split('#')[0];
	$: hash = href.split('#')[1];

	$: _href =
		$isReactPath && $isComponentsPath && !$isApiPath
			? `${path}/react${hash ? `#${hash}` : ''}`
			: href;
</script>

<a href={_href} {...$$restProps}><slot /></a>
