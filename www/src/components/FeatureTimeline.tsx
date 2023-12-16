import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useWindowDimensions } from "../utils/window";
import styles from "../css/styles.module.css";

type FeatureProps = {
  imageUrl: string;
  title: React.ReactNode;
  description: React.ReactNode;
  inverted?: boolean;
};

type FeatureTimelineProps = {
  features: FeatureProps[];
  inverted?: boolean;
};

function Feature({
  inverted,
  imageUrl,
  title,
  description,
}: FeatureProps): JSX.Element | null {
  const imgUrl = useBaseUrl(imageUrl);
  const ImgDiv = imgUrl && (
    <div className={classnames("text--center")}>
      <img className={styles.featureTimelineImg} src={imgUrl} alt={title} />
    </div>
  );
  const TextDiv = (
    <>
      {title && <h3 className={styles.featureTimelineTitle}>{title}</h3>}
      <p className={styles.featureTimelineText}>{description}</p>
    </>
  );
  const windowWidth = useWindowDimensions().width;
  return (
    <div className={classnames("row", styles.featureTimelineRow)}>
      <div className={classnames("col col--5 col--offset-1")}>
        {(windowWidth < 960 && TextDiv) || (inverted ? ImgDiv : TextDiv)}
      </div>
      <div className={classnames("col col--5")}>
        {(windowWidth < 960 && ImgDiv) || (inverted ? TextDiv : ImgDiv)}
      </div>
    </div>
  );
}

function FeatureTimeline({
  features,
  inverted,
}: FeatureTimelineProps): JSX.Element | null {
  return (
    <div className="container">
      {features &&
        features.length > 0 &&
        features.map((props, idx) => (
          <Feature
            key={idx}
            inverted={(inverted ? idx + 1 : idx) % 2 == 0}
            {...props}
          />
        ))}
    </div>
  );
}

export default FeatureTimeline;
