import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import * as dfstyles from './styles';

export class DarkForestCheckbox extends LitElement {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-checkbox';

  // Defining element styles without a decorator
  // These are injected into the shadowRoot so they aren't applied globally
  static styles = css`
    :host {
      /*
        We inherit the font information from the parent
        TODO: Maybe we want to always assign it using the theme
      */
      font-family: inherit;
      font-weight: inherit;
      font-size: inherit;
    }

    .checkbox,
    .label {
      /*
        We inherit the font information from the parent
        TODO: Maybe we want to always assign it using the theme
      */
      font-family: inherit;
      font-weight: inherit;
      font-size: inherit;
      box-sizing: border-box;
    }

    .checkbox {
      flex-grow: 0;
      flex-shrink: 0;
      height: 18px;
      width: 18px;
      /* We use 0px on the left so Checkbox aligns with other content in columns */
      margin: 4px 8px 4px 0;
    }

    .label {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      color: ${unsafeCSS(dfstyles.colors.subtext)};
      cursor: pointer;
    }

    .labelContent {
      flex-grow: 1;
      flex-shrink: 1;
    }
  `;

  // Defining element properties without a decorator
  static properties = {
    disabled: {
      type: Boolean,
    },
    checked: {
      type: Boolean,
    },
    selected: {
      type: Boolean,
    },
    label: {
      type: String,
    },
  };

  // Properties defined above will have a getter/setter created on the component,
  // but we want to define their type and/or defaults on the component
  disabled?: boolean;
  checked = false;
  selected = false;
  label?: string;

  private _inputRef = createRef<HTMLInputElement>();

  render() {
    return html`<label class="label">
      <input
        ${ref(this._inputRef)}
        class="checkbox"
        type="checkbox"
        @input=${this._handleInput}
        @keyup=${this._handleKeyUp}
        @keydown=${this._handleKeyDown}
        .checked=${this.checked}
      />${this.label ? html`<span class="labelContent">${this.label}</span>` : nothing}
    </label>`;
  }

  firstUpdated() {
    const input = this._inputRef.value;
    if (this.selected && input) {
      input.focus();
      input.select();
    }
  }

  public focus() {
    const input = this._inputRef.value;
    if (input) {
      input.focus();
    }
  }

  public select() {
    const input = this._inputRef.value;
    if (input) {
      input.select();
    }
  }

  private _handleInput(evt: Event) {
    if (this.disabled) {
      evt.stopImmediatePropagation();
      evt.preventDefault();
      const input = this._inputRef.value;
      if (input) {
        input.checked = this.checked;
      }
    } else {
      if (evt.target) {
        this.checked = (evt.target as HTMLInputElement).checked;
      }
    }
  }

  private _handleKeyUp(evt: Event) {
    // This prevents typing from bubbling up to shortcut handler
    evt.stopPropagation();
  }
  private _handleKeyDown(evt: Event) {
    // This prevents typing from bubbling up to shortcut handler
    evt.stopPropagation();
  }
}
