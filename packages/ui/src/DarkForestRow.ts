import { css, html, LitElement } from 'lit';

export class DarkForestRow extends LitElement {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-row';

  // Defining element styles without a decorator
  // These are injected into the shadowRoot so they aren't applied globally
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 4px;
      margin-bottom: 4px;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
