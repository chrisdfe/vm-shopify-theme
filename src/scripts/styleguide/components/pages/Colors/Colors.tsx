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
    title: "Cool Neutral",
    hex: "#f4f3f3"
  },
  {
    title: "Forest Green",
    hex: "#262f25"
  },
  {
    title: "Sand",
    hex: "#eacdb4"
  },
  {
    title: "Coffee Bean",
    hex: "#45262b"
  },
  {
    title: "Black",
    hex: "#16120f"
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
          { title: "Cool Neutral", value: 40, color: "#f4f3f3" },
          { title: "Forest Green", value: 25, color: "#262f25" },
          { title: "Sand", value: 5, color: "#eacdb4" },
          { title: "Coffee Bean", value: 30, color: "#45262b" },
          { title: "Black", value: 30, color: "#16120f" },
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

            <StyleguideSubsectionRow title="Dark - alt 2">
              <ColorRegionExample region="dark-alt-2" />
            </StyleguideSubsectionRow>
          </StyleguideSubsection>

          {/*           <StyleguideSubsection
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
          </StyleguideSubsection> */}
        </div>
      </div>
    </StyleguideLayout>
  );
}

export default ColorsPage;
