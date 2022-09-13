import { getPlanetCosmetic } from '@darkforest_eth/procedural';
import {
  AsteroidRendererType,
  CanvasCoords,
  DrawMode,
  GameViewport,
  Planet,
  RendererType,
  RGBVec,
} from '@darkforest_eth/types';
import { EngineUtils } from '../EngineUtils';
import { ASTEROID_PROGRAM_DEFINITION } from '../Programs/AsteroidProgram';
import { GameGLManager } from '../WebGL/GameGLManager';
import { GenericRenderer } from '../WebGL/GenericRenderer';

export class AsteroidRenderer
  extends GenericRenderer<typeof ASTEROID_PROGRAM_DEFINITION>
  implements AsteroidRendererType
{
  viewport: GameViewport;

  rendererType = RendererType.Asteroid;

  constructor(manager: GameGLManager) {
    super(manager, ASTEROID_PROGRAM_DEFINITION);
    this.viewport = manager.renderer.getViewport();
  }

  public queueAsteroid(planet: Planet, centerW: CanvasCoords, radiusW: number, color: RGBVec) {
    const {
      position: posA,
      color: colorA,
      radius: radiusA,
      theta: thetaA,
      seed: seedA,
    } = this.attribManagers;

    const center = this.viewport.worldToCanvasCoords(centerW);
    const radius = this.viewport.worldToCanvasDist(radiusW);

    const cosmetic = getPlanetCosmetic(planet);

    const { x, y } = center;

    const z = EngineUtils.getPlanetZIndex(planet);

    // initial asteroid offset
    const theta = (color[0] * 255 ** 2 + color[1] * 255 + color[2]) % 10000;

    posA.setVertex([x, y, z], this.verts);
    colorA.setVertex(color, this.verts);
    radiusA.setVertex([radius], this.verts);
    thetaA.setVertex([theta], this.verts);
    seedA.setVertex([cosmetic.seed], this.verts);

    this.verts += 1;
  }

  public setUniforms() {
    this.uniformSetters.matrix(this.manager.projectionMatrix);
    this.uniformSetters.now(EngineUtils.getNow());
  }

  public flush() {
    super.flush(DrawMode.Points);
  }
}
