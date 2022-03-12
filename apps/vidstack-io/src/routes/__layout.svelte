<script>
	import '$styles/fonts.css';
	import '$styles/tailwind.css';
	import '$styles/app.css';
	import '$polyfills/focus-visible';

	import { onMount } from 'svelte';

	onMount(() => {
		// Strange fix for strange issue -_O_- (`cmd + k` opening two docsearch containers).
		window.addEventListener('keydown', (e) => {
			if (e.key === 'k' && e.metaKey) {
				setTimeout(() => {
					const search = Array.from(document.querySelectorAll('.DocSearch.DocSearch-Container'));
					search[1]?.remove();
				});
			}
		});
	});
</script>

<slot />
