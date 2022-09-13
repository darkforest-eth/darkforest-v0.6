import { HandleController, Slider, SliderHandle } from '@spectrum-web-components/slider';
import { css, CSSResultArray, unsafeCSS } from 'lit';
import * as dfstyles from './styles';

export class DarkForestSlider extends Slider {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-slider';

  public static get styles(): CSSResultArray {
    const customStyles = css`
      :host {
        --spectrum-slider-m-track-height: 8px;
        --spectrum-slider-m-track-handleoffset: 2px;
        --spectrum-slider-m-height: var(--df-slider-height);
        --spectrum-slide-label-text-size: 14px;
        --spectrum-fieldlabel-m-text-size: 14px;
        --spectrum-slider-m-label-text-color: ${unsafeCSS(dfstyles.colors.subtext)};
        --spectrum-fieldlabel-m-text-color: ${unsafeCSS(dfstyles.colors.subtext)};
        width: var(--df-slider-width, 100%);
      }

      .track:first-of-type::before {
        border-radius: 3px 0 0 3px;
      }

      .track:last-of-type::before {
        border-radius: 0 3px 3px 0;
      }
    `;
    return [...super.styles, customStyles];
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderRoot.addEventListener('keyup', this._handleKeyUp);
    this.renderRoot.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    this.renderRoot.removeEventListener('keyup', this._handleKeyUp);
    this.renderRoot.removeEventListener('keydown', this._handleKeyDown);
    super.disconnectedCallback();
  }

  // For some reason, the HandleController.inputForHandle in Spectrum Slider can throw
  // so we catch and ignore it in handlePointerdown/handlePointerup/handlePointermove
  public handlePointerdown(event: PointerEvent): void {
    try {
      return super.handlePointerdown(event);
    } catch {}
  }
  public handlePointerup(event: PointerEvent): void {
    try {
      return super.handlePointerup(event);
    } catch {}
  }
  public handlePointermove(event: PointerEvent): void {
    try {
      return super.handlePointermove(event);
    } catch {}
  }

  private _handleKeyUp = (evt: Event) => {
    if (evt.target === this.numberField) {
      // This prevents typing from bubbling up to shortcut handler if typing in the numberField
      evt.stopPropagation();
    }
  };
  private _handleKeyDown = (evt: Event) => {
    if (evt.target === this.numberField) {
      // This prevents typing from bubbling up to shortcut handler if typing in the numberField
      evt.stopPropagation();
    }
  };
}

export class DarkForestSliderHandle extends SliderHandle {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-slider-handle';

  private _handleChange(_evt: Event) {
    const controller = this.handleController as HandleController;
    const handleNamesInOrder = Object.keys(controller.values);
    const idx = handleNamesInOrder.findIndex((name) => name === this.handleName);
    const value = this.value;

    const step = this.step || 1;

    // We want to treat these as exclusive, not inclusive
    if (this.min === 'previous') {
      const prevIdx = idx - 1;
      const handleName = handleNamesInOrder[prevIdx];
      if (value === controller.values[handleName]) {
        this.value = value + step;
      }
    }

    // We want to treat these as exclusive, not inclusive
    if (this.max === 'next') {
      const nextIdx = idx + 1;
      const handleName = handleNamesInOrder[nextIdx];
      if (value === controller.values[handleName]) {
        this.value = value - step;
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._handleChange);
  }

  disconnectedCallback() {
    this.removeEventListener('change', this._handleChange);
    super.disconnectedCallback();
  }
}
