import type { EthAddress, LocationId } from './identifier';
import type { Abstract } from './utility';

/**
 * This set of types essentially defines a protocol by which we can add individual `Message`s (which
 * have a `type` and a `sender` and a `timeCreated` and a `body`, where the body can really be
 * anything) to individual planets. A planet can have an unlimited amount of messages of any type.
 * Rate limiting, serializing/deserializing, enforcing ownership requirements, all these things are
 * *not* the responsibility of this message protocol. Use this as a storage mechanism and take care
 * of the buisness logic yourself.
 *
 * Currently there is one type of message that a planet can have: an single emoji 'flag' set by the
 * owner of the planet, which hovers above the planet on everyone's web client.
 *
 * In the future, we might consider building things like:
 * - a comment on a planet. anyone can just post any text comment.
 * - an emoji react to a planet.
 * - an http url set by the owner of the planet
 * - some cosmetic item that we want to give some planets.
 * - a markdown file posted by the owner of the planet.
 *
 * In the future, we might also consider supporting at the very least submitting hashes of these
 * messages on-chain.
 */

/**
 * Abstract type representing a type of planet message.
 */
export type PlanetMessageType = Abstract<string, 'PlanetMessageType'>;

/**
 * Each message type has a corresponding entry here.
 */
export const PlanetMessageType = {
  EmojiFlag: 'EmojiFlag' as PlanetMessageType,
} as const;

/**
 * Owners of planets can post emojis on the planet.
 */
export interface EmojiFlagBody {
  emoji: string;
}

/**
 * Thinking about future message types.
 */
export type PlanetMessageBody = EmojiFlagBody | unknown;

/**
 * We can save these to and retrieve these from the database.
 */
export interface PlanetMessage<T extends PlanetMessageBody> {
  id: string;
  type: PlanetMessageType;
  sender: EthAddress;
  timeCreated: number;
  planetId: LocationId;
  body: T;
}

/**
 * Asks the webserver to get all the the messages posted to some set of planets.
 */
export interface PlanetMessageRequest {
  planets: LocationId[];
}

/**
 * Contains the answer to the above question.
 */
export interface PlanetMessageResponse {
  [planetId: string /* this is really a LocationId */]: PlanetMessage<unknown>[];
}

/**
 * Asks the webserver to post an emoji to a particular planet.
 */
export interface PostMessageRequest<T extends PlanetMessageBody> {
  type: PlanetMessageType;
  locationId: LocationId;
  body: T;
}

/**
 * Asks the webserver to delete some messages.
 */
export interface DeleteMessagesRequest {
  locationId: LocationId;
  ids: string[];
}

/**
 * A signed message contains some sort of message, as well as its signature and the address that
 * claims to have signed this message.
 */
export interface SignedMessage<T> {
  sender?: EthAddress;
  signature?: string;
  message: T;
}
