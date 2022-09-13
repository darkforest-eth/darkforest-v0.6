import { hslToRgb } from '@darkforest_eth/procedural';
import { RGBAVec, RGBVec } from '@darkforest_eth/types';

export const engineConsts = {
  fontStyle: '64px monospace',
  dashLength: 10,
  planet: {
    maxRadius: 4,
  },
  glyphs: {
    glyphW: 40,
    glyphH: 64,
    rowL: 13,
    canvasDim: 1024,
    scale: 4,
  },
  colors: {
    artifacts: {
      shine: [255, 251, 207] as RGBVec,
      trim: [240, 227, 86] as RGBVec,
    },
    gold: [255, 221, 48] as RGBVec,
    orange: [196, 101, 0] as RGBVec,
    orangeA: [196, 101, 0, 255] as RGBAVec,
    barbs: [153, 102, 102] as RGBVec,
    barbsA: [153, 102, 102, 255] as RGBAVec,
    white: [255, 255, 255] as RGBVec,
    whiteA: [255, 255, 255, 255] as RGBAVec,
    purpleA: [255, 0, 255, 255] as RGBAVec,
    purple: [255, 0, 255] as RGBVec,
    red: [255, 0, 0] as RGBVec,
    redA: [255, 0, 0, 255] as RGBAVec,
    range: {
      dash: [150, 145, 191] as RGBVec,
      energy: [245, 180, 130] as RGBVec,
    },
    voyage: {
      enemy: [255, 0, 0] as RGBVec,
      enemyA: [255, 0, 0, 255] as RGBAVec,
      mine: [0, 0, 255] as RGBVec,
      mineA: [255, 255, 255, 255] as RGBAVec,
      // Alpha version of `gold` above
      shipA: [255, 221, 48, 255] as RGBAVec,
    },
    bonus: {
      energyCap: hslToRgb([360, 73, 70]) as RGBVec,
      energyGro: hslToRgb([136, 73, 70]) as RGBVec,
      speed: hslToRgb([290, 73, 70]) as RGBVec,
      range: hslToRgb([50, 73, 70]) as RGBVec,
      defense: hslToRgb([231, 73, 70]) as RGBVec,
      spaceJunk: hslToRgb([44, 32, 29]) as RGBVec,
    },
    belt: {
      silver: [240, 180, 50] as RGBVec,
      speed: hslToRgb([290, 85, 80]) as RGBVec,
      range: hslToRgb([50, 85, 80]) as RGBVec,
      defense: hslToRgb([231, 85, 80]) as RGBVec,
    },
  },
};
