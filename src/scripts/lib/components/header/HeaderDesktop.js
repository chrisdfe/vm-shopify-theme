import findAndInitialize from "../../utils/findAndInitialize";

export default class HeaderDesktop {
  static selector = ".header-desktop";

  //
  currentDropdownId = null;

  //
  headerElement = null;
  dropdownNavLinkElements = [];
  dropdownLinkElements = [];
  dropdownElements = [];
  dropdownIds = [];
  dropdownMap = {};

  constructor(headerElement) {
    this.headerElement = headerElement;
  }

  initialize() {
    this.headerWrapperElement = document.querySelector(".header-wrapper");

    this.dropdownLinkElements = this.headerElement.querySelectorAll(
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

    this.dropdownNavLinkElements = Array.from(
      this.headerElement.querySelectorAll(".header-desktop__nav-link")
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

    // Ideally we'd add this class in the liquid itself but the entire list of
    // dropdown ids isn't available to the header snippet
    this.dropdownNavLinkElements.forEach((dropdownLink) => {
      dropdownLink.classList.add("is-dropdown-link");
    });

    const allDropdownLinkElements = [
      ...this.dropdownLinkElements,
      ...this.dropdownNavLinkElements,
    ];

    allDropdownLinkElements.forEach((dropdownLink) => {
      const dropdownId = dropdownLink.getAttribute("data-dropdown-rel");
      const dropdownElement = this.dropdownMap[dropdownId];

      // TODO -
      // 1) store current active dropdownId
      // 2) deactivate current dropdown
      dropdownLink.addEventListener("mouseover", (event) => {
        if (this.currentDropdownId && this.currentDropdownId !== dropdownId) {
          const otherDropdownElement = this.dropdownMap[this.currentDropdownId];
          otherDropdownElement.classList.remove("is-active");
        }

        this.currentDropdownId = dropdownId;
        dropdownElement.classList.add("is-active");
      });
    });

    // TODO
    // - if the mouse is within the header still the dropdown should not close
    this.headerWrapperElement.addEventListener("mouseleave", (event) => {
      // console.log("event.target");
      console.log(event.target.closest(".header-wrapper"));
      // if (!event.target.closest(".header-wrapper")) {
      // console.log("mouseout", event.target);

      // dropdownElement.classList.remove("is-active");
      if (this.currentDropdownId) {
        const otherDropdownElement = this.dropdownMap[this.currentDropdownId];
        otherDropdownElement.classList.remove("is-active");
      }

      this.currentDropdownId = null;
      // }
    });
  }

  static findAndInitialize() {
    return findAndInitialize(HeaderDesktop);
  }
}
