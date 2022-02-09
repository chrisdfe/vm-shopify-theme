import React from "react";

import StyleguideLayout from "../../lib/Layout";

import StyleguideSubsection from "../../lib/Subsection";
import StyleguideSubsectionRow from "../../lib/SubsectionRow";

function ComponentsPage() {
  return (
    <StyleguideLayout page="components" pageNumber="03" title="Components">
      <div className="vm-styleguide__page vm-styleguide__page--ComponentsPage">
        <StyleguideSubsection number="03a" title="Button">
          <StyleguideSubsectionRow title="Primary">
            <button className="button button--primary">Secondary</button>
          </StyleguideSubsectionRow>

          <StyleguideSubsectionRow title="Secondary">
            <button className="button button--primary">Secondary</button>
          </StyleguideSubsectionRow>
        </StyleguideSubsection>
        <StyleguideSubsection number="03b" title="CTA Link">
          <StyleguideSubsectionRow title="Primary">
            <a className="cta-link" href="#">
              CTA Link
            </a>
          </StyleguideSubsectionRow>
        </StyleguideSubsection>

        <StyleguideSubsection number="03c" title="Table">
          <StyleguideSubsectionRow title="default">
            <table>
              <thead>
                <tr>
                  <td>column 1</td>
                  <td>column 2</td>
                  <td>column 3</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>column 1</td>
                  <td>column 2</td>
                  <td>column 3</td>
                </tr>
                <tr>
                  <td>column 1</td>
                  <td>column 2</td>
                  <td>column 3</td>
                </tr>
                <tr>
                  <td>column 1</td>
                  <td>column 2</td>
                  <td>column 3</td>
                </tr>
              </tbody>
            </table>
          </StyleguideSubsectionRow>
        </StyleguideSubsection>
      </div>
    </StyleguideLayout>
  );
}

export default ComponentsPage;
