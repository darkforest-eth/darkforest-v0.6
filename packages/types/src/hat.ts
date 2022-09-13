import type { Abstract } from './utility';

export type HatType = Abstract<string, 'HatType'>;

export const HatType = {
  GraduationCap: 'GraduationCap' as HatType,
  PartyHat: 'PartyHat' as HatType,
  Fish: 'Fish' as HatType,
  TopHat: 'TopHat' as HatType,
  Fez: 'Fez' as HatType,
  ChefHat: 'ChefHat' as HatType,
  CowboyHat: 'CowboyHat' as HatType,
  PopeHat: 'PopeHat' as HatType,
  Squid: 'Squid' as HatType,
  SantaHat: 'SantaHat' as HatType,
};
