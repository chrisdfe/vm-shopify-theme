import findAndInitialize from "../../utils/findAndInitialize";

import PromoBanner from "./modules/PromoBanner";

import DrawerManager from "./drawers/DrawerManager";
import DropdownManager from "./dropdowns/DropdownManager";

const HEADER_SECTIONS = [
  'header',
  'mega-menu-1',
  'mega-menu-2',
  'mega-menu-3',
  'mega-menu-4',
  'mega-menu-5',
  'mega-menu-6',
];

export default class HeaderWrapper {
  static selector = ".header-wrapper";

  headerWrapperElement = null;

  promoBanner: PromoBanner;
  drawerManager: DrawerManager;
  dropdownManager: DropdownManager;

  constructor(headerWrapperElement) {
    this.headerWrapperElement = headerWrapperElement;

    document.addEventListener("shopify:section:load", (event) => {
      // @ts-ignore
      console.log("shopify:section:load", event.detail.sectionId);

      // @ts-ignore
      if (HEADER_SECTIONS.includes(event.detail.sectionId)) {
        this.reset();
      }
    })
  }

  initialize() {
    this.promoBanner = new PromoBanner().initialize();

    this.drawerManager = new DrawerManager().initialize();
    this.dropdownManager = new DropdownManager().initialize();
  }

  unload() {
    // this.promoBanner.reset();
    // this.drawerManager.reset();
    this.dropdownManager.reset();
  }

  reset() {
    this.unload();
    this.initialize();
  }

  static findAndInitialize() {
    return findAndInitialize(HeaderWrapper);
  }
}
