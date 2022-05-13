import React from "react";
import { ReactNode } from 'react';

import "./Subsection.scss";

interface Props {
  number: string,
  title: string,
  children: ReactNode
  description?: ReactNode,
  sectionId?: string,
  uses?: ReactNode[],
  avoids?: ReactNode[],
}

function StyleguideSubsection({
  number,
  title,
  sectionId,
  description,
  uses,
  avoids,
  children,
}: Props) {
  return (
    <div className="vm-styleguide-subsection">
      <div className="container">
        <div className="row">
          <div className="twelve columns offset-by-four">
            <h2 className="vm-styleguide__subsection-title">
              <sup>{number}.</sup>
              <span>{title}</span>
            </h2>

            {description && (
              <div className="vm-styleguide__content-section-description">
                {description}
              </div>
            )}
          </div>
        </div>

        {(uses || avoids) && (
          <>
            <div className="row">
              <div className="twelve columns offset-by-four">
                <h3>Usage</h3>
              </div>
            </div>
            <div className="row u-margin-bottom-5">
              <div className="four columns">
                &nbsp;
              </div>

              <div className="six columns">
                &nbsp;
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
                &nbsp;
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
          </>
        )}

        <div className="vm-styleguide-subsection__content">
          <div className="row">
            <div className="twelve columns offset-by-four">
              <h3>Examples</h3>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default StyleguideSubsection;
