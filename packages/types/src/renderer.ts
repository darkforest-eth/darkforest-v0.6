import type { mat3, mat4 } from 'gl-matrix';
import type { RenderedArtifact } from './artifact';
import type { HatType } from './hat';
import type { LocationId } from './identifier';
import type { LocatablePlanet, Planet } from './planet';
import type { Abstract } from './utility';
import type { Chunk, WorldCoords } from './world';

export interface PlanetRenderInfo {
  planet: LocatablePlanet;
  radii: Radii;
}

export interface Radii {
  radiusWorld: number;
  radiusPixels: number;
}

export interface CanvasCoords {
  x: number;
  y: number;
}

export interface GameViewport {
  worldToCanvasCoords(worldCoords: WorldCoords): CanvasCoords;
  worldToCanvasDist(dist: number): number;
  canvasToWorldCoords(canvasCoord: CanvasCoords): WorldCoords;
  scale: number;
  centerWorldCoords: WorldCoords;
  viewportWidth: number;
  viewportHeight: number;
  intersectsViewport(chunk: Chunk): boolean;
}

export type AttribType = Abstract<number, 'AttribType'>;
export const AttribType = {
  Float: 5126 as AttribType, // window.WebGL2RenderingContext && WebGL2RenderingContext['FLOAT'],
  UByte: 5121 as AttribType, // window.WebGL2RenderingContext && WebGL2RenderingContext['UNSIGNED_BYTE'],
};

export type DrawMode = Abstract<number, 'DrawMode'>;
export const DrawMode = {
  Triangles: 4 as DrawMode, // window.WebGL2RenderingContext && WebGL2RenderingContext['TRIANGLES'],
  Lines: 1 as DrawMode, // window.WebGL2RenderingContext && WebGL2RenderingContext['LINES'],
  Points: 0 as DrawMode, // window.WebGL2RenderingContext && WebGL2RenderingContext['POINTS'],
};

export type AttribProps = {
  dim: number;
  type: AttribType; // gl.FLOAT, etc
  normalize: boolean;
  name: string;
};

export type UniformType = Abstract<number, 'UniformType'>;
export const UniformType = {
  Mat4: 0 as UniformType,
  Mat3: 1 as UniformType,
  UByte: 2 as UniformType,
  Float: 3 as UniformType,
  Texture: 4 as UniformType,
  Vec3: 5 as UniformType,
};

export type Vec3 = [number, number, number];

export type UniformJSType = mat4 | mat3 | number | Vec3;

export type UniformProps = {
  name: string;
  type: UniformType;
};

export type RGBVec = [number, number, number];

export type RGBAVec = [number, number, number, number];

export type Translation = {
  x: number;
  y: number;
};

export type Scaling = {
  x: number;
  y: number;
};
export type HSLVec = readonly [number, number, number];

export type TextAlign = Abstract<number, 'TextAlign'>;
export const TextAlign = {
  Left: 0 as TextAlign,
  Center: 0.5 as TextAlign,
  Right: 1 as TextAlign,
};

export type TextAnchor = Abstract<number, 'TextAnchor'>;
export const TextAnchor = {
  Top: 0 as TextAnchor,
  Middle: 0.5 as TextAnchor,
  Bottom: 1 as TextAnchor,
};

export type RenderZIndex = Abstract<number, 'RenderZIndex'>;
export const RenderZIndex = {
  Background: 0 as RenderZIndex,
  Voyages: -1 as RenderZIndex,
  Planets: -10 as RenderZIndex,
  Text: -11 as RenderZIndex,
  UI: -12 as RenderZIndex,

  DEFAULT: -98 as RenderZIndex,
  MAX: -99 as RenderZIndex,
};

export type RuinsInfo = {
  [PlanetLevel: number]: {
    weights: [number, number, number, number];
    props: [number, number, number, number];
  };
};

export interface PlanetCosmeticInfo {
  baseHue: number;

  baseStr: string;
  bgStr: string;

  baseColor: RGBVec;
  baseColor2: RGBVec;
  baseColor3: RGBVec;

  mtnColor: RGBVec;
  mtnColor2: RGBVec;
  mtnColor3: RGBVec;

  backgroundColor: RGBVec;
  previewColor: RGBVec;

  landRgb: RGBVec;
  oceanRgb: RGBVec;
  beachRgb: RGBVec;

  asteroidHsl: HSLVec;

  seed: number;

  hatType: HatType;

  spacetime1: RGBVec;
  spacetime2: RGBVec;
  spacetime3: RGBVec;

  ruins?: RuinsInfo;
}

export type SpaceColorConfiguration = {
  innerNebulaColor?: string;
  nebulaColor?: string;
  spaceColor?: string;
  deepSpaceColor?: string;
  deadSpaceColor?: string;
};

export interface IRendererConfig {
  spaceColors: SpaceColorConfiguration;
}

/**
 * Enum for determining the type of renderer
 * Each renderer should contain a variable called 'rendererType'
 * 'rendererType' should be a enum that corresponds with the type of renderer it is
 */
export type RendererType = Abstract<number, 'RendererType'>;
export const RendererType = {
  Planet: 0 as RendererType,
  Mine: 1 as RendererType,
  SpacetimeRip: 2 as RendererType,
  Quasar: 3 as RendererType,
  Ruins: 4 as RendererType,
  Asteroid: 5 as RendererType,
  Ring: 6 as RendererType,
  Sprite: 7 as RendererType,
  BlackDomain: 8 as RendererType,
  Text: 9 as RendererType,
  Voyager: 10 as RendererType,
  Wormhole: 11 as RendererType,
  MineBody: 12 as RendererType,
  Belt: 13 as RendererType,
  Background: 14 as RendererType,
  Space: 15 as RendererType,
  Unmined: 16 as RendererType,
  Perlin: 17 as RendererType,
  Line: 18 as RendererType,
  Rect: 19 as RendererType,
  Circle: 20 as RendererType,
  UI: 21 as RendererType,
  PlanetManager: 22 as RendererType,
  QuasarBody: 23 as RendererType,
  QuasarRay: 24 as RendererType,
  CaptureZone: 25 as RendererType,
};

export interface PlanetRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param planet - an object that contains info about the planet to be drawn
   * @param centerW - represents the coordinates of the planet to the game world.
   * @param radiusW - represents the radius of the planet relative to the game world
   */
  queuePlanetBody(planet: Planet, centerW: WorldCoords, radiusW: number): void;

  /**
   * Draws all queued planets.
   */
  flush(): void;
}

export interface MineRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param planet - an object that contains info about the the Mine/Asteroid Field planet to be drawn
   * @param centerW - represents the coordinates of the asteroid field relative to the game world.
   * @param radiusW - represents the radius of the asteroid field relative to the game world
   */
  queueMine(planet: Planet, centerW: WorldCoords, radiusW: number): void;

  /**
   * Draws all queued Asteroid Fields.
   */
  flush(): void;
}

export interface SpacetimeRipRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param planet - an object that contains info about the Spacetime Rip planet to be drawn
   * @param centerW - represents the coordinates of the Spacetime Rips relative to the game world.
   * @param radiusW - represents the radius of the Spacetime Rips relative to the game world.
   */
  queueRip(planet: Planet, centerW: WorldCoords, radiusW: number): void;

  /**
   * Draws all queued Spacetime Rips.
   */
  flush(): void;
}

export interface QuasarRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param planet - an object that contains info about the current Quasar planet
   * @param centerW - represents the coordinates of the current Quasar relative to the game world.
   * @param radiusW - represents the radius of the Quasar relative to the size of the game world.
   */
  queueQuasar(planet: Planet, centerW: WorldCoords, radiusW: number): void;

  /**
   * Draws all queued Quasars.
   */
  flush(): void;
}

export interface RuinsRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param planet - an object that contains info about the current Ruins/Foundery planet
   * @param centerW - represents the coordinates of the current Foundries relative to the game world.
   * @param radiusW - represents the radius of the Foundries relative to the size of the game world
   */
  queueRuins(planet: Planet, centerW: WorldCoords, radiusW: number): void;

  /**
   * Draws all queued Foundries.
   */
  flush(): void;
}

export interface AsteroidRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param planet - an object that contains info about the current planet the Asteroid is revolving
   * @param centerW - represents the coordinates of the planet relative to the game world.
   * @param radiusW - represents the radius of the planet relative to the size of the game world
   */
  queueAsteroid(planet: Planet, centerW: CanvasCoords, radiusW: number, color?: RGBVec): void;

  /**
   * Draws all queued Asteroids.
   */
  flush(): void;
}

export interface RingRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Rings are used to show the different levels of a planet
   * @param planet - an object that contains info about the current planet
   * @param centerW - represents the coordinates of the planet relative to the game world.
   * @param radiusW - represents the radius of the planet relative to the size of the game world
   */
  queueRingAtIdx(
    planet: Planet,
    centerW: WorldCoords,
    radiusW: number,
    color?: RGBVec,
    beltIdx?: number,
    angle?: number
  ): void;

  /**
   * Draws all queued Rings.
   */
  flush(): void;
}

export interface SpriteRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw Artifacts onto the screen when around hovering around a planet
   * @param artifact - an object that contains information on the current Artifact
   * @param posW - The position of the artifact relative to the game world
   * @param widthW - The size of the artifact relative to then game world
   * @param alpha - The opacity of the image of the artifact
   * @param atFrame
   * @param color
   * @param theta - The angle the artifact should be rotated
   * @param viewport - a GameViewport class
   */
  queueArtifactWorld(
    artifact: RenderedArtifact,
    posW: CanvasCoords,
    widthW: number,
    alpha?: number,
    atFrame?: number | undefined,
    color?: RGBVec | undefined,
    theta?: number | undefined,
    viewport?: GameViewport
  ): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw artifacts when traveling with the voyager
   * @param artifact - information on the type of artifact
   * @param pos - the position relative to the canvas
   * @param width - the width of the artifact relative to the canvas
   * @param alpha - The opacity of the image of the artifact
   * @param atFrame
   * @param color
   * @param theta - The angle the artifact should be rotated
   */
  queueArtifact(
    artifact: RenderedArtifact,
    pos: CanvasCoords,
    width?: number,
    alpha?: number,
    atFrame?: number | undefined,
    color?: RGBVec | undefined,
    theta?: number | undefined
  ): void;

  /**
   * Draws all queued Artifacts.
   */
  flush(): void;
}

export interface BlackDomainRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Queue the planet that has been dystroyed to be drawn
   * @param planet - an object that contains info about the current planet
   * @param centerW - Location of the planet relative to the game world
   * @param radiusW - Radius of the planet relative to the game world
   */
  queueBlackDomain(planet: Planet, centerW: WorldCoords, radiusW: number): void;

  /**
   * Draws all queued planets with black domain effect.
   */
  flush(): void;
}

export interface TextRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Queue text to be drawn at world Cooridnates
   * @param text - The text
   * @param coords - The coordinates on relative to the game world
   * @param color - color of the text
   * @param offY - measured in text units - constant screen-coord offset that it useful for drawing nice things
   * @param align - how the text should be aligned
   * @param anchor - How the text should be anchored
   * @param zIdx - The z axis index of the text
   */
  queueTextWorld(
    text: string,
    coords: WorldCoords,
    color?: RGBAVec,
    offY?: number,
    align?: TextAlign,
    anchor?: TextAnchor,
    zIdx?: number
  ): void;

  /**
   * Draws all text in game.
   */
  flush(): void;
}

export interface VoyageRendererType {
  rendererType: RendererType;
  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Unlike most renderer you will not be given information about voyages.
   * You can access all voyages by usin GameUIManger.getAllVoyages()
   */
  queueVoyages(): void;

  /**
   * Draws all active voyages.
   */
  flush(): void;
}

export interface WormholeRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Unlike most renderer you will not be given information about wormholes.
   * GameUIManager.getUnconfirmedWormholeActivations() to get all unconfirmed wormholes
   * GameUIManager.getWormholes() to get all active confirmed wormholes
   */
  queueWormholes(): void;

  /**
   * Draws all Wormholes.
   */
  flush(): void;
}

export interface MineBodyRendererType {
  rendererType: RendererType;
  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Draw the body of the Mine/Asteroid Field
   * @param planet - Planet class that contains information on the current Mine/Asteroid Field
   * @param center - The location of the center of the Asteroid Field relative to the game world.
   * @param radius - Radius of the Asteroid Field relative to the game world
   * @param z - The amount of Asteroids in the Asteroid field
   */
  queueMineScreen(planet: Planet, center: WorldCoords, radius: number, z: number): void;

  /**
   * Draws all queued mine bodies.
   */
  flush(): void;

  setUniforms?(): void;
}

export interface BeltRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Draw the Rings around the Mine/Asteroid Field
   * @param planet - an object that contains info about the Mine/Asteroid Field
   * @param center - The location of the center of the planet. The coordinate system is determined by the screen arguement.
   * @param radius - The radius of the planet relative to game world
   * @param color
   * @param beltIdx - the index of the belt, the belt with the higher idx is the one rendered on top
   * @param angle - The angle the belt should be tilted
   * @param screen - True: coordinates is relative to the canvas False: coordinates are relative to the game world
   */
  queueBeltAtIdx(
    planet: Planet,
    center: WorldCoords | CanvasCoords,
    radius?: number,
    color?: RGBVec,
    beltIdx?: number,
    angle?: number,
    screen?: boolean
  ): void;

  /**
   * Draws all queued asteroid field belts.
   */
  flush(): void;

  setUniforms?(): void;
}

export interface BackgroundRendererType {
  rendererType: RendererType;

  /**
   *
   * @param exploredChunks - an object that contains a alls chunks of space the user has explored
   * @param highPerfMode - if the game is in high perofromance mode found in settings
   * @param drawChunkBorders - draws the boarders on each chunk in the game
   * @param disableFancySpaceEffect - if background renderering should use perlin renderer
   * @param innerNebulaColor
   * @param nebulaColor
   * @param spaceColor
   * @param deepSpaceColor
   * @param deadSpaceColor
   */
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
  ): void;

  /**
   * Draws the background
   */
  flush(): void;
}

export interface SpaceRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Called by the game to draw a chunk of the background. A chunk is a square section of the background.
   * @param chunk a variable that contains information on the chunk being drawn. A chunk is rectangle section of the background
   */
  queueChunk(chunk: Chunk): void;

  /**
   * In the Darkforest settings players can choose to set their own color configuratio for the background. This is called when the color is changed.
   * @param innerNebulaColor
   * @param nebulaColor
   * @param spaceColor
   * @param deepSpaceColor
   * @param deadSpaceColor
   */
  setColorConfiguration(
    innerNebulaColor: string,
    nebulaColor: string,
    spaceColor: string,
    deepSpaceColor: string,
    deadSpaceColor: string
  ): void;

  /**
   * Draws all discovered space
   */
  flush(): void;
}

export interface UnminedRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Called to queue up a chunk of unmined space to be drawn
   * @param  -param0 the x and y positon on the canvas. The bottom left corner
   * @param width - the width of the chunk
   * @param height - the height of the chunk
   * @param color - optional the color of the chunk
   * @param zIdx - Z axis
   */
  queueRect(
    { x, y }: CanvasCoords,
    width: number,
    height: number,
    color?: RGBVec,
    zIdx?: number
  ): void;

  /**
   * Draws all undiscovered space
   */
  flush(): void;
}

/**
 * Perlin Renderer is only used when disable fancy space effects is true
 */
export interface PerlinRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * @param chunk - a variable that contains information on the chunk being drawn. A chunk is rectangle section of the background.
   */
  queueChunk(chunk: Chunk): void;

  /**
   * Draws all discovered space
   */
  flush(): void;
}

export interface LineRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * This will affect every line drawn in the game.
   * Used to draw the line that the voyager take and wormholes
   * @param start - The coordinates of where the lines start relative to the game world
   * @param end - The coordinates of where the lines end relative to the game world
   * @param color
   * @param width - how thick the line should be from the center
   * @param zIdx - Z axis
   * @param dashed - if the line should be dashed
   */
  queueLineWorld(
    start: WorldCoords,
    end: WorldCoords,
    color?: RGBAVec,
    width?: number,
    zIdx?: number,
    dashed?: boolean
  ): void;

  /**
   * Draws all queued lines
   */
  flush(): void;
}

export interface RectRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * This will affect every Rectangle drawn in the game.
   * Drawing the rectangele that shows up when you hover over a planet
   * @param center - Coordinates of the planet relative to the game world
   * @param width - Width of planet relative to the game world
   * @param height - Height of planet relative to the game world
   * @param color
   * @param stroke - How thick the border of the rectangle should be
   * @param zIdx - Z axis
   */
  queueRectCenterWorld(
    center: WorldCoords,
    width: number,
    height: number,
    color?: RGBVec,
    stroke?: number,
    zIdx?: number
  ): void;

  /**
   * Draws all queued rectangles
   */
  flush(): void;
}

export interface CircleRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * This will affect every Cricle drawn in the game.
   * Used for drawing the range a planet can attack
   * Used for highlighting the destination of a voyage
   * Used for drawing the world boarder
   * Used for drawing capture zones
   * @param center - Center of the circle relative to the canvas
   * @param radius - Radius relative to the canvas
   * @param color
   * @param stroke - How thick the stroke of the circle should be
   * @param angle - The angle/arc of the cirlce to draw
   * @param dashed - If the circumference of the circle should be dashed
   */
  queueCircleWorld(
    center: CanvasCoords,
    radius: number,
    color?: RGBAVec,
    stroke?: number,
    angle?: number,
    dashed?: boolean
  ): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used for drawing the voyager (circle)
   * @param center - center of the circle relative to the game world
   * @param radius - size of the circle relative to the game world
   * @param color
   */
  queueCircleWorldCenterOnly(
    center: WorldCoords,
    radius: number, // canvas coords
    color?: RGBAVec
  ): void;

  /**
   * Draws all queued circles
   */
  flush(): void;
}

export interface UIRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw the boarder of the game.
   */
  queueBorders(): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw the range of a planet when it is selected
   */
  queueSelectedRangeRing(): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw a rectangle around a planet to indicate that the planet has been selected
   */
  queueSelectedRect(): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw a rectangle around a planet to indicate that the planet is being hovered over
   */
  queueHoveringRect(): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw the path the mouse is taking when trying to transfer energy
   */
  queueMousePath(): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw the Miner
   */
  drawMiner(): void;

  /**
   * Draws all queued items
   */
  flush(): void;
}

export interface PlanetRenderManagerType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw the range of a planet when it is selected
   */
  queueRangeRings(planet: LocatablePlanet): void;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used for Drawing all types of planets
   * @param cachedPlanets - A Map that contains all planets that have been discovered by the user
   * @param now - the modular of the current unix time by (2 * pi  * 12000) in seconds
   * @param highPerfMode - if the game is in high performance mode
   * @param disableEmojis
   * @param disableHats
   */
  queuePlanets(
    cachedPlanets: Map<LocationId, PlanetRenderInfo>,
    now?: number,
    highPerfMode?: boolean,
    disableEmojis?: boolean,
    disableHats?: boolean
  ): void;

  /**
   * Draw all queued planets
   */
  flush(): void;
}

export interface QuasarBodyRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to Draw the body of the Quasar
   * @param planet - an object that contains info about the current Quasar planet
   * @param centerW - represents the coordinates of the current Quasar relative to the game world.
   * @param radiusW - represents the radius of the Quasar relative to the size of the game world.
   * @param z - z axis
   * @param angle - the angle the body should be titled
   */
  queueQuasarBody(
    planet: Planet,
    centerW: WorldCoords,
    radiusW: number,
    z?: number,
    angle?: number
  ): void;

  /**
   * Draw all queued Quasar Bodies
   */
  flush(): void;

  setUniforms?(): void;
}

export interface QuasarRayRendererType {
  rendererType: RendererType;

  /**
   * The game calls the queue function when the entities should be put into a back buffer queue.
   * The back buffer is used to contain information on the entities being drawn for later use in the flush function.
   * The implementing renderer should contains its own back buffer.
   * Used to draw the rays on the Quasar.
   * There are 2 rays one on top and one on the bottom
   * @param planet - an object that contains info about the current Quasar planet
   * @param centerW - represents the coordinates of the current Quasar relative to the game world.
   * @param radiusW - represents the radius of the Quasar relative to the size of the game world.
   * @param z - z axis
   * @param top - if the ray is ontop of the Quasar
   * @param angle - the angle the body should be titled
   */
  queueQuasarRay(
    planet: Planet,
    centerW: WorldCoords,
    radiusW: number,
    z?: number,
    top?: boolean,
    angle?: number
  ): void;

  /**
   * Draw all queued Quasar Rays
   */
  flush(): void;

  setUniforms?(): void;
}

export interface CaptureZoneRendererType {
  rendererType: RendererType;

  /**
   * Queue all Capture Zones
   */
  queueCaptureZones(): void;

  /**
   * Draw all Capture Zones
   */
  flush(): void;
}
/**
 * The purpose of this interface is for type checking
 * It make sures that the variable is a type of renderer
 */
export interface BaseRenderer {
  rendererType: RendererType;

  flush(): void;
}

export type RendererProgram = {
  attribs: {
    [key: string]: AttribProps;
  };
  uniforms: {
    [key: string]: UniformProps;
  };
  vertexShader: string;
  fragmentShader: string;
};
