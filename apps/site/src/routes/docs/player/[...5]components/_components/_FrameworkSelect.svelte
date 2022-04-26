<script lang="ts">
  import HTMLIcon from '~icons/ri/html5-fill';
  import ReactIcon from '~icons/ri/reactjs-fill';
  import { Select } from '@svelteness/kit-docs';

  import { framework, type FrameworkType } from '$lib/stores/framework';
  import { isApiPath, isComponentsPath, isReactPath } from '$lib/stores/path';
  import { goto } from '$app/navigation';

  let value = $isReactPath ? 'React' : 'HTML';

  function onChange() {
    $framework = value.toLowerCase() as FrameworkType;

    if (!$isComponentsPath) return;

    const url = new URL(location.href);
    const path = url.pathname;

    if ($framework === 'react') {
      goto(
        $isApiPath
          ? `${path.replace(/\/api\/?/, '')}/react/api`
          : `${path.replace(/\/$/, '')}/react`,
      );
    } else {
      goto(path.replace(/\/react/, ''));
    }
  }

  $: value = $framework === 'html' ? 'HTML' : 'React';
</script>

<Select title="Current Framework" bind:value on:change={onChange} raised={false}>
  <div class="mr-1" aria-hidden="true" slot="before-title">
    {#if value === 'React'}
      <ReactIcon width="16" height="16" />
    {:else}
      <HTMLIcon width="16" height="16" />
    {/if}
  </div>

  <option>HTML</option>
  <option>React</option>
</Select>
