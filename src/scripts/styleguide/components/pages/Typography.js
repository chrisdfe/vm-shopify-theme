import React from "react";

import StyleguideLayout from "../app/Layout";

import StyleguideSubsection from "../app/Subsection";
import StyleguideSubsectionRow from "../app/SubsectionRow";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const QUICK_BROWN_FOX = "The quick brown fox jumps over the lazy dog";

const FONT_EXAMPLE = (
  <>
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    <br />
    abcdefghijklmnopqrstuvwxyz
    <br />
    01 02 03 04 05 06 07 08 09
  </>
);

function TypographyPage() {
  return (
    <StyleguideLayout>
      <h1>Typography</h1>

      <StyleguideSubsection number="01a." title="Fonts">
        <StyleguideSubsectionRow title="Orpheus Pro">
          <div className="vm-styleguide__font-example vm-styleguide__font-example--orpheus">
            {FONT_EXAMPLE}
          </div>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Poppins">
          <div className="vm-styleguide__font-example vm-styleguide__font-example--orpheus">
            {FONT_EXAMPLE}
          </div>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01b."
        title="Headings"
        description={
          <>
            <p>Headings are used for page and section titles.</p>
            <p>
              All Headings use <b>Orpheus Pro Bold.</b>
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow title="Heading 1">
          <h1>{QUICK_BROWN_FOX}</h1>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Heading 2">
          <h2>{QUICK_BROWN_FOX}</h2>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Heading 3">
          <h3>{QUICK_BROWN_FOX}</h3>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01c."
        title="Subheadings"
        description={
          <>
            <p>
              Subheadings are the next tier down from headings. They are also
              used for button text and labels (see <b>03. Components</b> for
              more details
            </p>{" "}
            <p>
              All subheadings use <b>Poppins Semibold</b> and are in{" "}
              <b>all Caps</b>.
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow title="Heading 4">
          <h4>{QUICK_BROWN_FOX}</h4>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Heading 5">
          <h5>{QUICK_BROWN_FOX}</h5>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Heading 6">
          <h6>{QUICK_BROWN_FOX}</h6>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01d."
        title="Paragraph Text"
        description={
          <>
            <p>
              Anything that is not a <b>heading</b> or a <b>subheading</b> is a
              paragraph.
            </p>

            <p>
              All paragraph text uses <b>Poppins Regular</b> and <b>bold</b>.
            </p>
          </>
        }
      >
        <StyleguideSubsectionRow title="Paragraph 1">
          <p className="paragraph-1">{LOREM}</p>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Paragraph 2">
          <p className="paragraph-2">{LOREM}</p>
        </StyleguideSubsectionRow>

        <StyleguideSubsectionRow title="Paragraph 3">
          <p className="paragraph-3">{LOREM}</p>
        </StyleguideSubsectionRow>
      </StyleguideSubsection>
    </StyleguideLayout>
  );
}

export default TypographyPage;
