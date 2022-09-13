# Code Style

- Consistency and simplicity are the most important principles.
- Keep game logic out of React, and in game logic classes.
- Limit the use of functions outside of classes. I.e. Each function should probably belong to some
  even if it's just a static function.
- Be precise in your use of access modifiers. If a function does not need access to an instance,
  make it `static`. If it doesn't need to be `public` (which all fields and functions in typescript
  are by default), then mark it as `private`. Use `const` unless the variable will be modified.
- Annotate all return types of functions.
- Rarely annotate the types of locals.
- Briefly document all public fields and methods and classes with a description of their purpose.
- In method bodies, group similar declarations. Eg group all hook declarations, followed by all
  effect calls when writing functional React components.
- Group methods in classes by their visibility. `public` methods together, `private` methods together.
- When something is optional, use `undefined` rather than `null`, for consistency.
- Avoid excessive creation of arrays and objects in hot sections of code, particularly in the renderer.
- Classes should have a tighly scoped purpose.
- Avoid singletons, and React Context.
- When possible, avoid repeating yourself.
- Try to keep your functions under 10 statements. 20-30 for really complicated functions.

## TypeScript Enums

TypeScript Enums are not allowed in the project. This has 2 reasons:

1. They generate a bunch of runtime code, which results in an object that doesn't work like a JS object. To quote from the eslint plugin we use...

   > "Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript."
   >
   > In other words, TypeScript enums have their corresponsing runtime representations, they are not erased from your emitted JavaScript files after being compiled. This conflicts with one of the TypeScript Design Non-goals:
   >
   > "Provide additional runtime functionality or libraries. Instead, use TypeScript to describe existing libraries."
   >
   > Having this TypeScript feature extending into your compiled JavaScript also conflicts with the TypeScript slogan of being a typed superset of JavaScript, which further introduces vendor lock-in.

   For example, an `ArtifactType` enum would generate:

```js
var ArtifactType;
(function (ArtifactType) {
  ArtifactType[(ArtifactType['Unknown'] = 0)] = 'Unknown';
  ArtifactType[(ArtifactType['Monolith'] = 1)] = 'Monolith';
  ArtifactType[(ArtifactType['Colossus'] = 2)] = 'Colossus';
  ArtifactType[(ArtifactType['Spaceship'] = 3)] = 'Spaceship';
  ArtifactType[(ArtifactType['Pyramid'] = 4)] = 'Pyramid';
  ArtifactType[(ArtifactType['Wormhole'] = 5)] = 'Wormhole';
  ArtifactType[(ArtifactType['PlanetaryShield'] = 6)] = 'PlanetaryShield';
  ArtifactType[(ArtifactType['PhotoidCannon'] = 7)] = 'PhotoidCannon';
  ArtifactType[(ArtifactType['BloomFilter'] = 8)] = 'BloomFilter';
  ArtifactType[(ArtifactType['BlackDomain'] = 9)] = 'BlackDomain';
})(ArtifactType || (ArtifactType = {}));

// console.log(ArtifactType);
// {
//   "0": "Unknown",
//   "1": "Monolith",
//   "2": "Colossus",
//   "3": "Spaceship",
//   "4": "Pyramid",
//   "5": "Wormhole",
//   "6": "PlanetaryShield",
//   "7": "PhotoidCannon",
//   "8": "BloomFilter",
//   "9": "BlackDomain",
//   "Unknown": 0,
//   "Monolith": 1,
//   "Colossus": 2,
//   "Spaceship": 3,
//   "Pyramid": 4,
//   "Wormhole": 5,
//   "PlanetaryShield": 6,
//   "PhotoidCannon": 7,
//   "BloomFilter": 8,
//   "BlackDomain": 9
// }
```

2. When we provide 3rd party developers with packages, we want them to be able to work with our data model like any other JS values. For example, we want this code to work:

```js
import { PlanetLevel } from '@darkforest_eth/types';
Object.values(PlanetLevel) === [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
```

For these reasons, the `enum` keyword from TypeScript is disallowed across the project. The one allowance of this rule is that any non-distributed package may use the `const enum` syntax because the code gets inlined at build time, such that `const enum Foo { FOO = 'foo' }` would be inserted throughout the code as just `'foo'`. This is completely disallowed in any projects in the `packages/` directory because those are distributed to 3rd party developers and the `const enums` would be stripped out.

As alternatives to enums, we combine an `Abstract` type (provided in `@darkforest_eth/types`) and an object with a TypeScript `const` assertion. An example of this looks like:

```ts
import type { Abstract } from '@darkforest_eth/types';

export type SpaceType = Abstract<0 | 1 | 2 | 3, 'SpaceType'>;

export const SpaceType = {
  NEBULA: 0 as SpaceType,
  SPACE: 1 as SpaceType,
  DEEP_SPACE: 2 as SpaceType,
  DEAD_SPACE: 3 as SpaceType,
} as const;
```

At build time, all of the type information will be stripped and we'll end up with the JS:

```js
export const SpaceType = {
  NEBULA: 0,
  SPACE: 1,
  DEEP_SPACE: 2,
  DEAD_SPACE: 3,
};
```

For more information regarding the negatives of enums, please review:

- https://github.com/projectsophon/eslint-plugin-typescript-enum#motivations
- https://maxheiber.medium.com/alternatives-to-typescript-enums-50e4c16600b1
- https://stackoverflow.com/questions/40275832/typescript-has-unions-so-are-enums-redundant/60041791#60041791
- https://2ality.com/2020/02/enum-alternatives-typescript.html
