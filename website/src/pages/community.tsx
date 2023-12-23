import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";

import styles from "../css/styles.module.css";
import FeatureGrid from "../components/FeatureGrid";

const CommunitySites = [
  {
    title: <>Github</>,
    imageUrl: "site/illustrations/flagbase+github.svg",
    link: "https://github.com/flagbase/flagbase",
    description: <>Where our code lives</>,
  },
  {
    title: <>Dicussions</>,
    link: "https://github.com/flagbase/flagbase/discussions",
    imageUrl: "site/illustrations/flagbase+discussions.svg",
    description: <>Where we discuss</>,
  },
];

function Community() {
  return (
    <Layout title={"Community"} description="TODO">
      <header
        className={classnames(
          "hero hero--primary hero--landing",
          styles.heroBanner
        )}
      >
        <div className="container">
          <h3 className="hero__title">Community</h3>
          <p className="hero__subtitle">Join our community-led development team!</p>
          <br />
          <FeatureGrid features={CommunitySites} />
        </div>
      </header>
      <main className="container">
        <h3 className="hero__title">Guidelines</h3>
        <p className="paragraph-text">
          At Flagbase, we recognize and celebrate the creativity and
          collaboration of open source contributors and the diversity of skills,
          experiences, cultures, and opinions they bring to the projects and
          communities they participate in.
        </p>
        <p className="paragraph-text">
          Every one of Flagbase's open source projects and communities are
          inclusive environments, based on treating all individuals
          respectfully, regardless of gender identity and expression, sexual
          orientation, disabilities, neurodiversity, physical appearance, body
          size, ethnicity, nationality, race, age, religion, or similar personal
          characteristic.
        </p>
        <p className="paragraph-text">
          We value diverse opinions, but we value respectful behavior more.
        </p>
        <p className="paragraph-text">Respectful behavior includes:</p>
        <ul>
          <li className="paragraph-text">
            Being considerate, kind, constructive, and helpful.
          </li>
          <li className="paragraph-text">
            Not engaging in demeaning, discriminatory, harassing, hateful,
            sexualized, or physically threatening behavior, speech, and imagery.
          </li>
          <li className="paragraph-text">
            Not engaging in unwanted physical contact.
          </li>
          <li className="paragraph-text">
            Some Flagbase open source projects may adopt an explicit project
            code of conduct, which may have additional detailed expectations for
            participants. Most of those projects will use our modified
            Contributor Covenant.
          </li>
        </ul>
        <h3 className="hero__secondary_title">Resolve peacefully</h3>
        <p className="paragraph-text">
          We do not believe that all conflict is necessarily bad; healthy debate
          and disagreement often yields positive results. However, it is never
          okay to be disrespectful.
        </p>
        <p className="paragraph-text">
          If you see someone behaving disrespectfully, you are encouraged to
          address the behavior directly with those involved. Many issues can be
          resolved quickly and easily, and this gives people more control over
          the outcome of their dispute. If you are unable to resolve the matter
          for any reason, or if the behavior is threatening or harassing, report
          it. We are dedicated to providing an environment where participants
          feel welcome and safe.
        </p>
        <h3 className="hero__secondary_title">Reporting problems</h3>
        <p className="paragraph-text">
          Some Flagbase open source projects may adopt a project-specific code
          of conduct. In those cases, a Flagbase employee will be identified as
          the Project Steward, who will receive and handle reports of code of
          conduct violations. In the event that a project hasn’t identified a
          Project Steward, you can report problems by emailing{" "}
          <a href="mailto:team@flagbase.com">team@flagbase.com</a>.{" "}
        </p>
        <p className="paragraph-text">
          We will investigate every complaint, but you may not receive a direct
          response. We will use our discretion in determining when and how to
          follow up on reported incidents, which may range from not taking
          action to permanent expulsion from the project and project-sponsored
          spaces. We will notify the accused of the report and provide them an
          opportunity to discuss it before any action is taken. The identity of
          the reporter will be omitted from the details of the report supplied
          to the accused. In potentially harmful situations, such as ongoing
          harassment or threats to anyone's safety, we may take action without
          notice.
        </p>
        <p className="paragraph-text">
          This document was adapted from the{" "}
          <a href="https://indieweb.org/code-of-conduct" target="_blank">
            IndieWeb Code of Conduct
          </a>
          .
        </p>
      </main>
    </Layout>
  );
}

export default Community;
