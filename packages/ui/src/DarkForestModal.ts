import { css, html, LitElement, nothing, PropertyValues, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import * as dfstyles from './styles';

type Coords = { x: number; y: number };
type Contain = 'left' | 'right' | 'top' | 'bottom' | 'horizontal' | 'vertical';

function clipX(x: number, width: number, contain: Contain[]): number {
  let newX = x;
  if (contain.includes('right') || contain.includes('horizontal')) {
    if (newX + width > window.innerWidth) {
      newX = window.innerWidth - width;
    }
  }
  if (contain.includes('left') || contain.includes('horizontal')) {
    if (newX < 0) {
      newX = 0;
    }
  }
  return newX;
}

const clipY = (y: number, height: number, contain: Contain[]): number => {
  let newY = y;
  if (contain.includes('bottom') || contain.includes('vertical')) {
    if (newY + height > window.innerHeight) {
      newY = window.innerHeight - height;
    }
  }
  if (contain.includes('top') || contain.includes('vertical')) {
    if (newY < 0) {
      newY = 0;
    }
  }
  return newY;
};

export class PositionChangedEvent extends Event {
  public coords: Coords;

  constructor(x: number, y: number) {
    super('position-changed', { bubbles: true, cancelable: true, composed: true });
    this.coords = {
      x,
      y,
    };
  }
}

export class DarkForestModal extends LitElement {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-modal';

  // Defining element styles without a decorator
  // These are injected into the shadowRoot so they aren't applied globally
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: absolute;
      z-index: ${unsafeCSS(dfstyles.zIndex.Modal)};
      width: fit-content;
      height: fit-content;
      background: ${unsafeCSS(dfstyles.colors.background)};
      border-radius: ${unsafeCSS(dfstyles.borderRadius)};
      /* Have to use !important here because Tailwind Preflight is too aggressive overrides border */
      border: 1px solid ${unsafeCSS(dfstyles.colors.borderDark)} !important;
      color: ${unsafeCSS(dfstyles.colors.text)};
    }

    .titleBar {
      box-sizing: border-box;
      user-select: none;
      line-height: 1.5em;
      width: 100%;
      cursor: grab;
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: grab;
      gap: 4px;
    }

    .titleBarMaximized {
      border-bottom: 1px solid ${unsafeCSS(dfstyles.colors.borderDark)};
    }

    .titleBarMinimized {
    }

    .titleBarDragging {
      cursor: grabbing;
    }

    .body {
      display: block;
      box-sizing: border-box;
      padding: 8px;
    }
  `;

  // Defining element properties without a decorator
  static properties = {
    minimized: {
      type: Boolean,
    },
    initialX: {
      type: Number,
    },
    initialY: {
      type: Number,
    },
    index: {
      type: Number,
    },
    width: {
      type: String,
    },
    contain: {
      type: Array,
    },
    // Everything with `state: true` is internal reactive state and should be marked as `private` on the class
    _dragging: {
      state: true,
    },
    _mousedownCoords: {
      state: true,
    },
    _delCoords: {
      state: true,
    },
  };

  // Properties defined above will have a getter/setter created on the component,
  // but we want to define their type and/or defaults on the component
  minimized = false;
  initialX?: number;
  initialY?: number;
  index?: number;
  width?: string;
  contain: Contain[] = ['horizontal', 'vertical'];
  private _dragging = false;
  private _mousedownCoords?: Coords;
  private _delCoords?: Coords;

  render() {
    return html`${this.renderTitleBar()} ${this.renderContent()}`;
  }

  // Coords are not reactive because we stach calculations on it and
  // other properties are reactive, so we can just rely on their update cycles
  private _coords?: Coords;

  firstUpdated() {
    const initialX = this.initialX ?? 0.5 * (window.innerWidth - this.offsetWidth);
    const initialY = this.initialY ?? 0.5 * (window.innerHeight - this.offsetHeight);
    this._coords = {
      x: initialX,
      y: initialY,
    };
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Adjust the zIndex if it changed
    if (changedProperties.has('index')) {
      let zIndex = dfstyles.zIndex.Modal;
      if (this.index) {
        zIndex += this.index;
      }
      this.style.zIndex = zIndex;
    }

    // Always try to update the position if any update was requested
    if (!this._coords) return;
    const delX = this._delCoords ? this._delCoords.x : 0;
    const delY = this._delCoords ? this._delCoords.y : 0;

    const x = clipX(this._coords.x + delX, this.offsetWidth, this.contain);
    const y = clipY(this._coords.y + delY, this.offsetHeight, this.contain);

    const left = `${x}px`;
    const top = `${y}px`;

    if (this.style.left !== left || this.style.top !== top) {
      this.style.left = left;
      this.style.top = top;

      const event = new PositionChangedEvent(x, y);
      this.dispatchEvent(event);
    }
  }

  private renderTitleBar() {
    const classes = {
      titleBar: true,
      titleBarMaximized: !this.minimized,
      titleBarMinimized: this.minimized,
      titleBarDragging: this._dragging,
    };
    const styles = {
      width: this.width,
    };
    return html`<slot
      style=${styleMap(styles)}
      class=${classMap(classes)}
      @mousedown=${this._setDragging}
      @mouseup=${this._unsetDragging}
      name="title"
    ></slot>`;
  }

  private renderContent() {
    if (this.minimized) {
      return nothing;
    } else {
      const styles = {
        width: this.width,
      };
      return html`<slot style=${styleMap(styles)} class="body"></slot>`;
    }
  }

  private _setDragging(evt: MouseEvent) {
    // We only want to handle dragging on mouse button that is configured as "left"
    if (evt.button === 0) {
      evt.preventDefault();
      this._dragging = true;
      this._mousedownCoords = { x: evt.clientX, y: evt.clientY };
      this._coords = {
        x: this.offsetLeft,
        y: this.offsetTop,
      };
    }
  }

  private _unsetDragging(evt: MouseEvent) {
    evt.preventDefault();
    this._handleMoveEnd(evt);
  }

  // Handler is attached to Window, so we use an arrow function to bind `this`
  private _handleMouseMove = (evt: MouseEvent) => {
    if (!this._dragging) return;
    if (!this._mousedownCoords) return;

    this._delCoords = {
      x: evt.clientX - this._mousedownCoords.x,
      y: evt.clientY - this._mousedownCoords.y,
    };
  };

  // Handler is attached to Window, so we use an arrow function to bind `this`
  private _handleMoveEnd = (evt: MouseEvent) => {
    if (!this._dragging) return;
    if (!this._mousedownCoords) return;
    if (!this._coords) return;

    const delX = evt.clientX - this._mousedownCoords.x;
    const delY = evt.clientY - this._mousedownCoords.y;

    this._coords = {
      x: clipX(this._coords.x + delX, this.offsetWidth, this.contain),
      y: clipY(this._coords.y + delY, this.offsetHeight, this.contain),
    };

    this._dragging = false;
    this._mousedownCoords = undefined;
    this._delCoords = undefined;
  };

  // Handler is attached to Window, so we use an arrow function to bind `this`
  private _handleResize = () => {
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('mousemove', this._handleMouseMove);
    window.addEventListener('mouseleave', this._handleMoveEnd);
    window.addEventListener('mouseup', this._handleMoveEnd);
    window.addEventListener('resize', this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._handleMouseMove);
    window.removeEventListener('mouseleave', this._handleMoveEnd);
    window.removeEventListener('mouseup', this._handleMoveEnd);
    window.removeEventListener('resize', this._handleResize);
  }
}
