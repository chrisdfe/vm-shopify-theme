import React from "react";

import StyleguideLayout from "../../lib/Layout";

import StyleguideSubsection from "../../lib/Subsection";
import StyleguideSubsectionRow from "../../lib/SubsectionRow";

import FontExample from "./FontExample";
import TypeStyleSubsectionRow from "./TypeStyleSubsectionRow";

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
        <TypeStyleSubsectionRow title="Heading 1" size={58} lineHeight={1.2} spacing={0}>
          <h1>{QUICK_BROWN_FOX}</h1>
        </TypeStyleSubsectionRow>

        <TypeStyleSubsectionRow title="Heading 2" size={42} lineHeight={1.2} spacing={0}>
          <h2>{QUICK_BROWN_FOX}</h2>
        </TypeStyleSubsectionRow>

        <TypeStyleSubsectionRow title="Heading 3" size={32} lineHeight={1.2} spacing={0}>
          <h3>{QUICK_BROWN_FOX}</h3>
        </TypeStyleSubsectionRow>
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
        <TypeStyleSubsectionRow title="Subheading 1" size={16} lineHeight={1.4} spacing={20}>
          <h4>{QUICK_BROWN_FOX}</h4>
        </TypeStyleSubsectionRow>

        <TypeStyleSubsectionRow title="Subheading 2" size={14} lineHeight={1.4} spacing={20}>
          <h5>{QUICK_BROWN_FOX}</h5>
        </TypeStyleSubsectionRow>

        <TypeStyleSubsectionRow title="Subheading 3" size={12} lineHeight={1.4} spacing={20}>
          <h6>{QUICK_BROWN_FOX}</h6>
        </TypeStyleSubsectionRow>
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
        <TypeStyleSubsectionRow title="Label" size={16} lineHeight={1.4} spacing={80}>
          <h4>{QUICK_BROWN_FOX}</h4>
        </TypeStyleSubsectionRow>
      </StyleguideSubsection>

      <StyleguideSubsection
        number="01e"
        title="Paragraph Text"
        sectionId="paragraphs"
        description={
          <>
            <p>
              Any text isn't a heading, subheading, or label is paragraph text.
            </p>

            <p>
              All paragraph text uses <b>Proxima Nova Regular</b>, and occasionally <em>italics</em> and <b>bold</b> for emphasis.
            </p>
          </>
        }
      >
        <TypeStyleSubsectionRow title="Paragraph 1" size={18} lineHeight={1.6} spacing={0}>
          <p className="paragraph-1">{LOREM}</p>
        </TypeStyleSubsectionRow>

        <TypeStyleSubsectionRow title="Paragraph 2" size={16} lineHeight={1.6} spacing={0}>
          <p className="paragraph-2">{LOREM}</p>
        </TypeStyleSubsectionRow>

        <TypeStyleSubsectionRow title="Paragraph 3" size={15} lineHeight={1.6} spacing={0}>
          <p className="paragraph-3">{LOREM}</p>
        </TypeStyleSubsectionRow>
      </StyleguideSubsection>
    </StyleguideLayout>
  );
}

export default TypographyPage;
