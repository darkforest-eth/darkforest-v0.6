import { SpecialKey } from '@darkforest_eth/constants';
import { css, html, nothing, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { DarkForestButton } from './DarkForestButton';
import * as dfstyles from './styles';

export class ShortcutPressedEvent extends Event {
  constructor() {
    super('shortcut-pressed', { bubbles: true, cancelable: true, composed: true });
  }
}

export class DarkForestShortcutButton extends DarkForestButton {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-shortcut-button';

  // Defining element styles without a decorator
  // These are injected into the shadowRoot so they aren't applied globally
  static styles = [
    ...DarkForestButton.styles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
      }

      /* Styling from https://www.npmjs.com/package/keyboard-css */
      .keyboardButton {
        font-size: 0.7rem;
        line-height: 1.4;
        padding: 0.1rem 0.45rem;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        border: 1px solid ${unsafeCSS(dfstyles.colors.border)};
        border-radius: 0.25rem;
        display: inline-block;
        font-weight: 400;
        text-align: left;
        transform: translateZ(5px);
        transform-style: preserve-3d;
        transition: all 0.25s cubic-bezier(0.2, 1, 0.2, 1);
        box-shadow: 0 0 #6b6b6b, 0 0 #6b6b6b, 0 1px #6d6d6d, 0 2px #6d6d6d, 2px 1px 4px #adb5bd,
          0 -1px 1px #adb5bd;
        background-color: #343a40;
        color: ${unsafeCSS(dfstyles.colors.text)};
        flex: 0;
        height: fit-content;
        margin: 1px 5px 5px;
      }

      .keyboardButton:focus,
      .keyboardButton:active,
      .keyboardButton.active {
        transform: translate3d(0, 2px, 0);
        box-shadow: 0 0 1px 1px #929292;
        background-color: ${unsafeCSS(dfstyles.colors.text)};
        color: ${unsafeCSS(dfstyles.colors.background)};
      }

      .keyboardButton:after {
        border-radius: 0.375rem;
        border-width: 0.0625rem;
        bottom: -6px;
        left: -0.25rem;
        right: -0.25rem;
        top: -2px;
        transform: translateZ(-2px);
        border-style: solid;
        box-sizing: content-box;
        content: '';
        display: block;
        position: absolute;
        transform-style: preserve-3d;
        transition: all 0.25s cubic-bezier(0.2, 1, 0.2, 1);
        border-color: ${unsafeCSS(dfstyles.colors.borderDarker)};
        background: ${unsafeCSS(dfstyles.colors.background)};
      }

      .keyboardButton:focus::after,
      .keyboardButton:active::after,
      .keyboardButton.active:after {
        transform: translate3d(0, -2px, 0);
        background: transparent;
      }
    `,
  ];

  // Defining element properties without a decorator
  static properties = {
    ...DarkForestButton.properties,
    shortcutKey: {
      type: String,
    },
    shortcutText: {
      type: String,
    },
    _shortcutPressed: {
      state: true,
    },
  };

  // Properties defined above will have a getter/setter created on the component,
  // but we want to define their type and/or defaults on the component
  /**
   * The `shortcutKey` indicates which key this component listens for while it is mounted
   */
  shortcutKey?: string;
  /**
   * The `shortcutText` indicates the key should be displayed and with what text
   */
  shortcutText?: string;
  private _shortcutPressed = false;
  // Since this extends DarkForestButton, the properties it accepts should already be on this component

  render() {
    const button = super.render();
    const kbd = this._renderKbd();

    return html`${button} ${kbd}`;
  }

  private _renderKbd() {
    const classes = {
      keyboardButton: true,
      active: this.active || this._shortcutPressed,
    };

    if (this.shortcutText) {
      return html`<kbd class=${classMap(classes)}>${this.shortcutText}</kbd>`;
    } else {
      return nothing;
    }
  }

  private _getKeyFromEvent(evt: KeyboardEvent) {
    if ((Object.values(SpecialKey) as string[]).includes(evt.key)) {
      return evt.key;
    }
    return evt.key.toLowerCase();
  }

  private _handleKeyDown = (evt: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (this.shortcutKey && this._getKeyFromEvent(evt) === this.shortcutKey) {
      this._shortcutPressed = true;
    }
  };

  private _handleKeyUp = (evt: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (this.shortcutKey && this._getKeyFromEvent(evt) === this.shortcutKey) {
      // Currently not preventing anything else from happening but we should consider it in the future
      if (this._shortcutPressed) {
        const event = new ShortcutPressedEvent();
        this.dispatchEvent(event);
      }
      this._shortcutPressed = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);
  }
}
