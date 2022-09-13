import { getPlanetCosmetic } from '@darkforest_eth/procedural';
import {
  CanvasCoords,
  Planet,
  QuasarBodyRendererType,
  RendererType,
  WorldCoords,
} from '@darkforest_eth/types';
import { EngineUtils } from '../EngineUtils';
import { QUASARBODY_PROGRAM_DEFINITION } from '../Programs/QuasarBodyProgram';
import { GameGLManager } from '../WebGL/GameGLManager';
import { GenericRenderer } from '../WebGL/GenericRenderer';

export class QuasarBodyRenderer
  extends GenericRenderer<typeof QUASARBODY_PROGRAM_DEFINITION, GameGLManager>
  implements QuasarBodyRendererType
{
  quad3Buffer: number[];
  quad2Buffer: number[];

  rendererType = RendererType.QuasarBody;

  constructor(manager: GameGLManager) {
    super(manager, QUASARBODY_PROGRAM_DEFINITION);

    this.quad3Buffer = EngineUtils.makeEmptyQuad();
    this.quad2Buffer = EngineUtils.makeQuadVec2(-1, 1, 1, -1);
  }

  public queueQuasarBodyScreen(
    planet: Planet,
    center: CanvasCoords,
    radius: number,
    z: number,
    angle = 0
  ) {
    const { position, color, rectPos } = this.attribManagers;

    const h = radius * (0.65 + Math.cos(angle) * 0.35);
    const w = radius;

    const x1 = -w;
    const y1 = -h;
    const x2 = +w;
    const y2 = +h;

    const effAngle = Math.sin(angle) * (Math.PI / 6);

    EngineUtils.makeQuadBuffered(this.quad3Buffer, x1, y1, x2, y2, z);
    EngineUtils.rotateQuad(this.quad3Buffer, effAngle);
    EngineUtils.translateQuad(this.quad3Buffer, [center.x, center.y]);

    position.setVertex(this.quad3Buffer, this.verts);
    rectPos.setVertex(this.quad2Buffer, this.verts);

    const cosmetic = getPlanetCosmetic(planet);

    // push the same color 6 times
    for (let i = 0; i < 6; i++) {
      color.setVertex(cosmetic.oceanRgb, this.verts + i);
    }

    this.verts += 6;
  }

  public queueQuasarBody(
    planet: Planet,
    centerW: WorldCoords,
    radiusW: number,
    z: number,
    angle = 0
  ): void {
    const center = this.manager.renderer.getViewport().worldToCanvasCoords(centerW);
    const radius = this.manager.renderer.getViewport().worldToCanvasDist(radiusW);

    this.queueQuasarBodyScreen(planet, center, radius, z, angle);
  }

  public setUniforms() {
    this.uniformSetters.matrix(this.manager.projectionMatrix);

    const time = EngineUtils.getNow();
    this.uniformSetters.time(time / 6);
  }
}
