<script>
	import SearchIcon from '~icons/ri/search-2-line';
</script>

<!-- For SSR to prevent sidebar jumping on initial render. -->
<div
	class="hidden w-full items-center rounded-sm border border-gray-divider bg-gray-elevate py-2.5 px-3 text-[15px] shadow-sm 992:flex"
>
	<span class="flex-1">Search</span>
	<span class="flex space-x-0.5 font-semibold">
		<span>⌘</span>
		<span>K</span>
	</span>
</div>

<div class="-mr-2 flex h-9 w-14 items-center justify-center rounded-sm border-0 992:hidden">
	<SearchIcon class=" text-gray-soft" width="28" height="28" />
</div>
