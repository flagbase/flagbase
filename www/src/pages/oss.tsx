import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";

import FeatureGrid from "../components/FeatureGrid";
import FeatureTimeline from "../components/FeatureTimeline";
import styles from "../css/styles.module.css";

const Products = [
  {
    title: <>Core</>,
    link: "#core",
    imageUrl: "site/illustrations/core.svg",
    description: "Used to control & transport",
  },
  {
    title: <>SDK</>,
    link: "#sdk",
    imageUrl: "site/illustrations/sdks-v1.svg",
    description: "Used to integrate",
  },
  {
    title: <>Client</>,
    link: "#ui",
    imageUrl: "site/illustrations/ui.svg",
    description: "Used to manage",
  },
];

const CoreFeatures = [
  {
    title: <>Flagbase Core</>,
    imageUrl: "site/illustrations/core.svg",
    description: (
      <>
        The core is the main service responsible for streaming feature flags to
        our SDKs via SSE (Server-Sent Events). It provides a REST API, used to
        manage key resources (i.e. workspaces, projects, environments, flags
        etc).
      </>
    ),
  },
];

const SDKFeatures = [
  {
    title: <>Flagbase SDKs</>,
    imageUrl: "site/illustrations/sdks-v1.svg",
    description: (
      <>
        Connect your app to Flagbase using one of our many SDKs. Flagbase has no
        concept server-only SDKs, since the core microservice can run alongside
        your backend apps. Hence alleviating security concerns around
        user-sensitive context data.
      </>
    ),
  },
];

const ClientFeatures = [
  {
    title: <>Flagbase Client</>,
    imageUrl: "site/illustrations/ui.svg",
    description: (
      <>
        Use the Client to manage your Flagbase core instance. With the Client, you can
        manage workspaces, projects, flags, targeting rules etc. Toggle on and
        off feature flags with just a single click. 
        
        <br/><br/>Open the{" "}
        <b>
          <a href="https://client.flagbase.com" target="_blank">
            Client Application
          </a>
        </b>
        , to connect to an instance!
      </>
    ),
  },
];

function OSS() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={"Open Source"}
      description="Built on trust. No vendor lock-in. Everything you need to get started is open-source."
    >
      <header
        className={classnames(
          "hero hero--primary hero--landing",
          styles.heroBanner
        )}
      >
        <div className="container">
          <h3 className="hero__title">
            <img
              width="400vw"
              src={useBaseUrl("site/illustrations/banner-dark-oss.svg")}
            ></img>
          </h3>
          <p className="hero__subtitle">
            Everything you need to get started is open-source.
          </p>
          <FeatureGrid features={Products} />
        </div>
      </header>
      <main>
        <section className="hero_section_secondary" id="core">
          <FeatureTimeline inverted features={CoreFeatures} />
        </section>
        <section className="hero_section_primary" id="sdk">
          <FeatureTimeline features={SDKFeatures} />
        </section>
        <section className="hero_section_secondary" id="ui">
          <FeatureTimeline inverted features={ClientFeatures} />
        </section>
        <section className="hero_section_primary">
          <div className="container">
            <h3 className="section__title">Why Open Source?</h3>
            <p className="paragraph-text">
              In the feature-flagging space, there are only a few open-source
              solutions. Most providers have proprietiery backends. When an
              organisation decides to go with a proprietiery vendor, they are
              essentially lockedin and face hurdles when trying to migrate to
              another solution. This is why we created Flagbase. Our vision is
              democratize feature management. Feature flagging is an essential
              aspect that has implications on how features are delivered to
              customers, both in terms of continous delivery and user
              experimentation. We believe using an open source development model
              will help us build more innovative technologies. We believe that
              software should offer freedom and not be a determent to its users.
            </p>
            <p className="paragraph-text">Some other reasons, why we went open-source:</p>
            <p>
              <ul>
                <li className="paragraph-text">
                  <b>Flexibility</b>: We believe there is no ideal one-size-fits
                  feature flagging solution. The best solution will be require
                  changes to adapt to your organisation's requirements. With
                  Flagbase, you can modify the core to suite your needs. Some
                  examples include, integrating to your organisation's user
                  targeting platform, instead of trusting a 3rd part with your
                  user data.
                </li>
                <li className="paragraph-text">
                  <b>Continuity</b>: With proprietiery vendors, if they ever go
                  out of business, you are screwed... With Flagbase, since it's
                  maintained by the community, you will never be at risk.
                  Flagbase was designed to be self-hosted.
                </li>
                <li className="paragraph-text">
                  <b>Security</b>: By its very nature, open source enables
                  anyone to look for and fix security flaws. And since its
                  peer-reviewed, it opens the software up to a large base of
                  inspectors who can quickly detect issues.
                </li>
              </ul>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default OSS;
