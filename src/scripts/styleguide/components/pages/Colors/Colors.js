import React from "react";

import StyleguideLayout from "../../lib/Layout";

import StyleguideSubsection from "../../lib/Subsection";
import StyleguideSubsectionRow from "../../lib/SubsectionRow";
import StyleguideSwatch from "../../lib/Swatch";

import ColorRegionExample from "../../lib/ColorRegionExample";

const VM_SWATCH = [
  {
    title: "Sea Green",
    hex: "#1c4047",
  },
  {
    title: "Plum",
    hex: "#714457",
  },
  {
    title: "Sand",
    hex: "#DEC1A8",
  },
  {
    title: "Cream",
    hex: "#F8F4F4",
  },
];

function ColorsPage() {
  return (
    <StyleguideLayout page="colors" pageNumber="02" title="Colors">
      <div className="vm-styleguide__page vm-styleguide__page--Colors">
        <div
          className="content-section content-section--vm-styleguide js-styleguide-section"
          data-section-id="#colors"
        >
          <StyleguideSubsection number="02a" title="Swatch">
            <StyleguideSubsectionRow title="Primary Colors">
              <StyleguideSwatch colors={VM_SWATCH} />
            </StyleguideSubsectionRow>
          </StyleguideSubsection>

          <StyleguideSubsection number="02b" title="Color Shades">
            <StyleguideSubsectionRow title="Plum">
              <p>TODO</p>
            </StyleguideSubsectionRow>
            <StyleguideSubsectionRow title="Sea green">
              <p>TODO</p>
            </StyleguideSubsectionRow>
            <StyleguideSubsectionRow title="Sand">
              <p>TODO</p>
            </StyleguideSubsectionRow>
          </StyleguideSubsection>

          <StyleguideSubsection number="02c" title="Regions">
            <StyleguideSubsectionRow title="Light">
              <ColorRegionExample region="light" />
            </StyleguideSubsectionRow>

            <StyleguideSubsectionRow title="Light - alt">
              <ColorRegionExample region="light-alt" />
            </StyleguideSubsectionRow>

            <StyleguideSubsectionRow title="Dark">
              <ColorRegionExample region="dark" />
            </StyleguideSubsectionRow>

            <StyleguideSubsectionRow title="Dark - alt">
              <ColorRegionExample region="dark-alt" />
            </StyleguideSubsectionRow>
          </StyleguideSubsection>

          <StyleguideSubsection number="02d" title="Color Ratios">
            <StyleguideSubsectionRow title="Key">
              <p>TODO</p>
            </StyleguideSubsectionRow>
          </StyleguideSubsection>
        </div>
      </div>
    </StyleguideLayout>
  );
}

export default ColorsPage;
