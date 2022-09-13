# darkforest

Dark Forest Game on Blockchain.

To run this project you will need to be on Node 14 OR Node 16.

## local development

### Install dependencies
- We use `yarn` to manage packages. Run `yarn` at the top level to automatically install all dependencies from subfolders. This will also run the monorepo's `prepare` script, which compiles things like TypeScript or Solidity code.

### Running the project
- Run `yarn workspace eth start` which starts the hardhat blockchain and deploys the game contracts.
- Run `yarn workspace client start` to load the webclient.
- Run `yarn watch` to start a typescript watcher to incrementally rebuild changed dependencies.

You can import the private key of one of the accounts `hardhat node` created and funded, which are printed when you started the node such as:

```
Account #2: 0x3097403b64fe672467345bf159f4c9c5464bd89e (100 ETH)
Private Key: 0x67195c963ff445314e667112ab22f4a7404bad7f9746564eb409b9bb8c6aed32
```

If you wish to restart the game from scratch, you will need to clear local storage. To do this in Chrome or Brave Browser, open the inspector, navigate to the "Application" tab, click "Clear storage" on the left pane, and click "Clear site data" under the circle that appears in the main inspector panel. Then hard refresh the website.

## Contract Addresses

Both localhost development and production contract addresses are stored in [`@darkforest_eth/contracts` package](./packages/contracts). If you deploy contracts locally in a fresh node, this file will never change. If the file does change **do not** check in this file, as you probably have a `hardhat node` process running in the background.

Production deploys **must** check in this file, but those will likely be done from CI and committed on a separate (non-development) branch.

# Workspaces & Packages

The Dark Forest monorepo is managed using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces). To add a new project to the monorepo, you must add it to the `workspaces` array inside the root `package.json`.

**Note:** We use globs for anything in `packages/` so you don't need to update the workspaces for a new package.

The `packages/` directory is a place to store workspace packages that should be published to something like the https://npmjs.com registry, which allows players to build plugins, game clients, etc using the same code that Dark Forest itself uses.

To add a new package, create a new directory inside the `packages/` directory. The package name for anything in `packages/` should be prefixed with `@darkforest_eth/` to be published to our scope.

## circom and snarkjs

If you are modifying anything SNARK-related, you may be interested in rebuilding circuits / redoing setup. Run `yarn workspace eth circom:dev` or `yarn workspace eth circom:prod` respectively to rebuild the `wasm` and `zkey` files. Then `yarn workspace eth compile` as usual will build and refresh the `Verifier.sol`.

## Thegraph

To run a local copy of thegraph make sure docker is installed and running, `yarn workspace eth start --subgraph df` OR if you already have your contracts deployed and running run `yarn workspace eth hardhat:dev subgraph:deploy --name df` and find your local hosted explorer at `http://localhost:8000/subgraphs/name/df`
