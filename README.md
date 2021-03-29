<div align="center">

  <img width="250px" src="./www/docs/assets/img/banner-dark.svg" /></br>

  <img width="570px"  src="./www/docs/assets/img/readme-banner.svg" /></br>

  ![GitHub](https://img.shields.io/github/license/flagbase/flagbase)
  [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fflagbase%2Fflagbase.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fflagbase%2Fflagbase?ref=badge_shield)
  [![CLA assistant](https://cla-assistant.io/readme/badge/flagbase/flagbase)](https://cla-assistant.io/flagbase/flagbase)
  [![Maintainability](https://api.codeclimate.com/v1/badges/a4766905458a5cb74f7b/maintainability)](https://codeclimate.com/github/flagbase/flagbase/maintainability)

</div>

Flagbase is an all-in-one feature management solution. Flagbase offers two delivery mechanisms for transporting flagsets including both polling and streaming via [SSE (Server-Sent Events)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). Flagbase also offers features such as targeted rollouts, auditing and extensive service monitoring via [Prometheus](https://prometheus.io).


## Architecture overview
<div align="center">
  <img width="570px" aria-label="Architecture Diagram" src="./www/dev/assets/dev/system-in-context.jpg" /></br>
</div>

### ER Diagram
![ER Diagram](./www/dev/assets/dev/er-diagram.png)

## Directories
This [monorepo](https://en.wikipedia.org/wiki/Monorepo) contains the code for Flagbase Core, UI, SDKs.
* **[`/core`](./core/README.md)**: The primary resource provider. This microservice consists of the key services used to manage protected resources and stream evaluated flagsets down to consumers (via the SDK). [Read more](./core/README.md)
* **[`/sdk`](./sdk/README.md)**: SDKs use to retrieve evaluated flagsets from the Core. [Read more](./sdk/README.md)
* **[`/ui`](./ui/README.md)**: UI interacts with the [Core's API](https://flagbase.com/docs/api). It is used to manage resources (e.g. workspaces, projects, environments, flags etc). [Read more](./ui/README.md)

## Community
Join us on [Github Dicussions](https://github.com/flagbase/flagbase/discussions).
* [Help](https://github.com/flagbase/flagbase/discussions/categories/help): Stuck on something? Ask for help here :)
* [Dev](https://github.com/flagbase/flagbase/discussions/categories/dev): Where contributers discuss ideas
* [Announcements](https://github.com/flagbase/flagbase/discussions/categories/announcements):  General PSAs & feature updates

## Contributing
We encourage community contributions via pull requests. Before opening up a PR, please read our [contributor guidelines](https://flagbase.com/dev/intro/workflow#contributing).

## License
Mozilla Public License Version 2.0, see [LICENSE](./LICENSE)
