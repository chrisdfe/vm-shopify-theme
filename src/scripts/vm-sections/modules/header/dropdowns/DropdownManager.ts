import debounce from "../../../utils/debounce";

import DropdownUnderlay from "./DropdownUnderlay";
import HeaderDropdown from "./Dropdown";

export type DropdownEventPayload = {
  dropdown: HeaderDropdown;
};

export default class DropdownManager {
  currentDropdownId = null;

  headerContentWrapperElement: HTMLElement;

  dropdownElements: NodeListOf<HTMLElement>;
  dropdownIds: string[];
  dropdownMap: { [dropdownId: string]: HeaderDropdown; };

  headerUnderlay: DropdownUnderlay;

  initialize() {
    this.headerContentWrapperElement = document.querySelector(
      ".header-content-wrapper"
    );

    this.headerContentWrapperElement.addEventListener(
      "mouseout",
      this.onHeaderMouseOut
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

  unload() {
    this.headerContentWrapperElement.removeEventListener(
      "mouseout",
      this.onHeaderMouseOut
    );

    this.dropdownIds.forEach(dropdownId => {
      const dropdown = this.dropdownMap[dropdownId];
      dropdown.unload();
    });

    document.documentElement.removeEventListener("mouseleave", this.closeCurrentOpenDropdown);
  }

  reset() {
    this.unload();
    this.initialize();
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
    const currentOpenDropdown = this.getCurrentOpenDropdown();

    if (currentOpenDropdown && currentOpenDropdown.activationType === "click") {
      return;
    }

    if (dropdown.activationType === "click") {
      return;
    }

    this.closeCurrentOpenDropdown();
    this.openDropdown(dropdown);
  };

  // TODO - check
  private onHeaderMouseOut = (event: MouseEvent) => {
    const currentOpenDropdown = this.getCurrentOpenDropdown();

    if (
      !currentOpenDropdown || currentOpenDropdown.activationType === "click"
    ) {
      return;
    }

    const toElement = event.relatedTarget as Element;

    // If the mouse is no longer within the header content, area hide the dropdown
    // if (toElement && !toElement.closest(".header-content-wrapper")) {
    if (toElement &&
      !toElement.closest(".header-desktop__navbar") &&
      !toElement.closest('.vm-header-drawer__content')
    ) {
      this.closeCurrentOpenDropdown();
    }
  };

  private onDropdownButtonClick = (event: Event, dropdown: HeaderDropdown) => {
    event.preventDefault();

    const currentOpenDropdown = this.getCurrentOpenDropdown();

    if (currentOpenDropdown) {
      this.closeDropdown(currentOpenDropdown);

      if (currentOpenDropdown.id !== dropdown.id) {
        this.openDropdown(dropdown);
      }
    } else {
      this.openDropdown(dropdown);
    }
  };

  private getCurrentOpenDropdown = () => this.dropdownMap[this.currentDropdownId];

  private closeCurrentOpenDropdown = () => {
    const currentDropdown = this.getCurrentOpenDropdown();

    if (currentDropdown) {
      this.closeDropdown(currentDropdown);
    }
  };

  private openDropdown = (dropdown: HeaderDropdown) => {
    this.currentDropdownId = dropdown.id;
    dropdown.open();

    this.headerUnderlay.show();

    window.dispatchEvent(new CustomEvent<DropdownEventPayload>("header-dropdown:opened", { detail: { dropdown } }));
  };

  private closeDropdown = (dropdown: HeaderDropdown) => {
    dropdown.close();
    this.currentDropdownId = null;

    window.dispatchEvent(new CustomEvent<DropdownEventPayload>("header-dropdown:closed", { detail: { dropdown } }));

    this.headerUnderlay.hide();
  };
}
