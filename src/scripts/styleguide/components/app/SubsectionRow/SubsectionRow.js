import React from "react";

function StyleguideSubsectionRow({ title, children }) {
  return (
    <div className="vm-styleguide__subsection-row">
      <div className="row">
        <div className="one-whole columns">
          <h4 className="vm-styleguide-content__subsection-row-subheading">
            {title}
          </h4>

          {children}
        </div>
      </div>
    </div>
  );
}

export default StyleguideSubsectionRow;
