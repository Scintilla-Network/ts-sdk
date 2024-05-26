## @scintilla/ts-sdk

The `@scintilla/ts-sdk` provides a comprehensive suite of TypeScript primitives and utilities designed for building and interacting with the Scintilla blockchain. This SDK simplifies the development process by offering well-defined structures for assets, governance, transactions, and more, alongside essential utilities for hashing and variable-length integer handling.

### Installation

To install the SDK in your project, run:

```bash
npm install @scintilla/ts-sdk
```

or if you are using yarn:

```bash
yarn add @scintilla/ts-sdk
```

#### Primitives

The SDK includes a variety of primitives, each tailored for specific use cases within the Scintilla ecosystem:

- [Asset](./src/primitives/asset/README.md)
- [DAO](./src/primitives/dao/README.md)
- [DriveData](./src/primitives/driveData/README.md)
- [GovernanceProposal](./src/primitives/governanceProposal/README.md)
- [GovernanceVote](./src/primitives/governanceVote/README.md)
- [HashProof](./src/primitives/hashProof/README.md)
- [Identity](./src/primitives/identity/README.md)
- [ModuleBlock](./src/primitives/moduleBlock/README.md)
- [Transaction](./src/primitives/transaction/README.md)
- [Transfer](./src/primitives/transfer/README.md)
- [Transition](./src/primitives/transition/README.md)
- [Messages](./src/primitives/messages/README.md)

#### Message 
The SDK also includes primitives for message handling:

- [NetMessage](./src/primitives/messages/NetMessage.md)
- [BlockMessage](./src/primitives/messages/BlockMessage.md)
- [PeerInfoMessage](./src/primitives/messages/PeerInfoMessage.md)
- [StatementMessage](./src/primitives/messages/StatementMessage.md)

#### Utilities
For technical operations, the SDK provides utility functions and data structures:
- [Hash (sha256)](./src/utilities/hash/README.md)
- [VarInt Encoding/Decoding](./src/utilities/varInt/README.md)

#### Data Structures
Some technical utilities are designed for specific data handling and management scenarios:
- [FIFOLookupMap](./src/utilities/fifoLookupMap/README.md)
- [Queue](./src/utilities/queue/README.md)
- [TimeQueue](./src/utilities/timeQueue/README.md)


These data structures are exported separately to emphasize their utility nature and potential broader applicability outside the direct blockchain interaction scenarios.

### Usage

To use a primitive or utility from the SDK, import it into your TypeScript file as follows:

```typescript
import { Asset, Transfer, sha256 } from '@scintilla/ts-sdk';

// Example usage
const asset = new Asset({/* initial properties */});
const transfer = new Transfer({/* initial properties */});
const hash = sha256('your data here');
```

Refer to the individual documentation for each primitive and utility for detailed usage instructions.


#### Browser 

```js
<script type="importmap">
    {
        "imports": {
            "@scintilla-network/sdk": "./dist/index.js"
        }
    }
</script>
<script type="module">
    import {Asset} from "@scintilla-network/sdk";
    console.log(new Asset('test'));
</script>
```
### Contributing

We welcome contributions to the `@scintilla/ts-sdk`! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
