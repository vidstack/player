<script lang="ts">
  import clsx from 'clsx';

  import LockIcon from '~icons/lucide/lock';
  import UnlockIcon from '~icons/lucide/unlock';
  import XOctagon from '~icons/lucide/x-octagon';

  import { isDarkColorScheme } from '../stores/color-scheme';
  import Button from './button.svelte';
  import Dialog from './dialog.svelte';
  import Select from './select.svelte';
  import IndeterminateLoadingSpinner from './style/indeterminate-loading-spinner.svelte';
  import TextGradient from './text-gradient.svelte';

  export let primary = false;
  export let gradient = false;

  let submitting = false,
    submitAttempted = false,
    success = false,
    failed = false,
    email = '',
    products = '',
    streamingProvider = '',
    uploadsPerMonth = '';

  function onEmailChange(event: Event) {
    email = (event.target as HTMLInputElement).value;
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    submitAttempted = true;
    if (!email || !products || !streamingProvider || !uploadsPerMonth) return;
    submitting = true;

    const response = await fetch('/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        products,
        stream: streamingProvider,
        uploads: uploadsPerMonth,
      }),
    });

    submitting = false;
    success = response.status === 200;
    failed = response.status !== 200;
  }

  $: readonly = submitting || success;
</script>

<Dialog {primary} arrow {gradient}>
  <span slot="trigger">Join Waitlist</span>

  <div
    class="flex flex-col items-center w-full flex-1 px-4"
    style={clsx(
      success && '--from-color: oklch(0.66 0.23 153.66); --to-color: oklch(0.66 0.15 203.58);',
      failed && '--from-color: oklch(0.68 0.18 57.17); --to-color: oklch(0.58 0.17 51.15);',
      !success &&
        !failed &&
        '--from-color: oklch(0.51 0.23 276.97); --to-color: oklch(0.53 0.23 294.27);',
    )}
    slot="content"
  >
    <div class="relative prefers-light-scheme">
      <div class="w-20 h-20 p-4 rounded-md bg-[var(--from-color)] transition-colors duration-500">
        {#if failed}
          <XOctagon class="w-full h-full text-white" />
        {:else if success}
          <UnlockIcon class="w-full h-full text-white" />
        {:else}
          <LockIcon class="w-full h-full text-white" />
        {/if}
      </div>
      <div
        class="w-20 h-20 absolute top-1 left-1 bg-[var(--from-color)] opacity-30 rounded-md"
      ></div>
    </div>

    <h1 class="font-bold text-2xl mt-6 text-center transition-colors duration-500">
      <TextGradient>
        {#if failed}
          Request Failed
        {:else if success}
          Request Sent
        {:else}
          Request Access
        {/if}
      </TextGradient>
    </h1>

    <p class="text-soft mt-2 max-w-[320px] text-center leading-snug">
      {#if failed}
        Something went wrong. Please try again.
      {:else if success}
        We'll be in touch as soon as we're ready!
      {:else}
        Join our waitlist and we'll reach out to you as soon as possible!
      {/if}
    </p>

    <form class="mt-10 w-full flex-1 shrink-0" on:submit={onSubmit}>
      <label for="email"></label>
      <input
        id="email"
        type="email"
        class={clsx(
          'bg-transparent text-inverse border border-border rounded-sm w-full py-2 px-2.5',
          'text-sm placeholder:text-soft',
          !readonly ? 'hocus:border-brand' : 'cursor-default',
        )}
        required
        placeholder="Email"
        {readonly}
        on:change={onEmailChange}
      />

      <Select
        class="w-full mt-4"
        label="Interested products"
        state={submitAttempted && !products ? 'error' : 'default'}
        options={[
          { label: 'All', value: 'all' },
          { label: 'Analytics', value: 'analytics' },
          { label: 'CMS', value: 'cms' },
          { label: 'Git Integration', value: 'git' },
          { label: 'Next.js Integration', value: 'next' },
          { label: 'Storage', value: 'storage' },
          { label: 'Streaming', value: 'streaming' },
        ]}
        multiple
        required
        disabled={readonly}
        on:change={({ detail: values }) => {
          products = values.join(',');
        }}
      />

      <Select
        class="w-full mt-4"
        label="Current streaming provider"
        state={submitAttempted && !streamingProvider ? 'error' : 'default'}
        options={[
          { label: 'AWS Media Services', value: 'aws' },
          { label: 'Cloudflare Stream', value: 'cf' },
          { label: 'JW Player', value: 'jw' },
          { label: 'Mux', value: 'mux' },
          { label: 'Vimeo', value: 'vimeo' },
          { label: 'YouTube', value: 'yt' },
          { label: 'Wistia', value: 'wistia' },
          { label: 'Custom', value: 'custom' },
        ]}
        required
        disabled={readonly}
        on:change={({ detail: values }) => {
          streamingProvider = values[0];
        }}
      />

      <Select
        class="w-full mt-4 mb-6"
        label="Number of uploads per month"
        state={submitAttempted && !uploadsPerMonth ? 'error' : 'default'}
        options={[
          { label: '1 - 100 uploads p/m', value: 'xs' },
          { label: '100 - 500 uploads p/m', value: 'sm' },
          { label: '500 - 2.5k uploads p/m', value: 'md' },
          { label: '2.5k - 10k uploads p/m', value: 'lg' },
          { label: '10k+ uploads p/m', value: 'xl' },
        ]}
        required
        disabled={readonly}
        on:change={({ detail: values }) => {
          uploadsPerMonth = values[0];
        }}
      />

      {#if success}
        <!--  -->
      {:else if submitting}
        <div class="flex items-center justify-center w-full px-5 py-2.5 rounded-md">
          <IndeterminateLoadingSpinner class="mr-2" size={20} />
          Submitting
        </div>
      {:else}
        <Button
          type="submit"
          class={clsx('w-full justify-center mb-2')}
          gradient={$isDarkColorScheme}
          primary={!$isDarkColorScheme}
        >
          Request Access
        </Button>
      {/if}
    </form>
  </div>
</Dialog>
