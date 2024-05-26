## FIFOLookupMap Documentation

### Overview
FIFOLookupMap is a TypeScript data structure designed to store and manage data in a First-In-First-Out (FIFO) manner. It's particularly useful for situations where you need to maintain a collection of items with quick access but also need to ensure that the collection does not exceed a specified maximum size. When the maximum size is reached, the oldest item is automatically removed upon the addition of a new item.

This class supports adding data with unique keys, retrieving data by any key, and ensuring that data is managed in a FIFO sequence. It's ideal for scenarios like caching, where you want to limit memory usage but ensure quick lookup of values.

### Features
- FIFO Management: Automatically removes the oldest item when the maximum size is exceeded.
- Flexible Key Lookup: Allows for the retrieval of data using any property as a key, not just a primary key.
- Data Uniqueness: Ensures that each item in the collection is unique based on a specified primary key.
- Serialization: Supports converting the collection to and from JSON for easy storage and transmission.


### Usage 

```typescript
import {FIFOLookupMap} from '@scintilla/ts-sdk';

// In this example, 5 is the maximum size of the map, and 'id' is the primary key.
const fifoLookupMap = new FIFOLookupMap(5, 'id');

fifoLookupMap.add({ id: 1, name: 'Item 1', value: 'Value 1' });

const item = fifoLookupMap.get('name', 'Item 1');

console.log(item); // { id: 1, name: 'Item 1', value: 'Value 1' }
```

#### Adding Items
To add an item to the map, use the add method. Each item should be an object that includes the primary key.

```typescript
fifoLookupMap.add({ id: 1, name: 'Item 1', value: 'Value 1' });
```

#### Getting Items
To retrieve an item, you can use the get method with any property name and value.

```typescript
const item = fifoLookupMap.get('name', 'Item 1');
console.log(item); // { id: 1, name: 'Item 1', value: 'Value 1' }
```

#### Removing Items
To remove an item, use the remove method with the value of the primary key.

```typescript
fifoLookupMap.remove(1);
```

#### Retrieving the Last Item by Property
To get the last item that matches a specific property, use the getLast method.

```typescript
const lastItem = fifoLookupMap.getLast('name');
console.log(lastItem);
```

#### Serialization and Deserialization
To convert the FIFOLookupMap to JSON:

```typescript
const json = fifoLookupMap.toJSON();
console.log(json);
```

To recreate a FIFOLookupMap from JSON:

```typescript
const newMap = FIFOLookupMap.fromJSON(json);
```
