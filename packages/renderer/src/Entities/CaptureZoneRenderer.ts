import { CaptureZoneRendererType, RendererType } from '@darkforest_eth/types';
import { Renderer, RendererGameContext } from '../Renderer';
import { GameGLManager } from '../WebGL/GameGLManager';

export class CaptureZoneRenderer implements CaptureZoneRendererType {
  rendererType = RendererType.CaptureZone;
  gl: GameGLManager;
  context: RendererGameContext;
  renderer: Renderer;

  constructor(glManager: GameGLManager) {
    this.gl = glManager;
    this.renderer = glManager.renderer;
    this.context = glManager.renderer.context;
  }

  queueCaptureZones(): void {
    const { circleRenderer: cR } = this.renderer;
    for (const zone of this.context.getCaptureZones()) {
      cR.queueCircleWorld(zone.coords, zone.radius, [255, 215, 0, 75]);
    }
  }

  flush(): void {
    const { circleRenderer: cR } = this.renderer;
    cR.flush();
  }
}
