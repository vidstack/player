export function setupPreviewStyles(preview: HTMLElement, orientation: string) {
  let rect = preview.getBoundingClientRect(),
    styles: Record<string, string | null> = {
      '--computed-width': rect.width + 'px',
      '--computed-height': rect.height + 'px',
      '--preview-width': 'var(--media-slider-preview-width, var(--computed-width))',
      '--preview-height': 'var(--media-slider-preview-height, var(--computed-height))',
    };

  if (orientation !== 'vertical') {
    styles = {
      ...styles,
      '--preview-width-half': 'calc(var(--preview-width) / 2)',
      '--preview-left-clamp': 'max(var(--preview-width-half), var(--slider-pointer-percent))',
      '--preview-right-clamp': 'calc(100% - var(--preview-width-half))',
      '--preview-left': 'min(var(--preview-left-clamp), var(--preview-right-clamp))',
    };
  } else {
    styles = {
      ...styles,
      '--preview-height-half': 'calc(var(--preview-height) / 2)',
      '--preview-top-clamp': 'max(var(--preview-height-half), var(--slider-pointer-percent))',
      '--preview-bottom-clamp': 'calc(100% - var(--preview-height-half))',
      '--preview-bottom': 'min(var(--preview-top-clamp), var(--preview-bottom-clamp))',
    };
  }

  for (const name of Object.keys(styles)) {
    preview.style.setProperty(name, styles[name]);
  }
}
