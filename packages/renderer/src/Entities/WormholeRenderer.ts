import {
  LocationId,
  RendererType,
  RenderZIndex,
  WormholeRendererType,
} from '@darkforest_eth/types';
import { engineConsts } from '../EngineConsts';
import { Renderer } from '../Renderer';
import { GameGLManager } from '../WebGL/GameGLManager';
const { purpleA } = engineConsts.colors;

export class WormholeRenderer implements WormholeRendererType {
  renderer: Renderer;

  rendererType = RendererType.Wormhole;

  constructor(gl: GameGLManager) {
    this.renderer = gl.renderer;
  }

  queueWormholes() {
    const { context: gameUIManager } = this.renderer;

    for (const unconfirmedWormhole of gameUIManager.getUnconfirmedWormholeActivations()) {
      if (unconfirmedWormhole.intent.wormholeTo)
        this.drawVoyagePath(
          unconfirmedWormhole.intent.locationId,
          unconfirmedWormhole.intent.wormholeTo,
          false
        );
    }

    for (const wormhole of gameUIManager.getWormholes()) {
      this.drawVoyagePath(wormhole.from, wormhole.to, true);
    }
  }

  private drawVoyagePath(from: LocationId, to: LocationId, confirmed: boolean) {
    const { context: gameUIManager } = this.renderer;

    const fromLoc = gameUIManager.getLocationOfPlanet(from);
    const fromPlanet = gameUIManager.getPlanetWithId(from);
    const toLoc = gameUIManager.getLocationOfPlanet(to);
    const toPlanet = gameUIManager.getPlanetWithId(to);
    if (!fromPlanet || !fromLoc || !toLoc || !toPlanet) {
      return;
    }

    this.renderer.lineRenderer.queueLineWorld(
      fromLoc.coords,
      toLoc.coords,
      purpleA,
      confirmed ? 2 : 1,
      RenderZIndex.Voyages,
      confirmed ? false : true
    );
  }

  // eslint-disable-next-line
  flush() {}
}
