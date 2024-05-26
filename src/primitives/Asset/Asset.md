## Asset Class Documentation

### Overview
The Asset class represents a digital or physical asset in a system, providing a structured way to define and interact with assets. This documentation covers the initialization of Asset instances, the properties available, and how to use its methods.

### Installation
```js
import {Asset} from '@scintilla/ts-sdk';
```

### Initializing an Asset

You can initialize an Asset instance by providing an object with properties that match the IAssetOptions interface. Below is an example of creating a new Asset with custom values:

```typescript
const myAsset = new Asset({
name: 'ExampleAsset',
symbol: 'EXA',
supply: {
max: 200_000_000 * 10 ** 8,
},
decimals: 8,
permissions: {
mint: ['user1'],
burn: ['user2'],
},
fees: {
transfer: {
percent: 0.0001,
max: 50,
},
},
});
```

#### Properties
- name: The name of the asset.
- symbol: The symbol representing the asset.
- supply: An object containing max, representing the maximum supply of the asset.
- decimals: The number of decimals the asset uses.
- distribution: An object representing the distribution of the asset (initially empty).
- permissions: An object containing arrays of strings for mint and burn permissions.
- fees: An object describing the fees for transferring the asset.

#### Methods
`toJSON()`
This method returns a JSON representation of the Asset instance, including all properties:

```typescript
const assetJSON = myAsset.toJSON();
console.log(assetJSON);
```

#### Example Usage

```typescript
import {Asset} from '@scintilla/ts-sdk';

// Initialize an Asset instance
const asset = new Asset({
    name: 'Scintilla',
    symbol: 'SCT',
    supply: {
        max: 100_000_000 * 10 ** 8,
    },
    decimals: 8,
    permissions: {
        mint: ['scintillaAdmin'],
        burn: ['scintillaAdmin'],
    },
    fees: {
        transfer: {
            percent: 0.00002,
            max: 20,
        },
    },
});

// Accessing properties
console.log(`Asset Name: ${asset.name}`);
console.log(`Asset Symbol: ${asset.symbol}`);
console.log(`Max Supply: ${asset.supply.max}`);

// Using toJSON method
const assetDetails = asset.toJSON();
console.log(assetDetails);
```

