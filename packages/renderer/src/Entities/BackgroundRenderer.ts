import {
  BackgroundRendererType,
  Chunk,
  RendererType,
  RGBVec,
  SpaceType,
} from '@darkforest_eth/types';
import { Renderer } from '../Renderer';
import { GameGLManager } from '../WebGL/GameGLManager';
import { RectRenderer } from './RectRenderer';

export class BackgroundRenderer implements BackgroundRendererType {
  manager: GameGLManager;

  renderer: Renderer;

  borderRenderer: RectRenderer;

  chunkShadowRenderer: RectRenderer;

  highQuality = true;

  rendererType = RendererType.Background;

  constructor(manager: GameGLManager) {
    this.manager = manager;
    this.renderer = manager.renderer;

    this.borderRenderer = new RectRenderer(manager);

    this.chunkShadowRenderer = new RectRenderer(manager);
  }

  queueChunks(
    exploredChunks: Iterable<Chunk>,
    highPerfMode: boolean,
    drawChunkBorders: boolean,
    disableFancySpaceEffect: boolean,
    innerNebulaColor?: string,
    nebulaColor?: string,
    spaceColor?: string,
    deepSpaceColor?: string,
    deadSpaceColor?: string
  ): void {
    // upload current camera transform to shader
    const { unminedRenderer, spaceRenderer, perlinRenderer } = this.renderer;
    if (highPerfMode) return;

    // use low quality effect if:
    // the user explicitly disabled it OR the user is in high perf mode
    this.highQuality = !(disableFancySpaceEffect || highPerfMode);

    /* draw using mask program */
    const viewport = this.manager.renderer.getViewport();

    // draw large background rect underneath everything
    unminedRenderer.queueRect(
      { x: 0, y: 0 },
      viewport.viewportWidth,
      viewport.viewportHeight,
      [0, 0, 0],
      4
    );
    if (innerNebulaColor && nebulaColor && spaceColor && deepSpaceColor && deadSpaceColor) {
      spaceRenderer.setColorConfiguration(
        innerNebulaColor,
        nebulaColor,
        spaceColor,
        deepSpaceColor,
        deadSpaceColor
      );
    }

    for (const exploredChunk of exploredChunks) {
      if (viewport.intersectsViewport(exploredChunk)) {
        // add this chunk to the verts array
        if (this.highQuality) {
          spaceRenderer.queueChunk(exploredChunk);
          this.chunkShadowRenderer.queueChunkBorderWithPadding(
            exploredChunk,
            1 + 1 * viewport.scale
          );
        } else {
          perlinRenderer.queueChunk(exploredChunk);
        }

        if (drawChunkBorders) {
          this.borderRenderer.queueChunkBorder(exploredChunk);
          // this.renderer.overlay2dRenderer.drawChunk(exploredChunk);
        }
      }
    }
  }

  fillPerlin() {
    const {
      canvas: { width, height },
      ctx,
    } = this.renderer.overlay2dRenderer;

    const { context } = this.renderer;
    const viewport = this.manager.renderer.getViewport();

    ctx.globalAlpha = 0.5;
    for (let x = 0; x < width; x += 100) {
      for (let y = 0; y < height; y += 100) {
        const worldCoords = viewport.canvasToWorldCoords({ x, y });

        const space = context.spaceTypeFromPerlin(context.getSpaceTypePerlin(worldCoords, false));

        let color: RGBVec = [255, 0, 0];
        // if (space === SpaceType.NEBULA) ctx.fillStyle = '#ff0000';
        if (space === SpaceType.SPACE) color = [0, 255, 0];
        if (space === SpaceType.DEEP_SPACE) color = [0, 0, 255];
        if (space === SpaceType.DEAD_SPACE) color = [0, 255, 0];

        // ctx.beginPath();
        // ctx.fillRect(x, y, 20, 20);

        this.borderRenderer.queueRect({ x, y }, 20, 20, color);
      }
    }

    ctx.globalAlpha = 1.0;
  }

  flush(): void {
    const { unminedRenderer, spaceRenderer, perlinRenderer } = this.renderer;
    if (this.highQuality) {
      unminedRenderer.flush();
      this.chunkShadowRenderer.flush();
      spaceRenderer.flush();
    } else {
      perlinRenderer.flush();
    }
    this.borderRenderer.flush();
  }
}
