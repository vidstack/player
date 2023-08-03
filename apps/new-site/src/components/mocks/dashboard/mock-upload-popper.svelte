<script lang="ts">
  import CheckCircleIcon from '~astro-icons/lucide/check-circle-2';
  import ChevronDownIcon from '~astro-icons/lucide/chevron-down';
  import clsx from 'clsx';
  import { onDestroy, tick } from 'svelte';
  import { get } from 'svelte/store';
  import { visible } from '../../../actions/visible';
  import { ariaBool } from '../../../utils/aria';
  import { IS_BROWSER } from '../../../utils/env';
  import { isKeyboardClick } from '../../../utils/keyboard';
  import { mockEncodeProgress, mockVideoTitles, type MockEncodeProgress } from './mock-encode';

  let expanded = false,
    intervalId = -1,
    startEncoding: boolean[] = [],
    videoCount = mockVideoTitles.length;

  onDestroy(() => IS_BROWSER && window.clearTimeout(intervalId));

  function onPress() {
    expanded = !expanded;
  }

  function onVisible() {
    setTimeout(() => {
      if (intervalId === -1) {
        intervalId = window.setInterval(onIntervalTick, 100);
      }
    }, 1500);
  }

  function startEncodingTimer(index: number) {
    if (typeof startEncoding[index] !== 'undefined') return;
    startEncoding[index] = false;
    setTimeout(() => {
      startEncoding[index] = true;
    }, Math.random() * 1500);
  }

  function onIntervalTick() {
    if (Math.random() <= 0.1) return;

    const progress = get(mockEncodeProgress);

    for (let i = 0; i < videoCount; i++) {
      const increment = Math.random() * (i + 1 * 6),
        current = (progress[i] ??= { upload: 0, encode: 0 });
      if (current.upload < 100) {
        current.upload = Math.min(100, current.upload + increment);
      } else {
        startEncodingTimer(i);
        if (startEncoding[i]) {
          current.encode = Math.min(100, current.encode + increment);
        }
      }
    }

    mockEncodeProgress.set([...progress]);
    tick();

    let complete = true;
    for (let i = 0; i < videoCount; i++) {
      const current = progress[i],
        percent = i > 0 ? (current.upload + current.encode) / 2 : current.upload;
      if (percent < 100) {
        complete = false;
      } else {
        const el = document.getElementById(`mock-video-${i}`);
        el?.setAttribute('data-ready', '');
      }
    }

    if (complete) window.clearInterval(intervalId);
  }

  function calcTotalUploadPercent(progress: MockEncodeProgress[]) {
    let total = 0;
    for (let i = 0; i < progress.length; i++) total += progress[i].upload || 0;
    return Math.min(100, total / progress.length) || 0;
  }

  $: uploadProgressPercent = calcTotalUploadPercent($mockEncodeProgress);
  $: completedUploads = $mockEncodeProgress.filter((e) => e.upload === 100).length;
  $: isUploadComplete = uploadProgressPercent === 100;
</script>

<div
  class={clsx(
    'flex flex-col absolute bottom-4 right-2 rounded-sm min-w-[240px] shadow-md z-20',
    'opacity-0 data-[visible]:opacity-100 transition-opacity ease-in duration-400 delay-1000',
  )}
  use:visible={{
    once: true,
  }}
>
  <button
    id="mock-uploader"
    class={clsx(
      'flex flex-col text-xs border border-border bg-elevate/90 backdrop-blur-md',
      'px-3 py-2 rounded-sm',
      expanded && 'rounded-b-none',
    )}
    aria-expanded={ariaBool(expanded)}
    aria-controls="mock-uploader-items"
    aria-haspopup="listbox"
    aria-label="Active Uploads"
    use:visible={{
      once: true,
      onChange: onVisible,
    }}
    on:pointerup={onPress}
    on:keydown={(e) => isKeyboardClick(e) && onPress()}
  >
    <div class="flex items-center w-full">
      {#if isUploadComplete}
        <CheckCircleIcon class="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
      {/if}

      <span>{isUploadComplete ? 'Uploaded' : 'Uploading'}</span>

      <span class="text-soft ml-1.5">
        {#if !isUploadComplete}
          {Math.round(uploadProgressPercent)}% -
        {/if}
        {completedUploads}/{videoCount}
      </span>

      <div class="flex-1"></div>

      <ChevronDownIcon
        class={clsx('w-4 h-4 transition-transform duration-300', expanded && 'rotate-180')}
      />
    </div>

    <div
      class={clsx(
        'w-full h-1 bg-green-600 dark:bg-green-400 transition-[width] duration-300 mt-2 rounded-sm',
        uploadProgressPercent === 0 && 'hidden',
      )}
      style={`width: ${uploadProgressPercent}%;`}
    />
  </button>

  <div
    id="mock-uploader-items"
    class={clsx(
      'transition-[height,opacity] bg-elevate/90 backdrop-blur-md border-t-0',
      'duration-300 rounded-b-sm overflow-hidden',
      expanded ? 'h-[190px] px-3 py-4 border border-border ease-in' : 'h-0 ease-out',
    )}
    aria-describedby="mock-uploader"
    aria-hidden={!ariaBool(expanded)}
  >
    <div class="w-full flex flex-col space-y-3">
      {#each mockVideoTitles as title, i (title)}
        {@const percent = $mockEncodeProgress[i]?.upload || 0}
        <div class="flex flex-row items-center">
          {#if percent === 100}
            <CheckCircleIcon class="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
          {:else}
            <svg
              class="w-4 h-4 rounded-full mr-2"
              fill="none"
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <circle
                class="text-inverse opacity-25"
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                stroke-width="40"
              ></circle>
              <circle
                class="text-green-600 dark:text-green-400 opacity-75"
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                stroke-width="40"
                stroke-dasharray="100"
                stroke-dashoffset={Math.max(0, 100 - percent)}
                pathLength="100"
              ></circle>
            </svg>
          {/if}
          <span class="font-semibold text-xs">{title} </span>
          <div class="flex-1"></div>
          <span class="text-xs text-soft ml-1">{Math.round(percent)}%</span>
        </div>
      {/each}
    </div>
  </div>
</div>
