import React, { useState } from "react";

import "./Swatch.scss";

function CopyButton({ text, onClick }) {
  const [label, setLabel] = useState("copy");

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setLabel("copied!");

          setTimeout(() => {
            setLabel("copy");
          }, 3000);
        });
      }}
    >
      {label}
    </button>
  );
}

function StyleguideSubsectionRow({ colors }) {
  return (
    <div className="vm-styleguide__swatch">
      {colors.map(({ title, hex }) => (
        <div className="vm-styleguide__swatch-color" key={title}>
          <div
            className="vm-styleguide__swatch-color__color-square"
            style={{ backgroundColor: hex }}
          ></div>
          <h4 className="vm-styleguide__swatch-color__title">{title}</h4>
          <div className="vm-styleguide__swatch-color__values">
            <h6 className="vm-styleguide__swatch-color__value-label">hex</h6>
            <h6 className="vm-styleguide__swatch-color__value-value">{hex}</h6>
            <CopyButton text={hex} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StyleguideSubsectionRow;
