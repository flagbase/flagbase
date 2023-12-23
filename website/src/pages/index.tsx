import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import styles from "../css/styles.module.css";
import FeatureTimeline from "../components/FeatureTimeline";

const how = [
  {
    title: <>1. Create your flags</>,
    imageUrl: "site/illustrations/1-add-flag.svg",
    description: (
      <>
        Create your new flag in Flagbase. Make sure you keep note of the flag
        key, which will be used in the next step. Optionally set a date for when
        the flag expires, so you're reminded when to clean up your flag.
      </>
    ),
  },
  {
    title: <>2. Wrap your features</>,
    imageUrl: "site/illustrations/2-wrap-features.svg",
    description: (
      <>
        Using one of our client/server SDKs in your application, wrap your
        feature code to only execute upon successfully evaluating your desired
        variation.
      </>
    ),
  },
  {
    title: <>3. Targeting users</>,
    imageUrl: "site/illustrations/3-targeting.svg",
    description: (
      <>
        Set up your flag's targeting configuration so users see feature
        variations intended for them. You can also choose to randomly assign
        users to different variations.
      </>
    ),
  },
  {
    title: <>4. Release anytime</>,
    imageUrl: "site/illustrations/enterprise.svg",
    description: (
      <>
        Ship your features without worrying. Don't worry, if something breaks
        you don't need to re-deploy. You can revert the change by remotely
        turning off the flag.
      </>
    ),
  },
];

const workflow = [
  {
    title: <>Risk-free Deployments</>,
    imageUrl: "site/illustrations/switches.svg",
    description: (
      <>
        Deploy code any time, even if a feature isn't ready. Just wrap your
        unfinished feature under a feature flag and switch it on it is ready to
        be released.
      </>
    ),
  },
  {
    title: <>Targeted Releases</>,
    imageUrl: "site/illustrations/experiment.svg",
    description: (
      <>
        Release features to specific user segments. For example, you may want to
        enable paid features to only paying users. Just hide paid features under
        a feature flag, having them automatically enabled when users upgrade.
      </>
    ),
  },
  {
    title: <>Measure & Experiment</>,
    imageUrl: "site/illustrations/measure.svg",
    description: (
      <>
        Experiment by rolling out features to specific user segments.
        Automatically conduct different experiments across your products by
        using our API. Maximize impact by measuring the impact of your feature
        releases.
      </>
    ),
  },
];

const features = [
  {
    title: <>Take control of your user data</>,
    imageUrl: "site/illustrations/servers.svg",
    description: (
      <>
        Deploy Flagbase using your own infrastructure. Don't rely on a 3rd-party
        vendor and expose customer-data. You can use our Cloud UI to manage your
        self-hosted instance(s) of Flagbase.
      </>
    ),
  },
  {
    title: <>Design inspired by other providers</>,
    imageUrl: "site/illustrations/sdk.svg",
    description: (
      <>
        Flagbase was inspired by other feature flag providers including{" "}
        LaunchDarkly, ConfigCat, Split.io etc. Flagbase relies on Server-Sent Events{" "}
        (SSE) to stream feature flags to our SDKs.
      </>
    ),
  },
];

function Home() {
  return (
    <Layout
      title="Democratizing Feature Management"
      description="Flagbase is an open-source feature flag service. Deploy your code without fear, and experiment to see what your users really want."
    >
      <header
        className={classnames("hero hero--landing", styles.homeHeroBanner)}
      >
        <div className="landing_container">
          <div className="row">
            <div className="col col--6">
              <h3 className="landing_hero__title">
                Feature Management
                <br />
                Simplified.
              </h3>
              <br />
              <p className="landing_hero__subtitle">
                Flagbase is an open-source feature management platform.{" "}
                Deploy to production without fear. Accelerate experimentation in your organisation.
              </p>
            </div>
            <div className="col col--6">
              <img src={useBaseUrl("site/illustrations/new-banner-white.svg")} />
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="hero_section_primary">
          <h2 className="section__title text--center">How it works</h2>
          <FeatureTimeline features={how} />
        </section>
        <section className="hero_section_secondary">
          <h2 className="section__title text--center">
            Deliver Features with Ease
          </h2>
          <FeatureTimeline features={workflow} />
        </section>
        <section className="hero_section_primary">
          <h2 className="section__title text--center">Freedom from Lock-in</h2>
          <FeatureTimeline features={features} />
        </section>
      </main>
    </Layout>
  );
}

export default Home;
