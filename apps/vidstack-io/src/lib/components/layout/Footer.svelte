<script lang="ts">
	import SocialLink from '$components/social/SocialLink.svelte';
</script>

<footer
	class="mt-20 flex w-full flex-col items-center justify-center border-t border-gray-200 bg-gray-100 py-12 text-center text-base font-medium dark:border-gray-600 dark:bg-gray-700 992:mt-32"
>
	<div class="flex flex-row space-x-8">
		<SocialLink type="twitter" />
		<SocialLink type="discord" />
		<SocialLink type="gitHub" />
	</div>

	<span class="mt-8 text-gray-soft">
		© Vidstack {new Date().getFullYear()}
	</span>
</footer>
