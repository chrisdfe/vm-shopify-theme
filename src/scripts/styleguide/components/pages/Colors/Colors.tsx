import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { useInView } from "react-intersection-observer";

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

function ColorsPieChart() {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [isVisible, setIsVisible] = useState(inView);

  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <div ref={ref}>
      {/* @ts-ignore - the types must be out of sync somehow */}
      <PieChart
        lineWidth={40}
        reveal={isVisible ? 100 : 0}
        animate
        animationDuration={800}
        animationEasing="ease-in-out"
        data={[
          { title: "Cream", value: 40, color: "#F8F4F4" },
          { title: "Plum", value: 30, color: "#714457" },
          { title: "Sea Green", value: 25, color: "#1c4047" },
          { title: "Sand", value: 5, color: "#DEC1A8" },
        ]}
      />
    </div>
  );
}

function ColorsPage() {
  return (
    <StyleguideLayout page="colors" pageNumber="02" title="Colors">
      <div className="vm-styleguide__page vm-styleguide__page--Colors">
        <div
          className="content-section content-section--vm-styleguide js-styleguide-section"
          data-section-id="#colors"
        >
          <StyleguideSubsection number="02a" title="Swatch" sectionId="swatch">
            <StyleguideSubsectionRow title="Primary Colors">
              <StyleguideSwatch colors={VM_SWATCH} />
            </StyleguideSubsectionRow>
          </StyleguideSubsection>

          <StyleguideSubsection
            number="02b"
            title="Color Shades"
            sectionId="color-shades"
          >
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

          <StyleguideSubsection
            number="02c"
            title="Regions"
            sectionId="color-regions"
          >
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

          <StyleguideSubsection
            number="02d"
            title="Color Ratios"
            sectionId="color-ratios"
          >
            <StyleguideSubsectionRow
              title="Key"
              dataRows={[
                { title: "cream", value: "40%" },
                { title: "plum", value: "30%" },
                { title: "sea green", value: "25%" },
                { title: "sand", value: "5%" },
              ]}
            >
              <ColorsPieChart />
            </StyleguideSubsectionRow>
          </StyleguideSubsection>
        </div>
      </div>
    </StyleguideLayout>
  );
}

export default ColorsPage;
