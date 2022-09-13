/**
 * This package contains `.wasm` compiled SNARK circuits and `.zkey`
 * proving/verifier keys for the Dark Forest SNARKs. It also contains typescript
 * types for inputs and outputs to the SnarkJS functions we use to calculate
 * Dark Forest SNARK proofs, as well as conversion methods that convert between
 * SnarkJS outputs and Dark Forest contract call args.
 *
 * ## Installation
 *
 * You can install this package using [`npm`](https://www.npmjs.com) or
 * [`yarn`](https://classic.yarnpkg.com/lang/en/) by running:
 *
 * ```bash
 * npm install --save @darkforest_eth/snarks
 * ```
 * ```bash
 * yarn add @darkforest_eth/snarks
 * ```
 *
 * When using this in a plugin, you might want to load it with [skypack](https://www.skypack.dev)
 *
 * ```js
 * import * as snarks from 'http://cdn.skypack.dev/@darkforest_eth/snarks'
 * ```
 *
 * @packageDocumentation
 */

/**
 * Shape of a javascript object that must be passed into snarkJS `fullProve`
 * proof generation function for `reveal` circuit
 */
export interface RevealSnarkInput {
  x: string;
  y: string;
  PLANETHASH_KEY: string;
  SPACETYPE_KEY: string;
  SCALE: string;
  xMirror: string;
  yMirror: string;
}

/**
 * Shape of the args for `revealLocation` DarkForest contract call
 */
export type RevealSnarkContractCallArgs = [
  [string, string], // proofA
  [
    // proofB
    [string, string],
    [string, string]
  ],
  [string, string], // proofC
  [string, string, string, string, string, string, string, string, string] // locationId (BigInt), perlin, x (BigInt mod p), y (BigInt mod p), planetHashKey, spaceTypeKey, perlin lengthscale, perlin xmirror, perlin ymirror
];

/**
 * Shape of a javascript object that must be passed into snarkJS `fullProve`
 * proof generation function for `init` circuit
 */
export interface InitSnarkInput {
  x: string;
  y: string;
  r: string;
  PLANETHASH_KEY: string;
  SPACETYPE_KEY: string;
  SCALE: string;
  xMirror: string;
  yMirror: string;
}

/**
 * Shape of the args for the `initializePlayer` DarkForest contract call
 */
export type InitSnarkContractCallArgs = [
  [string, string], // proofA
  [
    // proofB
    [string, string],
    [string, string]
  ],
  [string, string], // proofC
  [string, string, string, string, string, string, string, string] // locationId (BigInt), perlin, radius, planetHashKey, spaceTypeKey, perlin lengthscale, perlin xmirror, perlin ymirror
];

/**
 * Shape of a javascript object that must be passed into snarkJS `fullProve`
 * proof generation function for `move` circuit
 */
export interface MoveSnarkInput {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  r: string;
  distMax: string;
  PLANETHASH_KEY: string;
  SPACETYPE_KEY: string;
  SCALE: string;
  xMirror: string;
  yMirror: string;
}

/**
 * (Almost) shape of the args for `move` DarkForest contract call.
 * The fourth array element additionally needs shipsMoved, silverMoved, and
 * artifactIdMoved before it can be passed as args to `move`, but those values
 * are not part of the zkSNARK.
 */
export type MoveSnarkContractCallArgs = [
  [string, string], // proofA
  [
    // proofB
    [string, string],
    [string, string]
  ],
  [string, string], // proofC
  [
    string, // from locationID (BigInt)
    string, // to locationID (BigInt)
    string, // perlin at to
    string, // radius at to
    string, // distMax
    string, // planetHashKey
    string, // spaceTypeKey
    string, // perlin lengthscale
    string, // perlin xmirror (1 true, 0 false)
    string // perlin ymirror (1 true, 0 false)
  ]
];

/**
 * Shape of a javascript object that must be passed into snarkJS `fullProve`
 * proof generation function for `biomebase` circuit
 */
export interface BiomebaseSnarkInput {
  x: string;
  y: string;
  PLANETHASH_KEY: string;
  BIOMEBASE_KEY: string;
  SCALE: string;
  xMirror: string;
  yMirror: string;
}

/**
 * Shape of the args for `findArtifact` DarkForest contract call.
 */
export type BiomebaseSnarkContractCallArgs = [
  [string, string], // proofA
  [
    // proofB
    [string, string],
    [string, string]
  ],
  [string, string], // proofC
  [
    string, // hash
    string, // biomebase
    string, // planethash key
    string, // biomebase key
    string, // perlin lengthscale
    string, // perlin xmirror (1 true, 0 false)
    string // perlin ymirror (1 true, 0 false)
  ]
];

/**
 * Shape of a javascript object that must be passed into snarkJS `fullProve`
 * proof generation function for `whitelist` circuit
 */
export interface WhitelistSnarkInput {
  key: string;
  recipient: string;
}

/**
 * Shape of the args for `whitelistRegister` DarkForest contract call.
 */
export type WhitelistSnarkContractCallArgs = [
  [string, string], // proofA
  [
    // proofB
    [string, string],
    [string, string]
  ],
  [string, string], // proofC
  [
    string, // hashed whitelist key
    string // recipient address
  ]
];

/**
 * Type representing the shape of args that are passed into DarkForest
 * functions that require zkSNARK verification.
 */
export type ContractCallArgs =
  | RevealSnarkContractCallArgs
  | InitSnarkContractCallArgs
  | MoveSnarkContractCallArgs
  | BiomebaseSnarkContractCallArgs
  | WhitelistSnarkContractCallArgs;

/**
 * A zkSNARK proof (without signals) generated by snarkJS `fullProve`
 */
export interface SnarkJSProof {
  pi_a: [string, string, string];
  pi_b: [[string, string], [string, string], [string, string]];
  pi_c: [string, string, string];
}

/**
 * A zkSNARK proof and corresponding public signals generated by snarkJS
 * `fullProve`
 */
export interface SnarkJSProofAndSignals {
  proof: SnarkJSProof;
  publicSignals: string[];
}

/**
 * Method for converting the output of snarkJS `fullProve` into args that can be
 * passed into DarkForest smart contract functions which perform zk proof
 * verification.
 *
 * @param snarkProof the SNARK proof
 * @param publicSignals the circuit's public signals (i.e. output signals and
 * public input signals)
 */
export function buildContractCallArgs(
  snarkProof: SnarkJSProof,
  publicSignals: string[]
): ContractCallArgs {
  // the object returned by genZKSnarkProof needs to be massaged into a set of parameters the verifying contract
  // will accept
  return [
    snarkProof.pi_a.slice(0, 2), // pi_a
    // genZKSnarkProof reverses values in the inner arrays of pi_b
    [snarkProof.pi_b[0].slice(0).reverse(), snarkProof.pi_b[1].slice(0).reverse()], // pi_b
    snarkProof.pi_c.slice(0, 2), // pi_c
    publicSignals, // input
  ] as ContractCallArgs;
}

// if we're using a mock hash and ZK proofs are disabled, just give an empty proof
/**
 * @hidden
 */
export function fakeProof(publicSignals: string[] = []): SnarkJSProofAndSignals {
  return {
    proof: {
      pi_a: ['0', '0', '0'],
      pi_b: [
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
      ],
      pi_c: ['0', '0', '0'],
    },
    publicSignals: publicSignals,
  };
}

// These paths are only useful for Node.js since they are absolute on the system
/**
 * @hidden
 */
export const revealSnarkWasmPath = require.resolve('./reveal.wasm');

/**
 * @hidden
 */
export const revealSnarkZkeyPath = require.resolve('./reveal.zkey');

/**
 * @hidden
 */
export const initSnarkWasmPath = require.resolve('./init.wasm');

/**
 * @hidden
 */
export const initSnarkZkeyPath = require.resolve('./init.zkey');

/**
 * @hidden
 */
export const moveSnarkWasmPath = require.resolve('./move.wasm');

/**
 * @hidden
 */
export const moveSnarkZkeyPath = require.resolve('./move.zkey');

/**
 * @hidden
 */
export const biomebaseSnarkWasmPath = require.resolve('./biomebase.wasm');

/**
 * @hidden
 */
export const biomebaseSnarkZkeyPath = require.resolve('./biomebase.zkey');

/**
 * @hidden
 */
export const whitelistSnarkWasmPath = require.resolve('./whitelist.wasm');

/**
 * @hidden
 */
export const whitelistSnarkZkeyPath = require.resolve('./whitelist.zkey');
