import React from "react";
import { ReactNode } from 'react';

import "./Subsection.scss";

interface Props {
  number: string,
  title: string,
  children: ReactNode
  description?: ReactNode,
  sectionId?: string,
}

function StyleguideSubsection({
  number,
  title,
  sectionId,
  description,
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
      </div>

      <div className="vm-styleguide-subsection__content">{children}</div>
    </div>
  );
}

export default StyleguideSubsection;
