<script>
	import TabbedLinks from '$components/markdown/TabbedLinks.svelte';
	import { markdownSlug } from '$stores/markdown';

	$: docsHref = $markdownSlug.includes('/api')
		? $markdownSlug.replace(/\/api\/?/, '')
		: $markdownSlug;

	$: apiHref = !$markdownSlug.includes('/api') ? `${$markdownSlug}/api` : $markdownSlug;

	$: links = [
		{ title: 'Docs', href: docsHref },
		{ title: 'API', href: apiHref }
	];
</script>

<TabbedLinks {links} />
