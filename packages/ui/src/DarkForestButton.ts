import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import * as dfstyles from './styles';

export class DarkForestButton extends LitElement {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-button';

  // Defining element styles without a decorator
  // These are injected into the shadowRoot so they aren't applied globally
  static styles = [
    css`
      .button {
        /* Need to unset all the styles that were set on this by the outer scope */
        all: unset;
        box-sizing: border-box;
        font-size: 12pt;
        user-select: none;
        display: inline-flex;
        border-radius: 3px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: var(--df-button-color, ${unsafeCSS(dfstyles.colors.text)});
        background-color: var(--df-button-background, ${unsafeCSS(dfstyles.colors.backgroundDark)});
        padding: 2px 8px;
      }

      .button:not(.disabled):hover,
      .button:not(.disabled):active,
      .button:not(.disabled).forceActive {
        filter: brightness(80%);
        color: ${unsafeCSS(dfstyles.colors.background)};
        background: var(--df-button-hover-background, ${unsafeCSS(dfstyles.colors.text)});

        /* Set the Icon color to a darker value on hover */
        --df-icon-color: ${unsafeCSS(dfstyles.colors.background)};
      }

      .small {
        font-size: 10pt;
        padding: 0 4px;
      }

      .medium {
      }

      .large {
        font-size: 16pt;
        border-radius: 4px;
        padding: 4px 32px;
      }

      .stretch {
        width: 100%;
      }

      .medium,
      .large,
      .stretch {
        border: var(--df-button-border, 1px solid ${unsafeCSS(dfstyles.colors.borderDark)});
      }

      .medium:not(.disabled):hover,
      .medium:not(.disabled):active,
      .medium:not(.disabled).forceActive,
      .large:not(.disabled):hover,
      .large:not(.disabled):active,
      .large:not(.disabled).forceActive,
      .stretch:not(.disabled):hover,
      .stretch:not(.disabled).forceActive .stretch:active {
        border: var(--df-button-hover-border, 1px solid ${unsafeCSS(dfstyles.colors.border)});
      }

      .danger:not(.disabled) {
        color: ${unsafeCSS(dfstyles.colors.dfred)};
        border: 1px solid ${unsafeCSS(dfstyles.colors.dfred)};
      }

      .danger:not(.disabled):hover,
      .danger:not(.disabled):active,
      .danger:not(.disabled).forceActive {
        background: ${unsafeCSS(dfstyles.colors.dfred)};
        border: 1px solid ${unsafeCSS(dfstyles.colors.dfred)};
      }

      .disabled {
        color: ${unsafeCSS(dfstyles.colors.subtext)};
        border-color: ${unsafeCSS(dfstyles.colors.border)};
        background: none;
        filter: none;
      }
    `,
  ];

  // Defining element properties without a decorator
  static properties = {
    size: {
      type: String,
    },
    variant: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
  };

  // Properties defined above will have a getter/setter created on the component,
  // but we want to define their type and/or defaults on the component
  size: 'small' | 'medium' | 'large' | 'stretch' = 'medium';
  variant: 'normal' | 'danger' = 'normal';
  disabled = false;
  active = false;

  render() {
    const classes = {
      button: true,
      small: this.size === 'small',
      medium: this.size === 'medium',
      large: this.size === 'large',
      stretch: this.size === 'stretch',
      disabled: this.disabled,
      forceActive: this.active,
      danger: this.variant === 'danger',
    };
    return html`<button class=${classMap(classes)} @click=${this._handleClick}>
      <slot></slot>
    </button>`;
  }

  protected _handleClick(evt: MouseEvent) {
    if (this.disabled) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }
}
