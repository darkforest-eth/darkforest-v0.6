import { css, html, LitElement, unsafeCSS } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import * as dfstyles from './styles';

export class DarkForestNumberInput extends LitElement {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-number-input';

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

    .input {
      /*
        We inherit the font information from the parent
        TODO: Maybe we want to always assign it using the theme
      */
      font-family: inherit;
      font-weight: inherit;
      font-size: inherit;
      box-sizing: border-box;
      outline: none;
      background: ${unsafeCSS(dfstyles.colors.background)};
      color: ${unsafeCSS(dfstyles.colors.subtext)};
      border-radius: 4px;
      border: 1px solid ${unsafeCSS(dfstyles.colors.borderDark)};
      width: 100%;
      padding: 2px 8px;
      line-height: 20px;
      -moz-appearance: textfield;
    }

    .input::-webkit-outer-spin-button,
    .input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .input:hover,
    .input:focus {
      border: 1px solid ${unsafeCSS(dfstyles.colors.border)};
      background: ${unsafeCSS(dfstyles.colors.backgroundLight)};
      color: ${unsafeCSS(dfstyles.colors.text)};
    }
  `;

  // Defining element properties without a decorator
  static properties = {
    disabled: {
      type: Boolean,
    },
    value: {
      type: Number,
    },
    format: {
      type: String,
    },
    selected: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    _value: {
      state: true,
    },
  };

  // Properties defined above will have a getter/setter created on the component,
  // but we want to define their type and/or defaults on the component
  disabled?: boolean;
  format: 'integer' | 'float' = 'integer';
  selected = false;
  readonly = false;

  private _value = '';

  set value(newValue: number | undefined) {
    if (typeof newValue === 'number') {
      this._value = `${newValue}`;
    } else {
      this._value = '';
    }
  }

  get value(): number | undefined {
    // Set initial value to NaN because we explicitly look for it below
    // and that's what the parseInt/parseFloat functions return on invalid values
    let parsedValue = NaN;
    switch (this.format) {
      case 'integer': {
        parsedValue = parseInt(this._value, 10);
        break;
      }
      case 'float': {
        parsedValue = parseFloat(this._value);
        break;
      }
    }

    if (isNaN(parsedValue)) {
      return undefined;
    } else {
      return parsedValue;
    }
  }

  private _inputRef = createRef<HTMLInputElement>();

  render() {
    return html`<input
      ${ref(this._inputRef)}
      class="input"
      type="number"
      ?readonly=${this.readonly}
      @input=${this._handleInput}
      @keyup=${this._handleKeyUp}
      @keydown=${this._handleKeyDown}
      @wheel=${this._handleWheel}
      .value=${this._value?.toString()}
    />`;
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

  private _handleInput(evt: InputEvent) {
    if (this.disabled) {
      evt.stopImmediatePropagation();
      evt.preventDefault();
      const input = this._inputRef.value;
      if (input) {
        input.value = this._value;
      }
    } else {
      if (evt.target) {
        if ((evt.target as HTMLInputElement).checkValidity()) {
          this._value = (evt.target as HTMLInputElement).value;
        } else {
          evt.stopImmediatePropagation();
        }
      }
    }
  }

  private _handleWheel(evt: Event) {
    // Stop the wheel from scrolling this element
    evt.preventDefault();
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
