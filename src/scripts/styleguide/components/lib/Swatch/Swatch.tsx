import React, { useState } from "react";

import SwatchColor from "./SwatchColor";

import "./Swatch.scss";

function Swatch({ colors }) {
  return (
    <div className="vm-styleguide__swatch">
      {colors.map(({ title, hex }) => (
        <div key={title} className="vm-styleguide__swatch__column">
          <SwatchColor title={title} hex={hex} />
        </div>
      ))}
    </div>
  );
}

export default Swatch;
