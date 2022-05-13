import React from "react";
import { ReactNode } from "react";

import "./SubsectionRow.scss";

import DataTable, { DataRow } from './DataTable';

interface Props {
  title: string,
  children: ReactNode,
  dataRows?: DataRow[]
}

function StyleguideSubsectionRow({ title, children, dataRows }: Props) {
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
