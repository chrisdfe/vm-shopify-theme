import React, { useState } from "react";
import classNames from "classnames";

import "./swatch-color.scss";

const getTextColor = (title) =>
  ["Forest Green", "Coffee Bean", "Black"].includes(title) ? "white" : "auto";

const HAS_COPIED_MESSAGE_LENGTH = 1500;
// This is set the CSS
const FADE_IN_OUT_LENGTH = 500;

function SwatchColor({ title, hex }) {
  const [hasCopied, setHasCopied] = useState(false);
  const [copyText, setCopyText] = useState("click to copy");

  const squareClassNames = classNames("vm-styleguide__swatch-color__square", {
    "vm-styleguide__swatch-color__square--has-copied": hasCopied,
  });

  return (
    <div className="vm-styleguide__swatch-color" key={title}>
      <div
        className={squareClassNames}
        style={{ backgroundColor: hex, color: getTextColor(title) }}
        onClick={() => {
          navigator.clipboard.writeText(hex).then(() => {
            setHasCopied(true);
            setCopyText("copied!");

            setTimeout(() => {
              setHasCopied(false);
            }, HAS_COPIED_MESSAGE_LENGTH);

            setTimeout(() => {
              setCopyText("click to copy");
            }, HAS_COPIED_MESSAGE_LENGTH + FADE_IN_OUT_LENGTH);
          });
        }}
      >
        <div className="vm-styleguide__swatch-color__label">{copyText}</div>
      </div>
      <h4 className="vm-styleguide__swatch-color__title">{title}</h4>
      <h6 className="vm-styleguide__swatch-color__value">{hex}</h6>
    </div>
  );
}

export default SwatchColor;
