import { Theme } from '@spectrum-web-components/theme';
// Only registering the themes we want to support
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/theme/theme-dark.js';
import { css, unsafeCSS } from 'lit';
import * as dfstyles from './styles';

export class DarkForestTheme extends Theme {
  // Not part of LitElement but let's tack on the tagName for easier registration
  static tagName = 'df-theme';
}

Theme.registerThemeFragment(
  'app',
  'app',
  css`
    @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap');

    :host,
    :root {
      color: ${unsafeCSS(dfstyles.colors.text)};
      font-family: 'Inconsolata', monospace;
      font-weight: 300;

      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  `
);
