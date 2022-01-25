import React from "react";

import { Link } from "react-router-dom";

import "./Layout.scss";

const sidebarLinks = [
  {
    title: "Overview",
    href: "/",
  },
  {
    title: "Typography",
    href: "/typography",
  },
  {
    title: "Colors",
    href: "/colors",
  },
];

function Layout({ children }) {
  return (
    <div className="vm-styleguide-layout">
      <div className="vm-styleguide-sidebar">
        <div className="vm-styleguide-sidebar__nav">
          <ul>
            {sidebarLinks.map(({ title, href }) => (
              <li key={title}>
                <h6>
                  <Link to={href}>{title}</Link>
                </h6>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="vm-styleguide-content">{children}</div>
    </div>
  );
}

export default Layout;
