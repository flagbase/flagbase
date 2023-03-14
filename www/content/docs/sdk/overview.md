---
sidebar_position: 1
---

# SDKs

Flagbase offers a number of SDKs for your client and server applications. The protocol used to retrieve and evaluate flags is consistent across these SDKs. 

# Installation

The installation process for Feature Flagging SDKs depends on the specific SDK that is being used. However, most SDKs can be installed using standard package managers, such as npm or yarn. Documentation for each SDK usually includes installation instructions, as well as details on how to configure and use the SDK.

# Usage

To use our SDKs, developers must first create and configure a feature flag in the Flagbase. This involves specifying the flag key, flag value, and any targeting rules that should be applied to the flag. Once the flag has been created, developers can use the SDK to evaluate the flag value and enable or disable features based on the flag value.

In client-side SDKs, this is typically done by loading the SDK into the client-side code and then calling the SDK to evaluate the flag value. In server-side SDKs, this is typically done by loading the SDK into the server-side code and then evaluating the flag value on the server-side.

# Client vs Server SDKs

Feature flag SDKs can be implemented on both the client-side and server-side of an application. While they share similar functionality, there are some technical differences in how they operate.

## Client-side SDKs
Client-side feature flag SDKs are typically embedded within client applications such as web browsers, mobile applications, and desktop applications. They are responsible for making decisions about which features to display to a user based on the flag values retrieved from the server-side. These SDKs also collect user information and pass it back to the server-side for feature flag evaluation. This allows for targeted and personalized feature delivery to end-users.

## Server-side SDKs
On the other hand, server-side feature flag SDKs are used to make feature flag decisions on the server-side of an application. They are typically used for server-to-server communication, for example, when a backend service needs to communicate with another backend service to make a feature flag decision. Server-side SDKs do not pass user information across the network to the service, instead, they receive the raw flag set (including the targeting rules) and evaluate the flag values locally. This ensures that user data is not unnecessarily exposed to other services, which can help maintain a secure environment.

Furthermore, server-side feature flag SDKs are designed to handle high levels of traffic and scale well with large applications. They can be used in conjunction with load balancers and caching services to ensure fast and efficient flag evaluations. In contrast, client-side SDKs are typically used for lower levels of traffic and can be slower due to the overhead of making network requests.


Overall, both client-side and server-side feature flag SDKs serve different purposes and are used in different scenarios. While client-side SDKs are best suited for personalizing features for individual end-users, server-side SDKs are better suited for server-to-server communication and maintaining a secure environment by not exposing user data over the network.
