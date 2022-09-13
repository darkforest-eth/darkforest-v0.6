import { MAX_PLANET_LEVEL } from '@darkforest_eth/constants';
import {
  CanvasCoords,
  MineRendererType,
  Planet,
  RendererType,
  WorldCoords,
} from '@darkforest_eth/types';
import { engineConsts } from '../EngineConsts';
import { EngineUtils } from '../EngineUtils';
import { Renderer } from '../Renderer';
import { GameGLManager } from '../WebGL/GameGLManager';

export class MineRenderer implements MineRendererType {
  manager: GameGLManager;

  rendererType = RendererType.Mine;

  renderer: Renderer;

  constructor(manager: GameGLManager) {
    this.manager = manager;
    this.renderer = manager.renderer;
  }

  public queueMineScreen(planet: Planet, center: CanvasCoords, radius: number, z: number) {
    const {
      white,
      belt: { silver },
    } = engineConsts.colors;
    const { beltRenderer, mineBodyRenderer } = this.renderer;
    mineBodyRenderer.queueMineScreen(planet, center, radius, z);
    const level = planet.planetLevel;

    const now = EngineUtils.getNow() * 0.3;

    if (level >= 1) beltRenderer.queueBeltAtIdx(planet, center, radius, white, 0, now * 0.5, true);
    if (level >= 3) beltRenderer.queueBeltAtIdx(planet, center, radius, white, 0, -now * 0.5, true);
    if (level >= 5) beltRenderer.queueBeltAtIdx(planet, center, radius, white, 0, -now * 0.3, true);
    if (level >= 7) beltRenderer.queueBeltAtIdx(planet, center, radius, white, 0, now * 0.3, true);
    if (level === MAX_PLANET_LEVEL) {
      beltRenderer.queueBeltAtIdx(planet, center, radius, silver, 2, 0, true);
    }
  }

  public queueMine(planet: Planet, centerW: WorldCoords, radiusW: number) {
    const center = this.manager.renderer.getViewport().worldToCanvasCoords(centerW);
    const radius = this.manager.renderer.getViewport().worldToCanvasDist(radiusW);
    const z = EngineUtils.getPlanetZIndex(planet);

    this.queueMineScreen(planet, center, radius, z);
  }

  public flush() {
    const { beltRenderer, mineBodyRenderer } = this.manager.renderer;
    beltRenderer.flush();
    mineBodyRenderer.flush();
  }

  public setUniforms() {
    const { beltRenderer, mineBodyRenderer } = this.manager.renderer;
    if (mineBodyRenderer.setUniforms) mineBodyRenderer.setUniforms();
    if (beltRenderer.setUniforms) beltRenderer.setUniforms();
  }
}
