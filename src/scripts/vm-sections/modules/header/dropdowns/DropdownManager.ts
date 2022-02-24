// import debounce from "../../../utils/debounce";
import DropdownUnderlay from "./DropdownUnderlay";

import HeaderDropdown from "./Dropdown";

interface Props {
  onDropdownOpen: (dropdown: HeaderDropdown) => void;
}

export default class DropdownManager {
  currentDropdownId = null;

  headerContentWrapperElement: Element;

  dropdownElements: NodeListOf<Element>;
  dropdownIds: string[];
  dropdownMap: { [dropdownId: string]: HeaderDropdown };

  headerUnderlay: DropdownUnderlay;

  initialize() {
    this.headerContentWrapperElement = document.querySelector(
      ".header-content-wrapper"
    );
    this.headerContentWrapperElement.addEventListener(
      "mouseout",
      (event: MouseEventInit) => {
        this.onHeaderMouseOut(event as MouseEvent);
      }
    );

    this.headerUnderlay = new DropdownUnderlay();

    this.dropdownElements = document.querySelectorAll(".vm-header-dropdown");

    this.dropdownMap = Array.from(this.dropdownElements).reduce(
      (acc, dropdownElement) => {
        const dropdown = new HeaderDropdown({
          dropdownElement,
          onDropdownButtonMouseOver: this.onDropdownButtonMouseOver,
          onDropdownButtonClick: this.onDropdownButtonClick,
        }).initialize();
        return { ...acc, [dropdown.id]: dropdown };
      },
      {}
    );

    this.dropdownIds = Object.keys(this.dropdownMap);

    document.body.addEventListener("click", this.onBodyClick);

    return this;
  }

  private onBodyClick = (event: Event) => {
    const currentOpenDropdown = this.getCurrentOpenDropdown();

    if (
      currentOpenDropdown &&
      currentOpenDropdown.activationType === "click" &&
      event.target instanceof Element &&
      event.target.closest("[data-dropdown-id]") === null &&
      event.target.closest("[data-dropdown-button-id]") === null
    ) {
      this.closeCurrentOpenDropdown();
    }
  };

  private onDropdownButtonMouseOver = (
    event: Event,
    dropdown: HeaderDropdown
  ) => {
    this.closeCurrentOpenDropdown();
    this.openDropdown(dropdown);
  };

  private onDropdownButtonClick = (event: Event, dropdown: HeaderDropdown) => {
    event.preventDefault();

    // TODO - don't open if the button being clicked is for the current dropdown
    //        in that case - close the dropdown
    const currentDropdown = this.getCurrentOpenDropdown();

    if (currentDropdown) {
      this.closeDropdown(currentDropdown);

      if (currentDropdown.id !== dropdown.id) {
        this.openDropdown(dropdown);
      }
    } else {
      this.openDropdown(dropdown);
    }
  };

  // TODO - check
  private onHeaderMouseOut = (event: MouseEvent) => {
    const currentOpenDropdown = this.getCurrentOpenDropdown();

    if (!currentOpenDropdown) {
      return;
    }

    if (currentOpenDropdown.activationType === "click") {
      return;
    }

    const toElement = event.relatedTarget as Element;

    // If the mouse is no longer within the header content area hide the dropdown
    if (toElement && !toElement.closest(".header-content-wrapper")) {
      this.closeCurrentOpenDropdown();
    }
  };

  getCurrentOpenDropdown = () => this.dropdownMap[this.currentDropdownId];

  closeCurrentOpenDropdown = () => {
    const currentDropdown = this.getCurrentOpenDropdown();
    if (currentDropdown) {
      this.closeDropdown(currentDropdown);
    }
  };

  openDropdown = (dropdown: HeaderDropdown) => {
    this.currentDropdownId = dropdown.id;
    dropdown.open();

    this.headerUnderlay.show();
  };

  closeDropdown = (dropdown: HeaderDropdown) => {
    dropdown.close();
    this.currentDropdownId = null;

    this.headerUnderlay.hide();
  };
}
