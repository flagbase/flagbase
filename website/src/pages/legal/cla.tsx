import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "../../css/styles.module.css";

function CLA(): JSX.Element {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={"Contributor License Agreement"}
      description={
        "In order to clarify the intellectual property license granted with Contributions from any person or entity, Flagbase ('Flagbase') must have a Contributor License Agreement ('CLA') on file that has been signed by each Contributor, indicating agreement to the license terms below. This license does not change your rights to use your own Contributions for any other purpose."
      }
    >
      <header
        className={classnames(
          "hero hero--primary hero--landing",
          styles.heroBanner
        )}
      >
        <div className="container">
          <h3 className="hero__title">CLA</h3>
          <p className="hero__subtitle">Contributor License Agreement</p>
          <a target="_blank" href="https://cla-assistant.io/flagbase/flagbase">
            <img
              src="https://cla-assistant.io/readme/badge/flagbase/flagbase"
              alt="CLA assistant"
            />
          </a>
        </div>
      </header>
      <main className="container">
        <h3 className="section__title">Signing the CLA</h3>
        <p className="paragraph-text">
          We are using CLA-assistant to guide contributors through the CLA
          signing process. Once you open a pull request to any of our open
          source projects, you are automatically asked to sign the CLA by a bot.
          A bot will comment on the PR asking you to sign the CLA if you haven't
          already.
        </p>
        <p className="paragraph-text">
          Follow the steps given by the bot to sign the CLA. This will require
          you to log in with GitHub (we only request public information from
          your account) and to fill in a few additional details such as your
          name and email address. We will only use this information for CLA
          tracking; none of your submitted information will be used for
          marketing purposes.
        </p>
        <p className="paragraph-text">
          You only have to sign the CLA one time. Once you've signed the CLA, future
          contributions to any Flagbase project will not require you to sign
          again.
        </p>
        <h3 className="section__title">The Agreement</h3>
        <section className="license-block">
          <p>
            In order to clarify the intellectual property license granted with
            Contributions from any person or entity, Flagbase ("Flagbase") must
            have a Contributor License Agreement ("CLA") on file that has been
            signed by each Contributor, indicating agreement to the license
            terms below. This license does not change your rights to use your
            own Contributions for any other purpose.
          </p>
          <p>
            You accept and agree to the following terms and conditions for Your
            present and future Contributions submitted to Flagbase. Except for
            the license granted herein to Flagbase and recipients of software
            distributed by Flagbase, You reserve all right, title, and interest
            in and to Your Contributions.
          </p>
          <ol>
            <li>
              <p>
                Definitions. "You" (or "Your") shall mean the copyright owner or
                legal entity authorized by the copyright owner that is making
                this Agreement with Flagbase. For legal entities, the entity
                making a Contribution and all other entities that control, are
                controlled by, or are under common control with that entity are
                considered to be a single Contributor. For the purposes of this
                definition, "control" means (i) the power, direct or indirect,
                to cause the direction or management of such entity, whether by
                contract or otherwise, or (ii) ownership of fifty percent (50%)
                or more of the outstanding shares, or (iii) beneficial ownership
                of such entity.
              </p>
              <p>
                {" "}
                "Contribution" shall mean any original work of authorship,
                including any modifications or additions to an existing work,
                that is or previously has been intentionally submitted by You to
                Flagbase for inclusion in, or documentation of, any of the
                products owned or managed by Flagbase (the "Work"). For the
                purposes of this definition, "submitted" means any form of
                electronic, verbal, or written communication sent to Flagbase or
                its representatives, including but not limited to communication
                on electronic mailing lists, source code control systems, and
                issue tracking systems that are managed by, or on behalf of,
                Flagbase for the purpose of discussing and improving the Work,
                but excluding communication that is conspicuously marked or
                otherwise designated in writing by You as "Not a Contribution."
              </p>
            </li>
            <li>
              <p>
                Grant of Copyright License. Subject to the terms and conditions
                of this Agreement, You hereby grant to Flagbase and to
                recipients of software distributed by Flagbase a perpetual,
                worldwide, non-exclusive, no-charge, royalty-free, irrevocable
                copyright license to reproduce, prepare derivative works of,
                publicly display, publicly perform, sublicense, and distribute
                Your Contributions and such derivative works.
              </p>
            </li>
            <li>
              <p>
                Grant of Patent License. Subject to the terms and conditions of
                this Agreement, You hereby grant to Flagbase and to recipients
                of software distributed by Flagbase a perpetual, worldwide,
                non-exclusive, no-charge, royalty-free, irrevocable (except as
                stated in this section) patent license to make, have made, use,
                offer to sell, sell, import, and otherwise transfer the Work,
                where such license applies only to those patent claims
                licensable by You that are necessarily infringed by Your
                Contribution(s) alone or by combination of Your Contribution(s)
                with the Work to which such Contribution(s) was submitted. If
                any entity institutes patent litigation against You or any other
                entity (including a cross-claim or counterclaim in a lawsuit)
                alleging that your Contribution, or the Work to which you have
                contributed, constitutes direct or contributory patent
                infringement, then any patent licenses granted to that entity
                under this Agreement for that Contribution or Work shall
                terminate as of the date such litigation is filed.
              </p>
            </li>
            <li>
              <p>
                You represent that you are legally entitled to grant the above
                license. If your employer(s) has rights to intellectual property
                that you create that includes your Contributions, you represent
                that you have received permission to make Contributions on
                behalf of that employer, that you will have received permission
                from your current and future employers for all future
                Contributions, that your applicable employer has waived such
                rights for all of your current and future Contributions to
                Flagbase, or that your employer has executed a separate
                Corporate CLA with Flagbase.
              </p>
            </li>
            <li>
              <p>
                You represent that each of Your Contributions is Your original
                creation (see section 7 for submissions on behalf of others).
                You represent that Your Contribution submissions include
                complete details of any third-party license or other restriction
                (including, but not limited to, related patents and trademarks)
                of which you are personally aware and which are associated with
                any part of Your Contributions.
              </p>
            </li>
            <li>
              <p>
                You are not expected to provide support for Your Contributions,
                except to the extent You desire to provide support. You may
                provide support for free, for a fee, or not at all. Unless
                required by applicable law or agreed to in writing, You provide
                Your Contributions on an "AS IS" BASIS, WITHOUT WARRANTIES OR
                CONDITIONS OF ANY KIND, either express or implied, including,
                without limitation, any warranties or conditions of TITLE, NON-
                INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR
                PURPOSE.
              </p>
            </li>
            <li>
              <p>
                Should You wish to submit work that is not Your original
                creation, You may submit it to Flagbase separately from any
                Contribution, identifying the complete details of its source and
                of any license or other restriction (including, but not limited
                to, related patents, trademarks, and license agreements) of
                which you are personally aware, and conspicuously marking the
                work as "Submitted on behalf of a third-party: [named here]".
              </p>
            </li>
            <li>
              <p>
                You agree to notify Flagbase of any facts or circumstances of
                which you become aware that would make these representations
                inaccurate in any respect.
              </p>
            </li>
          </ol>
        </section>
      </main>
    </Layout>
  );
}

export default CLA;
