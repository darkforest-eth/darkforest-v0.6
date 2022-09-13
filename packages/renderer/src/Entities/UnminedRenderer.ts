import {
  CanvasCoords,
  RendererType,
  RenderZIndex,
  RGBVec,
  UnminedRendererType,
} from '@darkforest_eth/types';
import { EngineUtils } from '../EngineUtils';
import { UNMINED_PROGRAM_DEFINITION } from '../Programs/UnminedProgram';
import { GameGLManager } from '../WebGL/GameGLManager';
import { GenericRenderer } from '../WebGL/GenericRenderer';

export class UnminedRenderer
  extends GenericRenderer<typeof UNMINED_PROGRAM_DEFINITION, GameGLManager>
  implements UnminedRendererType
{
  quad3Buffer: number[];
  quad2Buffer: number[];
  rendererType = RendererType.Unmined;
  constructor(manager: GameGLManager) {
    super(manager, UNMINED_PROGRAM_DEFINITION);
    this.quad3Buffer = EngineUtils.makeEmptyQuad();
    this.quad2Buffer = EngineUtils.makeQuadVec2(0, 0, 1, 1);
  }

  public queueRect(
    { x, y }: CanvasCoords,
    width: number,
    height: number,
    color: RGBVec = [255, 0, 0],
    zIdx: number = RenderZIndex.DEFAULT
  ): void {
    const { position: posA, rectPos: rectPosA, color: colorA } = this.attribManagers;
    const { x1, y1 } = { x1: x, y1: y };
    const { x2, y2 } = { x2: x + width, y2: y + height };

    EngineUtils.makeQuadBuffered(this.quad3Buffer, x1, y1, x2, y2, zIdx);
    posA.setVertex(this.quad3Buffer, this.verts);
    rectPosA.setVertex(this.quad2Buffer, this.verts);

    for (let i = 0; i < 6; i++) {
      colorA.setVertex(color, this.verts + i);
    }

    this.verts += 6;
  }

  public setUniforms() {
    this.uniformSetters.matrix(this.manager.projectionMatrix);

    const time = EngineUtils.getNow();
    this.uniformSetters.time(time);

    const viewport = this.manager.renderer.getViewport();
    const { x: xC, y: yC } = viewport.worldToCanvasCoords(viewport.centerWorldCoords);
    this.uniformSetters.viewportCenter([xC, yC, 0]);
  }
}
