import {
  Artifact,
  ArtifactId,
  AsteroidRendererType,
  BackgroundRendererType,
  BaseRenderer,
  BeltRendererType,
  BlackDomainRendererType,
  CaptureZone,
  CaptureZoneRendererType,
  Chunk,
  CircleRendererType,
  DiagnosticUpdater,
  EthAddress,
  GameViewport,
  IRendererConfig,
  LineRendererType,
  LocatablePlanet,
  LocationId,
  MineBodyRendererType,
  MineRendererType,
  PerlinConfig,
  PerlinRendererType,
  Planet,
  PlanetLevel,
  PlanetRendererType,
  PlanetRenderInfo,
  PlanetRenderManagerType,
  Player,
  QuasarBodyRendererType,
  QuasarRayRendererType,
  QuasarRendererType,
  QueuedArrival,
  RectRendererType,
  RendererType,
  RingRendererType,
  RuinsRendererType,
  Setting,
  SpaceRendererType,
  SpacetimeRipRendererType,
  SpaceType,
  SpriteRendererType,
  TextRendererType,
  Transaction,
  UIRendererType,
  UnconfirmedActivateArtifact,
  UnconfirmedMove,
  UnminedRendererType,
  VoyageRendererType,
  WorldCoords,
  WorldLocation,
  Wormhole,
  WormholeRendererType,
} from '@darkforest_eth/types';
import autoBind from 'auto-bind';
import { AsteroidRenderer } from './Entities/AsteroidRenderer';
import { BackgroundRenderer } from './Entities/BackgroundRenderer';
import { BeltRenderer } from './Entities/BeltRenderer';
import { BlackDomainRenderer } from './Entities/BlackDomainRenderer';
import { CaptureZoneRenderer } from './Entities/CaptureZoneRenderer';
import { CircleRenderer } from './Entities/CircleRenderer';
import { LineRenderer } from './Entities/LineRenderer';
import { MineBodyRenderer } from './Entities/MineBodyRenderer';
import { MineRenderer } from './Entities/MineRenderer';
import { PerlinRenderer } from './Entities/PerlinRenderer';
import { PlanetRenderer } from './Entities/PlanetRenderer';
import { PlanetRenderManager } from './Entities/PlanetRenderManager';
import { QuasarBodyRenderer } from './Entities/QuasarBodyRenderer';
import { QuasarRayRenderer } from './Entities/QuasarRayRenderer';
import { QuasarRenderer } from './Entities/QuasarRenderer';
import { RectRenderer } from './Entities/RectRenderer';
import { RingRenderer } from './Entities/RingRenderer';
import { RuinsRenderer } from './Entities/RuinsRenderer';
import { SpaceRenderer } from './Entities/SpaceRenderer';
import { SpacetimeRipRenderer } from './Entities/SpacetimeRipRenderer';
import { SpriteRenderer } from './Entities/SpriteRenderer';
import { TextRenderer } from './Entities/TextRenderer';
import { UnminedRenderer } from './Entities/UnminedRenderer';
import { VoyageRenderer } from './Entities/VoyageRenderer';
import { WormholeRenderer } from './Entities/WormholeRenderer';
import { Overlay2DRenderer } from './Overlay2DRenderer';
import {
  isAsteroidRenderer,
  isBackgroundRenderer,
  isBeltRenderer,
  isBlackDomainRenderer,
  isCaptureZoneRenderer,
  isCircleRenderer,
  isLineRenderer,
  isMineBodyRenderer,
  isMineRenderer,
  isPerlinRenderer,
  isPlanetRenderer,
  isPlanetRendererManager,
  isQuasarBodyRenderer,
  isQuasarRayRenderer,
  isQuasarRenderer,
  isRectRenderer,
  isRingRenderer,
  isRuinsRenderer,
  isSpaceRenderer,
  isSpacetimeRipRenderer,
  isSpriteRenderer,
  isTextRenderer,
  isUIRendererManager,
  isUnminedRenderer,
  isVoyageRenderer,
  isWormholeRenderer,
} from './RendererTypeAssertions';
import { UIRenderer } from './UIRenderer';
import { GameGLManager } from './WebGL/GameGLManager';

export interface RendererGameContext extends DiagnosticUpdater {
  getStringSetting(setting: Setting): string | undefined;
  getBooleanSetting(setting: Setting): boolean;
  getIsHighPerfMode(): boolean;
  getWorldRadius(): number;
  getMouseDownPlanet(): LocatablePlanet | undefined;
  getLocationsAndChunks(): { chunks: Set<Chunk>; cachedPlanets: Map<LocationId, PlanetRenderInfo> };
  getLocationOfPlanet(planetId: LocationId): WorldLocation | undefined;
  getPlanetWithId(planetId: LocationId | undefined): Planet | undefined;
  getAccount(): EthAddress | undefined;
  getAllVoyages(): QueuedArrival[];
  getPlayer(address?: EthAddress): Player | undefined;
  getUnconfirmedMoves(): Transaction<UnconfirmedMove>[];
  spaceTypeFromPerlin(perlin: number): SpaceType;
  getPerlinConfig(isBiome: boolean): PerlinConfig;
  getArtifactWithId(artifactId: ArtifactId | undefined): Artifact | undefined;
  getSpaceTypePerlin(coords: WorldCoords, floor: boolean): number;
  getPerlinThresholds(): [number, number, number];
  isOwnedByMe(planet: Planet): boolean;
  getArtifactsWithIds(artifactIds: ArtifactId[]): Array<Artifact | undefined>;
  getSelectedPlanet(): LocatablePlanet | undefined;
  getHoveringOverPlanet(): Planet | undefined;
  getHoveringOverCoords(): WorldCoords | undefined;
  getSelectedCoords(): WorldCoords | undefined;
  getForcesSending(planetId: LocationId): number;
  getEnergyArrivingForMove(
    from: LocationId,
    to: LocationId | undefined,
    dist: number | undefined,
    energy: number
  ): number;
  getIsChoosingTargetPlanet(): boolean;
  getWormholes(): Iterable<Wormhole>;
  getRadiusOfPlanetLevel(planetRarity: PlanetLevel): number;
  getDistCoords(from: WorldCoords, to: WorldCoords): number;
  isOverOwnPlanet(coords: WorldCoords): Planet | undefined;
  getPlanetWithCoords(coords: WorldCoords | undefined): Planet | undefined;
  getUnconfirmedWormholeActivations(): Transaction<UnconfirmedActivateArtifact>[];
  getAllMinerLocations(): WorldCoords[];
  drawAllRunningPlugins(ctx: CanvasRenderingContext2D): void;
  isSendingShip(planetId: LocationId): boolean;
  isAbandoning(): boolean;
  getArtifactSending(planetId: LocationId): Artifact | undefined;
  getAbandonRangeChangePercent(): number;
  getCaptureZones(): Iterable<CaptureZone>;
}

export class Renderer {
  public static instance: Renderer | null;

  private viewport: GameViewport;

  canvas: HTMLCanvasElement;
  glCanvas: HTMLCanvasElement;

  bufferCanvas: HTMLCanvasElement;

  frameRequestId: number;
  context: RendererGameContext;

  frameCount: number;
  now: number; // so that we only need to compute Date.now() once per frame

  // render engines
  public glManager: GameGLManager;
  overlay2dRenderer: Overlay2DRenderer;

  // primitives
  lineRenderer: LineRendererType;
  circleRenderer: CircleRendererType;
  textRenderer: TextRendererType;
  rectRenderer: RectRendererType;

  // game background
  bgRenderer: BackgroundRendererType;
  spaceRenderer: SpaceRendererType;
  perlinRenderer: PerlinRendererType;
  unminedRenderer: UnminedRendererType;

  //non planet entities
  asteroidRenderer: AsteroidRendererType;
  ringRenderer: RingRendererType;
  spriteRenderer: SpriteRendererType;
  blackDomainRenderer: BlackDomainRendererType;
  captureZoneRenderer: CaptureZoneRendererType;

  //planet entities
  planetRenderer: PlanetRendererType;
  mineRenderer: MineRendererType;
  mineBodyRenderer: MineBodyRendererType;
  beltRenderer: BeltRendererType;
  quasarRenderer: QuasarRendererType;
  quasarBodyRenderer: QuasarBodyRendererType;
  quasarRayRenderer: QuasarRayRendererType;
  spacetimeRipRenderer: SpacetimeRipRendererType;
  ruinsRenderer: RuinsRendererType;

  // render managers
  uiRenderManager: UIRendererType;
  planetRenderManager: PlanetRenderManagerType;
  voyageRenderManager: VoyageRendererType;
  wormholeRenderManager: WormholeRendererType;

  private previousRenderTimestamp: number;
  rendererStack: BaseRenderer[];
  config: IRendererConfig;

  private constructor(
    canvas: HTMLCanvasElement,
    glCanvas: HTMLCanvasElement,
    bufferCanvas: HTMLCanvasElement,
    viewport: GameViewport,
    context: RendererGameContext,
    config: IRendererConfig
  ) {
    this.canvas = canvas;
    this.glCanvas = glCanvas;
    this.bufferCanvas = bufferCanvas;
    this.context = context;

    this.glManager = new GameGLManager(this, this.glCanvas);
    this.overlay2dRenderer = new Overlay2DRenderer(this, this.canvas);
    this.previousRenderTimestamp = Date.now();

    this.viewport = viewport;

    this.frameCount = 0;
    this.now = Date.now();
    this.config = config;
    autoBind(this);

    // do async stuff here e.g.: loadTextures(() => this.setup());
    this.setup();
  }

  private setup() {
    this.rendererStack = [
      new PlanetRenderer(this.glManager),
      new MineRenderer(this.glManager),
      new BeltRenderer(this.glManager),
      new MineBodyRenderer(this.glManager),
      new SpacetimeRipRenderer(this.glManager),
      new QuasarRenderer(this.glManager),
      new RuinsRenderer(this.glManager),

      new AsteroidRenderer(this.glManager),
      new RingRenderer(this.glManager),
      new SpriteRenderer(this.glManager),
      new BlackDomainRenderer(this.glManager),

      new LineRenderer(this.glManager),
      new CircleRenderer(this.glManager),
      new RectRenderer(this.glManager),

      new TextRenderer(this.glManager),
      new SpaceRenderer(this.glManager),
      new PerlinRenderer(this.glManager),
      new UnminedRenderer(this.glManager),

      new BackgroundRenderer(this.glManager),

      new VoyageRenderer(this.glManager),
      new WormholeRenderer(this.glManager),
      new PlanetRenderManager(this.glManager),
      new UIRenderer(this.glManager),

      new QuasarBodyRenderer(this.glManager),
      new QuasarRayRenderer(this.glManager),
      new CaptureZoneRenderer(this.glManager),
    ];
    for (const index in this.rendererStack) {
      this.setRenderer(this.rendererStack[index]);
    }
    this.loop();
  }

  static destroy(): void {
    if (Renderer.instance) {
      window.cancelAnimationFrame(Renderer.instance.frameRequestId);
    }
    Renderer.instance = null;
  }

  static initialize(
    canvas: HTMLCanvasElement,
    glCanvas: HTMLCanvasElement,
    bufferCanvas: HTMLCanvasElement,
    viewport: GameViewport,
    context: RendererGameContext,
    config: IRendererConfig
  ) {
    const canvasRenderer = new Renderer(canvas, glCanvas, bufferCanvas, viewport, context, config);
    Renderer.instance = canvasRenderer;

    return canvasRenderer;
  }

  private recordRender(now: number) {
    this.context.updateDiagnostics((d) => {
      d.fps = 1000 / (now - this.previousRenderTimestamp);
    });

    this.previousRenderTimestamp = now;
  }

  private loop() {
    this.frameCount++;
    this.now = Date.now();
    this.draw();
    this.recordRender(Date.now());

    this.frameRequestId = window.requestAnimationFrame(() => this.loop());
  }

  /* one optimization we make is to queue batches of lots of vertices, then flush them all to the GPU in one go.
       one result of this is that things don't draw in the order they're queued - they draw in the order they're flushed.
       so *all lines* will draw before *all planets*. if you want to change the ordering on the layers, you need to add
       an early flush() somewhere. */

  private draw() {
    // write matrix uniform
    this.glManager.setProjectionMatrix();

    // clear all
    this.overlay2dRenderer.clear();
    this.glManager.isHighPerf = this.context.getIsHighPerfMode();
    this.glManager.clear();

    // get some data
    const { cachedPlanets, chunks } = this.context.getLocationsAndChunks();

    const innerNebulaColor = this.context.getStringSetting(Setting.RendererColorInnerNebula);
    const nebulaColor = this.context.getStringSetting(Setting.RendererColorNebula);
    const spaceColor = this.context.getStringSetting(Setting.RendererColorSpace);
    const deepSpaceColor = this.context.getStringSetting(Setting.RendererColorDeepSpace);
    const deadSpaceColor = this.context.getStringSetting(Setting.RendererColorDeadSpace);

    const isHighPerfMode = this.context.getBooleanSetting(Setting.HighPerformanceRendering);
    const disableEmojis = this.context.getBooleanSetting(Setting.DisableEmojiRendering);
    const disableHats = this.context.getBooleanSetting(Setting.DisableHatRendering);
    const drawChunkBorders = this.context.getBooleanSetting(Setting.DrawChunkBorders);
    const disableFancySpaceEffect = this.context.getBooleanSetting(Setting.DisableFancySpaceEffect);

    // draw the bg
    this.bgRenderer.queueChunks(
      chunks,
      isHighPerfMode,
      drawChunkBorders,
      disableFancySpaceEffect,
      innerNebulaColor,
      nebulaColor,
      spaceColor,
      deepSpaceColor,
      deadSpaceColor
    );
    this.bgRenderer.flush();

    this.uiRenderManager.queueBorders();

    this.captureZoneRenderer.queueCaptureZones();
    this.captureZoneRenderer.flush();

    this.uiRenderManager.queueSelectedRangeRing();
    this.uiRenderManager.queueSelectedRect();
    this.uiRenderManager.queueHoveringRect();
    this.uiRenderManager.queueMousePath();
    this.uiRenderManager.drawMiner(); // drawn to canvas, which sits above gl

    // queue voyages calls
    this.voyageRenderManager.queueVoyages();

    // queue wormhole calls
    this.wormholeRenderManager.queueWormholes();

    // queue planets
    this.planetRenderManager.queuePlanets(
      cachedPlanets,
      this.now,
      isHighPerfMode,
      disableEmojis,
      disableHats
    );

    // flush all - ordering matters! (they get drawn bottom-up)

    this.lineRenderer.flush();
    this.planetRenderManager.flush();
    this.voyageRenderManager.flush();
    this.wormholeRenderManager.flush();
    this.uiRenderManager.flush();
    this.circleRenderer.flush();
    this.rectRenderer.flush();
    this.textRenderer.flush();
    this.spriteRenderer.flush();

    // render all of the plugins
    this.context.drawAllRunningPlugins(this.overlay2dRenderer.ctx);
  }

  /**
   * Determines the type of the passed in renderer and replaces the
   * current renderer of the same type with the one passed in.
   * If the renderer is determined to not follow any of the renderer
   * types it will print a message into the console
   * @param renderer - an unknown renderer
   * @returns
   */
  private setRenderer(renderer: BaseRenderer): boolean {
    switch (renderer.rendererType) {
      case RendererType.Planet:
        if (isPlanetRenderer(renderer)) {
          this.planetRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Planet Renderer');
        return false;

      case RendererType.Mine:
        if (isMineRenderer(renderer)) {
          this.mineRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Mine Renderer');
        return false;

      case RendererType.SpacetimeRip:
        if (isSpacetimeRipRenderer(renderer)) {
          this.spacetimeRipRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Spacetime Rip Renderer');
        return false;

      case RendererType.Quasar:
        if (isQuasarRenderer(renderer)) {
          this.quasarRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Quasar renderer');
        return false;

      case RendererType.Ruins:
        if (isRuinsRenderer(renderer)) {
          this.ruinsRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Ruins Renderer');
        return false;

      case RendererType.Asteroid:
        if (isAsteroidRenderer(renderer)) {
          this.asteroidRenderer = renderer;
          break;
        }
        console.log('Renderer is not an Asteroid renderer');
        return false;

      case RendererType.Ring:
        if (isRingRenderer(renderer)) {
          this.ringRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Ring Renderer');
        return false;

      case RendererType.Sprite:
        if (isSpriteRenderer(renderer)) {
          this.spriteRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Sprite Renderer');
        return false;

      case RendererType.BlackDomain:
        if (isBlackDomainRenderer(renderer)) {
          this.blackDomainRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Black Domain Renderer');
        return false;

      case RendererType.Text:
        if (isTextRenderer(renderer)) {
          this.textRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Text Renderer');
        return false;

      case RendererType.Voyager:
        if (isVoyageRenderer(renderer)) {
          this.voyageRenderManager = renderer;
          break;
        }
        console.log('Renderer is not a Voywage Renderer');
        return false;

      case RendererType.Wormhole:
        if (isWormholeRenderer(renderer)) {
          this.wormholeRenderManager = renderer;
          break;
        }
        console.log('Renderer is not a Wormhole renderer');
        return false;

      case RendererType.MineBody:
        if (isMineBodyRenderer(renderer)) {
          this.mineBodyRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Mine Body Renderer');
        return false;

      case RendererType.Belt:
        if (isBeltRenderer(renderer)) {
          this.beltRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Belt Renderer');
        return false;

      case RendererType.Background:
        if (isBackgroundRenderer(renderer)) {
          this.bgRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Background Renderer');
        return false;

      case RendererType.Space:
        if (isSpaceRenderer(renderer)) {
          this.spaceRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Space Renderer');
        return false;

      case RendererType.Unmined:
        if (isUnminedRenderer(renderer)) {
          this.unminedRenderer = renderer;
          break;
        }
        console.log('Renderer is not an Unmined Renderer');
        return false;

      case RendererType.Perlin:
        if (isPerlinRenderer(renderer)) {
          this.perlinRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Perlin Renderer');
        return false;

      case RendererType.Line:
        if (isLineRenderer(renderer)) {
          this.lineRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Line Renderer');
        return false;

      case RendererType.Rect:
        if (isRectRenderer(renderer)) {
          this.rectRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Rect Renderer');
        return false;

      case RendererType.Circle:
        if (isCircleRenderer(renderer)) {
          this.circleRenderer = renderer;
          break;
        }
        console.log('Renderer is not a Circle Renderer');
        return false;

      case RendererType.UI:
        if (isUIRendererManager(renderer)) {
          this.uiRenderManager = renderer;
          break;
        }
        console.log('Renderer is not a UIRenderer');
        return false;

      case RendererType.PlanetManager:
        if (isPlanetRendererManager(renderer)) {
          this.planetRenderManager = renderer;
          break;
        }
        console.log('Renderer is not a PlanetRenderManager');
        return false;

      case RendererType.QuasarBody:
        if (isQuasarBodyRenderer(renderer)) {
          this.quasarBodyRenderer = renderer;
          break;
        }
        console.log('Renderer is not a QuasarBodyRenderer');
        return false;

      case RendererType.QuasarRay:
        if (isQuasarRayRenderer(renderer)) {
          this.quasarRayRenderer = renderer;
          break;
        }
        console.log('Renderer is not a QuasarRayRenderer');
        return false;

      case RendererType.CaptureZone:
        if (isCaptureZoneRenderer(renderer)) {
          this.captureZoneRenderer = renderer;
          break;
        }
        console.log('Renderer is not a CaptureZoneRenderer');
        return false;

      default:
        console.log(renderer.rendererType);
        console.log(typeof renderer.rendererType);
        console.log('Not a valid RendererType');
        return false;
    }
    return true;
  }

  /**
   * Called by GameUIManager to add custom renderer into the game.
   * The function automatically determines what kind of renderer it is based on the type property.
   * The renderer is then added onto the rendering stack
   * The renderer stack is a data structure used to determine which renderer to draw with.
   * The most recently added renderers to the stack will be the ones to be used.
   * @param renderer
   */
  public addCustomRenderer(renderer: BaseRenderer) {
    if (this.setRenderer(renderer)) {
      this.rendererStack.push(renderer);
      return;
    }
    console.log('Unable to add custom renderer');
  }

  /**
   * Called by GameUIManager to remove the passed in renderers from the game.
   * @param renderer - passed in renderer
   */
  public removeCustomRenderer(renderer: BaseRenderer) {
    const index = this.rendererStack.indexOf(renderer);
    if (index > -1) {
      this.rendererStack.splice(index, 1);
    } else {
      console.log('Renderer not found');
    }
    for (const index in this.rendererStack) {
      this.setRenderer(this.rendererStack[index]);
    }
  }

  public get2DRenderer() {
    return this.overlay2dRenderer.ctx;
  }

  public getViewport(): GameViewport {
    return this.viewport;
  }
}
