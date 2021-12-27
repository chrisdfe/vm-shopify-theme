import findAndInitialize from "../../utils/findAndInitialize";

import PromoBanner from "./PromoBanner";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

import HeaderDrawerManager from "./drawers/DrawerManager";
import HeaderDropdownManager from "./dropdowns/DropdownManager";

export default class HeaderWrapper {
  static selector = ".header-wrapper";

  headerWrapperElement = null;

  promoBanner = null;
  headerDesktop = null;
  headerMobile = null;

  drawerManager = null;
  dropdownManager = null;

  constructor(headerWrapperElement) {
    this.headerWrapperElement = headerWrapperElement;
  }

  initialize() {
    this.promoBanner = PromoBanner.findAndInitialize();
    this.headerDesktop = HeaderDesktop.findAndInitialize();
    this.headerMobile = HeaderMobile.findAndInitialize();

    this.drawerManager = new HeaderDrawerManager().initialize();
    this.dropdownManager = new HeaderDropdownManager().initialize();
  }

  static findAndInitialize() {
    return findAndInitialize(HeaderWrapper);
  }
}
