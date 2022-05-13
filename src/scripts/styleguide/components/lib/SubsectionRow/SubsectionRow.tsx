import React from "react";
import { ReactNode } from "react";
import classNames from "classnames";

import "./SubsectionRow.scss";

import DataTable, { DataRow } from './DataTable';

interface Props {
  title: string,
  children: ReactNode,
  dataRows?: DataRow[]
  uses: ReactNode[],
  avoids: ReactNode[],
}

function StyleguideSubsectionRow({ title, children, dataRows, uses, avoids }: Props) {
  return (
    <div className="vm-styleguide__subsection-row">
      <div className="container">
        <div className="row">
          <div className="four columns vm-styleguide__subsection-row__sidebar">
            <h4 className="vm-styleguide-content__subsection-row-subheading">
              {title}
            </h4>

            {dataRows && <DataTable dataRows={dataRows} />}
          </div>

          <div className="twelve columns">
            <div className="vm-styleguide__subsection-row__body">
              {children}
            </div>
          </div>
        </div>

        {(uses || avoids) && (
          <div className="row">
            <div className="four columns">
            </div>
            <div className="six columns">
              {uses && uses.length && (
                <>
                  <h4>Uses:</h4>
                  <ul>
                    {uses.map(use => <li>{use}</li>)}
                  </ul>
                </>
              )}
            </div>
            <div className="six columns">
              {avoids && avoids.length && (
                <>
                  <h4>Avoid:</h4>
                  <ul>
                    {avoids.map(avoid => <li>{avoid}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StyleguideSubsectionRow;
