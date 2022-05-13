import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import "./Sidebar.scss";

const sidebarLinks = [
  {
    title: "Title Card",
    id: "overview",
    href: "/",
  },
  {
    title: "Typography",
    id: "typography",
    href: "/typography",
  },
  {
    title: "Colors",
    id: "colors",
    href: "/colors",
  },
  {
    title: "Components",
    id: "components",
    href: "/components",
  },
];

function Sidebar({ page }) {
  return (
    <div className="vm-styleguide-sidebar">
      <div className="vm-styleguide-sidebar__nav">
        <ul>
          {sidebarLinks.map(({ title, id, href }, index) => {
            const isActive = id === page;
            const sectionNumber = `0${index}.`;

            return (
              <li key={title} className="vm-styleguide-sidebar__nav-item">
                <h4>
                  <Link
                    to={href}
                    className={classNames("vm-styleguide-sidebar__nav-link", {
                      "vm-styleguide-sidebar__nav-link--active": isActive,
                    })}
                  >
                    <sup>{sectionNumber}</sup>
                    {title}
                  </Link>
                </h4>

                {/* {isActive && !!subsections && (
                  <ul>
                    {subsections.map((subsectionLink) => (
                      <li key={subsectionLink.url}>
                        <h6>
                          <Link to={`${href}?section=${subsectionLink.url}`}>
                            <sup>
                              {sectionNumber}
                              {subsectionLink.number}
                            </sup>
                            {subsectionLink.title}
                          </Link>
                        </h6>
                      </li>
                    ))}
                  </ul>
                )} */}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
