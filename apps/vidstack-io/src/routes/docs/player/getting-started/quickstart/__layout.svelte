<script lang="ts">
	import clsx from 'clsx';

	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Chip from '$components/base/Chip.svelte';
	import Select from '$components/base/Select.svelte';
	import Steps from '$components/markdown/Steps.svelte';
	import Step from '$components/markdown/Step.svelte';

	import InstallNpm from './_components/_InstallNPM.md';
	import InstallCdn from './_components/_InstallCDN.md';
	import LibHtml from './_components/_LibHTML.md';
	import LibReact from './_components/_LibReact.md';
	import ProviderHls from './_components/_ProviderHls.md';
	import BrowserSupport from './_components/_BrowserSupport.md';
	import DangerouslyAll from './_components/_DangerouslyAll.md';

	import { installMethod as _installMethod, type InstallMethodType } from '$stores/installMethod';
	import { framework as _framework, type FrameworkType } from '$stores/framework';

	const basePath = '/docs/player/getting-started/quickstart';

	const installOptions = ['NPM', 'CDN'];
	const frameworkOptions = ['HTML', 'React'];
	const providerOptions = ['Audio', 'Video', 'HLS'];

	let installMethod = getSelectionFromPath(installOptions) ?? 'NPM';
	let frameworkType = getSelectionFromPath(frameworkOptions) ?? 'HTML';
	let providerType = getSelectionFromPath(providerOptions) ?? 'Video';

	let isFrameworkDisabled = installMethod === 'CDN';

	$: providerLink = `/docs/player/components/providers/${providerType.toLowerCase()}${
		frameworkType === 'React' ? '/react' : ''
	}`;
	$: providerApiLink = `${providerLink}/api`;

	$: if ($navigating?.to.pathname === basePath) {
		installMethod = 'NPM';
		frameworkType = 'HTML';
		providerType = 'Video';
	}

	$: if (installMethod === 'CDN') {
		frameworkType = 'HTML';
		isFrameworkDisabled = true;
	} else {
		isFrameworkDisabled = false;
	}

	function getSelectionFromPath(values: string[]) {
		for (const value of values) {
			if ($page.url.pathname.includes(`/${value.toLowerCase()}`)) {
				return value;
			}
		}
	}

	function onOptionsChange() {
		const isCDNInstallMethod = installMethod === 'CDN';
		const isVideoProvider = providerType === 'Video';
		const isReact = frameworkType === 'React';
		const isDefault = isVideoProvider && !isReact;

		let installPath = isCDNInstallMethod ? '/cdn' : '';
		let frameworkPath = isReact && !isCDNInstallMethod ? '/react' : '';
		let providerPath = !isCDNInstallMethod && isDefault ? '' : `/${providerType}`;
		let slug = `${basePath}${installPath}${frameworkPath}${providerPath}`.toLowerCase();

		if ($page.url.pathname !== slug) {
			goto(slug, { noscroll: true });
		}

		$_installMethod = installMethod.toLowerCase() as InstallMethodType;
		$_framework = frameworkType.toLowerCase() as FrameworkType;
	}
</script>

<h1>Quickstart</h1>

<p>
	This section will get you up and running with the player. You'll find specific instructions below
	depending on the type of installation method (NPM/CDN), framework (HTML/React), and provider
	(Audio/Video/HLS) you opt to use.
</p>

<BrowserSupport />

<h2 class="mb-10 flex flex-col 992:flex-row 992:items-center">
	Player Installation
	<div class="mt-4 -ml-2 inline-flex space-x-1.5 text-white dark:text-black 992:ml-2 992:mt-0">
		<Chip class={clsx(installMethod === 'CDN' ? 'bg-lime-600 dark:bg-lime-300' : 'hidden')}>
			{installMethod}
		</Chip>
		<Chip class={clsx(frameworkType === 'HTML' ? 'hidden' : 'bg-sky-600 dark:bg-sky-300')}>
			{frameworkType}
		</Chip>
		<Chip class="bg-indigo-600 dark:bg-indigo-300">
			{providerType}
		</Chip>
	</div>
</h2>

<Steps>
	<Step orientation="vertical">
		<h3 slot="title">Select Installation Method</h3>

		<Select
			title="Select Installation Method"
			options={installOptions}
			bind:value={installMethod}
			on:change={onOptionsChange}
		/>

		{#if installMethod === 'NPM'}
			<InstallNpm />
		{:else}
			<InstallCdn />
		{/if}
	</Step>

	{#if !isFrameworkDisabled}
		<Step orientation="vertical">
			<h3 slot="title">Select Library</h3>

			<Select
				title="Select Library"
				options={frameworkOptions}
				bind:value={frameworkType}
				on:change={onOptionsChange}
			/>

			{#if frameworkType === 'HTML'}
				<LibHtml />
			{:else}
				<LibReact />
			{/if}
		</Step>
	{/if}

	<Step orientation="vertical">
		<h3 slot="title">Select Media Provider</h3>

		<Select
			title="Select Media Provider"
			options={providerOptions}
			bind:value={providerType}
			on:change={onOptionsChange}
		/>

		{#if providerType === 'Audio'}
			<p>
				Embed sound content into documents via the native <code>&lt;audio&gt;</code> element.
			</p>
		{:else if providerType === 'Video'}
			<p>
				Embed video content into documents via the native <code>&lt;video&gt;</code> element.
			</p>
		{:else if providerType === 'HLS'}
			<ProviderHls />
		{/if}
	</Step>

	<slot />
</Steps>

<p class="mt-10">
	Congratulations, you're done! You should now see the media player rendered on your site. For more
	information on loading media or interacting with the player, you can dig around the provider
	<a href={providerLink} target="_blank">docs</a>
	and
	<a href={providerApiLink} target="_blank">API</a> pages.
</p>

<h2>Player Skins</h2>

<p>
	You might not be interested in designing your player and rather a quick, beautiful default look.
	Skins which provide what you're looking for are not available just yet but on our roadmap. We'll
	announce it on our channels once it's ready. Follow us on
	<a href="https://twitter.com/vidstackjs?lang=en" target="_blank">Twitter</a> or
	<a href="https://discord.com/invite/7RGU7wvsu9" target="_blank">Discord</a>
	to be notified when it's ready.
</p>

{#if frameworkType !== 'React'}
	<DangerouslyAll {installMethod} />
{/if}
