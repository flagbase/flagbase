# JavaScript Client SDK

The Flagbase JavaScript Client-side SDK is a lightweight library that enables your web applications to use feature flags easily and efficiently.

## Features
* Efficient and fast feature flag evaluations
* Client-side API for accessing and manipulating flags, traits, and identifiers
* Event-driven architecture with support for custom event listeners
* Extensible, easy-to-use API for flag management

## Installation
Using npm:
```bash
npm install @flagbase/js-client-sdk
```
Using yarn:
```bash
yarn add @flagbase/js-client-sdk
```

## Usage
First, import the SDK:
```javascript
import Client from "@flagbase/js-client-sdk";
```

Then, initialize the client:
```javascript
const client = Client("your-client-key", {
  identifier: "your-identifier",
  traits: {
    "your-trait-key": "your-trait-value",
  },
});
```

Now, you can use the SDK to evaluate feature flags and manage user traits.
Evaluating Feature Flags

```javascript
const variation = client.variation("your-flag-key", "default-variation-key");

if (variation === "enabled") {
  // Execute the feature flag enabled code
} else {
  // Execute the feature flag disabled code
}
```

Managing User Traits

Get user traits:
```javascript
const allTraits = client.getAllTraits();
const specificTrait = client.getTrait("your-trait-key");
```

Set user traits:
```javascript
client.setTrait("your-trait-key", "new-trait-value");
```

Listening to Events
```javascript
client.on("CONTEXT_CHANGE", (eventMessage, eventContext) => {
  console.log("Event:", eventMessage, eventContext);
});

client.off("CONTEXT_CHANGE");
```

API Reference
**Client**
* `Client(clientKey: string, identity: Identity, opts?: ClientOptions): IClient`

**IClient**
* `variation(flagKey: string, defaultVariationKey: string): Flag["variationKey"]`
* `getIdentifier(): Identity["identifier"]`
* `setIdentifier(identifier: string): void`
* `getAllTraits(): Identity["traits"]`
* `getTrait(traitKey: string): string | number`
* `setTrait(traitKey: string, traitValue: string | number): void`
* `getAllFlags(): Flagset`
* `getInternalData(): InternalData`
* `on(eventName: EventType, listenerFn: ListenerFn): void`
* `off(eventName: EventType, listenerFn?: ListenerFn): void`
* `clear(): void`
* `destroy(): void`

# Contributing

Contributions are welcome! Please read our Contributing Guidelines for more information.

# License
This project is licensed under the Mozilla Public License 2.0. See the LICENSE file for more details.
