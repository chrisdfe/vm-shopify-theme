import React from "react";

import { Link } from "react-router-dom";

import Sidebar from "./Sidebar";

import "./Layout.scss";

function Layout({ page, pageNumber, title, children }) {
  return (
    <div className="vm-styleguide-layout">
      <Sidebar page={page} />

      <div className="vm-styleguide-content">
        <div className="container">
          <div className="row">
            <div className="one-whole columns">
              <h1 className="vm-styleguide__page-title">
                <sup>{pageNumber}.</sup>
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
