<media-captions
  class="captions media-preview:opacity-0 media-controls:bottom-[85px] media-captions:opacity-100 absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300"
/>

<style lang="postcss">
  .captions {
    /* Recommended settings in the WebVTT spec (https://www.w3.org/TR/webvtt1). */
    --cue-color: var(--media-cue-color, white);
    --cue-bg-color: var(--media-cue-bg, rgba(0, 0, 0, 0.7));
    --cue-font-size: calc(var(--overlay-height) / 100 * 4.5);
    --cue-line-height: calc(var(--cue-font-size) * 1.2);
    --cue-padding-x: calc(var(--cue-font-size) * 0.6);
    --cue-padding-y: calc(var(--cue-font-size) * 0.4);

    font-size: var(--cue-font-size);
    word-spacing: normal;
    contain: layout style;

    &[data-dir='rtl'] :global([data-part='cue-display']) {
      direction: rtl;
    }

    &[aria-hidden='true'] {
      display: none;
    }
  }

  /*************************************************************************************************
 * Cue Display
 *************************************************************************************************/

  /*
* Most of the cue styles are set automatically by our [media-captions](https://github.com/vidstack/media-captions)
* library via CSS variables. They are inferred from the VTT, SRT, or SSA file cue settings. You're
* free to ignore them and style the captions as desired, but we don't recommend it unless the
* captions file contains no cue settings. Otherwise, you might be breaking accessibility.
*/
  .captions :global([data-part='cue-display']) {
    position: absolute;
    direction: ltr;
    overflow: visible;
    contain: content;
    top: var(--cue-top);
    left: var(--cue-left);
    right: var(--cue-right);
    bottom: var(--cue-bottom);
    width: var(--cue-width, auto);
    height: var(--cue-height, auto);
    transform: var(--cue-transform);
    text-align: var(--cue-text-align);
    writing-mode: var(--cue-writing-mode, unset);
    white-space: pre-line;
    unicode-bidi: plaintext;
    min-width: min-content;
    min-height: min-content;
  }

  .captions :global([data-part='cue']) {
    display: inline-block;
    contain: content;
    border-radius: 2px;
    backdrop-filter: blur(8px);
    padding: var(--cue-padding-y) var(--cue-padding-x);
    line-height: var(--cue-line-height);
    background-color: var(--cue-bg-color);
    color: var(--cue-color);
    white-space: pre-wrap;
    outline: var(--cue-outline);
    text-shadow: var(--cue-text-shadow);
  }

  .captions :global([data-part='cue-display'][data-vertical] [data-part='cue']) {
    padding: var(--cue-padding-x) var(--cue-padding-y);
  }
</style>
