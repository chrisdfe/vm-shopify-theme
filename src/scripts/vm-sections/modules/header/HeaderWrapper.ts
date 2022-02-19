import findAndInitialize from "../../utils/findAndInitialize";

import PromoBanner from "./modules/PromoBanner";

import DrawerManager from "./drawers/DrawerManager";
import DropdownManager from "./dropdowns/DropdownManager";

export default class HeaderWrapper {
  static selector = ".header-wrapper";

  headerWrapperElement = null;

  promoBanner: PromoBanner;
  drawerManager: DrawerManager;
  dropdownManager: DropdownManager;

  constructor(headerWrapperElement) {
    this.headerWrapperElement = headerWrapperElement;
  }

  initialize() {
    this.promoBanner = new PromoBanner().initialize();

    this.drawerManager = new DrawerManager().initialize();
    this.dropdownManager = new DropdownManager().initialize();
  }

  static findAndInitialize() {
    return findAndInitialize(HeaderWrapper);
  }
}
