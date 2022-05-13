import * as React from "react";
import { ReactNode } from "react";
import classNames from "classnames";

import Sidebar from "./Sidebar";

import "./Layout.scss";

interface Props {
  page: string,
  title: string,
  children?: ReactNode,
  pageNumber?: string,
  contentRegion?: string,
}

function Layout({ page, pageNumber, title, contentRegion, children }: Props) {
  return (
    <div className="vm-styleguide-layout">
      <Sidebar page={page} />

      <div
        className={classNames(
          "vm-styleguide-content",
          { [`color-region--${contentRegion}`]: !!contentRegion }
        )}
      >
        <div className="container">
          <div className="row">
            <div className="one-whole columns">
              <h1 className="vm-styleguide__page-title">
                {pageNumber && <sup>{pageNumber}.</sup>}
                {title}
              </h1>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div >
  );
}

export default Layout;
