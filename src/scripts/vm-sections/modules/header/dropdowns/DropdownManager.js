export default class DropdownManager {
  //
  currentDropdownId = null;

  //
  headerElement = null;
  navLinkElements = [];
  dropdownLinkElements = [];
  dropdownElements = [];
  dropdownIds = [];
  dropdownMap = {};

  constructor() {}

  initialize() {
    this.headerWrapperElement = document.querySelector(".header-wrapper");

    this.dropdownLinkElements = document.querySelectorAll(
      ".header__dropdown-link"
    );

    this.dropdownElements = document.querySelectorAll(
      ".header__dropdown-container"
    );

    this.dropdownMap = Array.from(this.dropdownElements).reduce(
      (acc, element) => {
        const dropdownId = element.getAttribute("data-dropdown");

        if (!dropdownId) {
          return acc;
        }

        return { ...acc, [dropdownId]: element };
      },
      {}
    );

    this.dropdownIds = Object.keys(this.dropdownMap);

    this.navLinkElements = Array.from(
      this.headerWrapperElement.querySelectorAll(".header-desktop__nav-link")
    ).filter((element) => {
      const dropdownRel = element.getAttribute("data-dropdown-rel");

      if (!dropdownRel) {
        return false;
      }

      // dropdownLink points to a non-existant dropdown
      if (!this.dropdownIds.includes(dropdownRel)) {
        return false;
      }

      return true;
    });

    return this;
  }

  unload() {}
}
