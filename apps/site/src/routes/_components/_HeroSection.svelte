<script>
	import Button from '$components/base/Button.svelte';
</script>

<section class="mx-auto w-full max-w-6xl px-4 576:px-8 992:px-14 1200:pt-8 1200:pb-16">
	<div class="flex flex-col 992:mt-12">
		<div class="flex flex-col items-center justify-center">
			<h1
				class="max-w-3xl text-center text-5xl font-bold leading-[3.5rem] 768:text-6xl 768:leading-[4.5rem] 1200:text-7xl 1200:leading-[5rem]"
			>
				<span class="576:hidden">Video tools for frontend devs.</span>
				<span class="hidden 576:block"> Video tools for frontend developers. </span>
			</h1>

			<p class="mx-auto mt-12 max-w-[600px] text-center text-lg text-gray-soft 576:text-xl">
				Vidstack is a video framework that makes it easy to build and integrate awesome media
				experiences into modern web apps.
			</p>

			<Button
				class="mt-16"
				type="raised"
				arrow="right"
				href="/docs/player/getting-started/quickstart"
				sveltekit:prefetch
			>
				Start Building
			</Button>
		</div>
	</div>
</section>
