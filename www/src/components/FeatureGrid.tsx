import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "../css/styles.module.css";

function split(array, n) {
  let [...arr] = array;
  var res = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
}

function Feature({ imageUrl, title, description, offset, link }) {
  const imgUrl = useBaseUrl(imageUrl);
  const content = (
    <>
      {imgUrl && (
        <div className={classnames("text--center")}>
          <img className={styles.featureGridImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 className={classnames("text--center", styles.featureGridTitle)}>
        {title}
      </h3>
      {description && <p className={styles.featureGridText}>{description}</p>}
    </>
  );
  return (
    <div className={classnames("col col--4", offset, link && "cardLink")}>
      {link ? (
        <Link className="cardLink" to={link}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}

function FeatureGrid({ features }) {
  const featureBins = split(features, 3);
  return (
    <div className="container">
      {features &&
        features.length > 0 &&
        featureBins.map((featureBin, idx) => (
          <div key={idx} className="row">
            {featureBin.map((props, idx) => (
              <Feature
                key={idx}
                offset={
                  (featureBin.length == 1 && "col--offset-4") ||
                  (idx === 0 && featureBin.length % 2 == 0 && "col--offset-2")
                }
                {...props}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default FeatureGrid;
