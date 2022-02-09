import React from "react";
import classNames from "classnames";

import "./color-region-example.scss";

const CLASSNAME_BASE = "vm-styleguide__color-region-example";

const DefaultContent = () => (
  <div>
    <h2>Heading 2</h2>
    <h4>heading 4</h4>
    <p>
      Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
      lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
      lorem ipsum
    </p>

    <a
      href="#"
      className="cta-link"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      cta link
    </a>
  </div>
);

function ColorRegionExample({ region, children }) {
  const className = classNames(
    `color-region--${region}`,
    CLASSNAME_BASE,
    `${CLASSNAME_BASE}--region-${region}`
  );
  return <div className={className}>{children || <DefaultContent />}</div>;
}

export default ColorRegionExample;
