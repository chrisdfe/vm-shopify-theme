import React from "react";
import ColorRegionExample from "../../../lib/ColorRegionExample";

import "./component-example.scss";

function ColorRegionWrapper({ region, children }) {
  return (
    <div className="vm-styleguide__component-example__color-region">
      <ColorRegionExample region={region}>{children}</ColorRegionExample>
    </div>
  );
}

function ComponentExample({ children, omitLightRegions, omitDarkRegions }) {
  return (
    <div className="vm-styleguide__component-example">
      {!omitLightRegions && (
        <div className="container">
          <div className="row">
            <div className="one-half columns">
              <ColorRegionWrapper region="light">{children}</ColorRegionWrapper>
            </div>
            <div className="one-half columns">
              <ColorRegionWrapper region="light-alt">
                {children}
              </ColorRegionWrapper>
            </div>
          </div>
        </div>
      )}

      {!omitDarkRegions && (
        <div className="container">
          <div className="row">
            <div className="one-half columns">
              <ColorRegionWrapper region="dark">{children}</ColorRegionWrapper>
            </div>
            <div className="one-half columns">
              <ColorRegionWrapper region="dark-alt">
                {children}
              </ColorRegionWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComponentExample;
