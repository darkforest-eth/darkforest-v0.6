import * as decoders from 'decoders';

const decodeAdminPlanet = decoders.exact({
  x: decoders.number,
  y: decoders.number,
  level: decoders.number,
  planetType: decoders.number,
  requireValidLocationId: decoders.boolean,
  revealLocation: decoders.boolean,
});

export type AdminPlanets = ReturnType<typeof decodeAdminPlanets>;

export const decodeAdminPlanets = decoders.guard(decoders.array(decodeAdminPlanet), {
  style: 'simple',
});
