import { html } from 'lit-html';

export function DefaultTitle() {
  return html`<media-title class="vds-title"></media-title>`;
}

export function DefaultChapterTitle() {
  return html`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`;
}

export function DefaultTitleGroup() {
  return html`<div class="vds-title-group">${DefaultTitle()}${DefaultChapterTitle()}</div>`;
}
