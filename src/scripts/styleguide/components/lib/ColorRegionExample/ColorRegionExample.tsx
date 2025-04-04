import React, { ReactNode } from "react";
import classNames from "classnames";

import "./color-region-example.scss";

interface Props {
  region: string,
  children?: ReactNode;
}

const CLASSNAME_BASE = "vm-styleguide__color-region-example";

const DefaultContent = () => (
  <div>
    <h2 style={{ marginBottom: "1rem" }}>Heading 2</h2>
    <h4 style={{ marginBottom: "1rem" }}>heading 4</h4>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
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
  </div >
);


function ColorRegionExample({ region, children }: Props) {
  const className = classNames(
    `color-region--${region}`,
    CLASSNAME_BASE,
    `${CLASSNAME_BASE}--region-${region}`
  );
  return <div className={className}>{children || <DefaultContent />}</div>;
}

export default ColorRegionExample;
