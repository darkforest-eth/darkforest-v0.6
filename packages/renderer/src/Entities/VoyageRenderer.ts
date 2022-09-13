import { EMPTY_ADDRESS } from '@darkforest_eth/constants';
import { formatNumber, hasOwner } from '@darkforest_eth/gamelogic';
import { getOwnerColorVec } from '@darkforest_eth/procedural';
import {
  LocationId,
  Planet,
  Player,
  QueuedArrival,
  RendererType,
  RenderZIndex,
  TextAlign,
  TextAnchor,
  VoyageRendererType,
} from '@darkforest_eth/types';
import { engineConsts } from '../EngineConsts';
import { Renderer } from '../Renderer';
import { GameGLManager } from '../WebGL/GameGLManager';

const { white, gold } = engineConsts.colors;
const { enemyA, mineA, shipA } = engineConsts.colors.voyage;

function getVoyageColor(fromPlanet: Planet, toPlanet: Planet, isMine: boolean, isShip: boolean) {
  if (isMine) {
    return mineA;
  }

  const isAttack = hasOwner(toPlanet) && fromPlanet.owner !== toPlanet.owner;
  if (isAttack) {
    if (isShip) {
      return shipA;
    } else {
      return enemyA;
    }
  }

  return getOwnerColorVec(fromPlanet);
}

/* responsible for calling renderers in order to draw voyages */
export class VoyageRenderer implements VoyageRendererType {
  renderer: Renderer;

  rendererType = RendererType.Voyager;
  constructor(gl: GameGLManager) {
    this.renderer = gl.renderer;
  }

  drawFleet(
    voyage: QueuedArrival,
    _player: Player | undefined,
    isMyVoyage: boolean,
    isShipVoyage: boolean
  ) {
    const {
      now: nowMs,
      context: gameUIManager,
      circleRenderer: cR,
      textRenderer: tR,
      spriteRenderer: sR,
    } = this.renderer;

    const fromLoc = gameUIManager.getLocationOfPlanet(voyage.fromPlanet);
    const fromPlanet = gameUIManager.getPlanetWithId(voyage.fromPlanet);
    const toLoc = gameUIManager.getLocationOfPlanet(voyage.toPlanet);
    const toPlanet = gameUIManager.getPlanetWithId(voyage.toPlanet);
    if (!fromPlanet || !toLoc) {
      // not enough info to draw anything
      return;
    } else if (!fromLoc && fromPlanet && toLoc && toPlanet) {
      // can draw a ring around dest, but don't know source location
      const myMove = voyage.player === gameUIManager.getAccount();
      const shipMove = voyage.player === EMPTY_ADDRESS;
      const now = nowMs / 1000;
      const timeLeft = voyage.arrivalTime - now;
      const radius = (timeLeft * fromPlanet.speed) / 100;
      const color = getVoyageColor(fromPlanet, toPlanet, myMove, shipMove);

      const text = shipMove ? 'Ship' : `${Math.floor(voyage.energyArriving)}`;

      cR.queueCircleWorld(toLoc.coords, radius, color, 0.7, 1, true);
      tR.queueTextWorld(
        `${text} in ${Math.floor(timeLeft)}s`,
        { x: toLoc.coords.x, y: toLoc.coords.y + radius },
        color,
        undefined,
        TextAlign.Center,
        TextAnchor.Bottom
      );
    } else if (fromLoc && fromPlanet && toLoc && toPlanet) {
      // know source and destination locations

      const now = nowMs / 1000;
      let proportion = (now - voyage.departureTime) / (voyage.arrivalTime - voyage.departureTime);
      proportion = Math.max(proportion, 0.01);
      proportion = Math.min(proportion, 0.99);

      const shipsLocationX = (1 - proportion) * fromLoc.coords.x + proportion * toLoc.coords.x;
      const shipsLocationY = (1 - proportion) * fromLoc.coords.y + proportion * toLoc.coords.y;
      const shipsLocation = { x: shipsLocationX, y: shipsLocationY };

      const timeLeftSeconds = Math.floor(voyage.arrivalTime - now);
      const voyageColor = getVoyageColor(fromPlanet, toPlanet, isMyVoyage, isShipVoyage);

      // alpha calculation
      const viewport = this.renderer.getViewport();
      const dx = fromLoc.coords.x - toLoc.coords.x;
      const dy = fromLoc.coords.y - toLoc.coords.y;
      const distWorld = Math.sqrt(dx ** 2 + dy ** 2);
      const dist = viewport.worldToCanvasDist(distWorld);
      let alpha = 255;
      if (dist < 300) {
        alpha = (dist / 300) * 255;
      }

      voyageColor[3] = alpha;
      const fleetRadius = 4;
      const artifactSizePixels = 20;
      cR.queueCircleWorldCenterOnly(shipsLocation, fleetRadius, voyageColor);
      if (voyage.artifactId) {
        const artifact = gameUIManager.getArtifactWithId(voyage.artifactId);
        if (artifact) {
          const viewport = this.renderer.getViewport();
          const screenCoords = viewport.worldToCanvasCoords(shipsLocation);
          const distanceFromCenterOfFleet = fleetRadius * 1.5 + artifactSizePixels;
          const x = distanceFromCenterOfFleet + screenCoords.x;
          const y = screenCoords.y;
          sR.queueArtifact(artifact, { x, y }, artifactSizePixels);
        }
      }

      // queue text
      tR.queueTextWorld(
        `${timeLeftSeconds.toString()}s`,
        {
          x: shipsLocationX,
          y: shipsLocationY - 0.5,
        },
        [...white, alpha],
        0,
        TextAlign.Center,
        TextAnchor.Top
      );
      if (voyage.energyArriving > 0) {
        tR.queueTextWorld(
          `${formatNumber(voyage.energyArriving)}`,
          {
            x: shipsLocationX,
            y: shipsLocationY + 0.5,
          },
          [...white, alpha],
          -0,
          TextAlign.Center,
          TextAnchor.Bottom
        );
      }
      if (voyage.silverMoved > 0) {
        tR.queueTextWorld(
          `${formatNumber(voyage.silverMoved)}`,
          {
            x: shipsLocationX,
            y: shipsLocationY + 0.5,
          },
          [...gold, alpha],
          -1,
          TextAlign.Center,
          TextAnchor.Bottom
        );
      }
    }
  }

  queueVoyages(): void {
    const { context: gameUIManager, now } = this.renderer;
    const voyages = gameUIManager.getAllVoyages();
    for (const voyage of voyages) {
      const nowS = now / 1000;
      if (nowS < voyage.arrivalTime) {
        const isMyVoyage =
          voyage.player === gameUIManager.getAccount() ||
          gameUIManager.getArtifactWithId(voyage.artifactId)?.controller ===
            gameUIManager.getPlayer()?.address;
        const isShipVoyage = voyage.player === EMPTY_ADDRESS;
        const sender = gameUIManager.getPlayer(voyage.player);
        this.drawVoyagePath(voyage.fromPlanet, voyage.toPlanet, true, isMyVoyage, isShipVoyage);
        this.drawFleet(voyage, sender, isMyVoyage, isShipVoyage);
      }
    }

    const unconfirmedDepartures = gameUIManager.getUnconfirmedMoves();
    for (const unconfirmedMove of unconfirmedDepartures) {
      this.drawVoyagePath(
        unconfirmedMove.intent.from,
        unconfirmedMove.intent.to,
        false,
        true,
        // This false doesn't matter because we force isMyVoyage to true
        false
      );
    }
  }

  private drawVoyagePath(
    from: LocationId,
    to: LocationId,
    confirmed: boolean,
    isMyVoyage: boolean,
    isShipVoyage: boolean
  ) {
    const { context: gameUIManager } = this.renderer;

    const fromLoc = gameUIManager.getLocationOfPlanet(from);
    const fromPlanet = gameUIManager.getPlanetWithId(from);
    const toLoc = gameUIManager.getLocationOfPlanet(to);
    const toPlanet = gameUIManager.getPlanetWithId(to);
    if (!fromPlanet || !fromLoc || !toLoc || !toPlanet) {
      return;
    }

    const voyageColor = getVoyageColor(fromPlanet, toPlanet, isMyVoyage, isShipVoyage);

    this.renderer.lineRenderer.queueLineWorld(
      fromLoc.coords,
      toLoc.coords,
      voyageColor,
      confirmed ? 2 : 1,
      RenderZIndex.Voyages,
      confirmed ? false : true
    );
  }

  // eslint-disable-next-line
  flush() {}
}
