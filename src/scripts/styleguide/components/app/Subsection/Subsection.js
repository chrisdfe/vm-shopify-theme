import React from "react";

function StyleguideSubsection({ number, title, description, children }) {
  return (
    <div className="vm-styleguide-subsection">
      <h2 className="vm-styleguide__subsection-title">
        <sup>{number}</sup>
        <span>{title}</span>
        {/* <span
          className="anchor js-subsection-anchor"
          id="{{ id }}"
          data-section-id="{{ sectionId }}"
        ></span> */}
      </h2>

      {description && (
        <div className="vm-styleguide__content-section-description">
          {description}
        </div>
      )}

      <div className="vm-styleguide-subsection__content">{children}</div>
    </div>
  );
}

export default StyleguideSubsection;
