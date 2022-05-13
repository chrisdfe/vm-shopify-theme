import React from "react";
import classNames from "classnames";

import "./FontExample.scss";

function FontExample({ font, weight }) {
  return (
    <div
      className={classNames(
        "vm-styleguide__font-example",
        `vm-styleguide__font-example--font-${font}`,
        `vm-styleguide__font-example--weight-${weight}`
      )}
    >
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      <br />
      abcdefghijklmnopqrstuvwxyz
      <br />
      01 02 03 04 05 06 07 08 09
    </div>
  );
}

export default FontExample;
