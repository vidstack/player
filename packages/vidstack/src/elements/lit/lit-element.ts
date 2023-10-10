import { render, type RootPart, type TemplateResult } from 'lit-html';

export class LitElement extends HTMLElement {
  rootPart: RootPart | null = null;

  connectedCallback() {
    this.rootPart = render((this as unknown as LitRenderer).render(), this, {
      renderBefore: this.firstChild,
    });
    this.rootPart.setConnected(true);
  }

  disconnectedCallback() {
    this.rootPart?.setConnected(false);
    this.rootPart = null;
  }
}

export interface LitRenderer {
  render(): TemplateResult;
}
