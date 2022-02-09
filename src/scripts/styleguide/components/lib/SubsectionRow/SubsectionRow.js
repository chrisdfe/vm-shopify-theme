import React from "react";

import "./SubsectionRow.scss";

function DataTable({ dataRows }) {
  return (
    <table className="vm-styleguide__subsection-row-data-table">
      <tbody>
        {dataRows.map(({ title, value }) => (
          <tr key={title}>
            <td>
              <h5 className="vm-styleguide__subsection-row-data-table__title">
                {title}
              </h5>
            </td>
            <td>
              <h5 className="vm-styleguide__subsection-row-data-table__value">
                {value}
              </h5>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StyleguideSubsectionRow({ title, children, dataRows }) {
  return (
    <div className="vm-styleguide__subsection-row">
      <div className="container">
        <div className="row">
          <div className="four columns">
            <h4 className="vm-styleguide-content__subsection-row-subheading">
              {title}
            </h4>

            {dataRows && <DataTable dataRows={dataRows} />}
          </div>

          <div className="twelve columns">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default StyleguideSubsectionRow;
