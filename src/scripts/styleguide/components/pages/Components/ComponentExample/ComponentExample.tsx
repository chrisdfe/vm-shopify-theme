import React, { ReactNode } from "react";

import "./component-example.scss";

import ColorRegionWrapper from "./ColorRegionWrapper";

interface Props {
  children?: ReactNode,
  omitLightRegions?: boolean,
  omitDarkRegions?: boolean,
}

function ComponentExample({ children, omitLightRegions, omitDarkRegions }: Props) {
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
