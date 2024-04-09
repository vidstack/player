import { render } from 'lit-html';

export class LitElement extends HTMLElement {
  rootPart: any = null;

  connectedCallback() {
    this.rootPart = render((this as unknown as LitRenderer).render(), this, {
      renderBefore: this.firstChild,
    });

    this.rootPart.setConnected(true);
  }

  disconnectedCallback() {
    this.rootPart?.setConnected(false);
    this.rootPart = null;
    render(null, this);
  }
}

export interface LitRenderer {
  render(): any;
}
