import React, { createContext } from "react";
import classNames from "classnames";

// import PageSectionManager from "./PageSectionManager";
import Sidebar from "./Sidebar";

import "./Layout.scss";

function Layout({ page, pageNumber, title, contentRegion, children }) {
  return (
    <div className="vm-styleguide-layout">
      <Sidebar page={page} />

      <div
        className={classNames(
          "vm-styleguide-content",
          `color-region--${contentRegion}`
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
    </div>
  );
}

export default Layout;
