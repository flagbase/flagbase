import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "../css/styles.module.css";
import FeatureTimeline from "../components/FeatureTimeline";

const values = [
  {
    title: <>First principles</>,
    imageUrl: "site/illustrations/value-thoughtful-pragmatism.svg",
    description: (
      <>
        Avoid mindlessly copying the currently accepted convention, as it often
        results in solutions that already exist. Instead, we suggest using only
        a few axioms when working on requirements, even though this approach may
        be more time-consuming. We believe that this approach will ultimately
        lead to better products, even for high-traffic features.
      </>
    ),
  },
  {
    title: <>Transparent Development</>,
    imageUrl: "site/illustrations/programmer.svg",
    description: (
      <>
        We prioritize transparency throughout our entire development process,
        from internal planning to documentation. This commitment to transparency
        extends beyond the open-source nature of our products. We believe that
        our open organizational culture helps us attract external contributors
        who are already familiar with our processes.
      </>
    ),
  },
  {
    title: <>Document Obsessively</>,
    imageUrl: "site/illustrations/value-document.svg",
    description: (
      <>
        In distributed organizations, poor documentation culture often leads to
        the formation of information silos. At our company, we follow a simple
        rule: if it's not documented, it doesn't exist. By writing down
        information, we can prevent the need for repetition and avoid the
        creation of information silos.
      </>
    ),
  },
  {
    title: <>Measure and Improve</>,
    imageUrl: "site/illustrations/value-measure.svg",
    description: (
      <>
        Carefully evaluate all changes we make, ensuring that we fully
        understand their impact on relevant metrics. We believe it's essential
        to measure the results of any changes we implement and to incorporate
        scientific rigor in our decision-making process when releasing these
        changes.
      </>
    ),
  },
];

function About() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={"About Us"}
      description="Core contributers and the principles that guide our development."
    >
      <header
        className={classnames(
          "hero hero--primary hero--landing",
          styles.heroBanner
        )}
      >
        <div className="container">
          <h3 className="hero__title">About Us</h3>
          <p className="hero__subtitle">Who we are & our values</p>
        </div>
      </header>
      <main className="container">
        <h3 className="section__title">Our Mission</h3>
        <p className="paragraph-text">
          Our mission at Flagbase is to simplify feature management for software
          organizations. We aim to achieve this by developing open-source tools
          that allow for effective release of features. We understand that each
          organization has its unique approach to feature management, which can
          be complex and tedious. Therefore, our goal is to build a single
          application that organizations can adapt and configure to their
          feature management workflows.
        </p>
        <br />
        <h3 className="section__title">Our Values</h3>
        <FeatureTimeline features={values} />
      </main>
    </Layout>
  );
}

export default About;
