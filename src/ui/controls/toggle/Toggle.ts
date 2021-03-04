import { CSSResultArray, LitElement } from 'lit-element';

import { toggleStyles } from './toggle.css';

/**
 * DESCRIPTION.
 *
 * ## Tag
 *
 * @tagname vds-toggle
 */
export class Toggle extends LitElement {
  public static get styles(): CSSResultArray {
    return [toggleStyles];
  }
}
