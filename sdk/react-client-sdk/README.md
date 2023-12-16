# Flagbase React Client SDK

This is the official React client-side SDK for Flagbase. With this SDK, you can use Flagbase feature flags and experiments in your React applications.

## Installation

You can install the package using npm:

```sh
$ npm install @flagbase/react-client-sdk
```

or yarn:

```sh
yarn add @flagbase/react-client-sdk
```

## Usage

1. Import the SDK

To use the SDK, import it at the top of your file:

```js
import FlagbaseProvider, { useFeatureFlag } from "@flagbase/react-client-sdk";
```

2. Wrap your app in the FlagbaseProvider

Wrap your app with the FlagbaseProvider component to enable the SDK to communicate with the Flagbase service. Pass in the clientKey and optionally, identity and opts props:

```js
function App() {
  return (
    <FlagbaseProvider
      clientKey="YOUR_CLIENT_KEY"
      identity={{ identifier: "USER_ID", traits: { age: 25 } }}
      opts={{ debug: true }}
    >
      <MyApp />
    </FlagbaseProvider>
  );
}
```

3. Use feature flags with useFeatureFlag

Use the useFeatureFlag hook to get the value of a feature flag. Pass in the flagKey and defaultVariationKey props:

```js
function MyComponent() {
  const isFeatureEnabled = useFeatureFlag("MY_FEATURE", false);

  return (
    <div>{isFeatureEnabled ? "Feature enabled!" : "Feature disabled."}</div>
  );
}
```

4. Use the Flagbase client instance with useFlagbaseClient

Use the useFlagbaseClient hook to get access to the Flagbase client instance:

```js
function MyComponent() {
  const flagbaseClient = useFlagbaseClient();

  // Do something with the client instance
}
```

## Contributing

Contributions are welcome! If you have any bug reports, feature requests, or pull requests, please open an issue or submit a pull request on GitHub.
