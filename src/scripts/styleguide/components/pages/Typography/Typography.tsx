import React from "react";

import StyleguideLayout from "../../lib/Layout";

import StyleguideSubsection from "../../lib/Subsection";
import StyleguideSubsectionRow from "../../lib/SubsectionRow";

import FontExample from "./FontExample";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const QUICK_BROWN_FOX = "The quick brown fox jumps over the lazy dog";

function TypographyPage() {
  return (
    <StyleguideLayout page="typography" pageNumber="01" title="Typography">
      <StyleguideSubsection number="01a" title="Fonts" sectionId="fonts">
        <StyleguideSubsectionRow title="Orpheus Pro">
          <FontExample font="orpheus-pro" weight="normal" />
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Proxima Nova">
          <FontExample font="proxima-nova" weight="normal" />
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01b"
        title="Headings"
        sectionId="headings"
        description={
          <>
            <p>Headings are used for page and section titles.</p>
            <p>
              All Headings use <b>Orpheus Pro Regular.</b>
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow
          title="Heading 1"
          dataRows={[
            { title: "size", value: "56px" },
            { title: "line height", value: "1.2 (67.2px)" },
            { title: "spacing", value: "20 (0.02em)" },
          ]}
        >
          <h1>{QUICK_BROWN_FOX}</h1>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow
          title="Heading 2"
          dataRows={[
            { title: "size", value: "36px" },
            { title: "line height", value: "1.2 (67.2px)" },
            { title: "spacing", value: "20 (0.02em)" },
          ]}
        >
          <h2>{QUICK_BROWN_FOX}</h2>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow
          title="Heading 3"
          dataRows={[
            { title: "size", value: "30px" },
            { title: "line height", value: "1.2 (48 px)" },
            { title: "spacing", value: "20 (0.02em)" },
          ]}
        >
          <h3>{QUICK_BROWN_FOX}</h3>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01c"
        title="Subheadings"
        sectionId="subheadings"
        description={
          <>
            <p>
              Subheadings are the next tier down from headings. They are also
              used for button text and labels (see <b>03. Components</b> for
              more details
            </p>{" "}
            <p>
              All subheadings use <b>Proxima Nova Semibold</b> and are in{" "}
              <b>all Caps</b>.
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow
          title="Subheading 1"
          dataRows={[
            { title: "size", value: "16px" },
            { title: "line height", value: "1.4 (22.4px)" },
            { title: "spacing", value: "80 (0.08em)" },
          ]}
        >
          <h4>{QUICK_BROWN_FOX}</h4>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow
          title="Subheading 2"
          dataRows={[
            { title: "size", value: "15px" },
            { title: "line height", value: "1.4 (21)" },
            { title: "spacing", value: "80 (0.08em)" },
          ]}
        >
          <h5>{QUICK_BROWN_FOX}</h5>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow
          title="Subheading 3"
          dataRows={[
            { title: "size", value: "13px" },
            { title: "line height", value: "1.4 (18.2px)" },
            { title: "spacing", value: "80 (0.08em)" },
          ]}
        >
          <h6>{QUICK_BROWN_FOX}</h6>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01d"
        title="Labels"
        sectionId="labels"
        description={
          <>
            <p>
              Labels are primariliy used in form components - buttons, inputs.
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow
          title="Label"
          dataRows={[
            { title: "size", value: "16px" },
            { title: "line height", value: "1.4 (22.4px)" },
            { title: "spacing", value: "80 (0.08em)" },
          ]}
        >
          <h4>{QUICK_BROWN_FOX}</h4>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01e"
        title="Paragraph Text"
        sectionId="paragraphs"
        description={
          <>
            <p>
              Anything that is not a <b>heading</b> or a <b>subheading</b> is a
              paragraph.
            </p>

            <p>
              All paragraph text uses <b>Proxima Nova Regular</b>, and occasionally <em>italics</em> and <b>bold</b> for emphasis.
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow
          title="Paragraph 1"
          dataRows={[
            { title: "size", value: "17px" },
            { title: "line height", value: "1.6 (27.2px)" },
            { title: "spacing", value: "30 (0.03em)" },
          ]}
        >
          <p className="paragraph-1">{LOREM}</p>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow
          title="Paragraph 2"
          dataRows={[
            { title: "size", value: "16px" },
            { title: "line height", value: "1.6 (25.6px)" },
            { title: "spacing", value: "30 (0.03em)" },
          ]}
        >
          <p className="paragraph-2">{LOREM}</p>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow
          title="Paragraph 3"
          dataRows={[
            { title: "size", value: "14px" },
            { title: "line height", value: "1.6 (22.4px)" },
            { title: "spacing", value: "30 (0.03em)" },
          ]}
        >
          <p className="paragraph-3">{LOREM}</p>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>
    </StyleguideLayout>
  );
}

export default TypographyPage;
