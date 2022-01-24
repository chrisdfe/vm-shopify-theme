import React from "react";

const pages = [
  {
    title: "Typography",
    href: "typography",
  },
  {
    title: "Colors",
    href: "colors",
  },
  {
    title: "Components",
    href: "components",
  },
];

function StyleguideBanner() {
  return (
    <div className="vm-styleguide__banner">
      <div className="container">
        <div className="row">
          <div className="twelve columns offset-by-two">
            <h1>Valerie Madison Styleguide</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="twelve columns offset-by-four medium-down--one-whole">
            <ul>
              {pages.map((page, index) => (
                <li>
                  <sup>0{index + 1}.</sup>
                  <span>{page.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleguideBanner;
