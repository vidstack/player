<script lang="ts" context="module">
	export type Link = {
		title: string;
		href: string;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import clsx from 'clsx';

	export let links: Link[] = [];
</script>

<div class="not-prose mt-10 mb-6 flex overflow-auto p-1">
	<div class="min-w-full flex-none pr-4">
		<ul class="flex space-x-6 whitespace-nowrap border-b border-gray-divider">
			{#each links as link (link.title + link.href)}
				{@const isActive = $page.url.pathname === link.href}
				<li>
					<h2>
						<a
							class={clsx(
								'-mb-px flex border-current pt-3 pb-2.5 leading-6 px-4 hover:border-b-2',
								isActive
									? 'text-brand font-semibold border-b-2'
									: 'text-gray-soft hover:text-gray-inverse'
							)}
							href={link.href}
							sveltekit:prefetch
						>
							{link.title}
						</a>
					</h2>
				</li>
			{/each}
		</ul>
	</div>
</div>
