// TODO: Migrate all DF styles over to here
import color from 'color';

const text = color('#bbb').hex();
const dfred = '#FF6492';
const dfgreen = '#00DC82';
const subtext = color(text).darken(0.3).hex();

const background = '#151515';
const backgroundDark = '#252525';
const backgroundLight = color(background).lighten(0.5).hex();

const border = '#777';
const borderDark = color(border).darken(0.2).hex();
const borderDarker = color(borderDark).darken(0.2).hex();

export const colors = {
  dfgreen,
  dfred,
  text,
  subtext,

  background,
  backgroundDark,
  backgroundLight,

  border,
  borderDark,
  borderDarker,
};

export const zIndex = {
  MenuBar: '4',
  HoverPlanet: '1001',
  Modal: '1001',
  Tooltip: '16000000',
  Notification: '1000',
};

export const borderRadius = '3px';
