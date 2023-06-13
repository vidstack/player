<script>
  import { onMount } from 'svelte';

  let ready = false,
    floating = false,
    player,
    outlet,
    float;

  onMount(async () => {
    await customElements.whenDefined('media-outlet');
    player.onAttach(() => void (player.muted = true));
    outlet.onAttach(() => void (ready = true));
  });

  function onPop() {
    if (!floating) {
      float.appendChild(outlet);
    } else {
      player.appendChild(outlet);
    }

    floating = !floating;
  }
</script>

<media-player
  class={`w-full max-w-sm min-w-sm z-0 overflow-visible aspect-video${floating ? 'bg-black' : ''}`}
  src="https://media-files.vidstack.io/720p.mp4"
  poster="https://media-files.vidstack.io/poster.png"
  aspect-ratio="16/9"
  bind:this={player}
>
  <media-outlet class="z-0" bind:this={outlet} />
  {#if ready}
    <div class="prefers-light-scheme absolute bottom-0 left-0 w-full z-10 px-1 py-0.5">
      <div class="bg-black/50 rounded-sm w-full flex">
        <media-play-button />
        <div class="flex-1" />
        <media-toggle-button aria-label="Floating Mode" on:pointerup={onPop}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" slot="on">
            <path
              d="M4.6767 22.75V17.0333C4.6767 16.9689 4.72893 16.9167 4.79336 16.9167H6.89336C6.9578 16.9167 7.01003 16.9689 7.01003 17.0333V20.4167C7.01003 20.7388 7.2712 21 7.59336 21H20.4267C20.7489 21 21.01 20.7388 21.01 20.4167V7.58332C21.01 7.26116 20.7489 6.99999 20.4267 6.99999H17.0434C16.9789 6.99999 16.9267 6.94776 16.9267 6.88332V4.78332C16.9267 4.71889 16.9789 4.66666 17.0434 4.66666H22.76C23.0822 4.66666 23.3434 4.92782 23.3434 5.24999V22.75C23.3434 23.0722 23.0822 23.3333 22.76 23.3333H5.26003C4.93786 23.3333 4.6767 23.0722 4.6767 22.75Z"
              fill="currentColor"
            />
            <path
              d="M12.2686 7.37064H9.46524C9.36131 7.37064 9.30925 7.4963 9.38275 7.5698L14.4905 12.6775C14.7183 12.9053 14.7183 13.2747 14.4905 13.5025L13.418 14.5749C13.1902 14.8027 12.8209 14.8027 12.593 14.5749L7.56774 9.54959C7.49424 9.4761 7.36858 9.52815 7.36858 9.63209V12.2706C7.36858 12.5928 7.10741 12.854 6.78524 12.854H5.26858C4.94641 12.854 4.68524 12.5928 4.68524 12.2706L4.68524 5.27064C4.68524 4.94847 4.94641 4.6873 5.26858 4.6873L12.2686 4.6873C12.5907 4.6873 12.8519 4.94847 12.8519 5.27064V6.7873C12.8519 7.10947 12.5907 7.37064 12.2686 7.37064Z"
              fill="currentColor"
            />
          </svg>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" slot="off">
            <path
              d="M14.01 13.4167C13.6879 13.4167 13.4267 13.6778 13.4267 14V17.5C13.4267 17.8222 13.6879 18.0833 14.01 18.0833H18.6767C18.9989 18.0833 19.26 17.8222 19.26 17.5V14C19.26 13.6778 18.9989 13.4167 18.6767 13.4167H14.01Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.6767 6.41668C4.6767 6.09451 4.93786 5.83334 5.26003 5.83334H22.76C23.0822 5.83334 23.3434 6.09451 23.3434 6.41668V21.5833C23.3434 21.9055 23.0822 22.1667 22.76 22.1667H5.26003C4.93786 22.1667 4.6767 21.9055 4.6767 21.5833V6.41668ZM7.01003 8.75001C7.01003 8.42784 7.2712 8.16668 7.59336 8.16668H20.4267C20.7489 8.16668 21.01 8.42784 21.01 8.75001V19.25C21.01 19.5722 20.7489 19.8333 20.4267 19.8333H7.59336C7.2712 19.8333 7.01003 19.5722 7.01003 19.25V8.75001Z"
              fill="currentColor"
            />
          </svg>
        </media-toggle-button>
      </div>
    </div>
  {/if}
</media-player>

<div class="max-w-[200px] absolute right-4 bottom-4 z-50" bind:this={float} />
