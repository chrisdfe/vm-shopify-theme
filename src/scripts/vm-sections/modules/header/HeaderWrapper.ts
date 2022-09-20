import findAndInitialize from "../../utils/findAndInitialize";

import { ShopifyEvent } from '../../types';

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

const SELECTORS = {
  wrapper: ".header-wrapper"
};

export default class Header {
  headerWrapperElement = null;

  promoBanner: PromoBanner;
  drawerManager: DrawerManager;
  dropdownManager: DropdownManager;

  initialize() {
    this.headerWrapperElement = document.querySelector(SELECTORS.wrapper);

    document.addEventListener("shopify:section:load", (event: ShopifyEvent) => {
      if (HEADER_SECTIONS.includes(event.detail.sectionId)) {
        this.reset();
      }
    });

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
}
