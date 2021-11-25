---
sidebar_position: 3
---

# Features

Compared to other solutions in the market, Flagbase takes a minimalist approach to feature management. Even though Flagbase does not offer every feature other established feature management solutions offer out of the box, due to its open-source nature, Flagbase is much more extendable and can be adapted to fit your organization's needs.

### Extendable context

When evaluating client-side flags, you may not want to send across sensitive user attributes across the network. Flagbase allows you to tap into different context sources securely. During evaluation, Flagbase will pull in user traits from external context providers that you've configured. So when users evaluate flags they see the most relevant variation.

### Custom configuration language

Flagbase relies on its own a minimal configuration language called Flagbase Configuration Language (FCL). FCL is highly composable, semantically unambiguous and offers performant configuration evaluation. The Flagbase evaluation engine is designed to interpret compressed FCL, allowing for transport & evaluation times - which is useful when dealing with projects with a lot of feature flags.

### Built-in access control

Flagbase's resource management layer is protected by a well thought out access control layer. Flagbase leverages [Casbin](https://casbin.org) to implement [RBAC policies](https://casbin.org/docs/en/rbac). These policies are implemented in the data layer, hence reducing the attack surface for permission-based attacked.

### Updates are pushed in realtime

Flagbase has two modes of delivering feature flags. First one being polling, where clients request feature flags periodically. This mode is good for when operating in unreliable networks. Flagbase also offers streaming via SSE (Sever-Sent Events), pushing flagset changes when required. This allows for near-realtime flag evaluations. By default, Flagbase uses a hybrid approach which is a combination of streaming and polling. When the stream is not available, Flagbase reverts back to polling and vice-versa backing off when necessary.

