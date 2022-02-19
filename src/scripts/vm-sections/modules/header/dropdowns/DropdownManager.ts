import HeaderDropdown from "./Dropdown";

export default class DropdownManager {
  //
  currentDropdownId = null;

  //
  headerWrapperElement: Element;
  dropdownLinkElements: NodeListOf<Element>;
  dropdownElements: NodeListOf<Element>;
  dropdownIds: string[];
  dropdownMap: { [dropdownId: string]: HeaderDropdown };
  // navLinkElements: Element[];

  constructor() {}

  initialize() {
    this.headerWrapperElement = document.querySelector(".header-wrapper");

    this.dropdownLinkElements = document.querySelectorAll(
      ".vm-header-dropdown-link"
    );

    this.dropdownElements = document.querySelectorAll(".vm-header-dropdown");

    this.dropdownMap = Array.from(this.dropdownElements).reduce(
      (acc, element) => {
        const dropdown = new HeaderDropdown(element).initialize();
        return { ...acc, [dropdown.id]: dropdown };
      },
      {}
    );

    this.dropdownIds = Object.keys(this.dropdownMap);

    // TODO - put this inside of Dropdown instead?
    // this.navLinkElements = Array.from(
    //   document.querySelectorAll(".header-desktop__nav-link")
    // ).filter((element) => {
    //   const dropdownRel = element.getAttribute("data-dropdown-rel");

    //   if (!dropdownRel) {
    //     return false;
    //   }

    //   // dropdownLink points to a non-existant dropdown
    //   if (!this.dropdownIds.includes(dropdownRel)) {
    //     return false;
    //   }

    //   return true;
    // });

    return this;
  }

  onDropdownHover(dropdown: HeaderDropdown) {
    console.log("ondropdownhover");
  }

  unload() {}
}
