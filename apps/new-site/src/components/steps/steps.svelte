<script lang="ts">
  import clsx from 'clsx';

  import CheckCircleIcon from '~astro-icons/lucide/check-circle-2';

  import { visible } from '../../actions/visible';
  import { useARIATabs } from '../../aria/tabs';
  import { IS_BROWSER } from '../../utils/env';
  import ProgressCircle from '../progress-circle.svelte';

  export let label: string;
  export let steps: string[] = [];
  export let animated = false;
  export let progress = false;
  export let color: 'orange';

  let _class = '';
  export { _class as class };
  export let stepListClass = '';

  let startAnimationTimer = -1,
    animationInterval = -1,
    progressPercent = 0,
    isVisible = false;

  const {
    tabsRoot: stepsRoot,
    tabList: stepList,
    tab: step,
    selectedTab: selectedStep,
    selectTab: selectStep,
  } = useARIATabs({
    onSelect(step, trigger) {
      onPause();
      progressPercent = 0;
      if (step < steps.length) {
        startAnimationTimer = window.setTimeout(
          () => {
            onPlay();
          },
          trigger ? 30000 : 5000,
        );
      }
    },
  });

  function onPlay() {
    window.clearInterval(animationInterval);
    animationInterval = window.setInterval(() => {
      progressPercent += 2.5;
      if (progressPercent >= 100) {
        window.clearInterval(animationInterval);
        const nextStep = $selectedStep + 1;
        if (nextStep < steps.length) {
          progressPercent = 0;
          selectStep(nextStep);
        }
      }
    }, 100);
  }

  function onResume() {
    onPlay();
  }

  function onPause() {
    window.clearInterval(animationInterval);
    window.clearTimeout(startAnimationTimer);
  }

  $: if (IS_BROWSER && animated) {
    if (isVisible) onResume();
    else onPause();
  }
</script>

<div
  class={clsx('flex flex-col items-center', _class)}
  use:stepsRoot
  use:visible={{
    onChange(visible) {
      isVisible = visible;
    },
  }}
>
  <div class={clsx('flex items-center relative w-full', stepListClass)} use:stepList={label}>
    {#each steps as title, i}
      {@const isSelected = $selectedStep === i}
      {@const isComplete = $selectedStep > i || progressPercent >= 100}
      <button
        class={clsx(
          'flex items-center justify-center outline-none py-1.5 text-[15px] font-semibold group px-2',
        )}
        use:step
      >
        {#if progress}
          {#if isComplete}
            <CheckCircleIcon
              class={clsx(
                'w-[26px] h-[26px] mr-2',
                color === 'orange' && 'text-[#f9700b] group-hocus:text-[#f9700b]/80',
              )}
            />
          {:else}
            <div class="flex relative items-center justify-center w-[26px] h-[26px] mr-2">
              <ProgressCircle
                class="absolute top-0 left-0 shadow-sm"
                size={26}
                thickness={isSelected ? 20 : 18}
                percent={isComplete ? 100 : $selectedStep === i ? progressPercent : 0}
                trackClass={clsx('opacity-25')}
                fillClass={clsx(color === 'orange' && 'text-[#f9700b]')}
              />
              <span
                class={clsx(
                  'text-xs font-semibold mt-px transition-colors duration-300',
                  !isSelected && 'text-inverse/40 group-hocus:text-inverse',
                )}>{i + 1}</span
              >
            </div>
          {/if}
        {:else}
          <div
            class={clsx(
              'rounded-full text-xs mr-1.5 w-[19px] h-[19px] flex items-center justify-center',
              'shadow-sm transition-colors duration-300 font-bold',
              isSelected
                ? color === 'orange'
                  ? 'bg-[#f9700b] text-white dark:text-black'
                  : ''
                : color === 'orange'
                ? 'bg-[#f9700b]/20 text-inverse/40 group-hocus:text-inverse'
                : '',
            )}
          >
            {i + 1}
          </div>
        {/if}

        <span
          class={clsx(
            'transition-colors group-hocus:text-inverse',
            !isSelected && !isComplete && 'text-inverse/60 group-hocus:text-inverse',
            isComplete && 'text-inverse',
          )}
        >
          {title}
        </span>
      </button>

      {#if i < steps.length - 1}
        <div class="flex-1">
          <div
            class={clsx(
              'border-dashed border-t-2 border-border transition-[width] duration-500',
              $selectedStep > i ? 'w-full' : 'w-0',
            )}
          />
        </div>
      {/if}
    {/each}
  </div>

  <div class={clsx('w-full mt-8')}>
    <slot />
  </div>
</div>
